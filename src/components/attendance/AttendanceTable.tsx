import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import { Checkbox } from "@/components/ui/checkbox";
import { cn } from "@/lib/utils";
import { AttendanceFilter } from "@/pages/Attendance";
import { parse, isWithinInterval } from "date-fns";
import { motion } from "framer-motion";

// Generate 66 students (23KP1A4401 to 23KP1A4466)
const generateStudents = () => {
  const students = [];
  for (let i = 1; i <= 66; i++) {
    const rollNo = `23KP1A44${String(i).padStart(2, "0")}`;
    // Random attendance pattern for demo
    const rand1 = Math.random() > 0.3 ? "P" : "A";
    const rand2 = Math.random() > 0.3 ? "P" : "A";
    const rand3 = Math.random() > 0.3 ? "P" : "A";
    const rand4 = Math.random() > 0.3 ? "P" : "A";
    const rand5 = Math.random() > 0.3 ? "P" : "A";
    students.push({
      rollNo,
      attendance: {
        "30/06/2025": [rand1, rand1, rand2, rand1, rand2, rand1, rand2],
        "03/07/2025": [rand2, rand1, rand2, rand1, rand2],
        "04/07/2025": [rand3, rand3, rand2, rand3, rand1, rand3, rand2],
        "05/07/2025": [rand4, rand4, rand4, rand4, rand4, rand4],
        "06/07/2025": [rand5, rand5, rand5, rand5, rand5],
      },
    });
  }
  return students;
};

// Mock data structure matching the Google Sheets format
const mockAttendanceData = {
  dates: [
    {
      date: "30/06/2025",
      hours: [
        { hour: "1", subject: "DOA", faculty: "Jeswanth" },
        { hour: "2", subject: "ML", faculty: "Anil" },
        { hour: "3", subject: "CN", faculty: "Salma" },
        { hour: "4", subject: "SE", faculty: "Praveen" },
        { hour: "5", subject: "TS", faculty: "Praveen" },
        { hour: "6", subject: "CTM", faculty: "N Chaithanya" },
        { hour: "7", subject: "CN", faculty: "Salma" },
      ],
    },
    {
      date: "03/07/2025",
      hours: [
        { hour: "1", subject: "SE", faculty: "Praveen" },
        { hour: "2", subject: "DOA", faculty: "Jeswanth" },
        { hour: "3", subject: "SE", faculty: "Praveen" },
        { hour: "4", subject: "ML", faculty: "Anil" },
        { hour: "5", subject: "N LAB", faculty: "Salma Sultana" },
      ],
    },
    {
      date: "04/07/2025",
      hours: [
        { hour: "1", subject: "ML", faculty: "Anil" },
        { hour: "2", subject: "DOA", faculty: "Jeswanth" },
        { hour: "3", subject: "CN", faculty: "Salma" },
        { hour: "4", subject: "TS", faculty: "Praveen" },
        { hour: "5", subject: "SE", faculty: "Praveen" },
        { hour: "6", subject: "CTM", faculty: "N Chaithanya" },
        { hour: "7", subject: "DOA", faculty: "Jeswanth" },
      ],
    },
    {
      date: "05/07/2025",
      hours: [
        { hour: "1", subject: "CN", faculty: "Salma" },
        { hour: "2", subject: "ML", faculty: "Anil" },
        { hour: "3", subject: "DOA", faculty: "Jeswanth" },
        { hour: "4", subject: "SE", faculty: "Praveen" },
        { hour: "5", subject: "CTM", faculty: "N Chaithanya" },
        { hour: "6", subject: "TS", faculty: "Praveen" },
      ],
    },
    {
      date: "06/07/2025",
      hours: [
        { hour: "1", subject: "TS", faculty: "Praveen" },
        { hour: "2", subject: "SE", faculty: "Praveen" },
        { hour: "3", subject: "ML", faculty: "Anil" },
        { hour: "4", subject: "CN", faculty: "Salma" },
        { hour: "5", subject: "DOA", faculty: "Jeswanth" },
      ],
    },
  ],
  students: generateStudents(),
};

interface AttendanceTableProps {
  statusFilter?: AttendanceFilter;
  startDate?: Date;
  endDate?: Date;
  searchQuery?: string;
  selectedStudents?: Set<string>;
  onSelectStudent?: (rollNo: string, selected: boolean) => void;
  onSelectAll?: (rollNos: string[], selected: boolean) => void;
}

export const AttendanceTable = ({ 
  statusFilter = "all",
  startDate,
  endDate,
  searchQuery = "",
  selectedStudents = new Set(),
  onSelectStudent,
  onSelectAll,
}: AttendanceTableProps) => {
  // Filter dates based on date range
  const filteredDates = mockAttendanceData.dates.filter((dateObj) => {
    if (!startDate && !endDate) return true;
    
    const currentDate = parse(dateObj.date, "dd/MM/yyyy", new Date());
    
    if (startDate && endDate) {
      return isWithinInterval(currentDate, { start: startDate, end: endDate });
    } else if (startDate) {
      return currentDate >= startDate;
    } else if (endDate) {
      return currentDate <= endDate;
    }
    
    return true;
  });

  // Filter students based on search query and attendance status
  const filteredStudents = mockAttendanceData.students.map((student) => {
    // Apply search filter first
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      const matchesRollNo = student.rollNo.toLowerCase().includes(query);
      // Note: In real implementation, you'd have student names in the data
      // For now, we'll just search by roll number
      if (!matchesRollNo) {
        return null;
      }
    }

    // Get all attendance values for this student across filtered dates
    const allAttendance = filteredDates.flatMap((dateObj) => 
      student.attendance[dateObj.date] || []
    );
    
    // Determine if student should be shown based on status filter
    if (statusFilter === "present") {
      // Show only if student has at least one present record
      if (!allAttendance.some(status => status === "P")) {
        return null;
      }
    } else if (statusFilter === "absent") {
      // Show only if student has at least one absent record
      if (!allAttendance.some(status => status === "A")) {
        return null;
      }
    }
    
    return student;
  }).filter(Boolean) as typeof mockAttendanceData.students;

  // Show message if no data after filtering
  if (filteredDates.length === 0) {
    return (
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white rounded-lg border-2 border-[#1E3A8A] shadow-lg p-8 text-center"
      >
        <p className="text-black font-medium">No attendance records found for the selected date range.</p>
      </motion.div>
    );
  }

  if (filteredStudents.length === 0) {
    const message = searchQuery 
      ? `No students found matching "${searchQuery}"`
      : statusFilter !== "all"
        ? `No students found with ${statusFilter === "present" ? "present" : "absent"} records in the selected period`
        : "No students found";
    
    return (
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white rounded-lg border-2 border-[#1E3A8A] shadow-lg p-8 text-center"
      >
        <p className="text-black font-medium">{message}</p>
      </motion.div>
    );
  }

  const allFilteredRollNos = filteredStudents.map(s => s.rollNo);
  const allSelected = allFilteredRollNos.length > 0 && 
    allFilteredRollNos.every(rollNo => selectedStudents.has(rollNo));
  const someSelected = allFilteredRollNos.some(rollNo => selectedStudents.has(rollNo));

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="bg-white rounded-lg border-2 border-[#1E3A8A] shadow-xl overflow-hidden"
    >
      <ScrollArea className="w-full">
        <div className="min-w-max">
          {/* Table Structure */}
          <table className="w-full border-collapse">
            {/* Header Group 1: Dates */}
            <thead className="sticky top-0 z-20 bg-white">
              <tr className="border-b-2 border-[#1E3A8A]">
                <th className="sticky left-0 z-30 bg-white border-r-2 border-[#1E3A8A] px-3 py-3 text-center min-w-[50px]">
                  <Checkbox
                    checked={allSelected}
                    onCheckedChange={(checked) => 
                      onSelectAll?.(allFilteredRollNos, checked === true)
                    }
                    aria-label="Select all students"
                    className={cn(
                      "border-[#1E3A8A] data-[state=checked]:bg-[#1E3A8A] data-[state=checked]:border-[#1E3A8A]",
                      someSelected && !allSelected && "data-[state=checked]:bg-[#1E3A8A]/50"
                    )}
                  />
                </th>
                <th className="sticky left-[50px] z-30 bg-white border-r-2 border-[#1E3A8A] px-4 py-3 text-left font-bold text-black min-w-[140px]">
                  Date
                </th>
                {filteredDates.map((dateObj, dateIdx) => (
                  <th
                    key={dateIdx}
                    colSpan={dateObj.hours.length}
                    className="border-r-2 border-[#1E3A8A] px-4 py-3 text-center font-bold text-black bg-blue-50"
                  >
                    {dateObj.date}
                  </th>
                ))}
              </tr>

              {/* Header Group 2: Hour Numbers */}
              <tr className="border-b-2 border-[#1E3A8A]">
                <th className="sticky left-0 z-30 bg-white border-r-2 border-[#1E3A8A] px-3 py-3 min-w-[50px]"></th>
                <th className="sticky left-[50px] z-30 bg-white border-r-2 border-[#1E3A8A] px-4 py-3 text-left font-bold text-black">
                  Hour
                </th>
                {filteredDates.map((dateObj, dateIdx) =>
                  dateObj.hours.map((hourObj, hourIdx) => (
                    <th
                      key={`${dateIdx}-${hourIdx}`}
                      className="border-r border-[#1E3A8A] px-3 py-3 text-center font-semibold text-sm text-black min-w-[70px] bg-blue-50"
                    >
                      {hourObj.hour}
                    </th>
                  ))
                )}
              </tr>

              {/* Header Group 3: Subject/Lab */}
              <tr className="border-b border-[#1E3A8A]">
                <th className="sticky left-0 z-30 bg-white border-r-2 border-[#1E3A8A] px-3 py-3 min-w-[50px]"></th>
                <th className="sticky left-[50px] z-30 bg-white border-r-2 border-[#1E3A8A] px-4 py-3 text-left font-bold text-black">
                  Subject/Lab
                </th>
                {filteredDates.map((dateObj, dateIdx) =>
                  dateObj.hours.map((hourObj, hourIdx) => (
                    <th
                      key={`${dateIdx}-${hourIdx}`}
                      className="border-r border-[#1E3A8A] px-3 py-2 text-center text-xs font-medium text-black bg-white"
                    >
                      {hourObj.subject}
                    </th>
                  ))
                )}
              </tr>

              {/* Header Group 4: Faculty */}
              <tr className="border-b-2 border-[#1E3A8A]">
                <th className="sticky left-0 z-30 bg-white border-r-2 border-[#1E3A8A] px-3 py-3 min-w-[50px]"></th>
                <th className="sticky left-[50px] z-30 bg-white border-r-2 border-[#1E3A8A] px-4 py-3 text-left font-bold text-black">
                  Faculty
                </th>
                {filteredDates.map((dateObj, dateIdx) =>
                  dateObj.hours.map((hourObj, hourIdx) => (
                    <th
                      key={`${dateIdx}-${hourIdx}`}
                      className="border-r border-[#1E3A8A] px-3 py-2 text-center text-xs font-medium text-black bg-white"
                    >
                      {hourObj.faculty}
                    </th>
                  ))
                )}
              </tr>
            </thead>

            {/* Body: Student Rows */}
            <tbody>
              {filteredStudents.map((student, studentIdx) => (
                <tr
                  key={student.rollNo}
                  className={cn(
                    "border-b border-[#1E3A8A] hover:bg-blue-50/50 transition-colors",
                    studentIdx % 2 === 0 ? "bg-white" : "bg-gray-50/30",
                    selectedStudents.has(student.rollNo) && "bg-blue-100/40"
                  )}
                >
                  {/* Checkbox - Sticky */}
                  <td className="sticky left-0 z-10 bg-inherit border-r-2 border-[#1E3A8A] px-3 py-3 text-center min-w-[50px]">
                    <Checkbox
                      checked={selectedStudents.has(student.rollNo)}
                      onCheckedChange={(checked) =>
                        onSelectStudent?.(student.rollNo, checked === true)
                      }
                      aria-label={`Select ${student.rollNo}`}
                      className="border-[#1E3A8A] data-[state=checked]:bg-[#1E3A8A] data-[state=checked]:border-[#1E3A8A]"
                    />
                  </td>

                  {/* Roll Number - Sticky */}
                  <td className="sticky left-[50px] z-10 bg-inherit border-r-2 border-[#1E3A8A] px-4 py-3 font-semibold text-black">
                    {student.rollNo}
                  </td>

                  {/* Attendance Cells */}
                  {filteredDates.map((dateObj) =>
                    student.attendance[dateObj.date]?.map(
                      (status, statusIdx) => (
                        <td
                          key={`${dateObj.date}-${statusIdx}`}
                          className={cn(
                            "border-r border-[#1E3A8A] px-3 py-3 text-center font-bold text-sm transition-all",
                            "bg-white hover:bg-blue-50/50",
                            status === "P" && "text-green-700",
                            status === "A" && "text-red-700"
                          )}
                        >
                          {status}
                        </td>
                      )
                    )
                  )}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <ScrollBar orientation="horizontal" className="h-3" />
      </ScrollArea>
    </motion.div>
  );
};
