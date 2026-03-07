import { useState, useEffect, useCallback, lazy, Suspense } from "react";
import { useParams, Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowLeft, TrendingUp, Users, Search, X, UserSearch, Sparkles, GraduationCap } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import MobileBottomNav from "@/components/layout/MobileBottomNav";
import { getBackendClient } from "@/integrations/backend/client";

const AttendanceCharts = lazy(() => import("@/components/analytics/AttendanceCharts"));
const ResultsCharts = lazy(() => import("@/components/analytics/ResultsCharts"));
const DataInterpretation = lazy(() => import("@/components/analytics/DataInterpretation"));

const departments: Record<string, { name: string; code: string }> = {
  cse: { name: "Computer Science & Engineering", code: "CSE" },
  it: { name: "Information Technology", code: "IT" },
  ds: { name: "Data Science", code: "DS" },
  aids: { name: "AI & Data Science", code: "DS" },
};

interface StudentData {
  id: string;
  roll_number: string;
  name: string;
  branch: string;
  semester: string;
  section: string;
  monthly_attendance: Record<string, number>;
  monthly_results: Record<string, number>;
}

const getAvg = (data: Record<string, number>) => {
  const vals = Object.values(data || {});
  return vals.length ? Math.round(vals.reduce((a, b) => a + Number(b), 0) / vals.length) : 0;
};

const getAttendanceColor = (v: number) => v >= 90 ? "text-green-600" : v >= 75 ? "text-blue-600" : "text-red-600";
const getResultColor = (v: number) => v >= 85 ? "text-green-600" : v >= 70 ? "text-blue-600" : "text-red-600";
const getAttendanceBg = (v: number) => v >= 90 ? "bg-green-500" : v >= 75 ? "bg-blue-500" : "bg-red-500";

const MiniSparkline = ({ data, color }: { data: Record<string, number>; color: string }) => {
  const MONTHS = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];
  const values = MONTHS.filter(m => data[m] !== undefined).map(m => data[m]);
  if (values.length < 2) return null;
  
  const max = Math.max(...values);
  const min = Math.min(...values);
  const range = max - min || 1;
  const w = 60;
  const h = 20;
  const points = values.map((v, i) => `${(i / (values.length - 1)) * w},${h - ((v - min) / range) * h}`).join(" ");
  
  return (
    <svg width={w} height={h} className="opacity-60">
      <polyline fill="none" stroke={color} strokeWidth="1.5" points={points} />
    </svg>
  );
};

const SectionAnalytics = () => {
  const { deptId, section } = useParams<{ deptId: string; section: string }>();
  const dept = deptId ? departments[deptId] : null;

  const [students, setStudents] = useState<StudentData[]>([]);
  const [filteredStudents, setFilteredStudents] = useState<StudentData[]>([]);
  const [selectedStudent, setSelectedStudent] = useState<StudentData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [error, setError] = useState("");

  const parsedSection = section ? (() => {
    const parts = section.split("-");
    if (parts.length >= 4) {
      return {
        semester: `${parts[0]}-${parts[1]}`,
        sectionLetter: parts[parts.length - 1],
        label: section.replace(/-/g, " "),
      };
    }
    return { semester: "", sectionLetter: "", label: section };
  })() : null;

  useEffect(() => {
    const fetchStudents = async () => {
      if (!dept || !parsedSection) return;
      setIsLoading(true);
      setError("");

      try {
        const supabase = getBackendClient();
        const { data, error: dbError } = await supabase
          .from("student_analytics")
          .select("*")
          .eq("branch", dept.code)
          .eq("semester", parsedSection.semester)
          .eq("section", parsedSection.sectionLetter)
          .order("roll_number", { ascending: true });

        if (dbError) throw dbError;
        const studentData = (data || []) as StudentData[];
        setStudents(studentData);
        setFilteredStudents(studentData);
      } catch (err: any) {
        console.error(err);
        setError("Failed to load student data.");
      } finally {
        setIsLoading(false);
      }
    };

    fetchStudents();
  }, [dept, parsedSection?.semester, parsedSection?.sectionLetter]);

  // Enhanced search: full roll number, partial, last digits, name
  useEffect(() => {
    const q = searchQuery.trim().toLowerCase();
    if (!q) {
      setFilteredStudents(students);
      return;
    }

    setFilteredStudents(
      students.filter((s) => {
        const roll = s.roll_number.toLowerCase();
        const name = s.name.toLowerCase();
        // Full match
        if (roll === q || name === q) return true;
        // Contains match
        if (roll.includes(q) || name.includes(q)) return true;
        // Last digits match (numeric only)
        if (/^\d+$/.test(q)) {
          const rollDigits = roll.replace(/\D/g, "");
          return rollDigits.endsWith(q);
        }
        return false;
      })
    );
  }, [searchQuery, students]);

  const handleStudentSelect = useCallback((student: StudentData) => {
    setSelectedStudent(student);
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, []);

  if (!dept || !parsedSection) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4 text-foreground">Section Not Found</h1>
          <Link to="/" className="text-primary hover:underline">Return Home</Link>
        </div>
      </div>
    );
  }

  const sectionLabel = section?.replace(/-/g, " ") || "";

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="pt-20 pb-24 md:pb-12">
        <div className="container mx-auto px-4 md:px-6 lg:px-8 max-w-6xl">
          {/* Hero Header */}
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="mb-8"
          >
            <Link
              to={`/department/${deptId}/student-portal`}
              className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground mb-4 transition-colors text-sm"
            >
              <ArrowLeft className="w-4 h-4" />
              Back to Student Portal
            </Link>

            <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-primary/10 via-primary/5 to-transparent border border-primary/20 p-6 md:p-8">
              <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 rounded-full -translate-y-1/2 translate-x-1/2" />
              <div className="absolute bottom-0 left-0 w-24 h-24 bg-primary/5 rounded-full translate-y-1/2 -translate-x-1/2" />
              
              <div className="relative flex items-start gap-4">
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ type: "spring", delay: 0.2 }}
                  className="w-12 h-12 md:w-14 md:h-14 rounded-2xl bg-primary/15 flex items-center justify-center shrink-0"
                >
                  <Sparkles className="w-6 h-6 md:w-7 md:h-7 text-primary" />
                </motion.div>
                <div>
                  <h1 className="text-xl md:text-3xl font-bold text-foreground mb-1">
                    {sectionLabel} Performance Analytics
                  </h1>
                  <p className="text-sm text-muted-foreground">{dept.name}</p>
                  <p className="text-xs text-muted-foreground mt-2">
                    AI-powered attendance trends, results visualization & performance insights for every student
                  </p>
                </div>
              </div>

              {!isLoading && students.length > 0 && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.4 }}
                  className="relative flex gap-4 mt-5 flex-wrap"
                >
                  <Badge variant="secondary" className="bg-background/80 backdrop-blur-sm">
                    <Users className="w-3 h-3 mr-1" /> {students.length} Students
                  </Badge>
                  <Badge variant="secondary" className="bg-background/80 backdrop-blur-sm">
                    <GraduationCap className="w-3 h-3 mr-1" /> Semester {parsedSection.semester}
                  </Badge>
                  <Badge variant="secondary" className="bg-background/80 backdrop-blur-sm">
                    <TrendingUp className="w-3 h-3 mr-1" /> Section {parsedSection.sectionLetter}
                  </Badge>
                </motion.div>
              )}
            </div>
          </motion.div>

          {/* Search */}
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="mb-6"
          >
            <Card className="shadow-sm">
              <CardContent className="p-4">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <Input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search by roll number, name, or last digits (e.g. 045, CSE045, John)..."
                    className="pl-10 pr-10 h-11"
                  />
                  {searchQuery && (
                    <button onClick={() => setSearchQuery("")} className="absolute right-3 top-1/2 -translate-y-1/2">
                      <X className="w-4 h-4 text-muted-foreground hover:text-foreground transition-colors" />
                    </button>
                  )}
                </div>
                <div className="flex items-center justify-between mt-2">
                  <p className="text-xs text-muted-foreground">
                    {filteredStudents.length} student{filteredStudents.length !== 1 ? "s" : ""} found
                  </p>
                  {searchQuery && (
                    <button onClick={() => setSearchQuery("")} className="text-xs text-primary hover:underline">
                      Clear search
                    </button>
                  )}
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* Loading */}
          {isLoading && (
            <div className="space-y-3">
              {[1, 2, 3, 4, 5].map((i) => (
                <Skeleton key={i} className="h-20 w-full rounded-xl" />
              ))}
            </div>
          )}

          {/* Error */}
          {error && !isLoading && (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="text-center py-16"
            >
              <p className="text-destructive">{error}</p>
            </motion.div>
          )}

          {/* Empty State */}
          {!isLoading && !error && students.length === 0 && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-center py-20"
            >
              <motion.div
                animate={{ y: [0, -8, 0] }}
                transition={{ repeat: Infinity, duration: 3, ease: "easeInOut" }}
              >
                <Users className="w-20 h-20 text-muted-foreground/40 mx-auto mb-6" />
              </motion.div>
              <h3 className="text-xl font-semibold text-foreground mb-2">No Student Data Yet</h3>
              <p className="text-sm text-muted-foreground max-w-md mx-auto">
                Analytics data for {sectionLabel} will appear here once attendance and results are uploaded by faculty.
              </p>
            </motion.div>
          )}

          {/* Student List & Charts */}
          {!isLoading && !error && students.length > 0 && (
            <div className="space-y-4">
              {/* Student Cards */}
              {!selectedStudent && (
                <AnimatePresence mode="popLayout">
                  {filteredStudents.length === 0 && searchQuery && (
                    <motion.div
                      initial={{ opacity: 0, scale: 0.95 }}
                      animate={{ opacity: 1, scale: 1 }}
                      className="text-center py-16"
                    >
                      <UserSearch className="w-14 h-14 text-muted-foreground/40 mx-auto mb-4" />
                      <h3 className="text-lg font-semibold text-foreground mb-1">No Match Found</h3>
                      <p className="text-sm text-muted-foreground">
                        No student matching "{searchQuery}" in this section. Try full roll number or last digits.
                      </p>
                    </motion.div>
                  )}
                  
                  {filteredStudents.map((student, index) => {
                    const avgAtt = getAvg(student.monthly_attendance);
                    const avgRes = getAvg(student.monthly_results);

                    return (
                      <motion.div
                        key={student.id}
                        layout
                        initial={{ opacity: 0, y: 15 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.95 }}
                        transition={{ delay: Math.min(index * 0.02, 0.3) }}
                      >
                        <Card
                          className="cursor-pointer hover:shadow-lg transition-all duration-300 hover:border-primary/40 group overflow-hidden"
                          onClick={() => handleStudentSelect(student)}
                        >
                          <CardContent className="p-4 md:p-5">
                            <div className="flex items-center justify-between gap-3">
                              {/* Left: Avatar + Info */}
                              <div className="flex items-center gap-3 min-w-0">
                                <div className="relative shrink-0">
                                  <div className="w-11 h-11 rounded-full bg-primary flex items-center justify-center group-hover:scale-105 transition-transform">
                                    <span className="text-sm font-bold text-primary-foreground">
                                      {student.name[0]?.toUpperCase()}
                                    </span>
                                  </div>
                                  {/* Status dot */}
                                  <div className={`absolute -bottom-0.5 -right-0.5 w-3.5 h-3.5 rounded-full border-2 border-background ${getAttendanceBg(avgAtt)}`} />
                                </div>
                                <div className="min-w-0">
                                  <p className="font-semibold text-foreground truncate group-hover:text-primary transition-colors">
                                    {student.name}
                                  </p>
                                  <p className="text-xs text-muted-foreground font-mono">{student.roll_number}</p>
                                </div>
                              </div>

                              {/* Right: Stats + Sparkline */}
                              <div className="flex items-center gap-4 shrink-0">
                                <div className="hidden sm:block">
                                  <MiniSparkline
                                    data={student.monthly_attendance}
                                    color={avgAtt >= 90 ? "#16a34a" : avgAtt >= 75 ? "#2563eb" : "#dc2626"}
                                  />
                                </div>
                                <div className="text-right space-y-0.5">
                                  <div className="flex items-center gap-2 justify-end">
                                    <span className="text-[10px] uppercase tracking-wider text-muted-foreground">Att</span>
                                    <span className={`text-sm font-bold tabular-nums ${getAttendanceColor(avgAtt)}`}>
                                      {avgAtt}%
                                    </span>
                                  </div>
                                  <div className="flex items-center gap-2 justify-end">
                                    <span className="text-[10px] uppercase tracking-wider text-muted-foreground">Res</span>
                                    <span className={`text-sm font-bold tabular-nums ${getResultColor(avgRes)}`}>
                                      {avgRes}
                                    </span>
                                  </div>
                                </div>
                                <ArrowLeft className="w-4 h-4 text-muted-foreground rotate-180 opacity-0 group-hover:opacity-100 transition-opacity" />
                              </div>
                            </div>
                          </CardContent>
                        </Card>
                      </motion.div>
                    );
                  })}
                </AnimatePresence>
              )}

              {/* Selected Student Detail */}
              {selectedStudent && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.4 }}
                  className="space-y-6"
                >
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setSelectedStudent(null)}
                    className="gap-2 hover:bg-primary/5"
                  >
                    <ArrowLeft className="w-4 h-4" />
                    Back to Student List
                  </Button>

                  {/* Student Info Card */}
                  <motion.div
                    initial={{ opacity: 0, y: 15 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 }}
                  >
                    <Card className="overflow-hidden">
                      <div className="h-1.5 bg-gradient-to-r from-primary via-primary/70 to-primary/40" />
                      <CardContent className="p-5 md:p-6">
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                          <div className="flex items-center gap-4">
                            <motion.div
                              initial={{ scale: 0 }}
                              animate={{ scale: 1 }}
                              transition={{ type: "spring", delay: 0.2 }}
                              className="w-14 h-14 rounded-2xl bg-primary flex items-center justify-center"
                            >
                              <span className="text-xl font-bold text-primary-foreground">
                                {selectedStudent.name[0]?.toUpperCase()}
                              </span>
                            </motion.div>
                            <div>
                              <h2 className="text-xl md:text-2xl font-bold text-foreground">{selectedStudent.name}</h2>
                              <p className="text-sm text-muted-foreground font-mono">
                                {selectedStudent.roll_number}
                              </p>
                              <div className="flex gap-2 mt-1.5 flex-wrap">
                                <Badge variant="secondary" className="text-xs">
                                  {selectedStudent.branch}
                                </Badge>
                                <Badge variant="secondary" className="text-xs">
                                  Sem {selectedStudent.semester}
                                </Badge>
                                <Badge variant="secondary" className="text-xs">
                                  Section {selectedStudent.section}
                                </Badge>
                              </div>
                            </div>
                          </div>

                          {/* Quick Stats */}
                          <div className="flex gap-4 sm:gap-6">
                            <motion.div
                              initial={{ opacity: 0, y: 10 }}
                              animate={{ opacity: 1, y: 0 }}
                              transition={{ delay: 0.3 }}
                              className="text-center"
                            >
                              <p className="text-xs text-muted-foreground mb-0.5">Attendance</p>
                              <p className={`text-2xl font-bold ${getAttendanceColor(getAvg(selectedStudent.monthly_attendance))}`}>
                                {getAvg(selectedStudent.monthly_attendance)}%
                              </p>
                            </motion.div>
                            <motion.div
                              initial={{ opacity: 0, y: 10 }}
                              animate={{ opacity: 1, y: 0 }}
                              transition={{ delay: 0.4 }}
                              className="text-center"
                            >
                              <p className="text-xs text-muted-foreground mb-0.5">Results</p>
                              <p className={`text-2xl font-bold ${getResultColor(getAvg(selectedStudent.monthly_results))}`}>
                                {getAvg(selectedStudent.monthly_results)}
                              </p>
                            </motion.div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </motion.div>

                  {/* Charts */}
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3 }}
                  >
                    <Tabs defaultValue="attendance" className="w-full">
                      <TabsList className="grid w-full grid-cols-2 max-w-md">
                        <TabsTrigger value="attendance" className="gap-1.5">📊 Attendance</TabsTrigger>
                        <TabsTrigger value="results" className="gap-1.5">📈 Results</TabsTrigger>
                      </TabsList>

                      <TabsContent value="attendance" className="mt-6 space-y-6">
                        <Suspense fallback={<Skeleton className="h-64 w-full rounded-xl" />}>
                          <AttendanceCharts data={selectedStudent.monthly_attendance} />
                          <DataInterpretation type="attendance" data={selectedStudent.monthly_attendance} />
                        </Suspense>
                      </TabsContent>

                      <TabsContent value="results" className="mt-6 space-y-6">
                        <Suspense fallback={<Skeleton className="h-64 w-full rounded-xl" />}>
                          <ResultsCharts data={selectedStudent.monthly_results} />
                          <DataInterpretation type="results" data={selectedStudent.monthly_results} />
                        </Suspense>
                      </TabsContent>
                    </Tabs>
                  </motion.div>
                </motion.div>
              )}
            </div>
          )}
        </div>
      </main>
      <Footer />
      <MobileBottomNav />
    </div>
  );
};

export default SectionAnalytics;
