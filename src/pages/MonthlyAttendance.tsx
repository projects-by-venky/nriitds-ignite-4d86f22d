import React from "react";
import { useParams, Link } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowLeft, Download } from "lucide-react";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import { Button } from "@/components/ui/button";

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
      subjectAttendance: subjects.map(() => ({
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
  
  const formattedSection = section?.replace(/-/g, ' ') || '';
  const data = generateMonthlyData(section || '2-2-DS-A');

  // Extract class and semester from section (e.g., "2-2-DS-A" -> "2nd B.TECH", "SEM:2")
  const sectionParts = section?.split('-') || [];
  const year = sectionParts[0] || '2';
  const sem = sectionParts[1] || '2';
  const branch = sectionParts[2] || 'DS';
  const sectionLetter = sectionParts[3] || 'A';

  if (!dept) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-4xl font-bold mb-4">Department Not Found</h1>
          <Link to="/" className="text-primary hover:underline">Return Home</Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-background via-background/95 to-background">
      <Header />
      
      <main className="pt-24 pb-20">
        <div className="container mx-auto px-4">
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-6"
          >
            <Link 
              to={`/department/${deptId}/student-portal`}
              className="inline-flex items-center gap-2 text-white/70 hover:text-white mb-4 transition-colors"
            >
              <ArrowLeft className="w-5 h-5" />
              Back to Student Portal
            </Link>
            
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-3xl font-black mb-1 bg-clip-text text-transparent"
                    style={{ backgroundImage: "linear-gradient(135deg, #0EA5E9, #1E3A8A)" }}>
                  Monthly Cumulative Attendance
                </h1>
                <p className="text-lg text-white/70">{formattedSection} - {dept.name}</p>
              </div>
              <Button 
                className="bg-gradient-cyber text-white hover:opacity-90"
                onClick={() => {}}
              >
                <Download className="w-4 h-4 mr-2" />
                Export
              </Button>
            </div>
          </motion.div>

          {/* Attendance Table */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-white rounded-lg border-2 border-[#1E3A8A] shadow-xl overflow-hidden"
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
                  {data.students.map((student, idx) => {
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
                  })}
                </tbody>
              </table>
            </div>
          </motion.div>

          {/* Legend */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
            className="mt-6 flex items-center gap-6 text-sm"
          >
            <div className="flex items-center gap-2">
              <span className="text-white/70 font-medium">TC - Total Conducted</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-white/70 font-medium">TA - Total Attended</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-white/70 font-medium">PER - Percentage</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 rounded bg-pink-500"></div>
              <span className="text-white/70">&lt; 75% (Low Attendance)</span>
            </div>
          </motion.div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default MonthlyAttendance;
