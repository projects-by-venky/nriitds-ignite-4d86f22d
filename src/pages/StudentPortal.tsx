import { useParams, Link, useNavigate } from "react-router-dom";
import { 
  FileText, BookOpen, Calendar, ClipboardList, Award, 
  GraduationCap, Beaker, FolderOpen, ArrowLeft, Users,
  FileCheck, Clock, BookMarked, Leaf, MessageSquare, ShieldCheck, BarChart3, TrendingUp
} from "lucide-react";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import MobileBottomNav from "@/components/layout/MobileBottomNav";
import { PortalSection } from "@/components/portal/PortalSection";
import { PortalButton } from "@/components/portal/PortalButton";
import { YearAccordion } from "@/components/portal/YearAccordion";
import { SectionGrid } from "@/components/portal/SectionGrid";

// Department configurations
const departments: Record<string, { name: string; code: string; fullName: string }> = {
  cse: { name: "Computer Science & Engineering", code: "CSE", fullName: "Department of Computer Science & Engineering" },
  it: { name: "Information Technology", code: "IT", fullName: "Department of Information Technology" },
  ds: { name: "Data Science", code: "DS", fullName: "Department of Data Science" },
  aids: { name: "AI & Data Science", code: "DS", fullName: "Department of Data Science" },
  ece: { name: "Electronics & Communication", code: "ECE", fullName: "Department of Electronics & Communication Engineering" },
  eee: { name: "Electrical & Electronics", code: "EEE", fullName: "Department of Electrical & Electronics Engineering" },
  mech: { name: "Mechanical Engineering", code: "MECH", fullName: "Department of Mechanical Engineering" },
  civil: { name: "Civil Engineering", code: "CIVIL", fullName: "Department of Civil Engineering" },
  mba: { name: "Business Administration", code: "MBA", fullName: "Department of Business Administration" },
  mca: { name: "Computer Applications", code: "MCA", fullName: "Department of Computer Applications" }
};

// Branches with full sections (CSE-specific)
const fullFeatureBranches = ["cse"];

// Branches with DS/AIDS sections
const dsBranches = ["ds", "aids"];

// IT branch
const itBranches = ["it"];

// Branches with limited sections
const limitedFeatureBranches = ["ds", "aids"];

const StudentPortal = () => {
  const { deptId } = useParams<{ deptId: string }>();
  const navigate = useNavigate();
  const dept = deptId ? departments[deptId as keyof typeof departments] : null;
  const deptCode = dept?.code || "CSE";

  const isFullFeatureBranch = fullFeatureBranches.includes(deptId || "");
  const isDSBranch = dsBranches.includes(deptId || "");
  const isITBranch = itBranches.includes(deptId || "");
  const isLimitedBranch = limitedFeatureBranches.includes(deptId || "");

  if (!dept) {
    return (
      <div className="min-h-screen flex items-center justify-center px-4 bg-background">
        <div className="text-center">
          <h1 className="text-2xl md:text-4xl font-bold mb-4 text-foreground">Department Not Found</h1>
          <Link to="/" className="text-primary hover:underline">Return Home</Link>
        </div>
      </div>
    );
  }

  const sections = ["A", "B", "C"];

  // Generate section-wise data for different years
  const generateSectionData = (basePath: string, prefix: string = "") => [
    {
      year: "1st Year",
      semesters: [
        { semester: "1-1 Semester", items: sections.map(sec => ({ label: `1-1 ${deptCode}-${sec}`, to: `${basePath}/1-1-${deptCode}-${sec}` })) },
        { semester: "1-2 Semester", items: sections.map(sec => ({ label: `1-2 ${deptCode}-${sec}`, to: `${basePath}/1-2-${deptCode}-${sec}` })) },
      ]
    },
    {
      year: "2nd Year",
      semesters: [
        { semester: "2-1 Semester", items: sections.map(sec => ({ label: `2-1 ${deptCode}-${sec}`, to: `${basePath}/2-1-${deptCode}-${sec}` })) },
        { semester: "2-2 Semester", items: sections.map(sec => ({ label: `2-2 ${deptCode}-${sec}`, to: `${basePath}/2-2-${deptCode}-${sec}` })) },
      ]
    },
    {
      year: "3rd Year",
      semesters: [
        { semester: "3-1 Semester", items: sections.map(sec => ({ label: `3-1 ${deptCode}-${sec}`, to: `${basePath}/3-1-${deptCode}-${sec}` })) },
        { semester: "3-2 Semester", items: sections.map(sec => ({ label: `3-2 ${deptCode}-${sec}`, to: `${basePath}/3-2-${deptCode}-${sec}` })) },
      ]
    },
    {
      year: "4th Year",
      semesters: [
        { semester: "4-1 Semester", items: sections.map(sec => ({ label: `4-1 ${deptCode}-${sec}`, to: `${basePath}/4-1-${deptCode}-${sec}` })) },
        { semester: "4-2 Semester", items: sections.map(sec => ({ label: `4-2 ${deptCode}-${sec}`, to: `${basePath}/4-2-${deptCode}-${sec}` })) },
      ]
    },
  ];

  // Data paths
  const attendancePath = `/department/${deptId}/attendance`;
  const timetablePath = `/department/${deptId}/timetable`;
  const sectionAnalyticsPath = `/department/${deptId}/section-analytics`;

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <main className="pt-20 pb-24 md:pb-12">
        <div className="container mx-auto px-4 md:px-6 lg:px-8 max-w-5xl">
          {/* Header */}
          <div className="mb-8">
            <Link 
              to={`/department/${deptId}`}
              className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground mb-4 transition-colors text-sm"
            >
              <ArrowLeft className="w-4 h-4" />
              Back to Department
            </Link>
            
            <div className="border-b border-border pb-6">
              <p className="text-sm text-muted-foreground mb-1">NRI Institute of Technology, Guntur</p>
              <h1 className="text-2xl md:text-3xl font-bold text-foreground mb-2">
                Student Portal
              </h1>
              <p className="text-base md:text-lg text-primary font-medium">
                {dept.fullName}
              </p>
            </div>
          </div>

          {/* Content Sections */}
          <div className="space-y-4">
            
            {/* ============ CSE ONLY SECTIONS ============ */}
            {isFullFeatureBranch && (
              <>
                {/* 1. Achievers and Improvers Batches */}
                <PortalSection 
                  title="Achievers and Improvers Batches" 
                  icon={<Award className="w-5 h-5" />}
                >
                  <SectionGrid 
                    items={[
                      { label: "Achievers Batch", variant: "primary" },
                      { label: "Improvers Batch", variant: "secondary" },
                    ]}
                    columns={2}
                  />
                </PortalSection>

                {/* 2. ES-Notes */}
                <PortalSection 
                  title="ES-Notes" 
                  icon={<Leaf className="w-5 h-5" />}
                >
                  <PortalButton 
                    label="ES-Notes" 
                    variant="primary"
                  />
                </PortalSection>

                {/* 3. Community Service Project */}
                <PortalSection 
                  title="Community Service Project" 
                  icon={<Users className="w-5 h-5" />}
                >
                  <PortalButton 
                    label="CSP- Sample Reports and PPT" 
                    variant="primary"
                  />
                </PortalSection>

                {/* 4. Self-Learning ST & Assignment-Questions */}
                <PortalSection 
                  title="Self-Learning ST & Assignment-Questions" 
                  icon={<BookMarked className="w-5 h-5" />}
                >
                  <p className="text-sm text-muted-foreground mb-4">
                    Subject-wise and semester-wise ST questions and assignments
                  </p>
                  <YearAccordion years={[
                    {
                      year: "3rd Year",
                      semesters: [
                        { 
                          semester: "3-1 Semester", 
                          items: [
                            { label: "CS501 - DAA" },
                            { label: "CS502 - OS" },
                            { label: "CS503 - DBMS" },
                            { label: "CS504 - SE" },
                          ] 
                        },
                        { 
                          semester: "3-2 Semester", 
                          items: [
                            { label: "3-2-CC" },
                            { label: "3-2-CD" },
                            { label: "3-2-CNS" },
                            { label: "3-2-ML" },
                            { label: "3-2-MPMC" },
                            { label: "3-2-SPM" },
                          ] 
                        },
                      ]
                    },
                    {
                      year: "2nd Year",
                      semesters: [
                        { 
                          semester: "2-2 Semester", 
                          items: [
                            { label: "2-2-DBMS" },
                            { label: "2-2-MEFA" },
                            { label: "2-2-OS" },
                            { label: "2-2-P&S" },
                            { label: "2-2-SE" },
                          ] 
                        },
                      ]
                    },
                  ]} />
                </PortalSection>

                {/* 5. Lecture - Notes */}
                <PortalSection 
                  title="Lecture - Notes" 
                  icon={<BookOpen className="w-5 h-5" />}
                >
                  <PortalButton 
                    label="Click here to access Lecture Notes" 
                    variant="primary"
                  />
                </PortalSection>

                {/* 6. Student Guidelines */}
                <PortalSection 
                  title="Student Guidelines" 
                  icon={<ShieldCheck className="w-5 h-5" />}
                >
                  <PortalButton 
                    label="Click here to access the student guidelines" 
                    href="/documents/Guidelines_Student_DS.pdf"
                    variant="primary"
                  />
                </PortalSection>

                {/* 7. Major Project */}
                <PortalSection 
                  title="Major Project" 
                  icon={<GraduationCap className="w-5 h-5" />}
                >
                  <SectionGrid 
                    items={[
                      { label: "Project-Reviews Schedule", variant: "secondary" },
                      { label: "Upload Review PPT", variant: "secondary" },
                      { label: "Check your details", variant: "secondary" },
                      { label: "Titles", variant: "secondary" },
                      { label: "Abstracts", variant: "secondary" },
                      { label: "Post - Mini Project details", variant: "secondary" },
                    ]}
                    columns={3}
                  />
                </PortalSection>

                {/* 8. Mid-Marks */}
                <PortalSection 
                  title="Mid-Marks" 
                  icon={<FileText className="w-5 h-5" />}
                >
                  <YearAccordion years={generateSectionData(`/department/${deptId}/mid-marks`)} />
                </PortalSection>

                {/* 9. Mid exams-Time Tables & QBank */}
                <PortalSection 
                  title="Mid exams-Time Tables & QBank" 
                  icon={<BarChart3 className="w-5 h-5" />}
                >
                  <YearAccordion years={generateSectionData(`/department/${deptId}/mid-tt-qb`)} />
                </PortalSection>

                {/* 10. Hourly Attendance */}
                <PortalSection 
                  title="Hourly Attendance" 
                  icon={<Calendar className="w-5 h-5" />}
                >
                  <YearAccordion years={generateSectionData(attendancePath)} />
                </PortalSection>

                {/* 11. Monthly Cumulative Attendance */}
                <PortalSection 
                  title="Monthly Cumulative Attendance" 
                  icon={<ClipboardList className="w-5 h-5" />}
                >
                  <p className="text-xs text-muted-foreground mb-3">Click a section to view attendance data. Use "Analytics & Graphs" for visual charts.</p>
                  <YearAccordion years={generateSectionData(`/department/${deptId}/monthly-attendance`)} />
                  <div className="mt-4 pt-4 border-t border-border">
                    <p className="text-xs font-medium text-muted-foreground mb-2">📊 Section-wise Analytics & Graphs</p>
                    <YearAccordion years={generateSectionData(sectionAnalyticsPath)} />
                  </div>
                </PortalSection>
              </>
            )}

            {/* ============ DS/AIDS BRANCH - ORDERED SECTIONS ============ */}
            {isDSBranch && (
              <>
                {/* 1. Student Guidelines */}
                <PortalSection 
                  title="Student Guidelines" 
                  icon={<ShieldCheck className="w-5 h-5" />}
                >
                  <PortalButton 
                    label="Click here to access the Student Guidelines" 
                    href="/documents/Guidelines_Student_DS.pdf"
                    variant="primary"
                  />
                </PortalSection>

                {/* 2. Hourly Attendance */}
                <PortalSection 
                  title="Hourly Attendance" 
                  icon={<Calendar className="w-5 h-5" />}
                >
                  <YearAccordion years={generateSectionData(attendancePath)} />
                </PortalSection>

                {/* 3. Monthly Cumulative Attendance */}
                <PortalSection 
                  title="Monthly Cumulative Attendance" 
                  icon={<ClipboardList className="w-5 h-5" />}
                >
                  <YearAccordion years={generateSectionData(`/department/${deptId}/monthly-attendance`)} />
                  <div className="mt-4 pt-4 border-t border-border">
                    <p className="text-xs font-medium text-muted-foreground mb-2">📊 Section-wise Analytics & Graphs</p>
                    <YearAccordion years={generateSectionData(sectionAnalyticsPath)} />
                  </div>
                </PortalSection>

                {/* 4. Mid exams-Time Tables & Imp Questions */}
                <PortalSection 
                  title="Mid exams-Time Tables & Imp Questions" 
                  icon={<BarChart3 className="w-5 h-5" />}
                >
                  <YearAccordion years={generateSectionData(`/department/${deptId}/mid-tt-qb`)} />
                </PortalSection>

                {/* 5. Time Tables */}
                <PortalSection 
                  title="Time Tables" 
                  icon={<Clock className="w-5 h-5" />}
                >
                  <YearAccordion years={generateSectionData(timetablePath)} />
                </PortalSection>

                {/* 6. Results */}
                <PortalSection 
                  title="Results" 
                  icon={<Award className="w-5 h-5" />}
                >
                  <YearAccordion years={generateSectionData(`/department/${deptId}/results`)} />
                  <div className="mt-4 pt-4 border-t border-border">
                    <p className="text-xs font-medium text-muted-foreground mb-2">📈 Section-wise Results Analytics & Graphs</p>
                    <YearAccordion years={generateSectionData(sectionAnalyticsPath)} />
                  </div>
                </PortalSection>

                {/* 7. Syllabus */}
                <PortalSection 
                  title="Syllabus" 
                  icon={<BookOpen className="w-5 h-5" />}
                >
                  <SectionGrid 
                    items={[
                      { label: `R23 Autonomous B.Tech ${deptCode} Syllabus`, href: "/documents/CSE-DS-Syllabus.pdf", variant: "secondary" },
                      { label: `R20 JNTUK B.Tech ${deptCode} Syllabus`, href: "/documents/CSE-DS-3rd-Year-Syllabus.pdf", variant: "secondary" },
                    ]}
                    columns={2}
                  />
                </PortalSection>

                {/* 8. Feedback */}
                <PortalSection 
                  title="Feedback" 
                  icon={<MessageSquare className="w-5 h-5" />}
                >
                  <PortalButton 
                    label="Click here to submit Feedback" 
                    variant="primary"
                  />
                </PortalSection>
              </>
            )}

            {/* ============ IT BRANCH SECTIONS ============ */}
            {isITBranch && (
              <>
                {/* 1. Notice Board */}
                <PortalSection title="Notice Board" icon={<ClipboardList className="w-5 h-5" />}>
                  <PortalButton label="Find your monthly Co-Curriculars" variant="primary" />
                </PortalSection>

                {/* 2. Roadmap for IT Student */}
                <PortalSection title="Roadmap for IT Student" icon={<BookOpen className="w-5 h-5" />}>
                  <PortalButton label="Click here to access" variant="primary" />
                </PortalSection>

                {/* 3. Student Guidelines */}
                <PortalSection title="Student Guidelines" icon={<ShieldCheck className="w-5 h-5" />}>
                  <PortalButton label="IT Click here to access the student guidelines" href="/documents/Guidelines_Student_DS.pdf" variant="primary" />
                </PortalSection>

                {/* 4. Time Tables */}
                <PortalSection title="Time Tables" icon={<Clock className="w-5 h-5" />}>
                  <SectionGrid items={[
                    { label: "2 S(R23)_IT_Time table", variant: "secondary" },
                    { label: "3 S(R23)_IT_Time table", variant: "secondary" },
                    { label: "3-1_IT_Class table", variant: "secondary" },
                    { label: "4-1_IT_Class table", variant: "secondary" },
                  ]} columns={2} />
                </PortalSection>

                {/* 5. Academic Calendars */}
                <PortalSection title="Academic Calendars" icon={<Calendar className="w-5 h-5" />}>
                  <SectionGrid items={[
                    { label: "3-1_IT Academic Calendar", href: "/documents/II_Year_Academic_calendar_24-25_NRIIT.pdf", variant: "secondary" },
                    { label: "2-1 IT Academic Calendar", href: "/documents/II_Year_Academic_calendar_24-25_NRIIT.pdf", variant: "secondary" },
                    { label: "4-1 IT Academic Calendar", href: "/documents/II_Year_Academic_calendar_24-25_NRIIT.pdf", variant: "secondary" },
                  ]} columns={3} />
                </PortalSection>

                {/* 6. Syllabus */}
                <PortalSection title="Syllabus" icon={<BookOpen className="w-5 h-5" />}>
                  <SectionGrid items={[
                    { label: "R23(2-II) B.Tech_Syllabus", variant: "secondary" },
                    { label: "R20 B.Tech Syllabus", variant: "secondary" },
                    { label: "4(R) Yr B.Tech Syllabus", variant: "secondary" },
                  ]} columns={2} />
                </PortalSection>

                {/* 7. Daily Attendance */}
                <PortalSection title="Daily Attendance" icon={<Calendar className="w-5 h-5" />}>
                  <SectionGrid items={[
                    { label: "24KP_IT(A)_Daily Attendance", variant: "secondary" },
                    { label: "24KP_IT(B)_Daily Attendance", variant: "secondary" },
                    { label: "23KP_IT_Daily Attendance", variant: "secondary" },
                    { label: "22KP_IT_Daily Attendance", variant: "secondary" },
                  ]} columns={2} />
                </PortalSection>

                {/* 8. Monthly Attendance */}
                <PortalSection title="Monthly Attendance" icon={<ClipboardList className="w-5 h-5" />}>
                  <SectionGrid items={[
                    { label: "24KP_IT(A)_Monthly Attendance", variant: "secondary" },
                    { label: "24KP_IT(B)_Monthly Attendance", variant: "secondary" },
                    { label: "23KP_IT_Monthly Attendance", variant: "secondary" },
                    { label: "22KP_IT_Monthly Attendance", variant: "secondary" },
                  ]} columns={2} />
                  <div className="mt-4 pt-4 border-t border-border">
                    <p className="text-xs font-medium text-muted-foreground mb-2">📊 Section-wise Analytics & Graphs</p>
                    <YearAccordion years={generateSectionData(sectionAnalyticsPath)} />
                  </div>
                </PortalSection>

                {/* 9. Mid Marks */}
                <PortalSection title="Mid Marks" icon={<FileText className="w-5 h-5" />}>
                  <SectionGrid items={[
                    { label: "24KP_IT(A)_Mid Marks", variant: "secondary" },
                    { label: "24KP_IT(B)_Mid Marks", variant: "secondary" },
                    { label: "23KP_IT_Mid Marks", variant: "secondary" },
                    { label: "22KP_IT_Mid Marks", variant: "secondary" },
                  ]} columns={2} />
                </PortalSection>

                {/* 10. Assignment Marks */}
                <PortalSection title="Assignment Marks" icon={<FileText className="w-5 h-5" />}>
                  <SectionGrid items={[
                    { label: "24KP_IT(A)_Assignment Marks", variant: "secondary" },
                    { label: "24KP_IT(B)_IT_Assignment Marks", variant: "secondary" },
                    { label: "23KP_IT_Assignment Marks", variant: "secondary" },
                    { label: "22KP_IT_Assignment Marks", variant: "secondary" },
                  ]} columns={2} />
                </PortalSection>

                {/* 11. Slip Test Marks */}
                <PortalSection title="Slip Test Marks" icon={<Award className="w-5 h-5" />}>
                  <SectionGrid items={[
                    { label: "24KP_IT(A)_Slip Test Marks", variant: "secondary" },
                    { label: "24KP_IT(B)_Slip Test Marks", variant: "secondary" },
                    { label: "22KP_IT_Slip Test Marks", variant: "secondary" },
                    { label: "23KP_IT_Slip Test Marks", variant: "secondary" },
                  ]} columns={2} />
                </PortalSection>

                {/* 12. Student Clubs */}
                <PortalSection title="Student Clubs" icon={<Users className="w-5 h-5" />}>
                  <SectionGrid items={[
                    { label: "Technical Club", variant: "primary" },
                    { label: "Culture Club", variant: "primary" },
                  ]} columns={2} />
                </PortalSection>

                {/* 13. Mentor List */}
                <PortalSection title="Mentor List" icon={<Users className="w-5 h-5" />}>
                  <SectionGrid items={[
                    { label: "24KP_IT(A)_Mentor List", variant: "secondary" },
                    { label: "24KP_IT(B)_Mentor List", variant: "secondary" },
                    { label: "23KP_IT_Mentor List", variant: "secondary" },
                    { label: "22KP(R)_Mentor List", variant: "secondary" },
                  ]} columns={2} />
                </PortalSection>

                {/* 14. Results */}
                <PortalSection title="Results" icon={<Award className="w-5 h-5" />}>
                  <SectionGrid items={[
                    { label: "24KP_IT_Results", variant: "secondary" },
                    { label: "23KP_IT_Results", variant: "secondary" },
                    { label: "22KP_IT_Results", variant: "secondary" },
                  ]} columns={3} />
                  <div className="mt-4 pt-4 border-t border-border">
                    <p className="text-xs font-medium text-muted-foreground mb-2">📈 Section-wise Results Analytics & Graphs</p>
                    <YearAccordion years={generateSectionData(sectionAnalyticsPath)} />
                  </div>
                </PortalSection>

                {/* 15. Feedback */}
                <PortalSection title="Feedback" icon={<MessageSquare className="w-5 h-5" />}>
                  <SectionGrid items={[
                    { label: "24KP_IT_Feedback", variant: "secondary" },
                    { label: "23KP_IT_Feedback", variant: "secondary" },
                    { label: "22KP_IT_Feedback", variant: "secondary" },
                    { label: "E_DTP_Feedback", variant: "secondary" },
                  ]} columns={3} />
                </PortalSection>

                {/* 16. Technical Events */}
                <PortalSection title="Technical Events" icon={<GraduationCap className="w-5 h-5" />}>
                  <SectionGrid items={[
                    { label: "Technical event videos", variant: "secondary" },
                    { label: "Technical Events Calendar", variant: "secondary" },
                  ]} columns={2} />
                </PortalSection>

                {/* 17. 3-2(R20) Materials (JNTUK) */}
                <PortalSection title="3-2(R20) Materials (JNTUK)" icon={<FolderOpen className="w-5 h-5" />}>
                  <SectionGrid items={[
                    { label: "ML", variant: "secondary" },
                    { label: "DDA", variant: "secondary" },
                    { label: "CNS", variant: "secondary" },
                    { label: "SP", variant: "secondary" },
                    { label: "ICT Applications", variant: "secondary" },
                    { label: "ADMS", variant: "secondary" },
                  ]} columns={3} />
                </PortalSection>

                {/* 18. 2-2(R23) Materials (Autonomous) */}
                <PortalSection title="2-2(R23) Materials (Autonomous)" icon={<FolderOpen className="w-5 h-5" />}>
                  <SectionGrid items={[
                    { label: "OS", variant: "secondary" },
                    { label: "P&S", variant: "secondary" },
                    { label: "ADS", variant: "secondary" },
                    { label: "DBMS", variant: "secondary" },
                    { label: "SE", variant: "secondary" },
                    { label: "EBS", variant: "secondary" },
                  ]} columns={3} />
                </PortalSection>

                {/* 19. JNTUK Previous Question Papers */}
                <PortalSection title="JNTUK Previous Question Papers" icon={<FileText className="w-5 h-5" />}>
                  <p className="text-sm text-muted-foreground mb-3 font-semibold">III -B.Tech-I_Sem</p>
                  <SectionGrid items={[
                    { label: "CN", variant: "secondary" },
                    { label: "NVA", variant: "secondary" },
                  ]} columns={3} />
                  <p className="text-sm text-muted-foreground mb-3 mt-4 font-semibold">III B.Tech-II_Sem</p>
                  <SectionGrid items={[
                    { label: "ML", variant: "secondary" },
                    { label: "DDA", variant: "secondary" },
                    { label: "CNS", variant: "secondary" },
                    { label: "SP", variant: "secondary" },
                    { label: "ICT Applications", variant: "secondary" },
                  ]} columns={3} />
                </PortalSection>
              </>
            )}

            {/* ============ COMMON SECTIONS FOR OTHER BRANCHES ============ */}
            {!isFullFeatureBranch && !isDSBranch && !isITBranch && (
              <>
                <PortalSection title="Results" icon={<Award className="w-5 h-5" />}>
                  <p className="text-sm text-muted-foreground mb-4">View semester-wise examination results</p>
                  <YearAccordion years={generateSectionData(`/department/${deptId}/results`)} />
                  <div className="mt-4 pt-4 border-t border-border">
                    <p className="text-xs font-medium text-muted-foreground mb-2">📈 Section-wise Results Analytics & Graphs</p>
                    <YearAccordion years={generateSectionData(sectionAnalyticsPath)} />
                  </div>
                </PortalSection>

                <PortalSection title="Hourly Attendance" icon={<Calendar className="w-5 h-5" />}>
                  <YearAccordion years={generateSectionData(attendancePath)} />
                </PortalSection>

                <PortalSection title="Monthly Cumulative Attendance" icon={<ClipboardList className="w-5 h-5" />}>
                  <YearAccordion years={generateSectionData(`/department/${deptId}/monthly-attendance`)} />
                  <div className="mt-4 pt-4 border-t border-border">
                    <p className="text-xs font-medium text-muted-foreground mb-2">📊 Section-wise Analytics & Graphs</p>
                    <YearAccordion years={generateSectionData(sectionAnalyticsPath)} />
                  </div>
                </PortalSection>

                <PortalSection title="Time Tables" icon={<Clock className="w-5 h-5" />}>
                  <YearAccordion years={generateSectionData(timetablePath)} />
                </PortalSection>

                <PortalSection title="Syllabus" icon={<BookOpen className="w-5 h-5" />}>
                  <SectionGrid items={[
                    { label: `R23 Autonomous B.Tech ${deptCode} Syllabus`, href: "/documents/CSE-DS-Syllabus.pdf", variant: "secondary" },
                    { label: `R20 JNTUK B.Tech ${deptCode} Syllabus`, href: "/documents/CSE-DS-3rd-Year-Syllabus.pdf", variant: "secondary" },
                  ]} columns={2} />
                </PortalSection>
              </>
            )}

            {/* ============ STUDENT ANALYTICS - ALL BRANCHES ============ */}
            <PortalSection 
              title="Student Analytics" 
              icon={<TrendingUp className="w-5 h-5" />}
            >
              <p className="text-sm text-muted-foreground mb-4">
                View attendance trends, results visualization, and personalized performance insights.
              </p>
              <PortalButton 
                label="Open Student Analytics Dashboard"
                to={`/department/${deptId}/student-analytics`}
                variant="primary"
              />
            </PortalSection>

            {/* Student Noticeboard - CSE Only */}
            {isFullFeatureBranch && (
              <PortalSection 
                title="Student Noticeboard" 
                icon={<ClipboardList className="w-5 h-5" />}
              >
                <PortalButton 
                  label="Click here to access the Student Noticeboard" 
                  variant="primary"
                />
              </PortalSection>
            )}

          </div>
        </div>
      </main>
      
      <Footer />
      <MobileBottomNav />
    </div>
  );
};

export default StudentPortal;
