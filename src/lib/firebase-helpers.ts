import { db } from "@/config/firebase";
import {
  collection,
  query,
  where,
  getDocs,
  doc,
  setDoc,
  writeBatch,
  orderBy,
  onSnapshot,
  type DocumentData,
  type Unsubscribe,
} from "firebase/firestore";

export interface StudentData {
  id: string;
  roll_number: string;
  name: string;
  branch: string;
  semester: string;
  section: string;
  monthly_attendance: Record<string, number>;
  monthly_results: Record<string, number>;
}

/**
 * In-memory cache for section rosters, keyed by branch/semester/section.
 * Persists across component remounts within the same app session so repeated
 * exports don't re-hit Firestore.
 */
const studentRosterCache = new Map<string, StudentData[]>();
const rosterListeners = new Map<string, Unsubscribe>();
const rosterSubscribers = new Map<string, Set<(students: StudentData[]) => void>>();

function rosterCacheKey(branch: string, semester: string, section: string) {
  return `${branch.toUpperCase()}::${semester}::${section.toUpperCase()}`;
}

export function getCachedStudentsBySection(
  branchCode: string,
  semester: string,
  sectionLetter: string
): StudentData[] | undefined {
  return studentRosterCache.get(rosterCacheKey(branchCode, semester, sectionLetter));
}

export function clearStudentRosterCache() {
  studentRosterCache.clear();
  rosterListeners.forEach((unsub) => unsub());
  rosterListeners.clear();
}

/**
 * Attach a Firestore onSnapshot listener for the given section roster so the
 * in-memory cache auto-invalidates whenever the underlying student_analytics
 * documents change. Idempotent — safe to call multiple times for the same key.
 */
function ensureRosterListener(
  branchCode: string,
  semester: string,
  sectionLetter: string
) {
  const key = rosterCacheKey(branchCode, semester, sectionLetter);
  if (rosterListeners.has(key)) return;

  const ref = collection(db, "student_analytics");
  const q = query(
    ref,
    where("branch", "==", branchCode),
    where("semester", "==", semester),
    where("section", "==", sectionLetter),
    orderBy("roll_number", "asc")
  );

  const unsub = onSnapshot(
    q,
    (snapshot) => {
      const students = snapshot.docs.map((d) => ({
        id: d.id,
        ...d.data(),
      })) as StudentData[];
      studentRosterCache.set(key, students);
      rosterSubscribers.get(key)?.forEach((cb) => cb(students));
    },
    (err) => {
      console.error("Roster listener error:", err);
    }
  );
  rosterListeners.set(key, unsub);
}

/**
 * Subscribe to roster changes for a section. Returns an unsubscribe fn.
 * Triggers cache hydration + live updates whenever Firestore data changes.
 */
export function subscribeToSectionRoster(
  branchCode: string,
  semester: string,
  sectionLetter: string,
  cb: (students: StudentData[]) => void
): Unsubscribe {
  const key = rosterCacheKey(branchCode, semester, sectionLetter);
  let set = rosterSubscribers.get(key);
  if (!set) {
    set = new Set();
    rosterSubscribers.set(key, set);
  }
  set.add(cb);
  ensureRosterListener(branchCode, semester, sectionLetter);

  // Emit current cache immediately if available
  const cached = studentRosterCache.get(key);
  if (cached) cb(cached);

  return () => {
    const subs = rosterSubscribers.get(key);
    subs?.delete(cb);
    if (subs && subs.size === 0) {
      rosterSubscribers.delete(key);
      rosterListeners.get(key)?.();
      rosterListeners.delete(key);
    }
  };
}

/**
 * Fetch all students for a given branch/semester/section from Firestore.
 * Results are cached in-memory and reused on subsequent calls unless
 * `forceRefresh` is true.
 */
export async function fetchStudentsBySection(
  branchCode: string,
  semester: string,
  sectionLetter: string,
  forceRefresh = false
): Promise<StudentData[]> {
  const key = rosterCacheKey(branchCode, semester, sectionLetter);
  if (!forceRefresh && studentRosterCache.has(key)) {
    return studentRosterCache.get(key)!;
  }

  const ref = collection(db, "student_analytics");
  const q = query(
    ref,
    where("branch", "==", branchCode),
    where("semester", "==", semester),
    where("section", "==", sectionLetter),
    orderBy("roll_number", "asc")
  );

  const snapshot = await getDocs(q);
  const students = snapshot.docs.map((doc) => ({
    id: doc.id,
    ...doc.data(),
  })) as StudentData[];

  studentRosterCache.set(key, students);
  return students;
}

/**
 * Search a student by roll number (exact or partial) within a branch.
 */
export async function searchStudentByRoll(
  branchCode: string,
  rollQuery: string
): Promise<StudentData | null> {
  const ref = collection(db, "student_analytics");

  // Try exact match first
  const exactQ = query(
    ref,
    where("branch", "==", branchCode),
    where("roll_number", "==", rollQuery.toUpperCase())
  );
  const exactSnap = await getDocs(exactQ);
  if (!exactSnap.empty) {
    const d = exactSnap.docs[0];
    return { id: d.id, ...d.data() } as StudentData;
  }

  // Fallback: fetch all for branch and filter client-side
  const allQ = query(ref, where("branch", "==", branchCode));
  const allSnap = await getDocs(allQ);
  const q = rollQuery.toLowerCase();

  for (const d of allSnap.docs) {
    const data = d.data() as DocumentData;
    const roll = (data.roll_number || "").toLowerCase();
    const name = (data.name || "").toLowerCase();
    if (roll.includes(q) || name.includes(q)) {
      return { id: d.id, ...data } as StudentData;
    }
    if (/^\d+$/.test(q)) {
      const digits = roll.replace(/\D/g, "");
      if (digits.endsWith(q)) {
        return { id: d.id, ...data } as StudentData;
      }
    }
  }

  return null;
}

/**
 * Upload an array of student records to Firestore in batch.
 * Uses roll_number as document ID for upsert behavior.
 */
export async function uploadStudentsBatch(
  students: Omit<StudentData, "id">[]
): Promise<{ success: number; failed: number }> {
  const ref = collection(db, "student_analytics");
  let success = 0;
  let failed = 0;

  // Firestore batch limit is 500
  const chunkSize = 450;
  for (let i = 0; i < students.length; i += chunkSize) {
    const chunk = students.slice(i, i + chunkSize);
    const batch = writeBatch(db);

    for (const student of chunk) {
      try {
        const docRef = doc(ref, student.roll_number);
        batch.set(docRef, student, { merge: true });
        success++;
      } catch {
        failed++;
      }
    }

    try {
      await batch.commit();
    } catch {
      failed += chunk.length;
      success -= chunk.length;
    }
  }

  return { success, failed };
}

/**
 * Seed demo students into Firestore for a section.
 */
export async function seedDemoData(
  branchCode: string,
  semester: string,
  sectionLetter: string
): Promise<number> {
  const names = [
    "Rahul Kumar", "Priya Sharma", "Arjun Reddy", "Sneha Patel", "Vikram Singh",
    "Anjali Gupta", "Karthik Nair", "Divya Krishnan", "Rohit Verma", "Meera Joshi",
    "Aditya Rao", "Kavya Menon", "Sai Prasad", "Lakshmi Devi", "Naveen Babu",
  ];

  const months = ["Jan", "Feb", "Mar", "Apr", "May"];
  const students: Omit<StudentData, "id">[] = names.map((name, i) => ({
    roll_number: `21${branchCode}${String(i + 1).padStart(3, "0")}`,
    name,
    branch: branchCode,
    semester,
    section: sectionLetter,
    monthly_attendance: Object.fromEntries(
      months.map((m) => [m, Math.floor(Math.random() * 30) + 70])
    ),
    monthly_results: Object.fromEntries(
      months.map((m) => [m, Math.floor(Math.random() * 40) + 55])
    ),
  }));

  const { success } = await uploadStudentsBatch(students);
  return success;
}

/**
 * Parse CSV text into student records.
 * Expected columns: roll_number, name, branch, semester, section, then month columns for attendance/results.
 */
/**
 * Subscribe to real-time updates for a specific student document by roll_number.
 */
export function subscribeToStudent(
  rollNumber: string,
  onData: (student: StudentData | null) => void,
  onError?: (error: Error) => void
): Unsubscribe {
  const docRef = doc(db, "student_analytics", rollNumber.toUpperCase());
  return onSnapshot(
    docRef,
    (snapshot) => {
      if (snapshot.exists()) {
        onData({ id: snapshot.id, ...snapshot.data() } as StudentData);
      } else {
        onData(null);
      }
    },
    (err) => onError?.(err)
  );
}

// ===== HOURLY ATTENDANCE SYSTEM =====

export interface HourlyAttendanceRecord {
  id: string;
  roll_number: string;
  name: string;
  branch: string;
  section: string;
  subject: string;
  hour: string;
  date: string;
  status: string;
  timestamp?: any;
}

/**
 * Fetch hourly attendance for a student by roll number.
 */
export async function fetchHourlyAttendance(
  rollNumber: string
): Promise<HourlyAttendanceRecord[]> {
  const ref = collection(db, "hourly_attendance");
  const q = query(
    ref,
    where("roll_number", "==", rollNumber.toUpperCase())
  );
  const snapshot = await getDocs(q);
  const records = snapshot.docs.map((d) => ({
    id: d.id,
    ...d.data(),
  })) as HourlyAttendanceRecord[];
  return records.sort((a, b) => b.date.localeCompare(a.date));
}

/**
 * Fetch hourly attendance for an entire section.
 */
export async function fetchSectionHourlyAttendance(
  branch: string,
  section: string
): Promise<HourlyAttendanceRecord[]> {
  const ref = collection(db, "hourly_attendance");
  const q = query(
    ref,
    where("branch", "==", branch.toUpperCase()),
    where("section", "==", section.toUpperCase())
  );
  const snapshot = await getDocs(q);
  const records = snapshot.docs.map((d) => ({
    id: d.id,
    ...d.data(),
  })) as HourlyAttendanceRecord[];
  return records.sort((a, b) => b.date.localeCompare(a.date));
}

/**
 * Subscribe to real-time hourly attendance updates for a roll number.
 */
export function subscribeToHourlyAttendance(
  rollNumber: string,
  onData: (records: HourlyAttendanceRecord[]) => void,
  onError?: (error: Error) => void
): Unsubscribe {
  const ref = collection(db, "hourly_attendance");
  const q = query(
    ref,
    where("roll_number", "==", rollNumber.toUpperCase())
  );
  return onSnapshot(
    q,
    (snapshot) => {
      const records = snapshot.docs.map((d) => ({
        id: d.id,
        ...d.data(),
      })) as HourlyAttendanceRecord[];
      onData(records.sort((a, b) => b.date.localeCompare(a.date)));
    },
    (err) => onError?.(err)
  );
}

/**
 * Seed demo hourly attendance data for testing.
 */
export async function seedDemoHourlyAttendance(
  branch: string,
  section: string
): Promise<number> {
  const subjects = ["DBMS", "OS", "CN", "SE", "DAA"];
  const hours = ["1", "2", "3", "4", "5", "6"];
  const dates = [
    "2026-04-07", "2026-04-08", "2026-04-09",
    "2026-04-10", "2026-04-11", "2026-04-12",
  ];
  const names = [
    "Rahul Kumar", "Priya Sharma", "Arjun Reddy", "Sneha Patel", "Vikram Singh",
  ];

  const ref = collection(db, "hourly_attendance");
  const batch = writeBatch(db);
  let count = 0;

  for (let s = 0; s < names.length; s++) {
    const rollNum = `23KP1A44${String(s + 1).padStart(2, "0")}`;
    for (const date of dates) {
      for (let h = 0; h < 5; h++) {
        const docId = `${rollNum}_${date}_${hours[h]}`;
        const docRef = doc(ref, docId);
        batch.set(docRef, {
          roll_number: rollNum,
          name: names[s],
          branch: branch.toUpperCase(),
          section: section.toUpperCase(),
          subject: subjects[h % subjects.length],
          hour: hours[h],
          date,
          status: Math.random() > 0.2 ? "Present" : "Absent",
        });
        count++;
      }
    }
  }

  await batch.commit();
  return count;
}

export function parseCSVToStudents(
  csvText: string,
  dataType: "attendance" | "results"
): Omit<StudentData, "id">[] {
  const lines = csvText.trim().split("\n");
  if (lines.length < 2) return [];

  const headers = lines[0].split(",").map((h) => h.trim().toLowerCase());
  const rollIdx = headers.findIndex((h) => h.includes("roll"));
  const nameIdx = headers.findIndex((h) => h.includes("name"));
  const branchIdx = headers.findIndex((h) => h.includes("branch"));
  const semIdx = headers.findIndex((h) => h.includes("sem"));
  const secIdx = headers.findIndex((h) => h.includes("section") || h.includes("sec"));

  if (rollIdx === -1 || nameIdx === -1) return [];

  // Month columns: everything after the metadata columns
  const monthHeaders = headers.filter(
    (h) =>
      !h.includes("roll") &&
      !h.includes("name") &&
      !h.includes("branch") &&
      !h.includes("sem") &&
      !h.includes("section") &&
      !h.includes("sec")
  );

  const monthIndices = monthHeaders.map((mh) => headers.indexOf(mh));

  return lines.slice(1).filter(Boolean).map((line) => {
    const cols = line.split(",").map((c) => c.trim());
    const monthData: Record<string, number> = {};
    monthHeaders.forEach((mh, i) => {
      const val = parseFloat(cols[monthIndices[i]]);
      if (!isNaN(val)) monthData[mh] = val;
    });

    return {
      roll_number: cols[rollIdx] || "",
      name: cols[nameIdx] || "",
      branch: branchIdx >= 0 ? cols[branchIdx] || "" : "",
      semester: semIdx >= 0 ? cols[semIdx] || "" : "",
      section: secIdx >= 0 ? cols[secIdx] || "" : "",
      monthly_attendance: dataType === "attendance" ? monthData : {},
      monthly_results: dataType === "results" ? monthData : {},
    };
  }).filter((s) => s.roll_number);
}
