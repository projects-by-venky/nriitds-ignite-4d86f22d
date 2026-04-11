import { db } from "@/config/firebase";
import {
  collection,
  query,
  where,
  getDocs,
  orderBy,
  type DocumentData,
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
 * Collection: student_analytics
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
    const doc = exactSnap.docs[0];
    return { id: doc.id, ...doc.data() } as StudentData;
  }

  // Fallback: fetch all for that branch and filter client-side
  // (Firestore doesn't support LIKE/contains natively)
  const allQ = query(ref, where("branch", "==", branchCode));
  const allSnap = await getDocs(allQ);
  const q = rollQuery.toLowerCase();

  for (const doc of allSnap.docs) {
    const d = doc.data() as DocumentData;
    const roll = (d.roll_number || "").toLowerCase();
    const name = (d.name || "").toLowerCase();
    if (roll.includes(q) || name.includes(q)) {
      return { id: doc.id, ...d } as StudentData;
    }
    if (/^\d+$/.test(q)) {
      const digits = roll.replace(/\D/g, "");
      if (digits.endsWith(q)) {
        return { id: doc.id, ...d } as StudentData;
      }
    }
  }

  return null;
}
