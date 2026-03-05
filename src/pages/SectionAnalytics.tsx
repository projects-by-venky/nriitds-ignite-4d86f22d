import { useState, useEffect, lazy, Suspense } from "react";
import { useParams, Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowLeft, TrendingUp, Users, Search, X } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
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

const SectionAnalytics = () => {
  const { deptId, section } = useParams<{ deptId: string; section: string }>();
  const dept = deptId ? departments[deptId] : null;

  const [students, setStudents] = useState<StudentData[]>([]);
  const [filteredStudents, setFilteredStudents] = useState<StudentData[]>([]);
  const [selectedStudent, setSelectedStudent] = useState<StudentData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [error, setError] = useState("");

  // Parse section param (e.g., "2-2-CSE-A" → semester "2-2", section "A")
  const parsedSection = section ? (() => {
    const parts = section.split("-");
    if (parts.length >= 4) {
      return {
        semester: `${parts[0]}-${parts[1]}`,
        sectionLetter: parts[parts.length - 1],
        label: section.replace(/-/g, " ").replace(/(\w+)$/, "- $1").replace("- ", "-"),
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

  useEffect(() => {
    const q = searchQuery.trim().toLowerCase();
    if (!q) {
      setFilteredStudents(students);
    } else {
      setFilteredStudents(
        students.filter(
          (s) =>
            s.roll_number.toLowerCase().includes(q) ||
            s.name.toLowerCase().includes(q)
        )
      );
    }
  }, [searchQuery, students]);

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

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="pt-20 pb-24 md:pb-12">
        <div className="container mx-auto px-4 md:px-6 lg:px-8 max-w-5xl">
          {/* Header */}
          <div className="mb-8">
            <Link
              to={`/department/${deptId}/student-portal`}
              className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground mb-4 transition-colors text-sm"
            >
              <ArrowLeft className="w-4 h-4" />
              Back to Student Portal
            </Link>

            <div className="border-b border-border pb-6">
              <div className="flex items-center gap-3 mb-2">
                <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
                  <TrendingUp className="w-5 h-5 text-primary" />
                </div>
                <div>
                  <h1 className="text-2xl md:text-3xl font-bold text-foreground">
                    {section?.replace(/-/g, " ")} Analytics
                  </h1>
                  <p className="text-sm text-muted-foreground">{dept.name} · Monthly Attendance & Results</p>
                </div>
              </div>
              <p className="text-sm text-muted-foreground mt-2">
                View attendance trends and results for all students in this section.
              </p>
            </div>
          </div>

          {/* Search */}
          <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="mb-6">
            <Card>
              <CardContent className="p-4">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <Input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search by roll number or name..."
                    className="pl-10 pr-10"
                  />
                  {searchQuery && (
                    <button onClick={() => setSearchQuery("")} className="absolute right-3 top-1/2 -translate-y-1/2">
                      <X className="w-4 h-4 text-muted-foreground hover:text-foreground" />
                    </button>
                  )}
                </div>
                <p className="text-xs text-muted-foreground mt-2">
                  {filteredStudents.length} student{filteredStudents.length !== 1 ? "s" : ""} found
                </p>
              </CardContent>
            </Card>
          </motion.div>

          {/* Loading */}
          {isLoading && (
            <div className="space-y-3">
              {[1, 2, 3, 4].map((i) => (
                <Skeleton key={i} className="h-16 w-full rounded-xl" />
              ))}
            </div>
          )}

          {/* Error */}
          {error && !isLoading && (
            <div className="text-center py-16">
              <p className="text-destructive">{error}</p>
            </div>
          )}

          {/* Empty State */}
          {!isLoading && !error && students.length === 0 && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-center py-16">
              <Users className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-foreground mb-2">No Student Data</h3>
              <p className="text-sm text-muted-foreground">
                No analytics data found for {section?.replace(/-/g, " ")}. Data will appear once it's uploaded.
              </p>
            </motion.div>
          )}

          {/* Student List & Charts */}
          {!isLoading && !error && students.length > 0 && (
            <div className="space-y-4">
              {/* Student Cards */}
              {!selectedStudent && (
                <AnimatePresence>
                  {filteredStudents.map((student, index) => {
                    const avgAttendance = (() => {
                      const vals = Object.values(student.monthly_attendance || {});
                      return vals.length ? Math.round(vals.reduce((a, b) => a + Number(b), 0) / vals.length) : 0;
                    })();
                    const avgResults = (() => {
                      const vals = Object.values(student.monthly_results || {});
                      return vals.length ? Math.round(vals.reduce((a, b) => a + Number(b), 0) / vals.length) : 0;
                    })();

                    return (
                      <motion.div
                        key={student.id}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.03 }}
                      >
                        <Card
                          className="cursor-pointer hover:shadow-md transition-all hover:border-primary/30"
                          onClick={() => setSelectedStudent(student)}
                        >
                          <CardContent className="p-4">
                            <div className="flex items-center justify-between">
                              <div className="flex items-center gap-3">
                                <div className="w-10 h-10 rounded-full bg-primary flex items-center justify-center shrink-0">
                                  <span className="text-sm font-bold text-primary-foreground">
                                    {student.name[0]?.toUpperCase()}
                                  </span>
                                </div>
                                <div>
                                  <p className="font-semibold text-foreground">{student.name}</p>
                                  <p className="text-xs text-muted-foreground">{student.roll_number}</p>
                                </div>
                              </div>
                              <div className="flex gap-4 text-right">
                                <div>
                                  <p className="text-xs text-muted-foreground">Attendance</p>
                                  <p className={`text-sm font-bold ${avgAttendance >= 90 ? "text-green-600" : avgAttendance >= 75 ? "text-blue-600" : "text-red-600"}`}>
                                    {avgAttendance}%
                                  </p>
                                </div>
                                <div>
                                  <p className="text-xs text-muted-foreground">Results</p>
                                  <p className={`text-sm font-bold ${avgResults >= 85 ? "text-green-600" : avgResults >= 70 ? "text-blue-600" : "text-red-600"}`}>
                                    {avgResults}
                                  </p>
                                </div>
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
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setSelectedStudent(null)}
                    className="gap-2"
                  >
                    <ArrowLeft className="w-4 h-4" />
                    Back to Student List
                  </Button>

                  {/* Student Info */}
                  <Card className="bg-gradient-to-r from-primary/5 to-primary/10 border-primary/20">
                    <CardContent className="p-5">
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 rounded-full bg-primary flex items-center justify-center">
                          <span className="text-lg font-bold text-primary-foreground">
                            {selectedStudent.name[0]?.toUpperCase()}
                          </span>
                        </div>
                        <div>
                          <h2 className="text-xl font-bold text-foreground">{selectedStudent.name}</h2>
                          <p className="text-sm text-muted-foreground">
                            {selectedStudent.roll_number} · {selectedStudent.branch} · Sem {selectedStudent.semester} · Section {selectedStudent.section}
                          </p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  {/* Charts */}
                  <Tabs defaultValue="attendance" className="w-full">
                    <TabsList className="grid w-full grid-cols-2 max-w-md">
                      <TabsTrigger value="attendance">📊 Attendance</TabsTrigger>
                      <TabsTrigger value="results">📈 Results</TabsTrigger>
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
