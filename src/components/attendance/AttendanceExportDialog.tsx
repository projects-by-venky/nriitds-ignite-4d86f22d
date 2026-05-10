import { useState, useEffect, useMemo, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import {
  Download, Loader2, User, Users, UsersRound, Check, Search, FileText, X, RefreshCw, Hash,
} from "lucide-react";
import { List, type RowComponentProps } from "react-window";
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Skeleton } from "@/components/ui/skeleton";
import { toast } from "@/hooks/use-toast";
import {
  HourlyAttendanceRecord,
  fetchHourlyAttendance,
  fetchSectionHourlyAttendance,
} from "@/lib/firebase-helpers";
import {
  generateStudentAttendancePDF,
  generateClassAttendancePDF,
} from "@/lib/attendance-pdf";

type ExportMode = "individual" | "group" | "all";
type DataType = "hourly" | "monthly" | "both";

interface StudentEntry {
  roll_number: string;
  name: string;
  branch: string;
  section: string;
}

interface AttendanceExportDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  /** Currently loaded records for the searched student (hourly dashboard) */
  currentRecords?: HourlyAttendanceRecord[];
  /** Current student info */
  currentStudent?: StudentEntry | null;
  /** All students visible in the table (monthly attendance page) */
  allStudents?: StudentEntry[];
  /** Whether the student list is still loading from Firebase */
  studentsLoading?: boolean;
  /** Optional callback to force re-fetch the roster (bypassing any cache) */
  onRefreshStudents?: () => void;
  /** Branch code */
  branch: string;
  /** Section letter */
  section: string;
  /** Source context */
  source: "hourly" | "monthly";
  /** Monthly data for students (roll -> subject attendance array) */
  monthlyData?: Record<string, { code: string; name: string; conducted: number; attended: number }[]>;
}

export default function AttendanceExportDialog({
  open, onOpenChange, currentRecords, currentStudent, allStudents = [], studentsLoading = false,
  onRefreshStudents, branch, section, source, monthlyData,
}: AttendanceExportDialogProps) {
  const [step, setStep] = useState(1);
  const [mode, setMode] = useState<ExportMode>("individual");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedRolls, setSelectedRolls] = useState<Set<string>>(new Set());
  const [generating, setGenerating] = useState(false);

  // Reset on open
  useEffect(() => {
    if (open) {
      setStep(1);
      setMode("individual");
      setSearchQuery("");
      setSelectedRolls(new Set());
    }
  }, [open]);

  const filteredStudents = allStudents.filter((s) => {
    if (!searchQuery) return true;
    const q = searchQuery.toUpperCase();
    return s.roll_number.toUpperCase().includes(q) || s.name.toUpperCase().includes(q);
  });

  const toggleStudent = (roll: string) => {
    setSelectedRolls((prev) => {
      const next = new Set(prev);
      if (next.has(roll)) next.delete(roll);
      else next.add(roll);
      return next;
    });
  };

  const toggleAll = () => {
    if (selectedRolls.size === filteredStudents.length) {
      setSelectedRolls(new Set());
    } else {
      setSelectedRolls(new Set(filteredStudents.map((s) => s.roll_number)));
    }
  };

  const handleGenerate = async () => {
    setGenerating(true);
    try {
      if (mode === "all") {
        // Full class report
        if (source === "hourly") {
          const allRecords = await fetchSectionHourlyAttendance(branch, section);
          if (allRecords.length === 0) {
            toast({ title: "No Data", description: "No attendance data found for this class.", variant: "destructive" });
            setGenerating(false);
            return;
          }
          generateClassAttendancePDF(allRecords, branch, section);
          toast({ title: "PDF Downloaded", description: `Full_Attendance_Report.pdf` });
        } else {
          generateMonthlyClassPDF();
        }
      } else if (mode === "individual") {
        // Single student
        if (source === "hourly") {
          if (currentRecords && currentRecords.length > 0 && currentStudent) {
            generateStudentAttendancePDF(currentRecords, {
              title: "Hourly Attendance Report",
              studentName: currentStudent.name,
              rollNumber: currentStudent.roll_number,
              branch: currentStudent.branch,
              section: currentStudent.section,
            });
            toast({ title: "PDF Downloaded", description: `${currentStudent.roll_number}_Attendance_Report.pdf` });
          } else {
            toast({ title: "No Data", description: "Search for a student first.", variant: "destructive" });
          }
        } else {
          // Monthly individual - use first selected or current
          const roll = selectedRolls.size > 0 ? [...selectedRolls][0] : currentStudent?.roll_number;
          if (roll && monthlyData?.[roll]) {
            generateMonthlyStudentPDF(roll);
          } else {
            toast({ title: "No Data", description: "Select a student first.", variant: "destructive" });
          }
        }
      } else {
        // Group
        if (selectedRolls.size === 0) {
          toast({ title: "No Selection", description: "Please select at least one student.", variant: "destructive" });
          setGenerating(false);
          return;
        }

        if (source === "hourly") {
          const allRecords = await fetchSectionHourlyAttendance(branch, section);
          const groupRecords = allRecords.filter((r) => selectedRolls.has(r.roll_number));
          if (groupRecords.length === 0) {
            toast({ title: "No Data", description: "No records found for selected students.", variant: "destructive" });
            setGenerating(false);
            return;
          }
          generateClassAttendancePDF(groupRecords, branch, section);
          toast({ title: "PDF Downloaded", description: `Group_Attendance_Report.pdf` });
        } else {
          generateMonthlyGroupPDF();
        }
      }

      onOpenChange(false);
    } catch (err) {
      console.error("Export error:", err);
      toast({ title: "Error", description: "Failed to generate PDF.", variant: "destructive" });
    }
    setGenerating(false);
  };

  // Monthly PDF helpers using jsPDF directly
  const generateMonthlyStudentPDF = (roll: string) => {
    const student = allStudents.find((s) => s.roll_number === roll);
    const subjectData = monthlyData?.[roll];
    if (!student || !subjectData) return;

    const doc = new jsPDF("p", "mm", "a4");

    addMonthlyHeader(doc, `Monthly Attendance - ${student.name}`);

    let y = 50;
    // Student info
    doc.setFillColor(241, 245, 249);
    doc.roundedRect(14, y, doc.internal.pageSize.getWidth() - 28, 20, 3, 3, "F");
    doc.setTextColor(15, 23, 42);
    doc.setFontSize(12);
    doc.setFont("helvetica", "bold");
    doc.text(student.name, 20, y + 9);
    doc.setFontSize(9);
    doc.setFont("helvetica", "normal");
    doc.setTextColor(100, 116, 139);
    doc.text(`${student.roll_number}  •  ${branch}  •  Section ${section}`, 20, y + 16);
    y += 28;

    const totalC = subjectData.reduce((s, a) => s + a.conducted, 0);
    const totalA = subjectData.reduce((s, a) => s + a.attended, 0);
    const pct = totalC > 0 ? Math.round((totalA / totalC) * 100) : 0;

    // Stats
    addMonthlyStats(doc, totalC, totalA, pct, y);
    y += 50;

    // Subject table
    autoTable(doc, {
      startY: y,
      head: [["Subject", "Conducted", "Attended", "Attendance %"]],
      body: subjectData.map((s) => {
        const p = s.conducted > 0 ? Math.round((s.attended / s.conducted) * 100) : 0;
        return [s.code, String(s.conducted), String(s.attended), `${p}%`];
      }),
      margin: { left: 14, right: 14 },
      headStyles: { fillColor: [15, 76, 130], textColor: [255, 255, 255], fontStyle: "bold", fontSize: 9 },
      bodyStyles: { fontSize: 9, textColor: [15, 23, 42] },
      alternateRowStyles: { fillColor: [248, 250, 252] },
      didParseCell: (data: any) => {
        if (data.section === "body" && data.column.index === 3) {
          const v = parseInt(data.cell.raw);
          if (v >= 75) data.cell.styles.textColor = [34, 197, 94];
          else if (v >= 50) data.cell.styles.textColor = [234, 179, 8];
          else data.cell.styles.textColor = [239, 68, 68];
          data.cell.styles.fontStyle = "bold";
        }
      },
    });

    addMonthlyWatermark(doc);
    doc.save(`${roll}_Attendance_Report.pdf`);
    toast({ title: "PDF Downloaded", description: `${roll}_Attendance_Report.pdf` });
  };

  const generateMonthlyClassPDF = () => {
    if (!monthlyData || allStudents.length === 0) return;
    generateMonthlyBulkPDF(allStudents, `Full_Attendance_Report.pdf`);
    toast({ title: "PDF Downloaded", description: "Full_Attendance_Report.pdf" });
  };

  const generateMonthlyGroupPDF = () => {
    const selected = allStudents.filter((s) => selectedRolls.has(s.roll_number));
    if (selected.length === 0) return;
    generateMonthlyBulkPDF(selected, `Group_Attendance_Report.pdf`);
    toast({ title: "PDF Downloaded", description: "Group_Attendance_Report.pdf" });
  };

  const generateMonthlyBulkPDF = (students: StudentEntry[], filename: string) => {
    const doc = new jsPDF("p", "mm", "a4");

    addMonthlyHeader(doc, `Monthly Attendance — ${branch.toUpperCase()} Section ${section.toUpperCase()}`);

    let y = 50;
    const rows = students.map((s, i) => {
      const data = monthlyData?.[s.roll_number] || [];
      const totalC = data.reduce((sum, a) => sum + a.conducted, 0);
      const totalA = data.reduce((sum, a) => sum + a.attended, 0);
      const pct = totalC > 0 ? Math.round((totalA / totalC) * 100) : 0;
      return [String(i + 1), s.roll_number, s.name, String(totalC), String(totalA), `${pct}%`];
    });

    autoTable(doc, {
      startY: y,
      head: [["#", "Roll Number", "Name", "Conducted", "Attended", "Attendance %"]],
      body: rows,
      margin: { left: 14, right: 14 },
      headStyles: { fillColor: [15, 76, 130], textColor: [255, 255, 255], fontStyle: "bold", fontSize: 8 },
      bodyStyles: { fontSize: 8, textColor: [15, 23, 42] },
      alternateRowStyles: { fillColor: [248, 250, 252] },
      columnStyles: { 0: { cellWidth: 10, halign: "center" }, 5: { fontStyle: "bold" } },
      didParseCell: (data: any) => {
        if (data.section === "body" && data.column.index === 5) {
          const v = parseInt(data.cell.raw);
          if (v >= 75) data.cell.styles.textColor = [34, 197, 94];
          else if (v >= 50) data.cell.styles.textColor = [234, 179, 8];
          else data.cell.styles.textColor = [239, 68, 68];
        }
      },
    });

    addMonthlyWatermark(doc);
    doc.save(filename);
  };

  const addMonthlyHeader = (doc: any, title: string) => {
    const pw = doc.internal.pageSize.getWidth();
    doc.setFillColor(15, 76, 130);
    doc.rect(0, 0, pw, 40, "F");
    doc.setFillColor(0, 188, 212);
    doc.rect(0, 40, pw, 3, "F");
    doc.setTextColor(255, 255, 255);
    doc.setFontSize(20);
    doc.setFont("helvetica", "bold");
    doc.text("NRIIT", 14, 18);
    doc.setFontSize(10);
    doc.setFont("helvetica", "normal");
    doc.text("NRI Institute of Information Technology", 14, 26);
    doc.setFontSize(13);
    doc.setFont("helvetica", "bold");
    doc.text(title, 14, 36);
    doc.setFontSize(9);
    doc.setFont("helvetica", "normal");
    const d = new Date().toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric" });
    doc.text(`Generated: ${d}`, pw - 14, 36, { align: "right" });
  };

  const addMonthlyStats = (doc: any, totalC: number, totalA: number, pct: number, y: number) => {
    const pw = doc.internal.pageSize.getWidth();
    const cw = (pw - 42) / 3;
    const stats = [
      { label: "Total Conducted", value: String(totalC), color: [15, 76, 130] },
      { label: "Total Attended", value: String(totalA), color: [34, 197, 94] },
      { label: "Attendance %", value: `${pct}%`, color: pct >= 75 ? [34, 197, 94] : pct >= 50 ? [234, 179, 8] : [239, 68, 68] },
    ];
    stats.forEach((s, i) => {
      const x = 14 + i * (cw + 7);
      doc.setFillColor(241, 245, 249);
      doc.roundedRect(x, y, cw, 24, 2, 2, "F");
      doc.setFillColor(...s.color);
      doc.rect(x, y, cw, 2, "F");
      doc.setTextColor(...s.color);
      doc.setFontSize(16);
      doc.setFont("helvetica", "bold");
      doc.text(s.value, x + cw / 2, y + 13, { align: "center" });
      doc.setTextColor(100, 116, 139);
      doc.setFontSize(8);
      doc.setFont("helvetica", "normal");
      doc.text(s.label, x + cw / 2, y + 20, { align: "center" });
    });
  };

  const addMonthlyWatermark = (doc: any) => {
    const pc = doc.getNumberOfPages();
    for (let i = 1; i <= pc; i++) {
      doc.setPage(i);
      doc.setTextColor(200, 210, 220);
      doc.setFontSize(40);
      doc.setFont("helvetica", "bold");
      const pw = doc.internal.pageSize.getWidth();
      const ph = doc.internal.pageSize.getHeight();
      doc.text("NRIIT Portal", pw / 2, ph / 2, { align: "center", angle: 45 });
      doc.setTextColor(100, 116, 139);
      doc.setFontSize(7);
      doc.setFont("helvetica", "normal");
      doc.text(`Generated by NRIIT Portal  •  Page ${i} of ${pc}`, pw / 2, ph - 8, { align: "center" });
    }
  };

  const canProceedStep1 = mode !== undefined;
  const canProceedStep2 = mode === "all" || mode === "individual" || selectedRolls.size > 0;

  const modeOptions = [
    { value: "individual" as ExportMode, icon: User, label: "Individual", desc: "Download one student's report" },
    { value: "group" as ExportMode, icon: UsersRound, label: "Group", desc: "Select multiple students" },
    { value: "all" as ExportMode, icon: Users, label: "All", desc: "Full class attendance" },
  ];

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-lg max-h-[85vh] overflow-hidden flex flex-col">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <FileText className="w-5 h-5 text-primary" />
            Export Attendance
          </DialogTitle>
          <DialogDescription>
            Step {step} of {mode === "all" || mode === "individual" ? 1 : 2} — {step === 1 ? "Choose export type" : "Select students"}
          </DialogDescription>
        </DialogHeader>

        <div className="flex-1 overflow-y-auto py-2 space-y-4">
          <AnimatePresence mode="wait">
            {step === 1 && (
              <motion.div
                key="step1"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                className="space-y-3"
              >
                {modeOptions.map((opt) => (
                  <button
                    key={opt.value}
                    onClick={() => setMode(opt.value)}
                    className={`w-full flex items-center gap-4 p-4 rounded-xl border-2 transition-all text-left ${
                      mode === opt.value
                        ? "border-primary bg-primary/5"
                        : "border-border hover:border-primary/40"
                    }`}
                  >
                    <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                      mode === opt.value ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground"
                    }`}>
                      <opt.icon className="w-5 h-5" />
                    </div>
                    <div className="flex-1">
                      <div className="font-semibold text-foreground">{opt.label}</div>
                      <div className="text-sm text-muted-foreground">{opt.desc}</div>
                    </div>
                    {mode === opt.value && (
                      <Check className="w-5 h-5 text-primary" />
                    )}
                  </button>
                ))}
              </motion.div>
            )}

            {step === 2 && mode === "group" && (
              <motion.div
                key="step2"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                className="space-y-3"
              >
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <Input
                    placeholder="Search by roll number or name..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-9 h-10"
                  />
                </div>

                <div className="flex items-center justify-between px-1">
                  <button
                    onClick={toggleAll}
                    className="text-sm text-primary hover:underline"
                  >
                    {selectedRolls.size === filteredStudents.length && filteredStudents.length > 0
                      ? "Deselect All"
                      : "Select All"}
                  </button>
                  <div className="flex items-center gap-3">
                    {onRefreshStudents && (
                      <button
                        type="button"
                        onClick={onRefreshStudents}
                        disabled={studentsLoading}
                        title="Refresh student list"
                        className="inline-flex items-center gap-1 text-xs text-muted-foreground hover:text-primary transition-colors disabled:opacity-50"
                      >
                        <RefreshCw className={`w-3.5 h-3.5 ${studentsLoading ? "animate-spin" : ""}`} />
                        Refresh
                      </button>
                    )}
                    <span className="text-xs text-muted-foreground">
                      {selectedRolls.size} selected
                    </span>
                  </div>
                </div>

                <div className="max-h-[300px] overflow-y-auto space-y-1 border border-border rounded-lg p-2">
                  {studentsLoading ? (
                    <div className="space-y-1" aria-label="Loading students">
                      {Array.from({ length: 8 }).map((_, i) => (
                        <div key={i} className="flex items-center gap-3 p-2.5 rounded-lg">
                          <Skeleton className="h-4 w-4 rounded" />
                          <div className="flex-1 space-y-1.5">
                            <Skeleton className="h-3.5 w-24" />
                            <Skeleton className="h-3 w-40" />
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : filteredStudents.length === 0 ? (
                    <p className="text-sm text-muted-foreground text-center py-4">No students found</p>
                  ) : (
                    filteredStudents.map((s) => (
                      <label
                        key={s.roll_number}
                        className={`flex items-center gap-3 p-2.5 rounded-lg cursor-pointer transition-colors ${
                          selectedRolls.has(s.roll_number) ? "bg-primary/5" : "hover:bg-muted/50"
                        }`}
                      >
                        <Checkbox
                          checked={selectedRolls.has(s.roll_number)}
                          onCheckedChange={() => toggleStudent(s.roll_number)}
                        />
                        <div className="flex-1 min-w-0">
                          <div className="text-sm font-medium text-foreground truncate">{s.roll_number}</div>
                          <div className="text-xs text-muted-foreground truncate">{s.name}</div>
                        </div>
                      </label>
                    ))
                  )}
                </div>
              </motion.div>
            )}

            {step === 2 && mode === "individual" && (
              <motion.div
                key="step2-individual"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                className="space-y-3"
              >
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <Input
                    placeholder="Search by roll number or name..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-9 h-10"
                  />
                </div>
                {onRefreshStudents && (
                  <div className="flex justify-end px-1">
                    <button
                      type="button"
                      onClick={onRefreshStudents}
                      disabled={studentsLoading}
                      title="Refresh student list"
                      className="inline-flex items-center gap-1 text-xs text-muted-foreground hover:text-primary transition-colors disabled:opacity-50"
                    >
                      <RefreshCw className={`w-3.5 h-3.5 ${studentsLoading ? "animate-spin" : ""}`} />
                      Refresh
                    </button>
                  </div>
                )}
                <div className="max-h-[300px] overflow-y-auto space-y-1 border border-border rounded-lg p-2">
                  {studentsLoading ? (
                    <div className="space-y-1" aria-label="Loading students">
                      {Array.from({ length: 8 }).map((_, i) => (
                        <div key={i} className="flex items-center gap-3 p-2.5 rounded-lg">
                          <Skeleton className="h-4 w-4 rounded" />
                          <div className="flex-1 space-y-1.5">
                            <Skeleton className="h-3.5 w-24" />
                            <Skeleton className="h-3 w-40" />
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : filteredStudents.map((s) => (
                    <label
                      key={s.roll_number}
                      className={`flex items-center gap-3 p-2.5 rounded-lg cursor-pointer transition-colors ${
                        selectedRolls.has(s.roll_number) ? "bg-primary/5" : "hover:bg-muted/50"
                      }`}
                    >
                      <Checkbox
                        checked={selectedRolls.has(s.roll_number)}
                        onCheckedChange={() => {
                          setSelectedRolls(new Set([s.roll_number]));
                        }}
                      />
                      <div className="flex-1 min-w-0">
                        <div className="text-sm font-medium text-foreground truncate">{s.roll_number}</div>
                        <div className="text-xs text-muted-foreground truncate">{s.name}</div>
                      </div>
                    </label>
                  ))}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Actions */}
        <div className="flex gap-2 pt-3 border-t border-border">
          {step === 2 && (
            <Button variant="outline" onClick={() => setStep(1)} className="flex-1">
              Back
            </Button>
          )}
          {step === 1 && (
            <>
              {(mode === "group" || (mode === "individual" && source === "monthly")) ? (
                <Button onClick={() => setStep(2)} className="flex-1 bg-gradient-cyber hover:opacity-90">
                  Next
                </Button>
              ) : (
                <Button
                  onClick={handleGenerate}
                  disabled={generating}
                  className="flex-1 bg-gradient-cyber hover:opacity-90 gap-2"
                >
                  {generating ? <Loader2 className="w-4 h-4 animate-spin" /> : <Download className="w-4 h-4" />}
                  {generating ? "Generating..." : "Download PDF"}
                </Button>
              )}
            </>
          )}
          {step === 2 && (
            <Button
              onClick={handleGenerate}
              disabled={generating || (mode === "group" && selectedRolls.size === 0) || (mode === "individual" && selectedRolls.size === 0)}
              className="flex-1 bg-gradient-cyber hover:opacity-90 gap-2"
            >
              {generating ? <Loader2 className="w-4 h-4 animate-spin" /> : <Download className="w-4 h-4" />}
              {generating ? "Generating..." : `Download PDF (${mode === "individual" ? 1 : selectedRolls.size})`}
            </Button>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
