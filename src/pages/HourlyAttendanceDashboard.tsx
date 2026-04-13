import { useState, useEffect, useRef, useMemo } from "react";
import { useParams, Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  Search, ArrowLeft, Clock, AlertTriangle, Download,
  Filter, X, Loader2, Database, Wifi, FileDown, Users
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select";
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from "@/components/ui/table";
import Header from "@/components/layout/Header";
import MobileBottomNav from "@/components/layout/MobileBottomNav";
import { useIsMobile } from "@/hooks/use-mobile";
import { toast } from "@/hooks/use-toast";
import {
  HourlyAttendanceRecord,
  subscribeToHourlyAttendance,
  fetchHourlyAttendance,
  seedDemoHourlyAttendance,
  fetchSectionHourlyAttendance,
} from "@/lib/firebase-helpers";
import {
  generateStudentAttendancePDF,
  generateClassAttendancePDF,
} from "@/lib/attendance-pdf";
import {
  PieChart, Pie, Cell, BarChart, Bar, LineChart, Line,
  XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend,
} from "recharts";

const CHART_COLORS = {
  present: "hsl(142, 71%, 45%)",
  absent: "hsl(0, 84%, 60%)",
  subjects: [
    "hsl(217, 91%, 60%)", "hsl(182, 59%, 56%)", "hsl(280, 60%, 60%)",
    "hsl(30, 90%, 55%)", "hsl(340, 75%, 55%)", "hsl(120, 50%, 50%)",
  ],
};

const HourlyAttendanceDashboard = () => {
  const { deptId, section } = useParams<{ deptId?: string; section?: string }>();
  const isMobile = useIsMobile();
  const [searchQuery, setSearchQuery] = useState("");
  const [searchedRoll, setSearchedRoll] = useState("");
  const [records, setRecords] = useState<HourlyAttendanceRecord[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isLive, setIsLive] = useState(false);
  const [subjectFilter, setSubjectFilter] = useState("all");
  const [pdfLoading, setPdfLoading] = useState<string | null>(null);
  const [seeding, setSeeding] = useState(false);
  const unsubRef = useRef<(() => void) | null>(null);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      unsubRef.current?.();
    };
  }, []);

  const handleSearch = () => {
    const roll = searchQuery.trim().toUpperCase();
    if (!roll) return;

    // Cleanup previous
    unsubRef.current?.();
    setLoading(true);
    setError(null);
    setSearchedRoll(roll);
    setIsLive(false);

    // First fetch, then subscribe for real-time
    fetchHourlyAttendance(roll)
      .then((data) => {
        setRecords(data);
        setLoading(false);
        if (data.length === 0) {
          setError("No attendance data found for this roll number.");
          return;
        }
        // Subscribe for real-time updates
        const unsub = subscribeToHourlyAttendance(
          roll,
          (liveData) => {
            setRecords(liveData);
            setIsLive(true);
          },
          (err) => {
            console.error("Real-time error:", err);
          }
        );
        unsubRef.current = unsub;
      })
      .catch(() => {
        setLoading(false);
        setError("Failed to fetch attendance data. Please try again.");
      });
  };

  const handleSeedDemo = async () => {
    setSeeding(true);
    try {
      const count = await seedDemoHourlyAttendance(
        deptId?.toUpperCase() || "CSE",
        section?.split("-").pop() || "A"
      );
      toast({
        title: "Demo Data Seeded",
        description: `Created ${count} attendance records. Try searching: 23KP1A4401`,
      });
    } catch {
      toast({ title: "Error", description: "Failed to seed demo data.", variant: "destructive" });
    }
    setSeeding(false);
  };

  // Computed stats
  const filteredRecords = useMemo(() => {
    if (subjectFilter === "all") return records;
    return records.filter((r) => r.subject === subjectFilter);
  }, [records, subjectFilter]);

  const subjects = useMemo(() => {
    return [...new Set(records.map((r) => r.subject))];
  }, [records]);

  const totalPresent = filteredRecords.filter((r) => r.status === "Present").length;
  const totalAbsent = filteredRecords.filter((r) => r.status === "Absent").length;
  const totalClasses = filteredRecords.length;
  const attendancePercent = totalClasses > 0 ? Math.round((totalPresent / totalClasses) * 100) : 0;
  const isLowAttendance = attendancePercent < 75 && totalClasses > 0;

  // Chart data
  const pieData = [
    { name: "Present", value: totalPresent },
    { name: "Absent", value: totalAbsent },
  ];

  const subjectWiseData = useMemo(() => {
    const map: Record<string, { present: number; absent: number }> = {};
    records.forEach((r) => {
      if (!map[r.subject]) map[r.subject] = { present: 0, absent: 0 };
      if (r.status === "Present") map[r.subject].present++;
      else map[r.subject].absent++;
    });
    return Object.entries(map).map(([subject, data]) => ({
      subject,
      present: data.present,
      absent: data.absent,
      percent: Math.round((data.present / (data.present + data.absent)) * 100),
    }));
  }, [records]);

  const dailyTrendData = useMemo(() => {
    const map: Record<string, { present: number; total: number }> = {};
    records.forEach((r) => {
      if (!map[r.date]) map[r.date] = { present: 0, total: 0 };
      map[r.date].total++;
      if (r.status === "Present") map[r.date].present++;
    });
    return Object.entries(map)
      .sort(([a], [b]) => a.localeCompare(b))
      .map(([date, data]) => ({
        date: date.slice(5), // MM-DD
        percent: Math.round((data.present / data.total) * 100),
      }));
  }, [records]);

  const studentInfo = records.length > 0 ? records[0] : null;

  return (
    <div className="min-h-screen bg-background">
      <Header />

      {/* Top Bar */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-card border-b border-border sticky top-14 md:top-16 z-40"
      >
        <div className="container mx-auto px-4 py-3 md:py-4">
          {deptId && (
            <Link
              to={`/department/${deptId}/student-portal`}
              className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors mb-3"
            >
              <ArrowLeft className="w-5 h-5" />
              <span className="text-sm">Back to Portal</span>
            </Link>
          )}

          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 md:w-12 md:h-12 rounded-xl bg-gradient-cyber flex items-center justify-center flex-shrink-0">
              <Clock className="w-5 h-5 md:w-6 md:h-6 text-white" />
            </div>
            <div className="min-w-0 flex-1">
              <div className="flex items-center gap-2">
                <h1 className="text-lg md:text-2xl font-bold text-foreground">
                  Hourly Attendance Dashboard
                </h1>
                {isLive && (
                  <span className="flex items-center gap-1 text-xs text-green-400 bg-green-400/10 px-2 py-0.5 rounded-full">
                    <Wifi className="w-3 h-3" />
                    Live
                  </span>
                )}
              </div>
              {section && (
                <p className="text-xs md:text-sm text-muted-foreground">
                  Section: {section}
                </p>
              )}
            </div>
          </div>

          {/* Search Bar */}
          <div className="flex gap-2">
            <Input
              placeholder="Enter Roll Number (e.g. 23KP1A4401)"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleSearch()}
              className="h-12 bg-background/50 border-border"
            />
            <Button onClick={handleSearch} className="h-12 px-6 bg-gradient-cyber hover:opacity-90">
              <Search className="w-4 h-4 mr-2" />
              Search
            </Button>
          </div>
        </div>
      </motion.div>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-6 pb-24 md:pb-8 space-y-6">
        {/* Initial State */}
        {!searchedRoll && !loading && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center py-16"
          >
            <div className="w-20 h-20 mx-auto mb-6 rounded-2xl bg-primary/10 flex items-center justify-center">
              <Search className="w-10 h-10 text-primary" />
            </div>
            <h2 className="text-xl font-semibold text-foreground mb-2">
              Search Student Attendance
            </h2>
            <p className="text-muted-foreground mb-6 max-w-md mx-auto">
              Enter a roll number to view detailed hourly attendance records with real-time updates.
            </p>
            <Button
              variant="outline"
              onClick={handleSeedDemo}
              disabled={seeding}
              className="gap-2"
            >
              {seeding ? <Loader2 className="w-4 h-4 animate-spin" /> : <Database className="w-4 h-4" />}
              {seeding ? "Seeding..." : "Seed Demo Data"}
            </Button>
          </motion.div>
        )}

        {/* Loading */}
        {loading && (
          <div className="space-y-4">
            <Skeleton className="h-32 w-full rounded-xl" />
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Skeleton className="h-48 rounded-xl" />
              <Skeleton className="h-48 rounded-xl" />
              <Skeleton className="h-48 rounded-xl" />
            </div>
            <Skeleton className="h-64 w-full rounded-xl" />
          </div>
        )}

        {/* Error / No Data */}
        {error && !loading && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-16"
          >
            <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-destructive/10 flex items-center justify-center">
              <AlertTriangle className="w-8 h-8 text-destructive" />
            </div>
            <p className="text-muted-foreground mb-4">{error}</p>
            <Button variant="outline" onClick={handleSeedDemo} disabled={seeding} className="gap-2">
              {seeding ? <Loader2 className="w-4 h-4 animate-spin" /> : <Database className="w-4 h-4" />}
              Seed Demo Data
            </Button>
          </motion.div>
        )}

        {/* Results */}
        <AnimatePresence>
          {searchedRoll && records.length > 0 && !loading && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="space-y-6"
            >
              {/* Student Info Card */}
              <div className="bg-card border border-border rounded-xl p-5 backdrop-blur-sm">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                  <div>
                    <h2 className="text-xl font-bold text-foreground">{studentInfo?.name}</h2>
                    <p className="text-sm text-muted-foreground">
                      {studentInfo?.roll_number} • {studentInfo?.branch} • Section {studentInfo?.section}
                    </p>
                  </div>
                  <div className="flex items-center gap-3">
                    {isLowAttendance && (
                      <span className="flex items-center gap-1.5 text-sm text-orange-400 bg-orange-400/10 px-3 py-1.5 rounded-lg">
                        <AlertTriangle className="w-4 h-4" />
                        Low Attendance
                      </span>
                    )}
                    <div className={`text-3xl font-bold ${isLowAttendance ? "text-destructive" : "text-green-400"}`}>
                      {attendancePercent}%
                    </div>
                  </div>
                </div>
              </div>

              {/* Stats Cards */}
              <div className="grid grid-cols-3 gap-3 md:gap-4">
                {[
                  { label: "Total Classes", value: totalClasses, color: "text-primary" },
                  { label: "Present", value: totalPresent, color: "text-green-400" },
                  { label: "Absent", value: totalAbsent, color: "text-destructive" },
                ].map((stat) => (
                  <div key={stat.label} className="bg-card border border-border rounded-xl p-4 text-center">
                    <div className={`text-2xl md:text-3xl font-bold ${stat.color}`}>{stat.value}</div>
                    <div className="text-xs text-muted-foreground mt-1">{stat.label}</div>
                  </div>
                ))}
              </div>

              {/* Charts */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {/* Pie Chart */}
                <div className="bg-card border border-border rounded-xl p-4">
                  <h3 className="text-sm font-semibold text-foreground mb-3">Overall Attendance</h3>
                  <ResponsiveContainer width="100%" height={200}>
                    <PieChart>
                      <Pie data={pieData} cx="50%" cy="50%" innerRadius={50} outerRadius={80} dataKey="value" stroke="none">
                        <Cell fill={CHART_COLORS.present} />
                        <Cell fill={CHART_COLORS.absent} />
                      </Pie>
                      <Tooltip
                        contentStyle={{ background: "hsl(218 42% 13%)", border: "1px solid hsl(210 30% 20%)", borderRadius: "8px", color: "white" }}
                      />
                      <Legend />
                    </PieChart>
                  </ResponsiveContainer>
                </div>

                {/* Bar Chart - Subject-wise */}
                <div className="bg-card border border-border rounded-xl p-4">
                  <h3 className="text-sm font-semibold text-foreground mb-3">Subject-wise</h3>
                  <ResponsiveContainer width="100%" height={200}>
                    <BarChart data={subjectWiseData}>
                      <CartesianGrid strokeDasharray="3 3" stroke="hsl(210 30% 20%)" />
                      <XAxis dataKey="subject" tick={{ fill: "hsl(210 10% 75%)", fontSize: 11 }} />
                      <YAxis tick={{ fill: "hsl(210 10% 75%)", fontSize: 11 }} />
                      <Tooltip
                        contentStyle={{ background: "hsl(218 42% 13%)", border: "1px solid hsl(210 30% 20%)", borderRadius: "8px", color: "white" }}
                      />
                      <Bar dataKey="present" fill={CHART_COLORS.present} radius={[4, 4, 0, 0]} />
                      <Bar dataKey="absent" fill={CHART_COLORS.absent} radius={[4, 4, 0, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                </div>

                {/* Line Chart - Daily Trend */}
                <div className="bg-card border border-border rounded-xl p-4">
                  <h3 className="text-sm font-semibold text-foreground mb-3">Daily Trend</h3>
                  <ResponsiveContainer width="100%" height={200}>
                    <LineChart data={dailyTrendData}>
                      <CartesianGrid strokeDasharray="3 3" stroke="hsl(210 30% 20%)" />
                      <XAxis dataKey="date" tick={{ fill: "hsl(210 10% 75%)", fontSize: 11 }} />
                      <YAxis domain={[0, 100]} tick={{ fill: "hsl(210 10% 75%)", fontSize: 11 }} />
                      <Tooltip
                        contentStyle={{ background: "hsl(218 42% 13%)", border: "1px solid hsl(210 30% 20%)", borderRadius: "8px", color: "white" }}
                        formatter={(val: number) => [`${val}%`, "Attendance"]}
                      />
                      <Line type="monotone" dataKey="percent" stroke="hsl(217, 91%, 60%)" strokeWidth={2} dot={{ fill: "hsl(182, 59%, 56%)", r: 4 }} />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </div>

              {/* Filter & Table */}
              <div className="bg-card border border-border rounded-xl overflow-hidden">
                <div className="p-4 border-b border-border flex flex-col sm:flex-row gap-3 items-start sm:items-center justify-between">
                  <h3 className="font-semibold text-foreground">Attendance Records</h3>
                  <div className="flex gap-2">
                    <Select value={subjectFilter} onValueChange={setSubjectFilter}>
                      <SelectTrigger className="w-[140px] h-9">
                        <Filter className="w-3 h-3 mr-1" />
                        <SelectValue placeholder="Subject" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All Subjects</SelectItem>
                        {subjects.map((s) => (
                          <SelectItem key={s} value={s}>{s}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    {subjectFilter !== "all" && (
                      <Button size="sm" variant="ghost" onClick={() => setSubjectFilter("all")}>
                        <X className="w-3 h-3" />
                      </Button>
                    )}
                  </div>
                </div>

                <div className="overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Date</TableHead>
                        <TableHead>Subject</TableHead>
                        <TableHead>Hour</TableHead>
                        <TableHead>Status</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {filteredRecords.map((r, i) => (
                        <TableRow key={r.id || i}>
                          <TableCell className="font-mono text-sm">{r.date}</TableCell>
                          <TableCell>{r.subject}</TableCell>
                          <TableCell>{r.hour}</TableCell>
                          <TableCell>
                            <span
                              className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium ${
                                r.status === "Present"
                                  ? "bg-green-400/10 text-green-400"
                                  : "bg-destructive/10 text-destructive"
                              }`}
                            >
                              {r.status}
                            </span>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <MobileBottomNav />
    </div>
  );
};

export default HourlyAttendanceDashboard;
