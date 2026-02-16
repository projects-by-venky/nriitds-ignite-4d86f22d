import { useParams, Link, useNavigate } from "react-router-dom";
import { 
  FileText, BookOpen, Calendar, ClipboardList, Award, 
  GraduationCap, Beaker, FolderOpen, ArrowLeft, Users,
  FileCheck, Clock, BookMarked, Leaf, MessageSquare, ShieldCheck, BarChart3
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
  aids: { name: "AI & Data Science", code: "DS", fullName: "Department of Artificial Intelligence & Data Science" },
  ece: { name: "Electronics & Communication", code: "ECE", fullName: "Department of Electronics & Communication Engineering" },
  eee: { name: "Electrical & Electronics", code: "EEE", fullName: "Department of Electrical & Electronics Engineering" },
  mech: { name: "Mechanical Engineering", code: "MECH", fullName: "Department of Mechanical Engineering" },
  civil: { name: "Civil Engineering", code: "CIVIL", fullName: "Department of Civil Engineering" },
  mba: { name: "Business Administration", code: "MBA", fullName: "Department of Business Administration" },
  mca: { name: "Computer Applications", code: "MCA", fullName: "Department of Computer Applications" }
};

// Branches with full sections (CSE-specific)
const fullFeatureBranches = ["cse"];

// Branches with limited sections (IT, DS)
const limitedFeatureBranches = ["it", "ds", "aids"];

const StudentPortal = () => {
  const { deptId } = useParams<{ deptId: string }>();
  const navigate = useNavigate();
  const dept = deptId ? departments[deptId as keyof typeof departments] : null;
  const deptCode = dept?.code || "CSE";

  const isFullFeatureBranch = fullFeatureBranches.includes(deptId || "");
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
                {/* 1. Achievers & Improvers Batch */}
                <PortalSection 
                  title="Achievers & Improvers Batch" 
                  icon={<Award className="w-5 h-5" />}
                >
                  <p className="text-sm text-muted-foreground mb-4">
                    View batch-wise academic performance information
                  </p>
                  <SectionGrid 
                    items={[
                      { label: "Achievers Batch", variant: "primary" },
                      { label: "Improvers Batch", variant: "secondary" },
                    ]}
                    columns={2}
                  />
                </PortalSection>

                {/* 2. ES Notes */}
                <PortalSection 
                  title="ES – Environmental Science Notes" 
                  icon={<Leaf className="w-5 h-5" />}
                >
                  <p className="text-sm text-muted-foreground mb-4">
                    Access Environmental Science study materials
                  </p>
                  <PortalButton 
                    label="Download ES Notes" 
                    variant="primary"
                  />
                </PortalSection>

                {/* 3. Community Service Project (CSP) */}
                <PortalSection 
                  title="Community Service Project (CSP)" 
                  icon={<Users className="w-5 h-5" />}
                >
                  <p className="text-sm text-muted-foreground mb-4">
                    CSP reports, PPT references, and guidelines
                  </p>
                  <SectionGrid 
                    items={[
                      { label: "Sample Reports", variant: "secondary" },
                      { label: "PPT References", variant: "secondary" },
                      { label: "CSP Guidelines", variant: "primary" },
                    ]}
                    columns={3}
                  />
                </PortalSection>

                {/* 4. Self-Learning (ST) & Assignment Questions */}
                <PortalSection 
                  title="Self-Learning (ST) & Assignment Questions" 
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
                            { label: "CS601 - CN" },
                            { label: "CS602 - CD" },
                            { label: "CS603 - AI" },
                          ] 
                        },
                      ]
                    },
                    {
                      year: "4th Year",
                      semesters: [
                        { 
                          semester: "4-1 Semester", 
                          items: [
                            { label: "CS701 - ML" },
                            { label: "CS702 - CC" },
                            { label: "Elective I" },
                          ] 
                        },
                      ]
                    },
                  ]} />
                </PortalSection>

                {/* 5. Major Project */}
                <PortalSection 
                  title="Major Project" 
                  icon={<GraduationCap className="w-5 h-5" />}
                >
                  <p className="text-sm text-muted-foreground mb-4">
                    Project review schedules, submissions, and status tracking
                  </p>
                  <SectionGrid 
                    items={[
                      { label: "Project Review Schedules", variant: "primary" },
                      { label: "PPT Upload Links", variant: "secondary" },
                      { label: "Abstract Submission", variant: "secondary" },
                      { label: "Title Submission", variant: "secondary" },
                      { label: "Project Status Check", variant: "secondary" },
                    ]}
                    columns={3}
                  />
                </PortalSection>

                {/* Student Guidelines */}
                <PortalSection 
                  title="Student Guidelines" 
                  icon={<ShieldCheck className="w-5 h-5" />}
                >
                  <p className="text-sm text-muted-foreground mb-4">
                    Click here to access the student guidelines
                  </p>
                  <PortalButton 
                    label="View Student Guidelines" 
                    href="/documents/Guidelines_Student_DS.pdf"
                    variant="primary"
                  />
                </PortalSection>

                {/* Mid Exams Time Tables & QBank */}
                <PortalSection 
                  title="Mid Exams-Time Tables & QBank" 
                  icon={<BarChart3 className="w-5 h-5" />}
                >
                  <p className="text-sm text-muted-foreground mb-4">
                    Mid exam time tables and question bank
                  </p>
                  <YearAccordion years={generateSectionData(`/department/${deptId}/mid-tt-qb`)} />
                </PortalSection>

                {/* 8. ST Marks - CSE Only */}
                <PortalSection 
                  title="ST Marks" 
                  icon={<FileCheck className="w-5 h-5" />}
                >
                  <p className="text-sm text-muted-foreground mb-4">
                    Subject-wise, section-wise, semester-wise ST marks
                  </p>
                  <YearAccordion years={generateSectionData(`/department/${deptId}/st-marks`)} />
                </PortalSection>

                {/* Feedback */}
                <PortalSection 
                  title="Feedback" 
                  icon={<MessageSquare className="w-5 h-5" />}
                >
                  <p className="text-sm text-muted-foreground mb-4">
                    Submit your feedback for courses
                  </p>
                  <YearAccordion years={generateSectionData(`/department/${deptId}/feedback`)} />
                </PortalSection>
              </>
            )}

            {/* ============ COMMON SECTIONS FOR ALL (CSE, IT, DS) ============ */}
            
            {/* 6. Assignment Marks */}
            <PortalSection 
              title="Assignment Marks" 
              icon={<ClipboardList className="w-5 h-5" />}
            >
              <p className="text-sm text-muted-foreground mb-4">
                Semester-wise and section-wise assignment marks
              </p>
              <YearAccordion years={generateSectionData(`/department/${deptId}/assignment-marks`)} />
            </PortalSection>

            {/* 7. Mid Examinations */}
            <PortalSection 
              title="Mid Marks" 
              icon={<FileText className="w-5 h-5" />}
            >
              <div className="space-y-6">
                {/* Mid Exam Time Tables */}
                <div>
                  <h4 className="text-sm font-semibold text-foreground mb-3 flex items-center gap-2">
                    <Clock className="w-4 h-4 text-primary" />
                    Mid Exam Time Tables
                  </h4>
                  <YearAccordion years={generateSectionData(`/department/${deptId}/mid-timetable`)} />
                </div>

                {/* Mid Marks */}
                <div className="pt-4 border-t border-border">
                  <h4 className="text-sm font-semibold text-foreground mb-3 flex items-center gap-2">
                    <FileCheck className="w-4 h-4 text-primary" />
                    Mid Marks
                  </h4>
                  <YearAccordion years={generateSectionData(`/department/${deptId}/mid-marks`)} />
                </div>
              </div>
            </PortalSection>

            {/* ============ ADDITIONAL SECTIONS (ALL BRANCHES) ============ */}
            
            {/* Subject Notes */}
            <PortalSection 
              title="Subject Notes & Materials" 
              icon={<FolderOpen className="w-5 h-5" />}
            >
              <p className="text-sm text-muted-foreground mb-4">
                Access lecture notes and study materials
              </p>
              <YearAccordion years={[
                {
                  year: "1st Year",
                  semesters: [
                    { semester: "1-1 Semester", items: [{ label: `1-1 ${deptCode} Notes`, to: `/department/${deptId}/notes/1-1` }] },
                    { semester: "1-2 Semester", items: [{ label: `1-2 ${deptCode} Notes`, to: `/department/${deptId}/notes/1-2` }] },
                  ]
                },
                {
                  year: "2nd Year",
                  semesters: [
                    { semester: "2-1 Semester", items: [{ label: `2-1 ${deptCode} Notes`, to: `/department/${deptId}/notes/2-1` }] },
                    { semester: "2-2 Semester", items: [{ label: `2-2 ${deptCode} Notes`, to: `/department/${deptId}/notes/2-2` }] },
                  ]
                },
                {
                  year: "3rd Year",
                  semesters: [
                    { semester: "3-1 Semester", items: [{ label: `3-1 ${deptCode} Notes`, to: `/department/${deptId}/notes/3-1` }] },
                    { semester: "3-2 Semester", items: [{ label: `3-2 ${deptCode} Notes`, to: `/department/${deptId}/notes/3-2` }] },
                  ]
                },
                {
                  year: "4th Year",
                  semesters: [
                    { semester: "4-1 Semester", items: [{ label: `4-1 ${deptCode} Notes`, to: `/department/${deptId}/notes/4-1` }] },
                    { semester: "4-2 Semester", items: [{ label: `4-2 ${deptCode} Notes`, to: `/department/${deptId}/notes/4-2` }] },
                  ]
                },
              ]} />
            </PortalSection>

            {/* Hourly Attendance */}
            <PortalSection 
              title="Hourly Attendance" 
              icon={<Calendar className="w-5 h-5" />}
            >
              <p className="text-sm text-muted-foreground mb-4">
                View daily attendance records by section
              </p>
              <YearAccordion years={generateSectionData(attendancePath)} />
            </PortalSection>

            {/* Monthly Cumulative Attendance */}
            <PortalSection 
              title="Monthly Cumulative Attendance" 
              icon={<ClipboardList className="w-5 h-5" />}
            >
              <p className="text-sm text-muted-foreground mb-4">
                View monthly cumulative attendance by section
              </p>
              <YearAccordion years={generateSectionData(`/department/${deptId}/monthly-attendance`)} />
            </PortalSection>

            {/* Time Tables */}
            <PortalSection 
              title="Class Time Tables" 
              icon={<Clock className="w-5 h-5" />}
            >
              <p className="text-sm text-muted-foreground mb-4">
                Section-wise class schedules
              </p>
              <YearAccordion years={generateSectionData(timetablePath)} />
            </PortalSection>

            {/* Syllabus */}
            <PortalSection 
              title="Syllabus" 
              icon={<BookOpen className="w-5 h-5" />}
            >
              <p className="text-sm text-muted-foreground mb-4">
                R20 Regulation syllabus documents
              </p>
              <SectionGrid 
                items={[
                  { label: `${deptCode} Syllabus (1st & 2nd Year)`, href: "/documents/CSE-DS-Syllabus.pdf", variant: "secondary" },
                  { label: `${deptCode} Syllabus (3rd & 4th Year)`, href: "/documents/CSE-DS-3rd-Year-Syllabus.pdf", variant: "secondary" },
                ]}
                columns={2}
              />
            </PortalSection>

          </div>
        </div>
      </main>
      
      <Footer />
      <MobileBottomNav />
    </div>
  );
};

export default StudentPortal;
