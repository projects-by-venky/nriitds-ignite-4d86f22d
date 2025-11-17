import { useParams, Link } from "react-router-dom";
import { motion } from "framer-motion";
import { GraduationCap, Users, ArrowLeft } from "lucide-react";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";

const departments = {
  cse: {
    name: "Computer Science & Engineering",
    gradient: "linear-gradient(135deg, #0EA5E9, #6366F1)",
    icon: "💻",
    description: "Leading innovation in software and technology"
  },
  ece: {
    name: "Electronics & Communication Engineering",
    gradient: "linear-gradient(135deg, #F97316, #F59E0B)",
    icon: "📡",
    description: "Pioneering communication technologies"
  },
  eee: {
    name: "Electrical & Electronics Engineering",
    gradient: "linear-gradient(135deg, #22C55E, #10B981)",
    icon: "⚡",
    description: "Powering the future with energy solutions"
  },
  mech: {
    name: "Mechanical Engineering",
    gradient: "linear-gradient(135deg, #475569, #94A3B8)",
    icon: "⚙️",
    description: "Engineering precision and innovation"
  },
  civil: {
    name: "Civil Engineering",
    gradient: "linear-gradient(135deg, #0D9488, #14B8A6)",
    icon: "🏗️",
    description: "Building tomorrow's infrastructure"
  },
  aids: {
    name: "Artificial Intelligence & Data Science",
    gradient: "linear-gradient(135deg, #8B5CF6, #EC4899)",
    icon: "🤖",
    description: "Shaping intelligent systems"
  },
  mba: {
    name: "Master of Business Administration",
    gradient: "linear-gradient(135deg, #2563EB, #3B82F6)",
    icon: "💼",
    description: "Cultivating business leaders"
  },
  mca: {
    name: "Master of Computer Applications",
    gradient: "linear-gradient(135deg, #9333EA, #DB2777)",
    icon: "🖥️",
    description: "Advanced computing excellence"
  }
};

const Department = () => {
  const { deptId } = useParams<{ deptId: string }>();
  const dept = deptId ? departments[deptId as keyof typeof departments] : null;

  if (!dept) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
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
          {/* Back Button */}
          <Link to="/#branches">
            <motion.button
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              className="flex items-center gap-2 text-foreground/70 hover:text-primary transition-colors mb-8"
            >
              <ArrowLeft className="w-5 h-5" />
              Back to Branches
            </motion.button>
          </Link>

          {/* Department Header */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center mb-20"
          >
            <h1 className="text-5xl md:text-6xl font-black mb-6 bg-clip-text text-transparent"
                style={{ backgroundImage: dept.gradient }}>
              Welcome to the Department of
            </h1>
            <h2 className="text-4xl md:text-5xl font-bold text-foreground mb-4">
              {dept.name}
            </h2>
            <p className="text-xl text-foreground/70 max-w-2xl mx-auto">
              {dept.description}
            </p>
          </motion.div>

          {/* Portal Selection */}
          <div className="grid md:grid-cols-2 gap-8 max-w-5xl mx-auto">
            {/* Student Portal */}
            <Link to={`/department/${deptId}/student-portal`}>
              <motion.div
                initial={{ opacity: 0, x: -30 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.8, delay: 0.3 }}
                whileHover={{ scale: 1.05, y: -8 }}
                className="relative group cursor-pointer"
              >
                <div 
                  className="absolute inset-0 rounded-3xl blur-xl opacity-50 group-hover:opacity-70 transition-opacity"
                  style={{ background: dept.gradient }}
                />
                <div className="relative bg-card/80 backdrop-blur-md border-2 border-[#1E3A8A] rounded-3xl p-10 hover:border-[#1E3A8A] transition-all shadow-lg">
                  <div className="flex flex-col items-center text-center">
                    <div 
                      className="w-20 h-20 rounded-2xl flex items-center justify-center mb-6 shadow-lg"
                      style={{ background: dept.gradient }}
                    >
                      <GraduationCap className="w-10 h-10 text-white" />
                    </div>
                    <h3 className="text-3xl font-bold mb-4 text-foreground">Student Portal</h3>
                    <p className="text-foreground/60 mb-6">
                      Access your dashboard, notes, results, and more
                    </p>
                    <div className="text-sm text-primary font-semibold">
                      Click to Enter →
                    </div>
                  </div>
                </div>
              </motion.div>
            </Link>

            {/* Faculty Portal */}
            <Link to={`/department/${deptId}/faculty-portal`}>
              <motion.div
                initial={{ opacity: 0, x: 30 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.8, delay: 0.5 }}
                whileHover={{ scale: 1.05, y: -8 }}
                className="relative group cursor-pointer"
              >
                <div 
                  className="absolute inset-0 rounded-3xl blur-xl opacity-50 group-hover:opacity-70 transition-opacity"
                  style={{ background: dept.gradient }}
                />
                <div className="relative bg-card/80 backdrop-blur-md border-2 border-[#1E3A8A] rounded-3xl p-10 hover:border-[#1E3A8A] transition-all shadow-lg">
                  <div className="flex flex-col items-center text-center">
                    <div 
                      className="w-20 h-20 rounded-2xl flex items-center justify-center mb-6 shadow-lg"
                      style={{ background: dept.gradient }}
                    >
                      <Users className="w-10 h-10 text-white" />
                    </div>
                    <h3 className="text-3xl font-bold mb-4 text-foreground">Faculty Portal</h3>
                    <p className="text-foreground/60 mb-6">
                      Manage students, upload notes, and post announcements
                    </p>
                    <div className="text-sm text-primary font-semibold">
                      Click to Enter →
                    </div>
                  </div>
                </div>
              </motion.div>
            </Link>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default Department;
