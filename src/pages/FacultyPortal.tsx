import { useParams, Link } from "react-router-dom";
import { motion } from "framer-motion";
import { 
  ArrowLeft, BookOpen, FileText, ClipboardList, Upload, Calendar, 
  Users, GraduationCap, Award, Clock, BarChart3, FileCheck, 
  Briefcase, ChevronDown, ChevronUp, ExternalLink, Bell, FileQuestion,
  CheckSquare, BookMarked, Sun, FlaskConical
} from "lucide-react";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import MobileBottomNav from "@/components/layout/MobileBottomNav";
import { useState } from "react";
import { cn } from "@/lib/utils";
import { SectionGrid } from "@/components/portal/SectionGrid";

const departments = {
  cse: { name: "Computer Science & Engineering", code: "CSE" },
  ece: { name: "Electronics & Communication", code: "ECE" },
  eee: { name: "Electrical & Electronics", code: "EEE" },
  mech: { name: "Mechanical Engineering", code: "MECH" },
  civil: { name: "Civil Engineering", code: "CIVIL" },
  aids: { name: "AI & Data Science", code: "DS" },
  ds: { name: "Data Science", code: "DS" },
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

const dsBranches = ["aids", "ds"];

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

  const isDSBranch = dsBranches.includes(deptId || "");
  const sections = ["A", "B", "C"];

  // ============ DS FACULTY PORTAL ============
  if (isDSBranch) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-background via-background/95 to-background">
        <Header />
        
        <main className="pt-16 md:pt-20 pb-24 md:pb-20">
          <div className="container mx-auto px-4 md:px-6 lg:px-8">
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

              {/* 1. Guidelines for the teachers */}
              <SectionCard title="Guidelines for the teachers" icon={BookOpen}>
                <ActionButton label="Click here to access guidelines for the teachers" href="/documents/Guidelines_All_Teachers.pdf" download />
              </SectionCard>

              {/* 2. Syllabus Review forms */}
              <SectionCard title="Syllabus Review forms" icon={FileCheck}>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2 md:gap-3">
                  {[
                    "3-1 DS-A Syllabus review form",
                    "3-1 DS-B Syllabus review form",
                    "2-1 DS Syllabus review form",
                    "3-2 DS-A Syllabus review forms",
                    "3-2 DS-B Syllabus review forms",
                    "3-2 DS-C Syllabus review forms",
                  ].map((label) => (
                    <ActionButton key={label} label={label} href="#" variant="secondary" />
                  ))}
                </div>
              </SectionCard>

              {/* 3. Slip Test Marks */}
              <SectionCard title="Slip Test Marks" icon={ClipboardList}>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2 md:gap-3">
                  {[
                    "Post 2-2 DS-A ST Marks",
                    "Post 2-2 DS-B ST Marks",
                    "Post 2-2 DS-C ST Marks",
                    "Post 3-2 DS-A ST Marks",
                    "Post 3-2 DS-B ST Marks",
                  ].map((label) => (
                    <ActionButton key={label} label={label} href="#" variant="secondary" />
                  ))}
                </div>
              </SectionCard>

              {/* 4. Submit mid papers */}
              <SectionCard title="Submit mid papers" icon={Upload}>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 md:gap-3">
                  {[
                    "Submit 2-2 DS mid papers",
                    "Submit 3-2 DS mid papers",
                  ].map((label) => (
                    <ActionButton key={label} label={label} href="#" variant="secondary" />
                  ))}
                </div>
              </SectionCard>

              {/* 5. Submit your Lesson Plan */}
              <SectionCard title="Submit your Lesson Plan" icon={FileCheck}>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 md:gap-3">
                  <ActionButton label="Submit 4-1 DS Lesson Plan" href="#" variant="secondary" />
                </div>
              </SectionCard>

              {/* 6. 2-2 & 3-2 Lab Internal marks */}
              <SectionCard title="2-2 & 3-2 Lab Internal marks" icon={FlaskConical}>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2 md:gap-3">
                  {[
                    "Post 2-2 DS-A lab internal marks",
                    "Post 2-2 DS-B lab internal marks",
                    "Post 2-2 DS-C lab internal marks",
                    "Post 3-2 DS-A lab internal marks",
                    "Post 3-2 DS-B lab internal marks",
                  ].map((label) => (
                    <ActionButton key={label} label={label} href="#" variant="secondary" />
                  ))}
                </div>
              </SectionCard>

              {/* 7. 2-2 & 3-2 Mid & Quiz marks */}
              <SectionCard title="2-2 & 3-2 Mid & Quiz marks" icon={BarChart3}>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2 md:gap-3">
                  {[
                    "Post 2-2 DS-A Mid marks",
                    "Post 2-2 DS-B Mid marks",
                    "Post 2-2 DS-C Mid marks",
                    "Post 3-2 DS-A Mid marks",
                    "Post 3-2 DS-B Mid marks",
                    "Quiz-1 marks",
                  ].map((label) => (
                    <ActionButton key={label} label={label} href="#" variant="secondary" />
                  ))}
                </div>
              </SectionCard>

              {/* 8. 2-1, 3-1 & 4-1 Assignment marks */}
              <SectionCard title="2-1, 3-1 & 4-1 Assignment marks" icon={FileText}>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2 md:gap-3">
                  {[
                    "Post 2-1 DS-A Assignment marks",
                    "Post 2-1 DS-B Assignment marks",
                    "Post 2-1 DS-C Assignment marks",
                    "Post 3-1 DS-A Assignment marks",
                    "Post 3-1 DS-B Assignment marks",
                    "Post 4-1 DS-A Assignment marks",
                    "Post 4-1 DS-B Assignment marks",
                  ].map((label) => (
                    <ActionButton key={label} label={label} href="#" variant="secondary" />
                  ))}
                </div>
              </SectionCard>

              {/* 9. Daily activities - Hourly & Monthly Attendance */}
              <SectionCard title="Daily activities" icon={Clock}>
                <SubSection title="Hourly attendance">
                  {[
                    "Post the 4-1 DS-A Attendance",
                    "Post the 4-1 DS-B Attendance",
                    "Post the 5-1 DS-A Attendance",
                    "Post the 5-1 DS-B Attendance",
                    "Post the 5-1 DS-C Attendance",
                    "Post the 3-1 DS-A Attendance",
                    "Post the 3-1 DS-B Attendance",
                    "Post the 3-1 DS-C Attendance",
                  ].map((label) => (
                    <ActionButton key={label} label={label} href="#" variant="secondary" />
                  ))}
                </SubSection>
                <SubSection title="Monthly attendance">
                  {[
                    "Post the 3-1 DS-A Monthly attendance",
                    "Post the 3-2 DS-B Monthly attendance",
                    "Post the 2-2 DS-A Monthly attendance",
                    "Post the 2-2 DS-B Monthly attendance",
                    "Post the 2-2 DS-C Monthly attendance",
                  ].map((label) => (
                    <ActionButton key={label} label={label} href="#" variant="secondary" />
                  ))}
                </SubSection>
              </SectionCard>

              {/* 10. Nominal Rolls & Mentors data */}
              <SectionCard title="Nominal Rolls & Mentors data" icon={Users}>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2 md:gap-3">
                  {[
                    "22RP-1_DS_Nominal_Rolls",
                    "22RP-3_2S_Nominal_Rolls",
                    "20RP-2_1S_Nominal_Rolls",
                    "4th, 3rd & 2nd Each_DS_Mentors",
                  ].map((label) => (
                    <ActionButton key={label} label={label} href="#" variant="secondary" />
                  ))}
                </div>
              </SectionCard>

              {/* 11. Academic calendars */}
              <SectionCard title="Academic calendars" icon={Calendar}>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2 md:gap-3">
                  {[
                    "4-1 & 4-2 Academic Calendar",
                    "3-1 & 3-2 Academic Calendar",
                    "2-1 & 2-2 Academic Calendar",
                  ].map((label) => (
                    <ActionButton key={label} label={label} href="/documents/II_Year_Academic_calendar_24-25_NRIIT.pdf" variant="secondary" />
                  ))}
                </div>
              </SectionCard>

              {/* 12. Teaching Guidelines */}
              <SectionCard title="Teaching Guidelines" icon={BookMarked}>
                <ActionButton label="Click here to access the guidelines for Teaching Staff" href="/documents/Guidelines_All_Teachers.pdf" download />
              </SectionCard>

              {/* 13. Syllabus DS */}
              <SectionCard title="Syllabus DS" icon={BookOpen}>
                <ActionButton label="Click here to access the Syllabus DS 2023" href="/documents/CSE-DS-Syllabus.pdf" variant="secondary" />
              </SectionCard>

              {/* 14. Summer Internship Attendance */}
              <SectionCard title="Summer Internship Attendance" icon={Sun}>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2 md:gap-3">
                  {[
                    "Post 22RP- 3rd IT- Attendance",
                    "Post 22RP- 3rd DS-A Attendance",
                    "Post 22RP- 3rd DS-B Attendance",
                  ].map((label) => (
                    <ActionButton key={label} label={label} href="#" variant="secondary" />
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
  }

  // ============ DEFAULT (CSE etc.) FACULTY PORTAL ============
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
            {/* 1. Staff Notice Board */}
            <SectionCard title="Staff Notice Board" icon={Bell}>
              <ActionButton label="Staff Notice Board" href="#" />
            </SectionCard>

            {/* 2. Faculty - Guidelines */}
            <SectionCard title="Faculty - Guidelines" icon={BookOpen}>
              <ActionButton label="Faculty - Guidelines" href="/documents/Guidelines_All_Teachers.pdf" download />
            </SectionCard>

            {/* 3. Upload Model question Papers */}
            <SectionCard title="Upload Model question Papers" icon={FileQuestion}>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 md:gap-3">
                {["3-1", "2-1"].map((sem) => (
                  <ActionButton 
                    key={`model-${sem}`}
                    label={`${sem} Model Papers`}
                    href="#"
                    variant="secondary"
                  />
                ))}
              </div>
            </SectionCard>

            {/* 4. Upload Mid Papers */}
            <SectionCard title="Upload Mid Papers" icon={Upload}>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 md:gap-3">
                {["3-2", "2-2"].map((sem) => (
                  <ActionButton 
                    key={`mid-${sem}`}
                    label={`${sem} Mid Papers`}
                    href="#"
                    variant="secondary"
                  />
                ))}
              </div>
            </SectionCard>

            {/* 5. Upload your Lesson Plan */}
            <SectionCard title="Upload your Lesson Plan" icon={FileCheck}>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2 md:gap-3">
                {["4-1", "3-1", "2-1"].map((sem) => (
                  <ActionButton 
                    key={`lesson-${sem}`}
                    label={`${sem} ${dept.code} Lesson Plans`}
                    href="#"
                    variant="secondary"
                  />
                ))}
              </div>
            </SectionCard>

            {/* 6. Internal (MID & Assignment) Marks */}
            <SectionCard title="Internal (MID & Assignment) Marks" icon={BarChart3}>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 md:gap-3">
                {["2-2", "3-2"].map((sem) => (
                  <ActionButton 
                    key={`internal-${sem}`}
                    label={`Post ${sem}-${dept.code} Internal Marks`}
                    href="#"
                    variant="secondary"
                  />
                ))}
              </div>
            </SectionCard>

            {/* 7. Slip Test Marks */}
            <SectionCard title="Slip Test Marks" icon={ClipboardList}>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2 md:gap-3">
                {["4-1", "3-1", "2-1"].map((sem) => (
                  sections.map((section) => (
                    <ActionButton 
                      key={`st-${sem}-${section}`}
                      label={`${sem} ${dept.code}-${section} ST Marks`}
                      href="#"
                      variant="secondary"
                    />
                  ))
                ))}
              </div>
            </SectionCard>

            {/* 8. Syllabus Coverage */}
            <SectionCard title="Syllabus Coverage" icon={CheckSquare}>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2 md:gap-3">
                {["3-2", "2-2"].map((sem) => (
                  sections.map((section) => (
                    <ActionButton 
                      key={`syllabus-cov-${sem}-${section}`}
                      label={`${sem} ${dept.code}-${section} Syllabus Coverage`}
                      href="#"
                      variant="secondary"
                    />
                  ))
                ))}
              </div>
            </SectionCard>

            {/* 9. Hourly Attendance */}
            <SectionCard title="Hourly Attendance" icon={Clock}>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2 md:gap-3">
                {["4-2", "3-2", "2-2"].map((sem) => (
                  sections.map((section) => (
                    <ActionButton 
                      key={`hourly-${sem}-${section}`}
                      label={`${sem} ${dept.code}-${section} H-att`}
                      href="#"
                      variant="secondary"
                    />
                  ))
                ))}
              </div>
            </SectionCard>

            {/* 10. Monthly Attendance */}
            <SectionCard title="Monthly Attendance" icon={Calendar}>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2 md:gap-3">
                {["3-2", "2-2"].map((sem) => (
                  sections.map((section) => (
                    <ActionButton 
                      key={`monthly-${sem}-${section}`}
                      label={`${sem} ${dept.code}-${section} M-att`}
                      href="#"
                      variant="secondary"
                    />
                  ))
                ))}
              </div>
            </SectionCard>

            {/* 11. Time Tables */}
            <SectionCard title="Time Tables" icon={Calendar}>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 md:gap-3">
                {["2-2", "3-2"].map((sem) => (
                  <ActionButton 
                    key={`tt-${sem}`}
                    label={`${sem} ${dept.code} - TT`}
                    href="#"
                    variant="secondary"
                  />
                ))}
              </div>
            </SectionCard>

            {/* 12. Mentors */}
            <SectionCard title="Mentors" icon={Users}>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2 md:gap-3">
                {["4-2", "3-2", "2-2"].map((sem) => (
                  <ActionButton 
                    key={`mentors-${sem}`}
                    label={`${sem} ${dept.code} Mentors`}
                    href="#"
                    variant="secondary"
                  />
                ))}
              </div>
            </SectionCard>

            {/* 13. Nominal Rolls */}
            <SectionCard title="Nominal Rolls" icon={Users}>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2 md:gap-3">
                {["4-2", "3-2", "2-2"].map((sem) => (
                  <ActionButton 
                    key={`nominal-${sem}`}
                    label={`${sem} ${dept.code} Rolls`}
                    href="#"
                    variant="secondary"
                  />
                ))}
              </div>
            </SectionCard>

            {/* 14. Academic Calendars */}
            <SectionCard title="Academic Calendars" icon={Calendar}>
              <ActionButton label="Academic Calendars" href="/documents/II_Year_Academic_calendar_24-25_NRIIT.pdf" variant="secondary" />
            </SectionCard>

            {/* 15. Syllabus */}
            <SectionCard title={`Syllabus`} icon={BookOpen}>
              <SectionGrid items={[
                { label: `R23-Autonomous-${dept.code}-Syllabus`, href: "/documents/CSE-DS-Syllabus.pdf", variant: "secondary" as const },
                { label: `R20-JNTUK-${dept.code}-Syllabus`, href: "/documents/CSE-DS-3rd-Year-Syllabus.pdf", variant: "secondary" as const },
              ]} columns={2} />
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
