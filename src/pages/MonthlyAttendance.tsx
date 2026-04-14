import React, { useState, useMemo } from "react";
import { useParams, Link } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowLeft, Download, Search, X } from "lucide-react";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import MobileBottomNav from "@/components/layout/MobileBottomNav";
import MobileSearchBar from "@/components/mobile/MobileSearchBar";
import MobileMonthlyCard from "@/components/mobile/MobileMonthlyCard";
import { Button } from "@/components/ui/button";
import { useIsMobile } from "@/hooks/use-mobile";
import AttendanceExportDialog from "@/components/attendance/AttendanceExportDialog";

// Subject data with faculty names
const subjects = [
  { code: "OT", name: "Object Technology", faculty: "Mrs DV" },
  { code: "SMDS", name: "Statistical Methods", faculty: "Mrs DV" },
  { code: "DE", name: "Digital Electronics", faculty: "Mr RT" },
  { code: "DBMS", name: "Database Management", faculty: "Ms PPK" },
  { code: "DLCO", name: "Digital Logic", faculty: "Mrs KP" },
  { code: "DE L", name: "DE Lab", faculty: "Mr RT" },
  { code: "DBMS L", name: "DBMS Lab", faculty: "Ms PPK" },
  { code: "EDA L", name: "EDA Lab", faculty: "Mr MV" },
  { code: "DT & I", name: "Design Thinking", faculty: "Mrs SM" },
  { code: "CRT", name: "Campus Training", faculty: "" },
];

// Generate mock students for the section
const generateStudents = (section: string) => {
  const students = [];
  const baseStart = section.includes("A") ? 1 : section.includes("B") ? 23 : 45;
  
  for (let i = 0; i < 22; i++) {
    const rollNum = baseStart + i;
    students.push({
      rollNumber: `23KP1A44${rollNum.toString().padStart(2, '0')}`,
    });
  }
  return students;
};

// Generate mock monthly attendance data per subject
const generateMonthlyData = (section: string) => {
  const students = generateStudents(section);
  
  return {
    section,
    attendanceDate: "31/03/2025",
    students: students.map(student => ({
      ...student,
      subjectAttendance: subjects.map((subject) => ({
        code: subject.code,
        name: subject.name,
        conducted: Math.floor(Math.random() * 50) + 40,
        attended: Math.floor(Math.random() * 40) + 10,
      })),
    })),
  };
};

const departments = {
  cse: { name: "Computer Science & Engineering", shortName: "CSE" },
  ece: { name: "Electronics & Communication", shortName: "ECE" },
  eee: { name: "Electrical & Electronics", shortName: "EEE" },
  mech: { name: "Mechanical Engineering", shortName: "MECH" },
  civil: { name: "Civil Engineering", shortName: "CIVIL" },
  aids: { name: "AI & Data Science", shortName: "AI&DS" },
  mba: { name: "Business Administration", shortName: "MBA" },
  mca: { name: "Computer Applications", shortName: "MCA" }
};

const MonthlyAttendance = () => {
  const { deptId, section } = useParams<{ deptId: string; section: string }>();
  const dept = deptId ? departments[deptId as keyof typeof departments] : null;
  const isMobile = useIsMobile();
  const [searchQuery, setSearchQuery] = useState("");
  const [exportOpen, setExportOpen] = useState(false);
  const formattedSection = section?.replace(/-/g, ' ') || '';
  const data = generateMonthlyData(section || '2-2-DS-A');

  // Extract class and semester from section
  const sectionParts = section?.split('-') || [];
  const year = sectionParts[0] || '2';
  const sem = sectionParts[1] || '2';
  const branch = sectionParts[2] || 'DS';
  const sectionLetter = sectionParts[3] || 'A';

  // Build student entries and monthly data for export
  const allStudentEntries = useMemo(() => 
    data.students.map((s) => ({
      roll_number: s.rollNumber,
      name: s.rollNumber,
      branch: branch,
      section: sectionLetter,
    })), [data.students, branch, sectionLetter]);

  const monthlyExportData = useMemo(() => {
    const map: Record<string, { code: string; name: string; conducted: number; attended: number }[]> = {};
    data.students.forEach((s) => {
      map[s.rollNumber] = s.subjectAttendance.map((a) => ({
        code: a.code,
        name: a.name,
        conducted: a.conducted,
        attended: a.attended,
      }));
    });
    return map;
  }, [data.students]);

  // Filter students based on search query - EXACT MATCH ONLY
  const filteredStudents = useMemo(() => {
    if (!searchQuery || searchQuery.trim() === "") {
      return data.students;
    }
    
    const query = searchQuery.trim().toUpperCase();
    const isNumericQuery = /^\d+$/.test(query);
    
    return data.students.filter(student => {
      const rollNoUpper = student.rollNumber.toUpperCase();
      
      if (isNumericQuery) {
        const rollNoNumericSuffix = student.rollNumber.replace(/\D/g, '').slice(-query.length);
        return rollNoNumericSuffix === query;
      } else {
        return rollNoUpper === query;
      }
    });
  }, [data.students, searchQuery]);

  if (!dept) {
    return (
      <div className="min-h-screen flex items-center justify-center px-4">
        <div className="text-center">
          <h1 className="text-2xl md:text-4xl font-bold mb-4">Department Not Found</h1>
          <Link to="/" className="text-primary hover:underline">Return Home</Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-background via-background/95 to-background">
      <Header />
      
      <main className="pt-16 md:pt-20 pb-24 md:pb-20">
        <div className="container mx-auto px-4 md:px-6">
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-4 md:mb-6"
          >
            <Link 
              to={`/department/${deptId}/student-portal`}
              className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground mb-3 transition-colors touch-target justify-start"
            >
              <ArrowLeft className="w-5 h-5" />
              <span className="text-sm">Back</span>
            </Link>
            
            <div className="flex flex-col gap-4">
              <div>
                <h1 className="text-xl md:text-3xl font-black mb-1 bg-clip-text text-transparent"
                    style={{ backgroundImage: "linear-gradient(135deg, #0EA5E9, #1E3A8A)" }}>
                  Monthly Attendance
                </h1>
                <p className="text-sm md:text-base text-muted-foreground">
                  {formattedSection} • {dept.name}
                </p>
              </div>
              
              {/* Search & Actions */}
              <div className="flex gap-2 md:gap-3">
                <div className="flex-1">
                  <MobileSearchBar
                    value={searchQuery}
                    onChange={setSearchQuery}
                    placeholder="Exact roll no. or suffix (e.g., 40)"
                  />
                </div>
                <Button 
                  className="h-12 px-3 md:px-4 bg-gradient-cyber text-white hover:opacity-90"
                  onClick={() => setExportOpen(true)}
                >
                  <Download className="w-4 h-4 md:mr-2" />
                  <span className="hidden md:inline">Export</span>
                </Button>
              </div>
            </div>
          </motion.div>

          {/* Mobile View - Card Layout */}
          {isMobile ? (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="space-y-3"
            >
              {filteredStudents.length === 0 ? (
                <div className="bg-card border border-border rounded-2xl p-8 text-center">
                  <p className="text-muted-foreground">No students found matching "{searchQuery}"</p>
                </div>
              ) : (
                filteredStudents.map((student) => {
                  const totalConducted = student.subjectAttendance.reduce((sum, a) => sum + a.conducted, 0);
                  const totalAttended = student.subjectAttendance.reduce((sum, a) => sum + a.attended, 0);
                  const percentage = Math.round((totalAttended / totalConducted) * 100);
                  
                  return (
                    <MobileMonthlyCard
                      key={student.rollNumber}
                      rollNumber={student.rollNumber}
                      subjects={student.subjectAttendance}
                      totalConducted={totalConducted}
                      totalAttended={totalAttended}
                      percentage={percentage}
                    />
                  );
                })
              )}
            </motion.div>
          ) : (
            /* Desktop View - Table */
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="bg-white rounded-xl border-2 border-[#1E3A8A] shadow-xl overflow-hidden"
            >
              <div className="overflow-x-auto max-h-[70vh]">
                <table className="w-full border-collapse text-sm">
                  {/* Institute Header */}
                  <thead className="sticky top-0 z-20">
                    <tr className="bg-blue-50 border-b-2 border-[#1E3A8A]">
                      <th colSpan={subjects.length * 2 + 4} className="px-4 py-3 text-center font-bold border-b border-[#1E3A8A] text-base text-black">
                        NRI INSTITUTE OF TECHNOLOGY::GUNTUR
                        <span className="ml-8">A-ATTENDED</span>
                        <span className="ml-4">C-CONDUCTED</span>
                      </th>
                    </tr>
                    <tr className="bg-blue-50 border-b-2 border-[#1E3A8A]">
                      <th colSpan={subjects.length * 2 + 4} className="px-4 py-2 text-center font-bold border-b border-[#1E3A8A] text-black">
                        CLASS:{year}nd B.TECH &nbsp;&nbsp; SEM:{sem} &nbsp;&nbsp; BRANCH: {branch}-{sectionLetter} &nbsp;&nbsp; CUMULATIVE ATTENDANCE UP TO - {data.attendanceDate}
                      </th>
                    </tr>
                    {/* Subject Headers */}
                    <tr className="bg-white border-b border-[#1E3A8A]">
                      <th rowSpan={3} className="sticky left-0 z-30 bg-white px-3 py-2 text-center font-bold border-r-2 border-b border-[#1E3A8A] min-w-[100px] text-black">
                        Roll No
                      </th>
                      {subjects.map((subject, idx) => (
                        <th key={idx} colSpan={2} className="px-2 py-2 text-center font-bold border-r border-[#1E3A8A] text-black bg-blue-50">
                          {subject.code}
                        </th>
                      ))}
                      <th rowSpan={3} className="px-2 py-2 text-center font-bold border-r border-[#1E3A8A] min-w-[50px] text-black bg-blue-50">
                        TC
                      </th>
                      <th rowSpan={3} className="px-2 py-2 text-center font-bold border-r border-[#1E3A8A] min-w-[50px] text-black bg-blue-50">
                        TA
                      </th>
                      <th rowSpan={3} className="px-2 py-2 text-center font-bold border-[#1E3A8A] min-w-[50px] text-black bg-blue-50">
                        PER
                      </th>
                    </tr>
                    {/* Faculty Names */}
                    <tr className="bg-white border-b border-[#1E3A8A]">
                      {subjects.map((subject, idx) => (
                        <th key={idx} colSpan={2} className="px-2 py-1 text-center font-normal border-r border-[#1E3A8A] text-xs text-black">
                          {subject.faculty}
                        </th>
                      ))}
                    </tr>
                    {/* C/A Headers */}
                    <tr className="bg-white border-b-2 border-[#1E3A8A]">
                      {subjects.map((_, idx) => (
                        <React.Fragment key={idx}>
                          <th className="px-1 py-1 text-center font-bold border-r border-[#1E3A8A] min-w-[35px] text-black">C</th>
                          <th className="px-1 py-1 text-center font-bold border-r border-[#1E3A8A] min-w-[35px] text-black">A</th>
                        </React.Fragment>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {filteredStudents.length === 0 ? (
                      <tr>
                        <td colSpan={subjects.length * 2 + 4} className="px-4 py-8 text-center text-black font-medium">
                          No students found matching "{searchQuery}"
                        </td>
                      </tr>
                    ) : (
                      filteredStudents.map((student, idx) => {
                        const totalConducted = student.subjectAttendance.reduce((sum, a) => sum + a.conducted, 0);
                        const totalAttended = student.subjectAttendance.reduce((sum, a) => sum + a.attended, 0);
                        const percentage = Math.round((totalAttended / totalConducted) * 100);
                        
                        return (
                          <tr key={student.rollNumber} className={`border-b border-[#1E3A8A] hover:bg-blue-50/50 transition-colors ${idx % 2 === 0 ? 'bg-white' : 'bg-gray-50/30'}`}>
                            <td className="sticky left-0 z-10 px-3 py-2 border-r-2 border-[#1E3A8A] font-semibold text-black text-center"
                                style={{ backgroundColor: idx % 2 === 0 ? 'white' : 'rgba(249, 250, 251, 0.3)' }}>
                              {student.rollNumber}
                            </td>
                            {student.subjectAttendance.map((att, attIdx) => (
                              <React.Fragment key={attIdx}>
                                <td className="px-1 py-2 border-r border-[#1E3A8A] text-center text-black">
                                  {att.conducted}
                                </td>
                                <td className="px-1 py-2 border-r border-[#1E3A8A] text-center text-black">
                                  {att.attended}
                                </td>
                              </React.Fragment>
                            ))}
                            <td className="px-1 py-2 border-r border-[#1E3A8A] text-center font-medium text-black">
                              {totalConducted}
                            </td>
                            <td className="px-1 py-2 border-r border-[#1E3A8A] text-center font-medium text-black">
                              {totalAttended}
                            </td>
                            <td className={`px-1 py-2 border-[#1E3A8A] text-center font-bold ${
                              percentage >= 75 ? 'text-black' : 'text-pink-600 bg-pink-100'
                            }`}>
                              {percentage}
                            </td>
                          </tr>
                        );
                      })
                    )}
                  </tbody>
                </table>
              </div>
            </motion.div>
          )}

          {/* Legend */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
            className="mt-4 md:mt-6 flex flex-wrap items-center gap-3 md:gap-6 text-xs md:text-sm"
          >
            <div className="flex items-center gap-2">
              <span className="text-muted-foreground">TC - Total Conducted</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-muted-foreground">TA - Total Attended</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 md:w-4 md:h-4 rounded bg-red-500"></div>
              <span className="text-muted-foreground">&lt; 75%</span>
            </div>
          </motion.div>
        </div>
      </main>

      <AttendanceExportDialog
        open={exportOpen}
        onOpenChange={setExportOpen}
        allStudents={allStudentEntries}
        branch={branch}
        section={sectionLetter}
        source="monthly"
        monthlyData={monthlyExportData}
      />

      <Footer />
      <MobileBottomNav />
    </div>
  );
};

export default MonthlyAttendance;
