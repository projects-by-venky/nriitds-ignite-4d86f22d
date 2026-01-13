import { useParams, Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowLeft, FileText } from "lucide-react";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import MobileBottomNav from "@/components/layout/MobileBottomNav";
import SyllabusReviewFormFields from "@/components/forms/SyllabusReviewFormFields";

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

const SyllabusReviewForm = () => {
  const { branch, semester, section } = useParams();
  const navigate = useNavigate();
  
  const department = branch ? departments[branch] : null;
  const formattedSection = section?.replace("section-", "").toUpperCase();

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
    <div className="min-h-screen bg-[#f0ebf8]">
      <Header />
      
      <main className="container mx-auto px-4 py-8 pb-24 md:pb-8">
        {/* Navigation */}
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-6"
        >
          <button
            onClick={() => navigate(-1)}
            className="inline-flex items-center gap-2 text-primary hover:text-primary/80 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            Back
          </button>
        </motion.div>

        {/* Breadcrumbs */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.1 }}
          className="text-sm text-muted-foreground mb-6"
        >
          <Link to="/faculty/syllabus-review" className="hover:text-primary">
            Syllabus Review
          </Link>
          {" / "}
          <Link to={`/faculty/syllabus-review/${branch}`} className="hover:text-primary">
            {department.code}
          </Link>
          {" / "}
          <Link to={`/faculty/syllabus-review/${branch}/${semester}`} className="hover:text-primary">
            {semester}
          </Link>
          {" / "}
          <span className="text-foreground">Section {formattedSection}</span>
        </motion.div>

        {/* Form Container */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="max-w-2xl mx-auto"
        >
          {/* Form Title Card */}
          <div className="bg-white rounded-lg shadow-sm border overflow-hidden mb-4">
            <div className="bg-primary h-2" />
            <div className="p-6">
              <h1 className="text-2xl font-normal text-gray-900">
                {semester} - {department.code}-{formattedSection} Syllabus-Review form
              </h1>
            </div>
          </div>

          {/* Form Fields */}
          <SyllabusReviewFormFields 
            branch={branch}
            semester={semester}
            section={formattedSection || "A"}
          />
        </motion.div>
      </main>

      <Footer />
      <MobileBottomNav />
    </div>
  );
};

export default SyllabusReviewForm;
