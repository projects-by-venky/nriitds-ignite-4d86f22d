import { useParams, Link } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowLeft, Calendar, Download } from "lucide-react";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import { Button } from "@/components/ui/button";

// Generate mock students for the section
const generateStudents = (section: string) => {
  const students = [];
  const baseRoll = section.includes("A") ? "23KP1A4401" : section.includes("B") ? "23KP1A4423" : "23KP1A4445";
  const startNum = parseInt(baseRoll.slice(-2));
  
  for (let i = 0; i < 22; i++) {
    const rollNum = startNum + i;
    students.push({
      rollNumber: `23KP1A44${rollNum.toString().padStart(2, '0')}`,
      name: `Student ${rollNum}`,
    });
  }
  return students;
};

// Mock monthly attendance data
const generateMonthlyData = (section: string) => {
  const students = generateStudents(section);
  const months = ["January 2025", "February 2025", "March 2025", "April 2025", "May 2025", "June 2025"];
  
  return {
    section,
    months,
    students: students.map(student => ({
      ...student,
      attendance: months.map(() => ({
        totalClasses: Math.floor(Math.random() * 10) + 20,
        attended: Math.floor(Math.random() * 8) + 18,
      })),
    })),
  };
};

const departments = {
  cse: { name: "Computer Science & Engineering" },
  ece: { name: "Electronics & Communication" },
  eee: { name: "Electrical & Electronics" },
  mech: { name: "Mechanical Engineering" },
  civil: { name: "Civil Engineering" },
  aids: { name: "AI & Data Science" },
  mba: { name: "Business Administration" },
  mca: { name: "Computer Applications" }
};

const MonthlyAttendance = () => {
  const { deptId, section } = useParams<{ deptId: string; section: string }>();
  const dept = deptId ? departments[deptId as keyof typeof departments] : null;
  
  const formattedSection = section?.replace(/-/g, ' ') || '';
  const data = generateMonthlyData(section || '2-2-DS-A');

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
        <div className="container mx-auto px-8">
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-8"
          >
            <Link 
              to={`/department/${deptId}/student-portal`}
              className="inline-flex items-center gap-2 text-white/70 hover:text-white mb-6 transition-colors"
            >
              <ArrowLeft className="w-5 h-5" />
              Back to Student Portal
            </Link>
            
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-4xl font-black mb-2 bg-clip-text text-transparent"
                    style={{ backgroundImage: "linear-gradient(135deg, #0EA5E9, #1E3A8A)" }}>
                  Monthly Cumulative Attendance
                </h1>
                <p className="text-xl text-white/70">{formattedSection} - {dept.name}</p>
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
            className="bg-white rounded-xl shadow-lg overflow-hidden"
          >
            <div className="overflow-x-auto">
              <table className="w-full border-collapse">
                <thead>
                  <tr className="bg-[#1E3A8A] text-white">
                    <th className="sticky left-0 z-10 bg-[#1E3A8A] px-4 py-3 text-left font-bold border border-[#1E3A8A]">
                      S.No
                    </th>
                    <th className="sticky left-16 z-10 bg-[#1E3A8A] px-4 py-3 text-left font-bold border border-[#1E3A8A]">
                      Roll Number
                    </th>
                    <th className="sticky left-40 z-10 bg-[#1E3A8A] px-4 py-3 text-left font-bold border border-[#1E3A8A]">
                      Student Name
                    </th>
                    {data.months.map((month, idx) => (
                      <th key={idx} className="px-4 py-3 text-center font-bold border border-[#1E3A8A] min-w-[140px]">
                        <div className="flex flex-col">
                          <span>{month}</span>
                          <span className="text-xs font-normal opacity-80">Attended / Total</span>
                        </div>
                      </th>
                    ))}
                    <th className="px-4 py-3 text-center font-bold border border-[#1E3A8A] min-w-[120px]">
                      Overall %
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {data.students.map((student, idx) => {
                    const totalAttended = student.attendance.reduce((sum, a) => sum + a.attended, 0);
                    const totalClasses = student.attendance.reduce((sum, a) => sum + a.totalClasses, 0);
                    const overallPercentage = ((totalAttended / totalClasses) * 100).toFixed(1);
                    
                    return (
                      <tr key={student.rollNumber} className={idx % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                        <td className="sticky left-0 z-10 px-4 py-3 border border-[#1E3A8A] font-medium text-black"
                            style={{ backgroundColor: idx % 2 === 0 ? 'white' : '#f9fafb' }}>
                          {idx + 1}
                        </td>
                        <td className="sticky left-16 z-10 px-4 py-3 border border-[#1E3A8A] font-medium text-black"
                            style={{ backgroundColor: idx % 2 === 0 ? 'white' : '#f9fafb' }}>
                          {student.rollNumber}
                        </td>
                        <td className="sticky left-40 z-10 px-4 py-3 border border-[#1E3A8A] text-black"
                            style={{ backgroundColor: idx % 2 === 0 ? 'white' : '#f9fafb' }}>
                          {student.name}
                        </td>
                        {student.attendance.map((att, attIdx) => {
                          const percentage = (att.attended / att.totalClasses) * 100;
                          return (
                            <td 
                              key={attIdx} 
                              className={`px-4 py-3 border border-[#1E3A8A] text-center font-medium ${
                                percentage >= 75 ? 'text-green-600' : percentage >= 65 ? 'text-yellow-600' : 'text-red-600'
                              }`}
                            >
                              {att.attended} / {att.totalClasses}
                              <span className="block text-xs opacity-70">({percentage.toFixed(0)}%)</span>
                            </td>
                          );
                        })}
                        <td className={`px-4 py-3 border border-[#1E3A8A] text-center font-bold ${
                          parseFloat(overallPercentage) >= 75 ? 'text-green-600 bg-green-50' : 
                          parseFloat(overallPercentage) >= 65 ? 'text-yellow-600 bg-yellow-50' : 'text-red-600 bg-red-50'
                        }`}>
                          {overallPercentage}%
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
              <div className="w-4 h-4 rounded bg-green-100 border border-green-600"></div>
              <span className="text-white/70">≥ 75% (Good)</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 rounded bg-yellow-100 border border-yellow-600"></div>
              <span className="text-white/70">65-74% (Warning)</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 rounded bg-red-100 border border-red-600"></div>
              <span className="text-white/70">&lt; 65% (Critical)</span>
            </div>
          </motion.div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default MonthlyAttendance;
