import { useParams, Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowLeft, FileText, TestTube, UserPlus, Users, Calendar, ClipboardList, BookOpen, GraduationCap, MessageSquare, ActivitySquare, Clock } from "lucide-react";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import { StudentSidebar } from "@/components/student/StudentSidebar";
import { ContentSection } from "@/components/student/ContentSection";
import { ActionButton } from "@/components/student/ActionButton";

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

const StudentPortal = () => {
  const { deptId } = useParams<{ deptId: string }>();
  const navigate = useNavigate();
  const dept = deptId ? departments[deptId as keyof typeof departments] : null;

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
            {/* Student Guidelines */}
            <ContentSection title="Student Guidelines" icon={<BookOpen className="w-6 h-6" />}>
              <a href="/documents/Guidelines_Student_DS.pdf" download className="w-full">
                <ActionButton label="Download Guidelines for DS Students" variant="primary" fullWidth />
              </a>
            </ContentSection>

            {/* MID Time Tables */}
            <ContentSection title="MID Time Tables" icon={<Calendar className="w-6 h-6" />}>
              <a href="/documents/2-2_Mid-2_TimeTable_April-2025.pdf" download className="w-full">
                <ActionButton label="Download 2-2 MID-2 Time Table" fullWidth />
              </a>
              <ActionButton label="IMP Questions Section" fullWidth />
            </ContentSection>

            {/* Internal Marks */}
            <ContentSection title="MID & Assignment Marks" icon={<ClipboardList className="w-6 h-6" />}>
              <ActionButton label="2-2 DS : Internal Marks" variant="primary" fullWidth />
            </ContentSection>

            {/* Hourly Attendance */}
            <ContentSection title="Hourly Attendance" icon={<ActivitySquare className="w-6 h-6" />}>
              <ActionButton 
                label="View Hourly Attendance Table" 
                icon={Clock}
                variant="primary"
                fullWidth
              />
              <ActionButton 
                label="3-1 DS-A" 
                onClick={() => navigate(`/department/${deptId}/attendance/3-1-DS-A`)}
              />
              <ActionButton 
                label="3-1 DS-B" 
                onClick={() => navigate(`/department/${deptId}/attendance/3-1-DS-B`)}
              />
              <ActionButton 
                label="3-1 DS-C" 
                onClick={() => navigate(`/department/${deptId}/attendance/3-1-DS-C`)}
              />
              <ActionButton 
                label="2-1 DS-A" 
                onClick={() => navigate(`/department/${deptId}/attendance/2-1-DS-A`)}
              />
              <ActionButton 
                label="2-1 DS-B" 
                onClick={() => navigate(`/department/${deptId}/attendance/2-1-DS-B`)}
              />
              <ActionButton 
                label="2-1 DS-C" 
                onClick={() => navigate(`/department/${deptId}/attendance/2-1-DS-C`)}
              />
            </ContentSection>

            {/* Cumulative Attendance */}
            <ContentSection title="Monthly Cumulative Attendance" icon={<Calendar className="w-6 h-6" />}>
              <ActionButton 
                label="2-2 DS-A Cumulative Attendance" 
                fullWidth 
                onClick={() => navigate(`/department/${deptId}/monthly-attendance/2-2-DS-A`)}
              />
              <ActionButton 
                label="2-2 DS-B Cumulative Attendance" 
                fullWidth 
                onClick={() => navigate(`/department/${deptId}/monthly-attendance/2-2-DS-B`)}
              />
              <ActionButton 
                label="2-2 DS-C Cumulative Attendance" 
                fullWidth 
                onClick={() => navigate(`/department/${deptId}/monthly-attendance/2-2-DS-C`)}
              />
            </ContentSection>

            {/* Time Tables */}
            <ContentSection title="Time Tables" icon={<Calendar className="w-6 h-6" />}>
              <ActionButton 
                label="2-1 DS-A" 
                onClick={() => navigate(`/department/${deptId}/timetable/2-1-DS-A`)}
              />
              <ActionButton 
                label="2-1 DS-B" 
                onClick={() => navigate(`/department/${deptId}/timetable/2-1-DS-B`)}
              />
              <ActionButton 
                label="2-1 DS-C" 
                onClick={() => navigate(`/department/${deptId}/timetable/2-1-DS-C`)}
              />
              <ActionButton 
                label="3-1 DS-A" 
                onClick={() => navigate(`/department/${deptId}/timetable/3-1-DS-A`)}
              />
              <ActionButton 
                label="3-1 DS-B" 
                onClick={() => navigate(`/department/${deptId}/timetable/3-1-DS-B`)}
              />
              <ActionButton 
                label="3-1 DS-C" 
                onClick={() => navigate(`/department/${deptId}/timetable/3-1-DS-C`)}
              />
            </ContentSection>

            {/* Feedback */}
            <ContentSection title="Feedback" icon={<MessageSquare className="w-6 h-6" />}>
              <ActionButton label="2-2 DS-A Feedback" />
              <ActionButton label="2-2 DS-B Feedback" />
              <ActionButton label="2-2 DS-C Feedback" />
            </ContentSection>

            {/* Syllabus */}
            <ContentSection title="Syllabus" icon={<BookOpen className="w-6 h-6" />}>
              <ActionButton label="2nd DS Syllabus" />
              <ActionButton label="3rd DS Syllabus" />
            </ContentSection>

            {/* Academic Calendars */}
            <ContentSection title="Academic Calendars" icon={<Calendar className="w-6 h-6" />}>
              <ActionButton label="2nd DS Academic Calendar" fullWidth />
            </ContentSection>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default StudentPortal;
