import { useParams, Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowLeft, FileText, BookOpen, GraduationCap, Sparkles } from "lucide-react";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import MobileBottomNav from "@/components/layout/MobileBottomNav";
import SyllabusReviewFormFields from "@/components/forms/SyllabusReviewFormFields";

// Department configuration
const departments: Record<string, { name: string; code: string; color: string }> = {
  cse: { name: "Computer Science & Engineering", code: "CSE", color: "from-blue-500 to-cyan-500" },
  ece: { name: "Electronics & Communication", code: "ECE", color: "from-purple-500 to-pink-500" },
  eee: { name: "Electrical & Electronics", code: "EEE", color: "from-yellow-500 to-orange-500" },
  mech: { name: "Mechanical Engineering", code: "MECH", color: "from-red-500 to-rose-500" },
  civil: { name: "Civil Engineering", code: "CIVIL", color: "from-green-500 to-emerald-500" },
  aids: { name: "AI & Data Science", code: "DS", color: "from-indigo-500 to-violet-500" },
  mba: { name: "Business Administration", code: "MBA", color: "from-teal-500 to-cyan-500" },
  mca: { name: "Computer Applications", code: "MCA", color: "from-fuchsia-500 to-pink-500" }
};

const SyllabusReviewForm = () => {
  const { branch, semester, section } = useParams();
  const navigate = useNavigate();
  
  const department = branch ? departments[branch] : null;
  const formattedSection = section?.toUpperCase();

  if (!department || !semester || !section) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <main className="container mx-auto px-4 py-16 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="max-w-md mx-auto"
          >
            <FileText className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
            <h1 className="text-2xl font-bold text-foreground mb-2">Form Not Found</h1>
            <p className="text-muted-foreground mb-6">
              The requested syllabus review form could not be found.
            </p>
            <Link 
              to="/faculty/syllabus-review"
              className="inline-flex items-center gap-2 text-primary hover:underline"
            >
              <ArrowLeft className="w-4 h-4" />
              Back to Syllabus Review
            </Link>
          </motion.div>
        </main>
        <Footer />
        <MobileBottomNav />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background relative overflow-hidden">
      {/* Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-primary/10 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-secondary/10 rounded-full blur-3xl animate-pulse delay-1000" />
        <div className="absolute top-1/2 left-0 w-64 h-64 bg-accent/5 rounded-full blur-3xl" />
        
        {/* Grid Pattern */}
        <div 
          className="absolute inset-0 opacity-[0.02]"
          style={{
            backgroundImage: `
              linear-gradient(to right, hsl(var(--primary)) 1px, transparent 1px),
              linear-gradient(to bottom, hsl(var(--primary)) 1px, transparent 1px)
            `,
            backgroundSize: '60px 60px'
          }}
        />
      </div>

      <Header />
      
      <main className="container mx-auto px-4 py-8 pb-24 md:pb-8 relative z-10">
        {/* Back Button */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="mb-8"
        >
          <button
            onClick={() => navigate(-1)}
            className="group inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-card/50 border border-border hover:border-primary/50 hover:bg-card transition-all duration-300"
          >
            <ArrowLeft className="w-4 h-4 text-muted-foreground group-hover:text-primary transition-colors" />
            <span className="text-sm text-muted-foreground group-hover:text-foreground transition-colors">Back</span>
          </button>
        </motion.div>

        {/* Breadcrumbs */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.1 }}
          className="flex items-center gap-2 text-sm mb-8 flex-wrap"
        >
          <Link to="/faculty/syllabus-review" className="text-muted-foreground hover:text-primary transition-colors">
            Syllabus Review
          </Link>
          <span className="text-border">/</span>
          <Link to={`/faculty/syllabus-review/${branch}`} className="text-muted-foreground hover:text-primary transition-colors">
            {department.code}
          </Link>
          <span className="text-border">/</span>
          <Link to={`/faculty/syllabus-review/${branch}/${semester}`} className="text-muted-foreground hover:text-primary transition-colors">
            {semester}
          </Link>
          <span className="text-border">/</span>
          <span className="text-primary font-medium">Section {formattedSection}</span>
        </motion.div>

        {/* Hero Header Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.15 }}
          className="max-w-3xl mx-auto mb-8"
        >
          <div className="relative overflow-hidden rounded-2xl border border-border bg-card/80 backdrop-blur-sm">
            {/* Gradient Top Bar */}
            <div className={`h-2 bg-gradient-to-r ${department.color}`} />
            
            {/* Content */}
            <div className="p-6 md:p-8">
              <div className="flex items-start gap-4">
                {/* Icon */}
                <div className={`hidden sm:flex items-center justify-center w-14 h-14 rounded-xl bg-gradient-to-br ${department.color} shadow-lg`}>
                  <BookOpen className="w-7 h-7 text-white" />
                </div>
                
                {/* Text */}
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-gradient-to-r ${department.color} text-white`}>
                      <GraduationCap className="w-3 h-3" />
                      {department.code}
                    </span>
                    <span className="px-2.5 py-1 rounded-full text-xs font-medium bg-secondary/20 text-secondary border border-secondary/30">
                      {semester}
                    </span>
                    <span className="px-2.5 py-1 rounded-full text-xs font-medium bg-primary/20 text-primary border border-primary/30">
                      Section {formattedSection}
                    </span>
                  </div>
                  
                  <h1 className="text-2xl md:text-3xl font-bold text-foreground mb-2">
                    Syllabus Review Form
                  </h1>
                  <p className="text-muted-foreground text-sm md:text-base">
                    {department.name} • Academic Progress Tracking
                  </p>
                </div>
              </div>

              {/* Decorative Elements */}
              <div className="absolute top-0 right-0 w-32 h-32 opacity-10 pointer-events-none">
                <Sparkles className="w-full h-full text-primary" />
              </div>
            </div>
          </div>
        </motion.div>

        {/* Form Container */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.25 }}
          className="max-w-3xl mx-auto"
        >
          <div className="relative">
            {/* Glow Effect Behind Form */}
            <div className={`absolute -inset-1 bg-gradient-to-r ${department.color} rounded-2xl blur-xl opacity-20`} />
            
            {/* Form Card */}
            <div className="relative rounded-2xl border border-border bg-card/90 backdrop-blur-sm overflow-hidden shadow-2xl">
              <SyllabusReviewFormFields 
                branch={branch}
                semester={semester}
                section={formattedSection || "A"}
              />
            </div>
          </div>
        </motion.div>

        {/* Bottom Spacing for Mobile Nav */}
        <div className="h-8" />
      </main>

      <Footer />
      <MobileBottomNav />
    </div>
  );
};

export default SyllabusReviewForm;
