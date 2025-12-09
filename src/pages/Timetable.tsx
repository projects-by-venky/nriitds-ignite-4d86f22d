import React from "react";
import { useParams, Link } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowLeft, Download } from "lucide-react";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import { Button } from "@/components/ui/button";

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

// Time slots
const timeSlots = [
  { period: "1st", time: "09:00-09:50" },
  { period: "2nd", time: "09:50-10:40" },
  { period: "BREAK", time: "10:40-10:50" },
  { period: "3rd", time: "10:50-11:40" },
  { period: "4th", time: "11:40-12:30" },
  { period: "LUNCH", time: "12:30-01:10" },
  { period: "5th", time: "01:10-02:00" },
  { period: "6th", time: "02:00-02:50" },
  { period: "BREAK", time: "02:50-03:00" },
  { period: "7th", time: "03:00-03:40" },
  { period: "8th", time: "03:40-04:20" },
];

// Timetable data based on section
const getTimetableData = (section: string) => {
  const baseSchedule = {
    "2-1-DS-A": {
      classIncharge: "Dr B BHAVANI",
      roomNo: "205",
      effectiveDate: "30-06-2025",
      schedule: {
        Monday: ["ADS", "CRT", "", "IDS", "ADS", "", "IDS", "DMGT", "", "UHV", "JAVA"],
        Tuesday: ["IDS", "JAVA", "", "DMGT", "UHV", "", "ADS", "IDS", "", "LAB", "LAB"],
        Wednesday: ["DMGT", "JAVA", "", "UHV", "ADS", "", "DMGT", "IDS", "", "JAVA", "TS"],
        Thursday: ["JAVA", "PYTHON", "", "LAB", "LAB", "", "ADS", "UHV", "", "DMGT", "COUN"],
        Friday: ["UHV", "DMGT", "", "ADS", "JAVA", "", "IDS", "ADS", "", "DMGT", "IDS"],
        Saturday: ["IDS", "JAVA", "", "LAB", "LAB", "", "LIB", "JAVA", "", "DMGT", "ADS"],
      },
      subjects: [
        { code: "DMGT", name: "Discrete Mathematics and Graph theory", faculty: "S&H" },
        { code: "UHV", name: "Universal human values", faculty: "Ms. Sushmita" },
        { code: "ADS", name: "Advanced Data Structures", faculty: "Mr. Praveen" },
        { code: "JAVA", name: "Java Programming", faculty: "Ms. Krishna" },
        { code: "IDS", name: "Introduction to Data Science", faculty: "Dr. B Bhavani" },
        { code: "PYTHON", name: "Python Programming", faculty: "Mr. Anil" },
        { code: "CRT", name: "Campus Recruitment Training", faculty: "Placement Cell" },
        { code: "TS", name: "Technical Seminar", faculty: "HOD" },
        { code: "COUN", name: "Counselling", faculty: "Mentor" },
      ],
      labs: [
        { name: "DS-DATA SCIENCE", faculty: "Mr RAVITEJA" },
        { name: "OOPS Through Java", faculty: "Ms D.Krishna" },
      ],
    },
    "2-1-DS-B": {
      classIncharge: "Dr P KUMAR",
      roomNo: "206",
      effectiveDate: "30-06-2025",
      schedule: {
        Monday: ["JAVA", "IDS", "", "ADS", "DMGT", "", "UHV", "JAVA", "", "IDS", "ADS"],
        Tuesday: ["DMGT", "ADS", "", "JAVA", "IDS", "", "LAB", "LAB", "", "UHV", "DMGT"],
        Wednesday: ["IDS", "DMGT", "", "ADS", "JAVA", "", "DMGT", "UHV", "", "LAB", "LAB"],
        Thursday: ["ADS", "JAVA", "", "IDS", "UHV", "", "JAVA", "ADS", "", "DMGT", "TS"],
        Friday: ["DMGT", "IDS", "", "JAVA", "ADS", "", "UHV", "DMGT", "", "IDS", "JAVA"],
        Saturday: ["JAVA", "ADS", "", "LAB", "LAB", "", "DMGT", "IDS", "", "UHV", "ADS"],
      },
      subjects: [
        { code: "DMGT", name: "Discrete Mathematics and Graph theory", faculty: "S&H" },
        { code: "UHV", name: "Universal human values", faculty: "Ms. Priya" },
        { code: "ADS", name: "Advanced Data Structures", faculty: "Mr. Ravi" },
        { code: "JAVA", name: "Java Programming", faculty: "Ms. Lakshmi" },
        { code: "IDS", name: "Introduction to Data Science", faculty: "Dr. P Kumar" },
        { code: "TS", name: "Technical Seminar", faculty: "HOD" },
      ],
      labs: [
        { name: "DS-DATA SCIENCE", faculty: "Mr SURESH" },
        { name: "OOPS Through Java", faculty: "Ms M.Rani" },
      ],
    },
    "2-1-DS-C": {
      classIncharge: "Dr S REDDY",
      roomNo: "207",
      effectiveDate: "30-06-2025",
      schedule: {
        Monday: ["IDS", "JAVA", "", "DMGT", "ADS", "", "JAVA", "IDS", "", "UHV", "DMGT"],
        Tuesday: ["ADS", "DMGT", "", "IDS", "JAVA", "", "ADS", "UHV", "", "LAB", "LAB"],
        Wednesday: ["JAVA", "IDS", "", "ADS", "DMGT", "", "LAB", "LAB", "", "JAVA", "ADS"],
        Thursday: ["DMGT", "ADS", "", "JAVA", "IDS", "", "DMGT", "JAVA", "", "IDS", "UHV"],
        Friday: ["IDS", "JAVA", "", "DMGT", "ADS", "", "UHV", "IDS", "", "JAVA", "TS"],
        Saturday: ["ADS", "DMGT", "", "LAB", "LAB", "", "JAVA", "ADS", "", "IDS", "DMGT"],
      },
      subjects: [
        { code: "DMGT", name: "Discrete Mathematics and Graph theory", faculty: "S&H" },
        { code: "UHV", name: "Universal human values", faculty: "Mr. Venkat" },
        { code: "ADS", name: "Advanced Data Structures", faculty: "Ms. Swathi" },
        { code: "JAVA", name: "Java Programming", faculty: "Mr. Kiran" },
        { code: "IDS", name: "Introduction to Data Science", faculty: "Dr. S Reddy" },
        { code: "TS", name: "Technical Seminar", faculty: "HOD" },
      ],
      labs: [
        { name: "DS-DATA SCIENCE", faculty: "Mr HARISH" },
        { name: "OOPS Through Java", faculty: "Ms P.Jyothi" },
      ],
    },
  };

  // Default to 2-1-DS-A if section not found
  return baseSchedule[section as keyof typeof baseSchedule] || baseSchedule["2-1-DS-A"];
};

const getCellStyle = (subject: string) => {
  if (subject === "LAB") return "bg-green-200 text-green-800 font-semibold";
  if (subject === "LIB") return "bg-blue-200 text-blue-800 font-semibold";
  if (subject === "PYTHON" || subject === "TS" || subject === "COUN") return "bg-yellow-100 text-yellow-800";
  if (subject === "") return "";
  return "bg-white text-black";
};

const Timetable = () => {
  const { deptId, section } = useParams<{ deptId: string; section: string }>();
  const dept = deptId ? departments[deptId as keyof typeof departments] : null;
  
  const formattedSection = section?.replace(/-/g, ' ') || '';
  const sectionParts = section?.split('-') || [];
  const year = sectionParts[0] || '2';
  const sem = sectionParts[1] || '1';
  const branch = sectionParts[2] || 'DS';
  const sectionLetter = sectionParts[3] || 'A';
  
  const timetableData = getTimetableData(section || '2-1-DS-A');

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

  const days = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];

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
                  Class Time Table
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

          {/* Timetable */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-white rounded-lg border-2 border-[#1E3A8A] shadow-xl overflow-hidden"
          >
            <div className="overflow-x-auto">
              <table className="w-full border-collapse text-sm">
                {/* Institute Header */}
                <thead>
                  <tr className="bg-blue-50 border-b-2 border-[#1E3A8A]">
                    <th colSpan={12} className="px-4 py-3 text-center font-bold text-base text-black border-b border-[#1E3A8A]">
                      NRI INSTITUTE OF TECHNOLOGY::GUNTUR
                    </th>
                  </tr>
                  {/* Class Info Row */}
                  <tr className="bg-white border-b border-[#1E3A8A]">
                    <th colSpan={4} className="px-4 py-2 text-left font-bold text-black border-r border-[#1E3A8A]">
                      Class: B.Tech
                    </th>
                    <th colSpan={4} className="px-4 py-2 text-center font-bold text-black border-r border-[#1E3A8A]">
                      Year&Sem: {year}-{sem}
                    </th>
                    <th colSpan={4} className="px-4 py-2 text-right font-bold text-black">
                      Branch: {branch}-{sectionLetter}
                    </th>
                  </tr>
                  {/* Room and Incharge Row */}
                  <tr className="bg-white border-b-2 border-[#1E3A8A]">
                    <th colSpan={4} className="px-4 py-2 text-left font-medium text-black border-r border-[#1E3A8A]">
                      Room no: {timetableData.roomNo}
                    </th>
                    <th colSpan={4} className="px-4 py-2 text-center font-medium text-black border-r border-[#1E3A8A]">
                      Class Incharge: {timetableData.classIncharge}
                    </th>
                    <th colSpan={4} className="px-4 py-2 text-right font-medium text-black">
                      w.e.f: {timetableData.effectiveDate}
                    </th>
                  </tr>
                  {/* Period Headers */}
                  <tr className="bg-blue-50 border-b border-[#1E3A8A]">
                    <th className="px-3 py-2 text-center font-bold text-black border-r border-[#1E3A8A] min-w-[100px]">
                      DAY/HOURS
                    </th>
                    {timeSlots.map((slot, idx) => (
                      <th 
                        key={idx} 
                        className={`px-2 py-2 text-center font-bold text-black border-r border-[#1E3A8A] min-w-[70px] ${
                          slot.period === "BREAK" || slot.period === "LUNCH" ? "bg-gray-200" : ""
                        }`}
                      >
                        {slot.period}
                        <div className="text-xs font-normal">{slot.time}</div>
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {days.map((day, dayIdx) => (
                    <tr key={day} className={`border-b border-[#1E3A8A] ${dayIdx % 2 === 0 ? 'bg-white' : 'bg-gray-50/30'}`}>
                      <td className="px-3 py-3 font-bold text-black border-r border-[#1E3A8A] text-center">
                        {day}
                      </td>
                      {timeSlots.map((slot, slotIdx) => {
                        if (slot.period === "BREAK") {
                          return (
                            <td 
                              key={slotIdx} 
                              rowSpan={1}
                              className="px-2 py-3 text-center border-r border-[#1E3A8A] bg-gray-200 text-black font-semibold text-xs writing-mode-vertical"
                              style={{ writingMode: dayIdx === 0 ? 'vertical-rl' : 'horizontal-tb' }}
                            >
                              {dayIdx === 0 ? "B\nR\nE\nA\nK" : ""}
                            </td>
                          );
                        }
                        if (slot.period === "LUNCH") {
                          return (
                            <td 
                              key={slotIdx} 
                              className="px-2 py-3 text-center border-r border-[#1E3A8A] bg-gray-200 text-black font-semibold text-xs"
                              style={{ writingMode: dayIdx === 0 ? 'vertical-rl' : 'horizontal-tb' }}
                            >
                              {dayIdx === 0 ? "L\nU\nN\nC\nH" : ""}
                            </td>
                          );
                        }
                        
                        const schedule = timetableData.schedule[day as keyof typeof timetableData.schedule];
                        const periodIndex = slotIdx > 8 ? slotIdx - 3 : slotIdx > 5 ? slotIdx - 2 : slotIdx > 2 ? slotIdx - 1 : slotIdx;
                        const subject = schedule?.[periodIndex] || "";
                        
                        return (
                          <td 
                            key={slotIdx} 
                            className={`px-2 py-3 text-center border-r border-[#1E3A8A] font-medium ${getCellStyle(subject)}`}
                          >
                            {subject}
                          </td>
                        );
                      })}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Subject Legend */}
            <div className="p-4 border-t-2 border-[#1E3A8A] bg-gray-50">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Subjects */}
                <div>
                  <table className="w-full border-collapse text-sm">
                    <thead>
                      <tr className="bg-gray-300">
                        <th className="px-3 py-2 text-left font-bold text-black border border-[#1E3A8A]">SUBJECT</th>
                        <th className="px-3 py-2 text-left font-bold text-black border border-[#1E3A8A]">FACULTY</th>
                      </tr>
                    </thead>
                    <tbody>
                      {timetableData.subjects.map((sub, idx) => (
                        <tr key={idx} className="bg-white">
                          <td className="px-3 py-2 text-black border border-[#1E3A8A]">
                            {sub.code} - {sub.name}
                          </td>
                          <td className="px-3 py-2 text-black border border-[#1E3A8A]">{sub.faculty}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
                
                {/* Labs */}
                <div>
                  <table className="w-full border-collapse text-sm">
                    <thead>
                      <tr className="bg-gray-300">
                        <th className="px-3 py-2 text-left font-bold text-black border border-[#1E3A8A]">LAB</th>
                        <th className="px-3 py-2 text-left font-bold text-black border border-[#1E3A8A]">FACULTY</th>
                      </tr>
                    </thead>
                    <tbody>
                      {timetableData.labs.map((lab, idx) => (
                        <tr key={idx} className="bg-white">
                          <td className="px-3 py-2 text-black border border-[#1E3A8A]">{lab.name}</td>
                          <td className="px-3 py-2 text-black border border-[#1E3A8A]">{lab.faculty}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Legend */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
            className="mt-6 flex flex-wrap items-center gap-6 text-sm"
          >
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 rounded bg-green-200 border border-green-400"></div>
              <span className="text-white/70">Lab Sessions</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 rounded bg-blue-200 border border-blue-400"></div>
              <span className="text-white/70">Library</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 rounded bg-yellow-100 border border-yellow-400"></div>
              <span className="text-white/70">Special Classes</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 rounded bg-gray-200 border border-gray-400"></div>
              <span className="text-white/70">Break/Lunch</span>
            </div>
          </motion.div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default Timetable;
