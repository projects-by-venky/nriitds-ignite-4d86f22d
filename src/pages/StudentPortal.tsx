import { useParams, Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { FileText, BookOpen, Calendar, ClipboardList, MessageSquare, ActivitySquare } from "lucide-react";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import { StudentSidebar } from "@/components/student/StudentSidebar";
import { ContentSection } from "@/components/student/ContentSection";
import { ActionButton } from "@/components/student/ActionButton";
import { YearSemesterSection } from "@/components/student/YearSemesterSection";

const departments = {
  cse: { name: "Computer Science & Engineering", code: "CSE" },
  ece: { name: "Electronics & Communication", code: "ECE" },
  eee: { name: "Electrical & Electronics", code: "EEE" },
  mech: { name: "Mechanical Engineering", code: "MECH" },
  civil: { name: "Civil Engineering", code: "CIVIL" },
  aids: { name: "AI & Data Science", code: "DS" },
  mba: { name: "Business Administration", code: "MBA" },
  mca: { name: "Computer Applications", code: "MCA" }
};

const StudentPortal = () => {
  const { deptId } = useParams<{ deptId: string }>();
  const navigate = useNavigate();
  const dept = deptId ? departments[deptId as keyof typeof departments] : null;
  const deptCode = dept?.code || "DS";

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

  // Helper function to generate sections for each section
  const sections = ["A", "B", "C"];

  // Subject Notes/Materials data
  const notesData = [
    {
      year: "1st Year",
      semesters: [
        { semester: "1-1 Semester", items: [{ label: `1-1 ${deptCode} Notes & Materials`, onClick: () => navigate(`/department/${deptId}/notes/1-1`) }] },
        { semester: "1-2 Semester", items: [{ label: `1-2 ${deptCode} Notes & Materials`, onClick: () => navigate(`/department/${deptId}/notes/1-2`) }] },
      ]
    },
    {
      year: "2nd Year",
      semesters: [
        { semester: "2-1 Semester", items: [{ label: `2-1 ${deptCode} Notes & Materials`, onClick: () => navigate(`/department/${deptId}/notes/2-1`) }] },
        { semester: "2-2 Semester", items: [{ label: `2-2 ${deptCode} Notes & Materials`, onClick: () => navigate(`/department/${deptId}/notes/2-2`) }] },
      ]
    },
    {
      year: "3rd Year",
      semesters: [
        { semester: "3-1 Semester", items: [{ label: `3-1 ${deptCode} Notes & Materials`, onClick: () => navigate(`/department/${deptId}/notes/3-1`) }] },
        { semester: "3-2 Semester", items: [{ label: `3-2 ${deptCode} Notes & Materials`, onClick: () => navigate(`/department/${deptId}/notes/3-2`) }] },
      ]
    },
    {
      year: "4th Year",
      semesters: [
        { semester: "4-1 Semester", items: [{ label: `4-1 ${deptCode} Notes & Materials`, onClick: () => navigate(`/department/${deptId}/notes/4-1`) }] },
        { semester: "4-2 Semester", items: [{ label: `4-2 ${deptCode} Notes & Materials`, onClick: () => navigate(`/department/${deptId}/notes/4-2`) }] },
      ]
    },
  ];

  // MID Time Tables data
  const midTimeTableData = [
    {
      year: "1st Year",
      semesters: [
        { semester: "1-1 Semester", items: [{ label: `1-1 MID Time Table` }] },
        { semester: "1-2 Semester", items: [{ label: `1-2 MID Time Table` }] },
      ]
    },
    {
      year: "2nd Year",
      semesters: [
        { semester: "2-1 Semester", items: [{ label: `2-1 MID Time Table`, href: "/documents/2-2_Mid-2_TimeTable_April-2025.pdf" }] },
        { semester: "2-2 Semester", items: [{ label: `2-2 MID Time Table`, href: "/documents/2-2_Mid-2_TimeTable_April-2025.pdf" }] },
      ]
    },
    {
      year: "3rd Year",
      semesters: [
        { semester: "3-1 Semester", items: [{ label: `3-1 MID Time Table` }] },
        { semester: "3-2 Semester", items: [{ label: `3-2 MID Time Table` }] },
      ]
    },
    {
      year: "4th Year",
      semesters: [
        { semester: "4-1 Semester", items: [{ label: `4-1 MID Time Table` }] },
        { semester: "4-2 Semester", items: [{ label: `4-2 MID Time Table` }] },
      ]
    },
  ];

  // MID & Assignment Marks data
  const marksData = [
    {
      year: "1st Year",
      semesters: [
        { semester: "1-1 Semester", items: [{ label: `1-1 ${deptCode} : Internal Marks`, variant: "primary" as const }] },
        { semester: "1-2 Semester", items: [{ label: `1-2 ${deptCode} : Internal Marks`, variant: "primary" as const }] },
      ]
    },
    {
      year: "2nd Year",
      semesters: [
        { semester: "2-1 Semester", items: [{ label: `2-1 ${deptCode} : Internal Marks`, variant: "primary" as const }] },
        { semester: "2-2 Semester", items: [{ label: `2-2 ${deptCode} : Internal Marks`, variant: "primary" as const }] },
      ]
    },
    {
      year: "3rd Year",
      semesters: [
        { semester: "3-1 Semester", items: [{ label: `3-1 ${deptCode} : Internal Marks`, variant: "primary" as const }] },
        { semester: "3-2 Semester", items: [{ label: `3-2 ${deptCode} : Internal Marks`, variant: "primary" as const }] },
      ]
    },
    {
      year: "4th Year",
      semesters: [
        { semester: "4-1 Semester", items: [{ label: `4-1 ${deptCode} : Internal Marks`, variant: "primary" as const }] },
        { semester: "4-2 Semester", items: [{ label: `4-2 ${deptCode} : Internal Marks`, variant: "primary" as const }] },
      ]
    },
  ];

  // Hourly Attendance data
  const hourlyAttendanceData = [
    {
      year: "1st Year",
      semesters: [
        { semester: "1-1 Semester", items: sections.map(sec => ({ label: `1-1 ${deptCode}-${sec}`, onClick: () => navigate(`/department/${deptId}/attendance/1-1-${deptCode}-${sec}`) })) },
        { semester: "1-2 Semester", items: sections.map(sec => ({ label: `1-2 ${deptCode}-${sec}`, onClick: () => navigate(`/department/${deptId}/attendance/1-2-${deptCode}-${sec}`) })) },
      ]
    },
    {
      year: "2nd Year",
      semesters: [
        { semester: "2-1 Semester", items: sections.map(sec => ({ label: `2-1 ${deptCode}-${sec}`, onClick: () => navigate(`/department/${deptId}/attendance/2-1-${deptCode}-${sec}`) })) },
        { semester: "2-2 Semester", items: sections.map(sec => ({ label: `2-2 ${deptCode}-${sec}`, onClick: () => navigate(`/department/${deptId}/attendance/2-2-${deptCode}-${sec}`) })) },
      ]
    },
    {
      year: "3rd Year",
      semesters: [
        { semester: "3-1 Semester", items: sections.map(sec => ({ label: `3-1 ${deptCode}-${sec}`, onClick: () => navigate(`/department/${deptId}/attendance/3-1-${deptCode}-${sec}`) })) },
        { semester: "3-2 Semester", items: sections.map(sec => ({ label: `3-2 ${deptCode}-${sec}`, onClick: () => navigate(`/department/${deptId}/attendance/3-2-${deptCode}-${sec}`) })) },
      ]
    },
    {
      year: "4th Year",
      semesters: [
        { semester: "4-1 Semester", items: sections.map(sec => ({ label: `4-1 ${deptCode}-${sec}`, onClick: () => navigate(`/department/${deptId}/attendance/4-1-${deptCode}-${sec}`) })) },
        { semester: "4-2 Semester", items: sections.map(sec => ({ label: `4-2 ${deptCode}-${sec}`, onClick: () => navigate(`/department/${deptId}/attendance/4-2-${deptCode}-${sec}`) })) },
      ]
    },
  ];

  // Monthly Attendance data
  const monthlyAttendanceData = [
    {
      year: "1st Year",
      semesters: [
        { semester: "1-1 Semester", items: sections.map(sec => ({ label: `1-1 ${deptCode}-${sec} Cumulative`, onClick: () => navigate(`/department/${deptId}/monthly-attendance/1-1-${deptCode}-${sec}`) })) },
        { semester: "1-2 Semester", items: sections.map(sec => ({ label: `1-2 ${deptCode}-${sec} Cumulative`, onClick: () => navigate(`/department/${deptId}/monthly-attendance/1-2-${deptCode}-${sec}`) })) },
      ]
    },
    {
      year: "2nd Year",
      semesters: [
        { semester: "2-1 Semester", items: sections.map(sec => ({ label: `2-1 ${deptCode}-${sec} Cumulative`, onClick: () => navigate(`/department/${deptId}/monthly-attendance/2-1-${deptCode}-${sec}`) })) },
        { semester: "2-2 Semester", items: sections.map(sec => ({ label: `2-2 ${deptCode}-${sec} Cumulative`, onClick: () => navigate(`/department/${deptId}/monthly-attendance/2-2-${deptCode}-${sec}`) })) },
      ]
    },
    {
      year: "3rd Year",
      semesters: [
        { semester: "3-1 Semester", items: sections.map(sec => ({ label: `3-1 ${deptCode}-${sec} Cumulative`, onClick: () => navigate(`/department/${deptId}/monthly-attendance/3-1-${deptCode}-${sec}`) })) },
        { semester: "3-2 Semester", items: sections.map(sec => ({ label: `3-2 ${deptCode}-${sec} Cumulative`, onClick: () => navigate(`/department/${deptId}/monthly-attendance/3-2-${deptCode}-${sec}`) })) },
      ]
    },
    {
      year: "4th Year",
      semesters: [
        { semester: "4-1 Semester", items: sections.map(sec => ({ label: `4-1 ${deptCode}-${sec} Cumulative`, onClick: () => navigate(`/department/${deptId}/monthly-attendance/4-1-${deptCode}-${sec}`) })) },
        { semester: "4-2 Semester", items: sections.map(sec => ({ label: `4-2 ${deptCode}-${sec} Cumulative`, onClick: () => navigate(`/department/${deptId}/monthly-attendance/4-2-${deptCode}-${sec}`) })) },
      ]
    },
  ];

  // Time Tables data
  const timeTablesData = [
    {
      year: "1st Year",
      semesters: [
        { semester: "1-1 Semester", items: sections.map(sec => ({ label: `1-1 ${deptCode}-${sec}`, onClick: () => navigate(`/department/${deptId}/timetable/1-1-${deptCode}-${sec}`) })) },
        { semester: "1-2 Semester", items: sections.map(sec => ({ label: `1-2 ${deptCode}-${sec}`, onClick: () => navigate(`/department/${deptId}/timetable/1-2-${deptCode}-${sec}`) })) },
      ]
    },
    {
      year: "2nd Year",
      semesters: [
        { semester: "2-1 Semester", items: sections.map(sec => ({ label: `2-1 ${deptCode}-${sec}`, onClick: () => navigate(`/department/${deptId}/timetable/2-1-${deptCode}-${sec}`) })) },
        { semester: "2-2 Semester", items: sections.map(sec => ({ label: `2-2 ${deptCode}-${sec}`, onClick: () => navigate(`/department/${deptId}/timetable/2-2-${deptCode}-${sec}`) })) },
      ]
    },
    {
      year: "3rd Year",
      semesters: [
        { semester: "3-1 Semester", items: sections.map(sec => ({ label: `3-1 ${deptCode}-${sec}`, onClick: () => navigate(`/department/${deptId}/timetable/3-1-${deptCode}-${sec}`) })) },
        { semester: "3-2 Semester", items: sections.map(sec => ({ label: `3-2 ${deptCode}-${sec}`, onClick: () => navigate(`/department/${deptId}/timetable/3-2-${deptCode}-${sec}`) })) },
      ]
    },
    {
      year: "4th Year",
      semesters: [
        { semester: "4-1 Semester", items: sections.map(sec => ({ label: `4-1 ${deptCode}-${sec}`, onClick: () => navigate(`/department/${deptId}/timetable/4-1-${deptCode}-${sec}`) })) },
        { semester: "4-2 Semester", items: sections.map(sec => ({ label: `4-2 ${deptCode}-${sec}`, onClick: () => navigate(`/department/${deptId}/timetable/4-2-${deptCode}-${sec}`) })) },
      ]
    },
  ];

  // Feedback data
  const feedbackData = [
    {
      year: "1st Year",
      semesters: [
        { semester: "1-1 Semester", items: sections.map(sec => ({ label: `1-1 ${deptCode}-${sec} Feedback` })) },
        { semester: "1-2 Semester", items: sections.map(sec => ({ label: `1-2 ${deptCode}-${sec} Feedback` })) },
      ]
    },
    {
      year: "2nd Year",
      semesters: [
        { semester: "2-1 Semester", items: sections.map(sec => ({ label: `2-1 ${deptCode}-${sec} Feedback` })) },
        { semester: "2-2 Semester", items: sections.map(sec => ({ label: `2-2 ${deptCode}-${sec} Feedback` })) },
      ]
    },
    {
      year: "3rd Year",
      semesters: [
        { semester: "3-1 Semester", items: sections.map(sec => ({ label: `3-1 ${deptCode}-${sec} Feedback` })) },
        { semester: "3-2 Semester", items: sections.map(sec => ({ label: `3-2 ${deptCode}-${sec} Feedback` })) },
      ]
    },
    {
      year: "4th Year",
      semesters: [
        { semester: "4-1 Semester", items: sections.map(sec => ({ label: `4-1 ${deptCode}-${sec} Feedback` })) },
        { semester: "4-2 Semester", items: sections.map(sec => ({ label: `4-2 ${deptCode}-${sec} Feedback` })) },
      ]
    },
  ];

  // Syllabus data
  const syllabusData = [
    {
      year: "1st Year",
      semesters: [
        { semester: "1-1 Semester", items: [{ label: `1-1 ${deptCode} Syllabus`, href: "/documents/CSE-DS-Syllabus.pdf" }] },
        { semester: "1-2 Semester", items: [{ label: `1-2 ${deptCode} Syllabus`, href: "/documents/CSE-DS-Syllabus.pdf" }] },
      ]
    },
    {
      year: "2nd Year",
      semesters: [
        { semester: "2-1 Semester", items: [{ label: `2-1 ${deptCode} Syllabus`, href: "/documents/CSE-DS-Syllabus.pdf" }] },
        { semester: "2-2 Semester", items: [{ label: `2-2 ${deptCode} Syllabus`, href: "/documents/CSE-DS-Syllabus.pdf" }] },
      ]
    },
    {
      year: "3rd Year",
      semesters: [
        { semester: "3-1 Semester", items: [{ label: `3-1 ${deptCode} Syllabus`, href: "/documents/CSE-DS-3rd-Year-Syllabus.pdf" }] },
        { semester: "3-2 Semester", items: [{ label: `3-2 ${deptCode} Syllabus`, href: "/documents/CSE-DS-3rd-Year-Syllabus.pdf" }] },
      ]
    },
    {
      year: "4th Year",
      semesters: [
        { semester: "4-1 Semester", items: [{ label: `4-1 ${deptCode} Syllabus`, href: "/documents/CSE-DS-Syllabus.pdf" }] },
        { semester: "4-2 Semester", items: [{ label: `4-2 ${deptCode} Syllabus`, href: "/documents/CSE-DS-Syllabus.pdf" }] },
      ]
    },
  ];

  // Academic Calendars data
  const academicCalendarData = [
    {
      year: "1st Year",
      semesters: [
        { semester: "1-1 Semester", items: [{ label: `1-1 Academic Calendar 2024-25`, href: "/documents/II_Year_Academic_calendar_24-25_NRIIT.pdf" }] },
        { semester: "1-2 Semester", items: [{ label: `1-2 Academic Calendar 2024-25`, href: "/documents/II_Year_Academic_calendar_24-25_NRIIT.pdf" }] },
      ]
    },
    {
      year: "2nd Year",
      semesters: [
        { semester: "2-1 Semester", items: [{ label: `2-1 Academic Calendar 2024-25`, href: "/documents/II_Year_Academic_calendar_24-25_NRIIT.pdf" }] },
        { semester: "2-2 Semester", items: [{ label: `2-2 Academic Calendar 2024-25`, href: "/documents/II_Year_Academic_calendar_24-25_NRIIT.pdf" }] },
      ]
    },
    {
      year: "3rd Year",
      semesters: [
        { semester: "3-1 Semester", items: [{ label: `3-1 Academic Calendar 2024-25`, href: "/documents/II_Year_Academic_calendar_24-25_NRIIT.pdf" }] },
        { semester: "3-2 Semester", items: [{ label: `3-2 Academic Calendar 2024-25`, href: "/documents/II_Year_Academic_calendar_24-25_NRIIT.pdf" }] },
      ]
    },
    {
      year: "4th Year",
      semesters: [
        { semester: "4-1 Semester", items: [{ label: `4-1 Academic Calendar 2024-25`, href: "/documents/II_Year_Academic_calendar_24-25_NRIIT.pdf" }] },
        { semester: "4-2 Semester", items: [{ label: `4-2 Academic Calendar 2024-25`, href: "/documents/II_Year_Academic_calendar_24-25_NRIIT.pdf" }] },
      ]
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-background via-background/95 to-background">
      <Header />
      
      <StudentSidebar />
      
      <main className="pt-24 pb-20 pl-64">
        <div className="container mx-auto px-8">
          {/* Hero Section */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-12"
          >
            <div className="flex items-center justify-between mb-6">
              <div>
                <h1 className="text-5xl font-black mb-2 bg-clip-text text-transparent"
                    style={{ backgroundImage: "linear-gradient(135deg, #0EA5E9, #1E3A8A)" }}>
                  NRIIT — {dept.name}
                </h1>
                <p className="text-xl text-white/70">{dept.name}</p>
              </div>
              <motion.button
                whileHover={{ scale: 1.05, boxShadow: "0 0 30px hsl(217 91% 60% / 0.6)" }}
                className="px-8 py-4 bg-gradient-cyber text-white rounded-xl font-bold shadow-[0_0_20px_hsl(217_91%_60%_/_0.4)]"
              >
                23KP_2.2 Results → Click Here
              </motion.button>
            </div>
            <motion.h2
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3 }}
              className="text-3xl font-bold text-center text-white/80"
            >
              Student Page
            </motion.h2>
          </motion.div>

          <div className="space-y-6">
            {/* All Subject Notes/Materials */}
            <ContentSection title="All Subject Notes / Materials" icon={<FileText className="w-6 h-6" />}>
              <YearSemesterSection years={notesData} deptId={deptId} />
            </ContentSection>

            {/* Student Guidelines */}
            <ContentSection title="Student Guidelines" icon={<BookOpen className="w-6 h-6" />}>
              <a href="/documents/Guidelines_Student_DS.pdf" download className="w-full">
                <ActionButton label="Download Guidelines for DS Students" variant="primary" fullWidth />
              </a>
            </ContentSection>

            {/* MID Time Tables */}
            <ContentSection title="MID Time Tables" icon={<Calendar className="w-6 h-6" />}>
              <YearSemesterSection years={midTimeTableData} deptId={deptId} />
            </ContentSection>

            {/* MID & Assignment Marks */}
            <ContentSection title="MID & Assignment Marks" icon={<ClipboardList className="w-6 h-6" />}>
              <YearSemesterSection years={marksData} deptId={deptId} />
            </ContentSection>

            {/* Hourly Attendance */}
            <ContentSection title="Hourly Attendance" icon={<ActivitySquare className="w-6 h-6" />}>
              <YearSemesterSection years={hourlyAttendanceData} deptId={deptId} />
            </ContentSection>

            {/* Monthly Cumulative Attendance */}
            <ContentSection title="Monthly Cumulative Attendance" icon={<Calendar className="w-6 h-6" />}>
              <YearSemesterSection years={monthlyAttendanceData} deptId={deptId} />
            </ContentSection>

            {/* Time Tables */}
            <ContentSection title="Time Tables" icon={<Calendar className="w-6 h-6" />}>
              <YearSemesterSection years={timeTablesData} deptId={deptId} />
            </ContentSection>

            {/* Feedback */}
            <ContentSection title="Feedback" icon={<MessageSquare className="w-6 h-6" />}>
              <YearSemesterSection years={feedbackData} deptId={deptId} />
            </ContentSection>

            {/* Syllabus */}
            <ContentSection title="Syllabus" icon={<BookOpen className="w-6 h-6" />}>
              <YearSemesterSection years={syllabusData} deptId={deptId} />
            </ContentSection>

            {/* Academic Calendars */}
            <ContentSection title="Academic Calendars" icon={<Calendar className="w-6 h-6" />}>
              <YearSemesterSection years={academicCalendarData} deptId={deptId} />
            </ContentSection>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default StudentPortal;
