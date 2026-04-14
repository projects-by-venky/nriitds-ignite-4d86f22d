import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import type { HourlyAttendanceRecord } from "./firebase-helpers";

// Extend jsPDF type for autotable
declare module "jspdf" {
  interface jsPDF {
    autoTable: (options: any) => jsPDF;
    lastAutoTable: { finalY: number };
  }
}

interface PDFOptions {
  title: string;
  studentName?: string;
  rollNumber?: string;
  branch?: string;
  section?: string;
  semester?: string;
}

const COLORS = {
  primary: [15, 76, 130] as [number, number, number],
  accent: [0, 188, 212] as [number, number, number],
  green: [34, 197, 94] as [number, number, number],
  red: [239, 68, 68] as [number, number, number],
  yellow: [234, 179, 8] as [number, number, number],
  dark: [15, 23, 42] as [number, number, number],
  muted: [100, 116, 139] as [number, number, number],
  white: [255, 255, 255] as [number, number, number],
  lightBg: [241, 245, 249] as [number, number, number],
};

function getAttendanceColor(percent: number): [number, number, number] {
  if (percent >= 75) return COLORS.green;
  if (percent >= 50) return COLORS.yellow;
  return COLORS.red;
}

function addHeader(doc: jsPDF, options: PDFOptions) {
  const pageWidth = doc.internal.pageSize.getWidth();

  // Header background
  doc.setFillColor(...COLORS.primary);
  doc.rect(0, 0, pageWidth, 40, "F");

  // Accent stripe
  doc.setFillColor(...COLORS.accent);
  doc.rect(0, 40, pageWidth, 3, "F");

  // College name
  doc.setTextColor(...COLORS.white);
  doc.setFontSize(20);
  doc.setFont("helvetica", "bold");
  doc.text("NRIIT", 14, 18);

  // Subtitle
  doc.setFontSize(10);
  doc.setFont("helvetica", "normal");
  doc.text("NRI Institute of Information Technology", 14, 26);

  // Report title
  doc.setFontSize(13);
  doc.setFont("helvetica", "bold");
  doc.text(options.title, 14, 36);

  // Date on right
  doc.setFontSize(9);
  doc.setFont("helvetica", "normal");
  const dateStr = new Date().toLocaleDateString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
  doc.text(`Generated: ${dateStr}`, pageWidth - 14, 36, { align: "right" });
}

function addStudentInfo(doc: jsPDF, options: PDFOptions, startY: number): number {
  if (!options.studentName) return startY;

  const pageWidth = doc.internal.pageSize.getWidth();

  doc.setFillColor(...COLORS.lightBg);
  doc.roundedRect(14, startY, pageWidth - 28, 28, 3, 3, "F");

  doc.setTextColor(...COLORS.dark);
  doc.setFontSize(13);
  doc.setFont("helvetica", "bold");
  doc.text(options.studentName, 20, startY + 11);

  doc.setFontSize(9);
  doc.setFont("helvetica", "normal");
  doc.setTextColor(...COLORS.muted);
  const details = [
    options.rollNumber,
    options.branch,
    options.section ? `Section ${options.section}` : null,
    options.semester,
  ]
    .filter(Boolean)
    .join("  •  ");
  doc.text(details, 20, startY + 20);

  return startY + 34;
}

function addStatsCards(
  doc: jsPDF,
  totalClasses: number,
  present: number,
  absent: number,
  startY: number
): number {
  const pageWidth = doc.internal.pageSize.getWidth();
  const cardWidth = (pageWidth - 42) / 3;
  const percent = totalClasses > 0 ? Math.round((present / totalClasses) * 100) : 0;

  const stats = [
    { label: "Total Classes", value: String(totalClasses), color: COLORS.primary },
    { label: "Present", value: String(present), color: COLORS.green },
    { label: "Absent", value: String(absent), color: COLORS.red },
  ];

  stats.forEach((stat, i) => {
    const x = 14 + i * (cardWidth + 7);

    doc.setFillColor(...COLORS.lightBg);
    doc.roundedRect(x, startY, cardWidth, 24, 2, 2, "F");

    // Top accent line
    doc.setFillColor(...stat.color);
    doc.rect(x, startY, cardWidth, 2, "F");

    doc.setTextColor(...stat.color);
    doc.setFontSize(16);
    doc.setFont("helvetica", "bold");
    doc.text(stat.value, x + cardWidth / 2, startY + 13, { align: "center" });

    doc.setTextColor(...COLORS.muted);
    doc.setFontSize(8);
    doc.setFont("helvetica", "normal");
    doc.text(stat.label, x + cardWidth / 2, startY + 20, { align: "center" });
  });

  // Overall percentage
  const y = startY + 30;
  const pColor = getAttendanceColor(percent);
  doc.setFillColor(...COLORS.lightBg);
  doc.roundedRect(14, y, pageWidth - 28, 14, 2, 2, "F");

  doc.setTextColor(...COLORS.dark);
  doc.setFontSize(10);
  doc.setFont("helvetica", "bold");
  doc.text("Overall Attendance:", 20, y + 9);

  doc.setTextColor(...pColor);
  doc.setFontSize(14);
  doc.text(`${percent}%`, pageWidth - 20, y + 10, { align: "right" });

  // Progress bar
  const barY = y + 12;
  const barWidth = pageWidth - 28;
  doc.setFillColor(226, 232, 240);
  doc.roundedRect(14, barY, barWidth, 3, 1, 1, "F");
  doc.setFillColor(...pColor);
  doc.roundedRect(14, barY, barWidth * (percent / 100), 3, 1, 1, "F");

  return barY + 10;
}

function addSubjectAnalysis(
  doc: jsPDF,
  records: HourlyAttendanceRecord[],
  startY: number
): number {
  const map: Record<string, { present: number; absent: number }> = {};
  records.forEach((r) => {
    if (!map[r.subject]) map[r.subject] = { present: 0, absent: 0 };
    if (r.status === "Present") map[r.subject].present++;
    else map[r.subject].absent++;
  });

  const subjects = Object.entries(map).map(([subject, data]) => ({
    subject,
    present: data.present,
    absent: data.absent,
    total: data.present + data.absent,
    percent: Math.round((data.present / (data.present + data.absent)) * 100),
  }));

  if (subjects.length === 0) return startY;

  doc.setTextColor(...COLORS.dark);
  doc.setFontSize(11);
  doc.setFont("helvetica", "bold");
  doc.text("Subject-wise Analysis", 14, startY);
  startY += 4;

  const pageWidth = doc.internal.pageSize.getWidth();

  doc.autoTable({
    startY,
    head: [["Subject", "Present", "Absent", "Total", "Attendance %"]],
    body: subjects.map((s) => [
      s.subject,
      String(s.present),
      String(s.absent),
      String(s.total),
      `${s.percent}%`,
    ]),
    margin: { left: 14, right: 14 },
    headStyles: {
      fillColor: COLORS.primary,
      textColor: COLORS.white,
      fontStyle: "bold",
      fontSize: 9,
    },
    bodyStyles: { fontSize: 9, textColor: COLORS.dark },
    alternateRowStyles: { fillColor: [248, 250, 252] },
    columnStyles: {
      4: {
        fontStyle: "bold",
      },
    },
    didParseCell: (data: any) => {
      if (data.section === "body" && data.column.index === 4) {
        const val = parseInt(data.cell.raw);
        if (val >= 75) data.cell.styles.textColor = COLORS.green;
        else if (val >= 50) data.cell.styles.textColor = COLORS.yellow;
        else data.cell.styles.textColor = COLORS.red;
      }
    },
  });

  return doc.lastAutoTable.finalY + 8;
}

function addAttendanceTable(
  doc: jsPDF,
  records: HourlyAttendanceRecord[],
  startY: number
): number {
  doc.setTextColor(...COLORS.dark);
  doc.setFontSize(11);
  doc.setFont("helvetica", "bold");
  doc.text("Detailed Attendance Records", 14, startY);
  startY += 4;

  doc.autoTable({
    startY,
    head: [["#", "Date", "Subject", "Hour", "Status"]],
    body: records.map((r, i) => [
      String(i + 1),
      r.date,
      r.subject,
      `Hour ${r.hour}`,
      r.status,
    ]),
    margin: { left: 14, right: 14 },
    headStyles: {
      fillColor: COLORS.primary,
      textColor: COLORS.white,
      fontStyle: "bold",
      fontSize: 9,
    },
    bodyStyles: { fontSize: 8, textColor: COLORS.dark },
    alternateRowStyles: { fillColor: [248, 250, 252] },
    columnStyles: {
      0: { cellWidth: 12, halign: "center" },
      4: { fontStyle: "bold" },
    },
    didParseCell: (data: any) => {
      if (data.section === "body" && data.column.index === 4) {
        if (data.cell.raw === "Present") data.cell.styles.textColor = COLORS.green;
        else data.cell.styles.textColor = COLORS.red;
      }
    },
  });

  return doc.lastAutoTable.finalY + 8;
}

function addWatermark(doc: jsPDF) {
  const pageCount = doc.getNumberOfPages();
  for (let i = 1; i <= pageCount; i++) {
    doc.setPage(i);
    doc.setTextColor(200, 210, 220);
    doc.setFontSize(40);
    doc.setFont("helvetica", "bold");

    const pageWidth = doc.internal.pageSize.getWidth();
    const pageHeight = doc.internal.pageSize.getHeight();

    doc.text("NRIIT Portal", pageWidth / 2, pageHeight / 2, {
      align: "center",
      angle: 45,
    });

    // Footer
    doc.setTextColor(...COLORS.muted);
    doc.setFontSize(7);
    doc.setFont("helvetica", "normal");
    doc.text(
      `Generated by NRIIT Portal  •  Page ${i} of ${pageCount}`,
      pageWidth / 2,
      pageHeight - 8,
      { align: "center" }
    );
  }
}

// ===== PUBLIC API =====

export function generateStudentAttendancePDF(
  records: HourlyAttendanceRecord[],
  options: PDFOptions
): void {
  if (records.length === 0) return;

  const doc = new jsPDF("p", "mm", "a4");
  addHeader(doc, options);

  let y = 50;
  y = addStudentInfo(doc, options, y);

  const present = records.filter((r) => r.status === "Present").length;
  const absent = records.filter((r) => r.status === "Absent").length;
  y = addStatsCards(doc, records.length, present, absent, y);

  y = addSubjectAnalysis(doc, records, y);
  addAttendanceTable(doc, records, y);
  addWatermark(doc);

  const filename = options.rollNumber
    ? `${options.rollNumber}_Attendance_Report.pdf`
    : "Attendance_Report.pdf";
  doc.save(filename);
}

export function generateClassAttendancePDF(
  allRecords: HourlyAttendanceRecord[],
  branch: string,
  section: string
): void {
  if (allRecords.length === 0) return;

  const doc = new jsPDF("p", "mm", "a4");
  addHeader(doc, {
    title: `Class Attendance Report — ${branch.toUpperCase()} Section ${section.toUpperCase()}`,
  });

  // Group by student
  const studentMap: Record<
    string,
    { name: string; records: HourlyAttendanceRecord[] }
  > = {};
  allRecords.forEach((r) => {
    if (!studentMap[r.roll_number]) {
      studentMap[r.roll_number] = { name: r.name, records: [] };
    }
    studentMap[r.roll_number].records.push(r);
  });

  const students = Object.entries(studentMap)
    .map(([roll, data]) => {
      const present = data.records.filter((r) => r.status === "Present").length;
      const total = data.records.length;
      return {
        roll,
        name: data.name,
        total,
        present,
        absent: total - present,
        percent: total > 0 ? Math.round((present / total) * 100) : 0,
      };
    })
    .sort((a, b) => a.roll.localeCompare(b.roll));

  let y = 50;

  // Summary info
  doc.setFillColor(...COLORS.lightBg);
  doc.roundedRect(14, y, doc.internal.pageSize.getWidth() - 28, 14, 2, 2, "F");
  doc.setTextColor(...COLORS.dark);
  doc.setFontSize(10);
  doc.setFont("helvetica", "bold");
  doc.text(`Total Students: ${students.length}`, 20, y + 9);
  const avgPercent =
    students.length > 0
      ? Math.round(students.reduce((s, st) => s + st.percent, 0) / students.length)
      : 0;
  const avgColor = getAttendanceColor(avgPercent);
  doc.setTextColor(...avgColor);
  doc.text(
    `Class Average: ${avgPercent}%`,
    doc.internal.pageSize.getWidth() - 20,
    y + 9,
    { align: "right" }
  );
  y += 20;

  // Summary table
  doc.setTextColor(...COLORS.dark);
  doc.setFontSize(11);
  doc.setFont("helvetica", "bold");
  doc.text("Student Summary", 14, y);
  y += 4;

  doc.autoTable({
    startY: y,
    head: [["#", "Roll Number", "Name", "Present", "Absent", "Total", "Attendance %"]],
    body: students.map((s, i) => [
      String(i + 1),
      s.roll,
      s.name,
      String(s.present),
      String(s.absent),
      String(s.total),
      `${s.percent}%`,
    ]),
    margin: { left: 14, right: 14 },
    headStyles: {
      fillColor: COLORS.primary,
      textColor: COLORS.white,
      fontStyle: "bold",
      fontSize: 8,
    },
    bodyStyles: { fontSize: 8, textColor: COLORS.dark },
    alternateRowStyles: { fillColor: [248, 250, 252] },
    columnStyles: {
      0: { cellWidth: 10, halign: "center" },
      6: { fontStyle: "bold" },
    },
    didParseCell: (data: any) => {
      if (data.section === "body" && data.column.index === 6) {
        const val = parseInt(data.cell.raw);
        if (val >= 75) data.cell.styles.textColor = COLORS.green;
        else if (val >= 50) data.cell.styles.textColor = COLORS.yellow;
        else data.cell.styles.textColor = COLORS.red;
      }
    },
  });

  addWatermark(doc);
  doc.save(`${branch.toUpperCase()}_${section.toUpperCase()}_Full_Report.pdf`);
}

export function generateMonthlyAttendancePDF(
  studentName: string,
  rollNumber: string,
  branch: string,
  section: string,
  semester: string,
  monthlyAttendance: Record<string, number>,
  monthlyResults: Record<string, number>
): void {
  const doc = new jsPDF("p", "mm", "a4");
  addHeader(doc, { title: "Monthly Attendance & Results Report" });

  let y = 50;
  y = addStudentInfo(doc, {
    title: "",
    studentName,
    rollNumber,
    branch,
    section: `Section ${section}`,
    semester,
  }, y);

  const months = Object.keys(monthlyAttendance);
  const avgAttendance =
    months.length > 0
      ? Math.round(
          months.reduce((s, m) => s + (monthlyAttendance[m] || 0), 0) / months.length
        )
      : 0;
  const avgColor = getAttendanceColor(avgAttendance);

  // Overall stat
  const pageWidth = doc.internal.pageSize.getWidth();
  doc.setFillColor(...COLORS.lightBg);
  doc.roundedRect(14, y, pageWidth - 28, 14, 2, 2, "F");
  doc.setTextColor(...COLORS.dark);
  doc.setFontSize(10);
  doc.setFont("helvetica", "bold");
  doc.text("Average Attendance:", 20, y + 9);
  doc.setTextColor(...avgColor);
  doc.setFontSize(14);
  doc.text(`${avgAttendance}%`, pageWidth - 20, y + 10, { align: "right" });
  y += 22;

  // Monthly table
  doc.setTextColor(...COLORS.dark);
  doc.setFontSize(11);
  doc.setFont("helvetica", "bold");
  doc.text("Monthly Attendance", 14, y);
  y += 4;

  doc.autoTable({
    startY: y,
    head: [["Month", "Attendance %", "Status"]],
    body: months.map((m) => {
      const val = monthlyAttendance[m] || 0;
      let status = "Good";
      if (val < 50) status = "Critical";
      else if (val < 75) status = "Warning";
      return [m, `${val}%`, status];
    }),
    margin: { left: 14, right: 14 },
    headStyles: {
      fillColor: COLORS.primary,
      textColor: COLORS.white,
      fontStyle: "bold",
      fontSize: 9,
    },
    bodyStyles: { fontSize: 9, textColor: COLORS.dark },
    alternateRowStyles: { fillColor: [248, 250, 252] },
    didParseCell: (data: any) => {
      if (data.section === "body") {
        if (data.column.index === 1 || data.column.index === 2) {
          const row = data.row.index;
          const val = monthlyAttendance[months[row]] || 0;
          if (val >= 75) data.cell.styles.textColor = COLORS.green;
          else if (val >= 50) data.cell.styles.textColor = COLORS.yellow;
          else data.cell.styles.textColor = COLORS.red;
          data.cell.styles.fontStyle = "bold";
        }
      }
    },
  });

  y = doc.lastAutoTable.finalY + 10;

  // Results table if available
  const resultMonths = Object.keys(monthlyResults);
  if (resultMonths.length > 0) {
    if (y > 240) {
      doc.addPage();
      y = 20;
    }

    doc.setTextColor(...COLORS.dark);
    doc.setFontSize(11);
    doc.setFont("helvetica", "bold");
    doc.text("Monthly Results", 14, y);
    y += 4;

    doc.autoTable({
      startY: y,
      head: [["Month", "Score %"]],
      body: resultMonths.map((m) => [m, `${monthlyResults[m] || 0}%`]),
      margin: { left: 14, right: 14 },
      headStyles: {
        fillColor: COLORS.primary,
        textColor: COLORS.white,
        fontStyle: "bold",
        fontSize: 9,
      },
      bodyStyles: { fontSize: 9, textColor: COLORS.dark },
      alternateRowStyles: { fillColor: [248, 250, 252] },
    });
  }

  addWatermark(doc);
  doc.save(`${rollNumber}_Monthly_Report.pdf`);
}
