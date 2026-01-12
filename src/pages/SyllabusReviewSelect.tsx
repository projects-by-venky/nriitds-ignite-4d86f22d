import { useParams, Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowLeft, FileText, GraduationCap, BookOpen, Users } from "lucide-react";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import MobileBottomNav from "@/components/layout/MobileBottomNav";

// Department configuration
const departments: Record<string, { name: string; code: string }> = {
  cse: { name: "Computer Science & Engineering", code: "CSE" },
  ece: { name: "Electronics & Communication", code: "ECE" },
  eee: { name: "Electrical & Electronics", code: "EEE" },
  mech: { name: "Mechanical Engineering", code: "MECH" },
  civil: { name: "Civil Engineering", code: "CIVIL" },
  aids: { name: "AI & Data Science", code: "DS" },
  mba: { name: "Business Administration", code: "MBA" },
  mca: { name: "Computer Applications", code: "MCA" }
};

const semesters = ["1-1", "1-2", "2-1", "2-2", "3-1", "3-2", "4-1", "4-2"];
const sections = ["A", "B", "C"];

// Selection Card Component
interface SelectionCardProps {
  title: string;
  subtitle?: string;
  icon: React.ReactNode;
  onClick?: () => void;
  href?: string;
  delay?: number;
}

const SelectionCard = ({ title, subtitle, icon, onClick, href, delay = 0 }: SelectionCardProps) => {
  const content = (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay }}
      whileHover={{ scale: 1.02, y: -2 }}
      whileTap={{ scale: 0.98 }}
      className="bg-card/80 backdrop-blur-md border border-border rounded-2xl p-4 md:p-6 cursor-pointer
                 hover:border-primary/50 hover:shadow-lg hover:shadow-primary/10 transition-all duration-300
                 flex flex-col items-center justify-center gap-3 min-h-[120px] md:min-h-[140px]"
    >
      <div className="w-12 h-12 md:w-14 md:h-14 rounded-xl bg-gradient-to-br from-[#0EA5E9] to-[#1E3A8A] 
                      flex items-center justify-center shadow-lg">
        {icon}
      </div>
      <div className="text-center">
        <h3 className="text-sm md:text-lg font-bold text-foreground">{title}</h3>
        {subtitle && (
          <p className="text-xs md:text-sm text-muted-foreground mt-1">{subtitle}</p>
        )}
      </div>
    </motion.div>
  );

  if (href) {
    return <Link to={href}>{content}</Link>;
  }

  return <div onClick={onClick}>{content}</div>;
};

// Branch Selection View
const BranchSelection = () => {
  const branches = Object.entries(departments);

  return (
    <div className="container mx-auto px-4 md:px-6 lg:px-8 max-w-5xl">
      <Link to="/">
        <motion.button
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors mb-4 touch-target justify-start"
        >
          <ArrowLeft className="w-5 h-5" />
          <span className="text-sm">Back to Home</span>
        </motion.button>
      </Link>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-6 md:mb-8"
      >
        <div className="flex items-center gap-3 mb-2">
          <div className="w-10 h-10 md:w-12 md:h-12 rounded-xl bg-gradient-to-br from-[#0EA5E9] to-[#1E3A8A] flex items-center justify-center">
            <FileText className="w-5 h-5 md:w-6 md:h-6 text-white" />
          </div>
          <div>
            <h1 className="text-xl md:text-3xl lg:text-4xl font-black bg-clip-text text-transparent"
                style={{ backgroundImage: "linear-gradient(135deg, #0EA5E9, #1E3A8A)" }}>
              Syllabus Review Forms
            </h1>
            <p className="text-sm text-muted-foreground">Select your branch to continue</p>
          </div>
        </div>
      </motion.div>

      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 md:gap-4">
        {branches.map(([key, dept], index) => (
          <SelectionCard
            key={key}
            title={dept.code}
            subtitle={dept.name}
            icon={<GraduationCap className="w-6 h-6 text-white" />}
            href={`/faculty/syllabus-review/${key}`}
            delay={index * 0.05}
          />
        ))}
      </div>
    </div>
  );
};

// Semester Selection View
const SemesterSelection = ({ branch }: { branch: string }) => {
  const dept = departments[branch];

  if (!dept) {
    return (
      <div className="container mx-auto px-4 text-center py-12">
        <h1 className="text-2xl font-bold mb-4">Branch Not Found</h1>
        <Link to="/faculty/syllabus-review" className="text-primary hover:underline">
          Return to Branch Selection
        </Link>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 md:px-6 lg:px-8 max-w-5xl">
      <Link to="/faculty/syllabus-review">
        <motion.button
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors mb-4 touch-target justify-start"
        >
          <ArrowLeft className="w-5 h-5" />
          <span className="text-sm">Back to Branches</span>
        </motion.button>
      </Link>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-6 md:mb-8"
      >
        <div className="flex items-center gap-3 mb-2">
          <div className="w-10 h-10 md:w-12 md:h-12 rounded-xl bg-gradient-to-br from-[#0EA5E9] to-[#1E3A8A] flex items-center justify-center">
            <GraduationCap className="w-5 h-5 md:w-6 md:h-6 text-white" />
          </div>
          <div>
            <h1 className="text-xl md:text-3xl font-black bg-clip-text text-transparent"
                style={{ backgroundImage: "linear-gradient(135deg, #0EA5E9, #1E3A8A)" }}>
              {dept.code} - Select Semester
            </h1>
            <p className="text-sm text-muted-foreground">{dept.name}</p>
          </div>
        </div>
        
        {/* Breadcrumb */}
        <div className="flex items-center gap-2 text-xs md:text-sm text-muted-foreground mt-4">
          <Link to="/faculty/syllabus-review" className="hover:text-primary transition-colors">
            Syllabus Review
          </Link>
          <span>/</span>
          <span className="text-foreground font-medium">{dept.code}</span>
        </div>
      </motion.div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4">
        {semesters.map((sem, index) => (
          <SelectionCard
            key={sem}
            title={`Semester ${sem}`}
            icon={<BookOpen className="w-6 h-6 text-white" />}
            href={`/faculty/syllabus-review/${branch}/${sem}`}
            delay={index * 0.05}
          />
        ))}
      </div>
    </div>
  );
};

// Section Selection View
const SectionSelection = ({ branch, semester }: { branch: string; semester: string }) => {
  const dept = departments[branch];

  if (!dept) {
    return (
      <div className="container mx-auto px-4 text-center py-12">
        <h1 className="text-2xl font-bold mb-4">Branch Not Found</h1>
        <Link to="/faculty/syllabus-review" className="text-primary hover:underline">
          Return to Branch Selection
        </Link>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 md:px-6 lg:px-8 max-w-5xl">
      <Link to={`/faculty/syllabus-review/${branch}`}>
        <motion.button
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors mb-4 touch-target justify-start"
        >
          <ArrowLeft className="w-5 h-5" />
          <span className="text-sm">Back to Semesters</span>
        </motion.button>
      </Link>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-6 md:mb-8"
      >
        <div className="flex items-center gap-3 mb-2">
          <div className="w-10 h-10 md:w-12 md:h-12 rounded-xl bg-gradient-to-br from-[#0EA5E9] to-[#1E3A8A] flex items-center justify-center">
            <BookOpen className="w-5 h-5 md:w-6 md:h-6 text-white" />
          </div>
          <div>
            <h1 className="text-xl md:text-3xl font-black bg-clip-text text-transparent"
                style={{ backgroundImage: "linear-gradient(135deg, #0EA5E9, #1E3A8A)" }}>
              {semester} {dept.code} - Select Section
            </h1>
            <p className="text-sm text-muted-foreground">{dept.name}</p>
          </div>
        </div>
        
        {/* Breadcrumb */}
        <div className="flex flex-wrap items-center gap-2 text-xs md:text-sm text-muted-foreground mt-4">
          <Link to="/faculty/syllabus-review" className="hover:text-primary transition-colors">
            Syllabus Review
          </Link>
          <span>/</span>
          <Link to={`/faculty/syllabus-review/${branch}`} className="hover:text-primary transition-colors">
            {dept.code}
          </Link>
          <span>/</span>
          <span className="text-foreground font-medium">Semester {semester}</span>
        </div>
      </motion.div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6">
        {sections.map((section, index) => (
          <SelectionCard
            key={section}
            title={`Section ${section}`}
            subtitle={`${semester} | ${dept.code} | Section ${section}`}
            icon={<Users className="w-6 h-6 text-white" />}
            href={`/faculty/syllabus-review/${branch}/${semester}/section-${section.toLowerCase()}`}
            delay={index * 0.1}
          />
        ))}
      </div>
    </div>
  );
};

// Main Component that handles routing
const SyllabusReviewSelect = () => {
  const { branch, semester } = useParams<{ branch?: string; semester?: string }>();

  // Determine which view to show based on URL params
  const renderContent = () => {
    if (semester && branch) {
      return <SectionSelection branch={branch} semester={semester} />;
    }
    if (branch) {
      return <SemesterSelection branch={branch} />;
    }
    return <BranchSelection />;
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-background via-background/95 to-background">
      <Header />
      <main className="pt-16 md:pt-20 pb-24 md:pb-20">
        {renderContent()}
      </main>
      <Footer />
      <MobileBottomNav />
    </div>
  );
};

export default SyllabusReviewSelect;
