import { useParams, Link } from "react-router-dom";
import { motion } from "framer-motion";
import { 
  ArrowLeft, BookOpen, FileText, ClipboardList, Upload, Calendar, 
  Users, GraduationCap, Award, Clock, BarChart3, FileCheck, 
  Briefcase, ChevronDown, ChevronUp, ExternalLink
} from "lucide-react";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import MobileBottomNav from "@/components/layout/MobileBottomNav";
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

interface ActionButtonProps {
  label: string;
  onClick?: () => void;
  href?: string;
  variant?: "primary" | "secondary";
  download?: boolean;
}

const ActionButton = ({ label, onClick, href, variant = "primary", download = false }: ActionButtonProps) => {
  const baseClasses = "w-full px-4 py-3 md:py-2.5 rounded-xl text-sm font-medium transition-all duration-300 flex items-center justify-center gap-2 touch-target";
  const variantClasses = variant === "primary" 
    ? "bg-gradient-to-r from-[#0EA5E9] to-[#1E3A8A] text-white hover:shadow-lg hover:shadow-primary/30 active:scale-[0.98]"
    : "bg-card/60 border border-border text-foreground hover:bg-card hover:border-primary/50 active:scale-[0.98]";

  if (href) {
    return (
      <a 
        href={href} 
        target={download ? undefined : "_blank"} 
        rel={download ? undefined : "noopener noreferrer"} 
        download={download}
        className={cn(baseClasses, variantClasses)}
      >
        <span className="truncate">{label}</span>
        <ExternalLink className="w-3 h-3 flex-shrink-0" />
      </a>
    );
  }

  return (
    <button onClick={onClick} className={cn(baseClasses, variantClasses)}>
      <span className="truncate">{label}</span>
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
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-card/80 backdrop-blur-md border border-border rounded-2xl overflow-hidden"
    >
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full px-4 py-4 md:px-6 md:py-5 flex items-center justify-between hover:bg-card/90 transition-colors touch-target"
      >
        <div className="flex items-center gap-3 md:gap-4 min-w-0">
          <div className="w-10 h-10 md:w-12 md:h-12 rounded-xl bg-gradient-to-br from-[#0EA5E9] to-[#1E3A8A] flex items-center justify-center flex-shrink-0">
            <Icon className="w-5 h-5 md:w-6 md:h-6 text-white" />
          </div>
          <h3 className="text-sm md:text-xl font-bold text-foreground text-left truncate">{title}</h3>
        </div>
        {isOpen ? (
          <ChevronUp className="w-5 h-5 text-muted-foreground flex-shrink-0 ml-2" />
        ) : (
          <ChevronDown className="w-5 h-5 text-muted-foreground flex-shrink-0 ml-2" />
        )}
      </button>
      
      {isOpen && (
        <motion.div
          initial={{ height: 0, opacity: 0 }}
          animate={{ height: "auto", opacity: 1 }}
          exit={{ height: 0, opacity: 0 }}
          className="px-4 pb-4 md:px-6 md:pb-6"
        >
          <div className="pt-3 md:pt-4 border-t border-border/50">
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
  <div className="mb-4 last:mb-0">
    <h4 className="text-xs md:text-sm font-semibold text-primary mb-2 md:mb-3 uppercase tracking-wide">{title}</h4>
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2 md:gap-3">
      {children}
    </div>
  </div>
);

const FacultyPortal = () => {
  const { deptId } = useParams<{ deptId: string }>();
  const dept = deptId ? departments[deptId as keyof typeof departments] : null;

  if (!dept) {
    return (
      <div className="min-h-screen flex items-center justify-center px-4">
        <div className="text-center">
          <h1 className="text-2xl md:text-4xl font-bold mb-4">Department Not Found</h1>
          <Link to="/" className="text-primary hover:underline">Return Home</Link>
        </div>
      </div>
    );
  }

  const sections = ["A", "B", "C"];

  return (
    <div className="min-h-screen bg-gradient-to-b from-background via-background/95 to-background">
      <Header />
      
      <main className="pt-16 md:pt-20 pb-24 md:pb-20">
        <div className="container mx-auto px-4 md:px-6 lg:px-8">
          {/* Header */}
          <Link to={`/department/${deptId}`}>
            <motion.button
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors mb-4 touch-target justify-start"
            >
              <ArrowLeft className="w-5 h-5" />
              <span className="text-sm">Back to Department</span>
            </motion.button>
          </Link>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-6 md:mb-8"
          >
            <h1 className="text-2xl md:text-4xl lg:text-5xl font-black mb-2 bg-clip-text text-transparent"
                style={{ backgroundImage: "linear-gradient(135deg, #0EA5E9, #1E3A8A)" }}>
              Faculty Portal
            </h1>
            <p className="text-sm md:text-lg text-muted-foreground">{dept.name}</p>
          </motion.div>

          <div className="space-y-3 md:space-y-4">
            {/* Guidelines for Teachers */}
            <SectionCard title="Guidelines for Teachers" icon={BookOpen}>
              <a 
                href="/documents/Guidelines_All_Teachers.pdf"
                download
                className="text-sm md:text-base text-muted-foreground hover:text-primary transition-colors cursor-pointer"
              >
                Download Teacher Guidelines
              </a>
            </SectionCard>


            {/* Syllabus Review Forms */}
            <SectionCard title="Syllabus Review Forms" icon={FileText}>
              <ActionButton 
                label="Open Syllabus Review Forms"
                href={`/department/${deptId}/syllabus-review-forms`}
                variant="secondary"
              />
            </SectionCard>

            {/* Slip Test Marks */}
            <SectionCard title="Slip Test Marks" icon={ClipboardList}>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2 md:gap-3">
                {["2-2", "3-2"].map((sem) => (
                  sections.map((section) => (
                    <ActionButton 
                      key={`${sem}-${section}`}
                      label={`Post ${sem} ${dept.code}-${section} ST Marks`}
                      href="#"
                      variant="secondary"
                    />
                  ))
                ))}
              </div>
            </SectionCard>

            {/* Submit Mid Papers */}
            <SectionCard title="Submit Mid Papers" icon={Upload}>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 md:gap-3">
                {["2-2", "3-2"].map((sem) => (
                  <ActionButton 
                    key={sem}
                    label={`Submit ${sem} ${dept.code} mid papers`}
                    href="#"
                    variant="secondary"
                  />
                ))}
              </div>
            </SectionCard>

            {/* Submit Lesson Plan */}
            <SectionCard title="Submit Your Lesson Plan" icon={FileCheck}>
              <ActionButton label={`Submit 4-1 ${dept.code} lesson Plan`} href="#" variant="secondary" />
            </SectionCard>

            {/* Lab Internal Marks */}
            <SectionCard title="Lab Internal Marks" icon={Award}>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2 md:gap-3">
                {["2-2", "3-2"].map((sem) => (
                  sections.map((section) => (
                    <ActionButton 
                      key={`${sem}-${section}`}
                      label={`Post ${sem} ${dept.code}-${section} lab marks`}
                      href="#"
                      variant="secondary"
                    />
                  ))
                ))}
              </div>
            </SectionCard>

            {/* Mid Marks */}
            <SectionCard title="Mid Marks" icon={BarChart3}>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2 md:gap-3">
                {["2-2", "3-2"].map((sem) => (
                  sections.map((section) => (
                    <ActionButton 
                      key={`mid-${sem}-${section}`}
                      label={`Post ${sem} ${dept.code}-${section} Mid marks`}
                      href="#"
                      variant="secondary"
                    />
                  ))
                ))}
              </div>
            </SectionCard>

            {/* Assignment Marks */}
            <SectionCard title="Assignment Marks" icon={FileText}>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2 md:gap-3">
                {["2-1", "3-1", "4-1"].map((sem) => (
                  sections.map((section) => (
                    <ActionButton 
                      key={`${sem}-${section}`}
                      label={`Post ${sem} ${dept.code}-${section} Assignment`}
                      href="#"
                      variant="secondary"
                    />
                  ))
                ))}
              </div>
            </SectionCard>

            {/* Daily Activities */}
            <SectionCard title="Daily Activities" icon={Clock}>
              <SubSection title="Hourly Attendance">
                {["4-1", "3-1", "2-1"].map((sem) => (
                  sections.map((section) => (
                    <ActionButton 
                      key={`hourly-${sem}-${section}`}
                      label={`Post ${sem} ${dept.code}-${section} Attendance`}
                      href="#"
                      variant="secondary"
                    />
                  ))
                ))}
              </SubSection>
              <SubSection title="Monthly Attendance">
                {["2-2", "3-2"].map((sem) => (
                  sections.map((section) => (
                    <ActionButton 
                      key={`monthly-${sem}-${section}`}
                      label={`Post ${sem} ${dept.code}-${section} Monthly`}
                      href="#"
                      variant="secondary"
                    />
                  ))
                ))}
              </SubSection>
            </SectionCard>

            {/* Nominal Rolls & Mentors Data */}
            <SectionCard title="Nominal Rolls & Mentors" icon={Users}>
              <SubSection title="Nominal Rolls">
                {["2-1", "3-1", "4-1"].map((sem) => (
                  <ActionButton 
                    key={`nominal-${sem}`}
                    label={`23NP-${sem.replace("-", "_")}${dept.code}_Nominal_Rolls`}
                    href="#"
                    variant="secondary"
                  />
                ))}
              </SubSection>
              <SubSection title="Mentors Data">
                <ActionButton label={`1st, 2nd & 3rd Year ${dept.code} Mentors`} href="#" variant="secondary" />
              </SubSection>
            </SectionCard>

            {/* Academic Calendars */}
            <SectionCard title="Academic Calendars" icon={Calendar}>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2 md:gap-3">
                <ActionButton label="1-1 & 1-2 Calendar" href="/documents/II_Year_Academic_calendar_24-25_NRIIT.pdf" variant="secondary" />
                <ActionButton label="2-1 & 2-2 Calendar" href="/documents/II_Year_Academic_calendar_24-25_NRIIT.pdf" variant="secondary" />
                <ActionButton label="3-1 & 3-2 Calendar" href="/documents/II_Year_Academic_calendar_24-25_NRIIT.pdf" variant="secondary" />
              </div>
            </SectionCard>

            {/* Syllabus */}
            <SectionCard title={`Syllabus ${dept.code}`} icon={BookOpen}>
              <ActionButton label={`${dept.code} Syllabus (R20)`} href="/documents/CSE-DS-Syllabus.pdf" />
            </SectionCard>

            {/* Summer Internship Attendance */}
            <SectionCard title="Summer Internship" icon={Briefcase}>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2 md:gap-3">
                {sections.map((section) => (
                  <ActionButton 
                    key={`internship-${section}`}
                    label={`Post 22NP-3rd ${dept.code}-${section} Attendance`}
                    href="#"
                    variant="secondary"
                  />
                ))}
              </div>
            </SectionCard>
          </div>
        </div>
      </main>

      <Footer />
      <MobileBottomNav />
    </div>
  );
};

export default FacultyPortal;
