import { useParams, Link } from "react-router-dom";
import { motion } from "framer-motion";
import { 
  ArrowLeft, BookOpen, FileText, ClipboardList, Upload, Calendar, 
  Users, GraduationCap, Award, Clock, BarChart3, FileCheck, 
  Briefcase, ChevronDown, ChevronUp, ExternalLink
} from "lucide-react";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import { useState } from "react";
import { cn } from "@/lib/utils";

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

const blueGradient = "linear-gradient(135deg, #0EA5E9, #1E3A8A)";

interface ActionButtonProps {
  label: string;
  onClick?: () => void;
  href?: string;
  variant?: "primary" | "secondary";
}

const ActionButton = ({ label, onClick, href, variant = "primary" }: ActionButtonProps) => {
  const baseClasses = "px-4 py-2 rounded-lg text-sm font-medium transition-all duration-300 flex items-center gap-2";
  const variantClasses = variant === "primary" 
    ? "bg-gradient-to-r from-[#0EA5E9] to-[#1E3A8A] text-white hover:shadow-lg hover:shadow-primary/30 hover:scale-105"
    : "bg-card/60 border border-border text-foreground hover:bg-card hover:border-primary/50";

  if (href) {
    return (
      <a href={href} target="_blank" rel="noopener noreferrer" className={cn(baseClasses, variantClasses)}>
        {label}
        <ExternalLink className="w-3 h-3" />
      </a>
    );
  }

  return (
    <button onClick={onClick} className={cn(baseClasses, variantClasses)}>
      {label}
    </button>
  );
};

interface SectionCardProps {
  title: string;
  icon: React.ElementType;
  children: React.ReactNode;
  defaultOpen?: boolean;
}

const SectionCard = ({ title, icon: Icon, children, defaultOpen = false }: SectionCardProps) => {
  const [isOpen, setIsOpen] = useState(defaultOpen);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-card/80 backdrop-blur-md border border-border rounded-2xl overflow-hidden"
    >
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full px-6 py-5 flex items-center justify-between hover:bg-card/90 transition-colors"
      >
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-[#0EA5E9] to-[#1E3A8A] flex items-center justify-center">
            <Icon className="w-6 h-6 text-white" />
          </div>
          <h3 className="text-xl font-bold text-foreground">{title}</h3>
        </div>
        {isOpen ? (
          <ChevronUp className="w-5 h-5 text-muted-foreground" />
        ) : (
          <ChevronDown className="w-5 h-5 text-muted-foreground" />
        )}
      </button>
      
      {isOpen && (
        <motion.div
          initial={{ height: 0, opacity: 0 }}
          animate={{ height: "auto", opacity: 1 }}
          exit={{ height: 0, opacity: 0 }}
          className="px-6 pb-6"
        >
          <div className="pt-4 border-t border-border/50">
            {children}
          </div>
        </motion.div>
      )}
    </motion.div>
  );
};

interface SubSectionProps {
  title: string;
  children: React.ReactNode;
}

const SubSection = ({ title, children }: SubSectionProps) => (
  <div className="mb-6 last:mb-0">
    <h4 className="text-lg font-semibold text-primary mb-3">{title}</h4>
    <div className="flex flex-wrap gap-3">
      {children}
    </div>
  </div>
);

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

  const sections = ["A", "B", "C"];
  const years = ["1st Year", "2nd Year", "3rd Year", "4th Year"];
  const semesters = {
    "1st Year": ["1-1", "1-2"],
    "2nd Year": ["2-1", "2-2"],
    "3rd Year": ["3-1", "3-2"],
    "4th Year": ["4-1", "4-2"]
  };

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
            className="text-center mb-12"
          >
            <h1 className="text-5xl font-black mb-4 bg-clip-text text-transparent"
                style={{ backgroundImage: blueGradient }}>
              Faculty Portal
            </h1>
            <p className="text-xl text-muted-foreground">{dept.name}</p>
          </motion.div>

          <div className="max-w-5xl mx-auto space-y-4">
            {/* Guidelines for Teachers */}
            <SectionCard title="Guidelines for Teachers" icon={BookOpen}>
              <ActionButton label="Click here to access guidelines for the teachers" href="/documents/Guidelines_All_Teachers.pdf" />
            </SectionCard>

            {/* Syllabus Review Forms */}
            <SectionCard title="Syllabus Review Forms" icon={FileText}>
              <div className="flex flex-wrap gap-3">
                {["2-1", "2-2", "3-1", "3-2"].map((sem) => (
                  sections.map((section) => (
                    <ActionButton 
                      key={`${sem}-${section}`}
                      label={`${sem} ${dept.code}-${section} Syllabus review form`}
                      href="#"
                    />
                  ))
                ))}
              </div>
            </SectionCard>

            {/* Slip Test Marks */}
            <SectionCard title="Slip Test Marks" icon={ClipboardList}>
              <div className="flex flex-wrap gap-3">
                {["2-2", "3-2"].map((sem) => (
                  sections.map((section) => (
                    <ActionButton 
                      key={`${sem}-${section}`}
                      label={`Post ${sem} ${dept.code}-${section} ST Marks`}
                      href="#"
                    />
                  ))
                ))}
              </div>
            </SectionCard>

            {/* Submit Mid Papers */}
            <SectionCard title="Submit Mid Papers" icon={Upload}>
              <div className="flex flex-wrap gap-3">
                {["2-2", "3-2"].map((sem) => (
                  <ActionButton 
                    key={sem}
                    label={`Submit ${sem} ${dept.code} mid papers`}
                    href="#"
                  />
                ))}
              </div>
            </SectionCard>

            {/* Submit Lesson Plan */}
            <SectionCard title="Submit Your Lesson Plan" icon={FileCheck}>
              <ActionButton label={`Submit 4-1 ${dept.code} lesson Plan`} href="#" />
            </SectionCard>

            {/* Lab Internal Marks */}
            <SectionCard title="2-2 & 3-2 Lab Internal Marks" icon={Award}>
              <div className="flex flex-wrap gap-3">
                {["2-2", "3-2"].map((sem) => (
                  sections.map((section) => (
                    <ActionButton 
                      key={`${sem}-${section}`}
                      label={`Post ${sem} ${dept.code}-${section} lab internal marks`}
                      href="#"
                    />
                  ))
                ))}
              </div>
            </SectionCard>

            {/* Mid & Quiz Marks */}
            <SectionCard title="2-2 & 3-2 Mid & Quiz Marks" icon={BarChart3}>
              <SubSection title="Mid Marks">
                <div className="flex flex-wrap gap-3">
                  {["2-2", "3-2"].map((sem) => (
                    sections.map((section) => (
                      <ActionButton 
                        key={`mid-${sem}-${section}`}
                        label={`Post ${sem} ${dept.code}-${section} Mid marks`}
                        href="#"
                      />
                    ))
                  ))}
                </div>
              </SubSection>
              <SubSection title="Quiz Marks">
                <ActionButton label="Quiz 3 marks" href="#" />
              </SubSection>
            </SectionCard>

            {/* Assignment Marks */}
            <SectionCard title="2-1, 3-1 & 4-1 Assignment Marks" icon={FileText}>
              <div className="flex flex-wrap gap-3">
                {["2-1", "3-1", "4-1"].map((sem) => (
                  sections.map((section) => (
                    <ActionButton 
                      key={`${sem}-${section}`}
                      label={`Post ${sem} ${dept.code}-${section} Assignment marks`}
                      href="#"
                    />
                  ))
                ))}
              </div>
            </SectionCard>

            {/* Daily Activities */}
            <SectionCard title="Daily Activities" icon={Clock}>
              <SubSection title="Hourly Attendance">
                <div className="flex flex-wrap gap-3">
                  {["4-1", "3-1", "2-1"].map((sem) => (
                    sections.map((section) => (
                      <ActionButton 
                        key={`hourly-${sem}-${section}`}
                        label={`Post the ${sem} ${dept.code}-${section} Attendance`}
                        href="#"
                      />
                    ))
                  ))}
                </div>
              </SubSection>
              <SubSection title="Monthly Attendance">
                <div className="flex flex-wrap gap-3">
                  {["2-2", "3-2"].map((sem) => (
                    sections.map((section) => (
                      <ActionButton 
                        key={`monthly-${sem}-${section}`}
                        label={`Post the ${sem} ${dept.code}-${section} Monthly attendance`}
                        href="#"
                      />
                    ))
                  ))}
                </div>
              </SubSection>
            </SectionCard>

            {/* Nominal Rolls & Mentors Data */}
            <SectionCard title="Nominal Rolls & Mentors Data" icon={Users}>
              <SubSection title="Nominal Rolls">
                <div className="flex flex-wrap gap-3">
                  {["2-1", "3-1", "4-1"].map((sem) => (
                    <ActionButton 
                      key={`nominal-${sem}`}
                      label={`23NP-${sem.replace("-", "_")}${dept.code}_Nominal_Rolls`}
                      href="#"
                    />
                  ))}
                </div>
              </SubSection>
              <SubSection title="Mentors Data">
                <ActionButton label={`1st, 2nd & 3rd Year ${dept.code} Mentors`} href="#" />
              </SubSection>
            </SectionCard>

            {/* Academic Calendars */}
            <SectionCard title="Academic Calendars" icon={Calendar}>
              <div className="flex flex-wrap gap-3">
                <ActionButton label="1-1 & 1-2 Academic Calendar" href="/documents/II_Year_Academic_calendar_24-25_NRIIT.pdf" />
                <ActionButton label="2-1 & 2-2 Academic Calendar" href="/documents/II_Year_Academic_calendar_24-25_NRIIT.pdf" />
                <ActionButton label="3-1 & 3-2 Academic Calendar" href="/documents/II_Year_Academic_calendar_24-25_NRIIT.pdf" />
              </div>
            </SectionCard>

            {/* Teaching Guidelines */}
            <SectionCard title="Teaching Guidelines" icon={GraduationCap}>
              <ActionButton label="Click here to access the Guidelines for Teaching staff" href="/documents/Guidelines_Student_DS.pdf" />
            </SectionCard>

            {/* Syllabus */}
            <SectionCard title={`Syllabus ${dept.code}`} icon={BookOpen}>
              <ActionButton label={`Click here to access the Syllabus (${dept.code} R20)`} href="/documents/CSE-DS-Syllabus.pdf" />
            </SectionCard>

            {/* Summer Internship Attendance */}
            <SectionCard title="Summer Internship Attendance" icon={Briefcase}>
              <div className="flex flex-wrap gap-3">
                {sections.map((section) => (
                  <ActionButton 
                    key={`internship-${section}`}
                    label={`Post 22NP - 3rd ${dept.code}-${section} - Attendance`}
                    href="#"
                  />
                ))}
              </div>
            </SectionCard>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default FacultyPortal;
