import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import { cn } from "@/lib/utils";

// Mock data structure matching the Google Sheets format
const mockAttendanceData = {
  dates: [
    {
      date: "30/06/2025",
      hours: [
        { hour: "2", subject: "DOA", faculty: "Jeswanth" },
        { hour: "3", subject: "ML", faculty: "Anil" },
        { hour: "1", subject: "CN", faculty: "Salma" },
        { hour: "4", subject: "SE", faculty: "Praveen" },
        { hour: "5", subject: "TS", faculty: "Praveen" },
        { hour: "6", subject: "CTM", faculty: "N Chaithanya" },
        { hour: "7", subject: "CN", faculty: "Salma" },
      ],
    },
    {
      date: "03/07/2025",
      hours: [
        { hour: "2", subject: "SE", faculty: "Praveen" },
        { hour: "1,3", subject: "DOA", faculty: "Jeswanth" },
        { hour: "2,4", subject: "SE", faculty: "Praveen" },
        { hour: "5", subject: "ML", faculty: "Anil" },
        { hour: "5,7,8", subject: "N LAB", faculty: "Salma Sultana" },
      ],
    },
  ],
  students: [
    {
      rollNo: "23KP1A4401",
      attendance: {
        "30/06/2025": ["A", "A", "A", "A", "A", "A", "A"],
        "03/07/2025": ["A", "A", "A", "A", "A"],
      },
    },
    {
      rollNo: "23KP1A4402",
      attendance: {
        "30/06/2025": ["A", "A", "A", "A", "A", "A", "A"],
        "03/07/2025": ["A", "A", "A", "A", "A"],
      },
    },
    {
      rollNo: "23KP1A4403",
      attendance: {
        "30/06/2025": ["A", "A", "A", "A", "A", "A", "A"],
        "03/07/2025": ["A", "A", "A", "A", "A"],
      },
    },
    {
      rollNo: "23KP1A4405",
      attendance: {
        "30/06/2025": ["A", "A", "A", "A", "A", "A", "A"],
        "03/07/2025": ["P", "P", "P", "P", "P"],
      },
    },
    {
      rollNo: "23KP1A4406",
      attendance: {
        "30/06/2025": ["P", "P", "A", "P", "P", "P", "P"],
        "03/07/2025": ["P", "P", "P", "P", "P"],
      },
    },
    {
      rollNo: "23KP1A4408",
      attendance: {
        "30/06/2025": ["A", "A", "A", "A", "A", "A", "A"],
        "03/07/2025": ["A", "A", "A", "A", "A"],
      },
    },
    {
      rollNo: "23KP1A4409",
      attendance: {
        "30/06/2025": ["A", "A", "A", "A", "A", "A", "A"],
        "03/07/2025": ["A", "A", "A", "A", "A"],
      },
    },
    {
      rollNo: "23KP1A4410",
      attendance: {
        "30/06/2025": ["A", "A", "A", "A", "A", "A", "A"],
        "03/07/2025": ["A", "A", "A", "A", "A"],
      },
    },
    {
      rollNo: "23KP1A4411",
      attendance: {
        "30/06/2025": ["A", "A", "A", "A", "A", "A", "A"],
        "03/07/2025": ["A", "A", "A", "A", "A"],
      },
    },
    {
      rollNo: "23KP1A4412",
      attendance: {
        "30/06/2025": ["A", "A", "A", "A", "A", "A", "A"],
        "03/07/2025": ["A", "A", "A", "A", "A"],
      },
    },
    {
      rollNo: "23KP1A4413",
      attendance: {
        "30/06/2025": ["P", "P", "P", "P", "A", "P", "P"],
        "03/07/2025": ["P", "P", "P", "P", "P"],
      },
    },
    {
      rollNo: "23KP1A4415",
      attendance: {
        "30/06/2025": ["P", "P", "P", "P", "P", "P", "P"],
        "03/07/2025": ["A", "A", "A", "A", "A"],
      },
    },
    {
      rollNo: "23KP1A4416",
      attendance: {
        "30/06/2025": ["A", "A", "A", "A", "A", "A", "A"],
        "03/07/2025": ["P", "P", "P", "P", "P"],
      },
    },
    {
      rollNo: "23KP1A4417",
      attendance: {
        "30/06/2025": ["A", "A", "A", "A", "A", "A", "A"],
        "03/07/2025": ["A", "A", "A", "A", "A"],
      },
    },
    {
      rollNo: "23KP1A4418",
      attendance: {
        "30/06/2025": ["A", "A", "A", "A", "A", "A", "A"],
        "03/07/2025": ["A", "A", "A", "A", "A"],
      },
    },
    {
      rollNo: "23KP1A4419",
      attendance: {
        "30/06/2025": ["P", "P", "P", "P", "P", "P", "P"],
        "03/07/2025": ["A", "A", "A", "A", "A"],
      },
    },
    {
      rollNo: "23KP1A4420",
      attendance: {
        "30/06/2025": ["A", "A", "A", "A", "A", "A", "A"],
        "03/07/2025": ["A", "A", "A", "A", "A"],
      },
    },
    {
      rollNo: "23KP1A4421",
      attendance: {
        "30/06/2025": ["A", "A", "A", "A", "A", "A", "A"],
        "03/07/2025": ["A", "A", "A", "A", "A"],
      },
    },
    {
      rollNo: "23KP1A4422",
      attendance: {
        "30/06/2025": ["A", "A", "A", "A", "A", "A", "A"],
        "03/07/2025": ["A", "A", "A", "A", "A"],
      },
    },
    {
      rollNo: "23KP1A4423",
      attendance: {
        "30/06/2025": ["A", "A", "A", "A", "A", "A", "A"],
        "03/07/2025": ["P", "P", "P", "P", "P"],
      },
    },
    {
      rollNo: "23KP1A4424",
      attendance: {
        "30/06/2025": ["P", "P", "P", "P", "P", "P", "P"],
        "03/07/2025": ["P", "P", "P", "P", "P"],
      },
    },
  ],
};

export const AttendanceTable = () => {
  const { dates, students } = mockAttendanceData;

  // Calculate total columns for proper width
  const totalHours = dates.reduce((sum, date) => sum + date.hours.length, 0);

  return (
    <div className="bg-card rounded-lg border border-border shadow-sm overflow-hidden">
      <ScrollArea className="w-full">
        <div className="min-w-max">
          {/* Table Structure */}
          <table className="w-full border-collapse">
            {/* Header Group 1: Dates */}
            <thead className="sticky top-0 z-20 bg-card">
              <tr className="border-b border-border">
                <th className="sticky left-0 z-30 bg-card border-r border-border px-4 py-3 text-left font-semibold text-foreground min-w-[120px]">
                  Date
                </th>
                {dates.map((dateObj, dateIdx) => (
                  <th
                    key={dateIdx}
                    colSpan={dateObj.hours.length}
                    className="border-r border-border px-4 py-3 text-center font-semibold text-foreground bg-muted/30"
                  >
                    {dateObj.date}
                  </th>
                ))}
              </tr>

              {/* Header Group 2: Hour Numbers */}
              <tr className="border-b border-border">
                <th className="sticky left-0 z-30 bg-card border-r border-border px-4 py-3 text-left font-semibold text-foreground">
                  Hour
                </th>
                {dates.map((dateObj, dateIdx) =>
                  dateObj.hours.map((hourObj, hourIdx) => (
                    <th
                      key={`${dateIdx}-${hourIdx}`}
                      className="border-r border-border px-3 py-3 text-center font-medium text-sm text-foreground min-w-[60px]"
                    >
                      {hourObj.hour}
                    </th>
                  ))
                )}
              </tr>

              {/* Header Group 3: Subject/Lab */}
              <tr className="border-b border-border">
                <th className="sticky left-0 z-30 bg-card border-r border-border px-4 py-3 text-left font-semibold text-foreground">
                  Subject/Lab
                </th>
                {dates.map((dateObj, dateIdx) =>
                  dateObj.hours.map((hourObj, hourIdx) => (
                    <th
                      key={`${dateIdx}-${hourIdx}`}
                      className="border-r border-border px-3 py-2 text-center text-xs font-medium text-muted-foreground"
                    >
                      {hourObj.subject}
                    </th>
                  ))
                )}
              </tr>

              {/* Header Group 4: Faculty */}
              <tr className="border-b-2 border-border">
                <th className="sticky left-0 z-30 bg-card border-r border-border px-4 py-3 text-left font-semibold text-foreground">
                  Faculty
                </th>
                {dates.map((dateObj, dateIdx) =>
                  dateObj.hours.map((hourObj, hourIdx) => (
                    <th
                      key={`${dateIdx}-${hourIdx}`}
                      className="border-r border-border px-3 py-2 text-center text-xs font-medium text-muted-foreground"
                    >
                      {hourObj.faculty}
                    </th>
                  ))
                )}
              </tr>
            </thead>

            {/* Body: Student Rows */}
            <tbody>
              {students.map((student, studentIdx) => (
                <tr
                  key={student.rollNo}
                  className={cn(
                    "border-b border-border hover:bg-muted/20 transition-colors",
                    studentIdx % 2 === 0 ? "bg-background" : "bg-muted/5"
                  )}
                >
                  {/* Roll Number - Sticky */}
                  <td className="sticky left-0 z-10 bg-inherit border-r border-border px-4 py-3 font-medium text-foreground">
                    {student.rollNo}
                  </td>

                  {/* Attendance Cells */}
                  {dates.map((dateObj) =>
                    student.attendance[dateObj.date]?.map(
                      (status, statusIdx) => (
                        <td
                          key={`${dateObj.date}-${statusIdx}`}
                          className={cn(
                            "border-r border-border px-3 py-3 text-center font-semibold text-sm transition-all",
                            status === "P"
                              ? "bg-green-500/20 text-green-700 dark:text-green-400"
                              : "bg-red-500/20 text-red-700 dark:text-red-400"
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
        <ScrollBar orientation="horizontal" />
      </ScrollArea>
    </div>
  );
};
