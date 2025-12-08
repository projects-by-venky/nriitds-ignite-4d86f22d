import { useParams, Link } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowLeft, Users, Upload, Calendar, Megaphone, MessageSquare, BarChart } from "lucide-react";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";

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

// Consistent blue gradient for all departments
const blueGradient = "linear-gradient(135deg, #0EA5E9, #1E3A8A)";

const sections = [
  { icon: Users, title: "Manage Students", desc: "Attendance & Marks" },
  { icon: Upload, title: "Upload Notes", desc: "Study Materials" },
  { icon: Calendar, title: "Timetable", desc: "Schedule Manager" },
  { icon: Megaphone, title: "Announcements", desc: "Post Circulars" },
  { icon: MessageSquare, title: "Feedback", desc: "Student Queries" },
  { icon: BarChart, title: "Analytics", desc: "Performance Reports" }
];

const FacultyPortal = () => {
  const { deptId } = useParams<{ deptId: string }>();
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
      
      <main className="pt-24 pb-20">
        <div className="container mx-auto px-4">
          <Link to={`/department/${deptId}`}>
            <motion.button
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              className="flex items-center gap-2 text-foreground/70 hover:text-primary transition-colors mb-8"
            >
              <ArrowLeft className="w-5 h-5" />
              Back to Department
            </motion.button>
          </Link>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center mb-16"
          >
            <h1 className="text-5xl font-black mb-4 bg-clip-text text-transparent"
                style={{ backgroundImage: blueGradient }}>
              Faculty Portal
            </h1>
            <p className="text-xl text-white/70">{dept.name}</p>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
            {sections.map((section, index) => {
              const Icon = section.icon;
              return (
                <motion.div
                  key={section.title}
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  whileHover={{ scale: 1.05, y: -5 }}
                  className="relative group cursor-pointer"
                >
                  <div 
                    className="absolute inset-0 rounded-2xl blur-xl opacity-0 group-hover:opacity-50 transition-opacity bg-primary"
                  />
                  <div className="relative bg-card/80 backdrop-blur-md border-2 border-[#1E3A8A] rounded-2xl p-8 hover:border-[#1E3A8A] transition-all h-full shadow-lg">
                    <div 
                      className="w-14 h-14 rounded-xl bg-gradient-cyber flex items-center justify-center mb-4"
                    >
                      <Icon className="w-7 h-7 text-white" />
                    </div>
                    <h3 className="text-2xl font-bold mb-2 text-white">{section.title}</h3>
                    <p className="text-white/60">{section.desc}</p>
                    <div className="mt-4 text-[#0EA5E9] font-semibold text-sm">
                      Access →
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default FacultyPortal;
