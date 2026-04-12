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
 * Fetch all students for a given branch/semester/section from Firestore.
 */
export async function fetchStudentsBySection(
  branchCode: string,
  semester: string,
  sectionLetter: string
): Promise<StudentData[]> {
  const ref = collection(db, "student_analytics");
  const q = query(
    ref,
    where("branch", "==", branchCode),
    where("semester", "==", semester),
    where("section", "==", sectionLetter),
    orderBy("roll_number", "asc")
  );

  const snapshot = await getDocs(q);
  return snapshot.docs.map((doc) => ({
    id: doc.id,
    ...doc.data(),
  })) as StudentData[];
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
