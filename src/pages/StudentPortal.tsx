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
              </>
            )}

            {/* ============ COMMON SECTIONS FOR ALL BRANCHES ============ */}

            {/* Results - All Branches */}
            <PortalSection 
              title="Results" 
              icon={<Award className="w-5 h-5" />}
            >
              <p className="text-sm text-muted-foreground mb-4">
                View semester-wise examination results
              </p>
              <YearAccordion years={generateSectionData(`/department/${deptId}/results`)} />
            </PortalSection>

            {/* Hourly Attendance */}
            <PortalSection 
              title="Hourly Attendance" 
              icon={<Calendar className="w-5 h-5" />}
            >
              <YearAccordion years={generateSectionData(attendancePath)} />
            </PortalSection>

            {/* Monthly Cumulative Attendance */}
            <PortalSection 
              title="Monthly Cumulative Attendance" 
              icon={<ClipboardList className="w-5 h-5" />}
            >
              <YearAccordion years={generateSectionData(`/department/${deptId}/monthly-attendance`)} />
            </PortalSection>

            {/* Time Tables */}
            <PortalSection 
              title="Time Tables" 
              icon={<Clock className="w-5 h-5" />}
            >
              <YearAccordion years={generateSectionData(timetablePath)} />
            </PortalSection>

            {/* ============ CSE ONLY - BOTTOM SECTIONS ============ */}
            {isFullFeatureBranch && (
              <>
                {/* ST Marks */}
                <PortalSection 
                  title="ST Marks" 
                  icon={<FileCheck className="w-5 h-5" />}
                >
                  <YearAccordion years={generateSectionData(`/department/${deptId}/st-marks`)} />
                </PortalSection>

                {/* Feedback */}
                <PortalSection 
                  title="Feedback" 
                  icon={<MessageSquare className="w-5 h-5" />}
                >
                  <YearAccordion years={generateSectionData(`/department/${deptId}/feedback`)} />
                </PortalSection>
              </>
            )}

            {/* Syllabus - All Branches */}
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
