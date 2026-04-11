import { useState, useCallback, lazy, Suspense } from "react";
import { useParams, Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowLeft, Search, X, TrendingUp, UserSearch } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import MobileBottomNav from "@/components/layout/MobileBottomNav";
import { searchStudentByRoll, type StudentData } from "@/lib/firebase-helpers";

const AttendanceCharts = lazy(() => import("@/components/analytics/AttendanceCharts"));
const ResultsCharts = lazy(() => import("@/components/analytics/ResultsCharts"));
const DataInterpretation = lazy(() => import("@/components/analytics/DataInterpretation"));

const departments: Record<string, { name: string; code: string }> = {
  cse: { name: "Computer Science & Engineering", code: "CSE" },
  it: { name: "Information Technology", code: "IT" },
  ds: { name: "Data Science", code: "DS" },
  aids: { name: "AI & Data Science", code: "DS" },
};

// StudentData type imported from firebase-helpers

const StudentAnalytics = () => {
  const { deptId } = useParams<{ deptId: string }>();
  const dept = deptId ? departments[deptId] : null;

  const [searchQuery, setSearchQuery] = useState("");
  const [student, setStudent] = useState<StudentData | null>(null);
  const [isSearching, setIsSearching] = useState(false);
  const [searched, setSearched] = useState(false);
  const [error, setError] = useState("");

  const handleSearch = useCallback(async () => {
    const q = searchQuery.trim();
    if (!q) return;

    setIsSearching(true);
    setError("");
    setStudent(null);
    setSearched(true);

    try {
      const branchCode = dept?.code || "CSE";
      const result = await searchStudentByRoll(branchCode, q);

      if (result) {
        setStudent(result);
      } else {
        setError("No student found with that roll number.");
      }
    } catch (err: any) {
      setError("Something went wrong. Please try again.");
      console.error(err);
    } finally {
      setIsSearching(false);
    }
  }, [searchQuery, dept]);

  const clearSearch = () => {
    setSearchQuery("");
    setStudent(null);
    setSearched(false);
    setError("");
  };

  if (!dept) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4 text-foreground">Department Not Found</h1>
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
                  <h1 className="text-2xl md:text-3xl font-bold text-foreground">Student Analytics</h1>
                  <p className="text-sm text-muted-foreground">{dept.name}</p>
                </div>
              </div>
              <p className="text-sm text-muted-foreground mt-2">
                Search by roll number to view attendance trends, results, and personalized insights.
              </p>
            </div>
          </div>

          {/* Search Bar */}
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-8"
          >
            <Card>
              <CardContent className="p-4">
                <div className="flex gap-3">
                  <div className="relative flex-1">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                    <Input
                      type="text"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      onKeyDown={(e) => e.key === "Enter" && handleSearch()}
                      placeholder="Enter roll number (e.g., 22B01A0540)"
                      className="pl-10 pr-10"
                    />
                    {searchQuery && (
                      <button onClick={clearSearch} className="absolute right-3 top-1/2 -translate-y-1/2">
                        <X className="w-4 h-4 text-muted-foreground hover:text-foreground" />
                      </button>
                    )}
                  </div>
                  <Button onClick={handleSearch} disabled={isSearching || !searchQuery.trim()}>
                    {isSearching ? "Searching..." : "Search"}
                  </Button>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* Loading */}
          {isSearching && (
            <div className="space-y-4">
              <Skeleton className="h-8 w-48 rounded-lg" />
              <Skeleton className="h-64 w-full rounded-xl" />
              <Skeleton className="h-64 w-full rounded-xl" />
            </div>
          )}

          {/* Error / Not Found */}
          <AnimatePresence>
            {error && !isSearching && (
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                className="text-center py-16"
              >
                <motion.div
                  animate={{ y: [0, -8, 0] }}
                  transition={{ repeat: Infinity, duration: 2 }}
                >
                  <UserSearch className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
                </motion.div>
                <h3 className="text-lg font-semibold text-foreground mb-2">No Student Found</h3>
                <p className="text-sm text-muted-foreground max-w-md mx-auto">{error}</p>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Initial State */}
          {!searched && !isSearching && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-center py-20"
            >
              <div className="w-20 h-20 rounded-2xl bg-primary/10 flex items-center justify-center mx-auto mb-6">
                <TrendingUp className="w-10 h-10 text-primary" />
              </div>
              <h3 className="text-xl font-semibold text-foreground mb-2">Enter a Roll Number</h3>
              <p className="text-sm text-muted-foreground max-w-md mx-auto">
                Search for a student by roll number to see their attendance trends, exam results, and AI-generated performance insights.
              </p>
            </motion.div>
          )}

          {/* Student Data */}
          {student && !isSearching && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="space-y-8"
            >
              {/* Student Info Card */}
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
              >
                <Card className="bg-gradient-to-r from-primary/5 to-primary/10 border-primary/20">
                  <CardContent className="p-5">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 rounded-full bg-primary flex items-center justify-center">
                          <span className="text-lg font-bold text-primary-foreground">
                            {student.name[0]?.toUpperCase()}
                          </span>
                        </div>
                        <div>
                          <h2 className="text-xl font-bold text-foreground">{student.name}</h2>
                          <p className="text-sm text-muted-foreground">
                            {student.roll_number} · {student.branch} · Sem {student.semester} · Section {student.section}
                          </p>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>

              {/* Charts Tabs */}
              <Tabs defaultValue="attendance" className="w-full">
                <TabsList className="grid w-full grid-cols-2 max-w-md">
                  <TabsTrigger value="attendance">📊 Attendance</TabsTrigger>
                  <TabsTrigger value="results">📈 Results</TabsTrigger>
                </TabsList>

                <TabsContent value="attendance" className="mt-6 space-y-6">
                  <Suspense fallback={<Skeleton className="h-64 w-full rounded-xl" />}>
                    <AttendanceCharts data={student.monthly_attendance} />
                    <DataInterpretation type="attendance" data={student.monthly_attendance} />
                  </Suspense>
                </TabsContent>

                <TabsContent value="results" className="mt-6 space-y-6">
                  <Suspense fallback={<Skeleton className="h-64 w-full rounded-xl" />}>
                    <ResultsCharts data={student.monthly_results} />
                    <DataInterpretation type="results" data={student.monthly_results} />
                  </Suspense>
                </TabsContent>
              </Tabs>
            </motion.div>
          )}
        </div>
      </main>
      <Footer />
      <MobileBottomNav />
    </div>
  );
};

export default StudentAnalytics;
