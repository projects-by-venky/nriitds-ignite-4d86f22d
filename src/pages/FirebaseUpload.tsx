import { useState, useRef } from "react";
import { motion } from "framer-motion";
import { Upload, FileSpreadsheet, CheckCircle, AlertCircle, Loader2, Download, Database } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import MobileBottomNav from "@/components/layout/MobileBottomNav";
import { parseCSVToStudents, uploadStudentsBatch, seedDemoData } from "@/lib/firebase-helpers";

const branches = [
  { value: "CSE", label: "CSE" },
  { value: "IT", label: "IT" },
  { value: "DS", label: "DS" },
  { value: "ECE", label: "ECE" },
  { value: "EEE", label: "EEE" },
  { value: "MECH", label: "MECH" },
];

const FirebaseUpload = () => {
  const { toast } = useToast();
  const fileRef = useRef<HTMLInputElement>(null);

  const [dataType, setDataType] = useState<"attendance" | "results">("attendance");
  const [isUploading, setIsUploading] = useState(false);
  const [uploadResult, setUploadResult] = useState<{ success: number; failed: number } | null>(null);
  const [previewCount, setPreviewCount] = useState(0);

  // Seed demo data state
  const [seedBranch, setSeedBranch] = useState("CSE");
  const [seedSemester, setSeedSemester] = useState("2-2");
  const [seedSection, setSeedSection] = useState("A");
  const [isSeeding, setIsSeeding] = useState(false);

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsUploading(true);
    setUploadResult(null);

    try {
      const text = await file.text();
      const students = parseCSVToStudents(text, dataType);
      setPreviewCount(students.length);

      if (students.length === 0) {
        toast({ title: "No valid records found", description: "Check CSV format: roll_number, name, branch, semester, section, then month columns", variant: "destructive" });
        setIsUploading(false);
        return;
      }

      const result = await uploadStudentsBatch(students);
      setUploadResult(result);
      toast({
        title: "Upload Complete",
        description: `${result.success} records uploaded, ${result.failed} failed`,
      });
    } catch (err: any) {
      console.error(err);
      toast({ title: "Upload Failed", description: err.message, variant: "destructive" });
    } finally {
      setIsUploading(false);
      if (fileRef.current) fileRef.current.value = "";
    }
  };

  const handleSeedDemo = async () => {
    setIsSeeding(true);
    try {
      const count = await seedDemoData(seedBranch, seedSemester, seedSection);
      toast({ title: "Demo Data Seeded", description: `${count} demo students added to Firebase for ${seedBranch} ${seedSemester} Section ${seedSection}` });
    } catch (err: any) {
      toast({ title: "Seed Failed", description: err.message, variant: "destructive" });
    } finally {
      setIsSeeding(false);
    }
  };

  const downloadTemplate = () => {
    const header = "roll_number,name,branch,semester,section,Jan,Feb,Mar,Apr,May";
    const sample = [
      "21CSE001,Rahul Kumar,CSE,2-2,A,92,88,94,90,87",
      "21CSE002,Priya Sharma,CSE,2-2,A,78,82,76,80,85",
    ].join("\n");
    const blob = new Blob([header + "\n" + sample], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${dataType}_template.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="pt-20 pb-24 md:pb-12">
        <div className="container mx-auto px-4 max-w-3xl">
          <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="mb-8">
            <h1 className="text-2xl md:text-3xl font-bold text-foreground mb-2">Firebase Data Upload</h1>
            <p className="text-sm text-muted-foreground">Upload student attendance & results to Firebase Firestore or seed demo data.</p>
          </motion.div>

          {/* CSV Upload */}
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
            <Card className="mb-6">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-lg">
                  <FileSpreadsheet className="w-5 h-5 text-primary" /> Upload CSV Data
                </CardTitle>
                <CardDescription>Upload a CSV file with student attendance or results data.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex gap-3 items-center flex-wrap">
                  <Select value={dataType} onValueChange={(v) => setDataType(v as "attendance" | "results")}>
                    <SelectTrigger className="w-40">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="attendance">Attendance</SelectItem>
                      <SelectItem value="results">Results</SelectItem>
                    </SelectContent>
                  </Select>
                  <Button variant="outline" size="sm" onClick={downloadTemplate}>
                    <Download className="w-4 h-4 mr-1" /> Template
                  </Button>
                </div>

                <div
                  className="border-2 border-dashed border-muted-foreground/30 rounded-xl p-8 text-center cursor-pointer hover:border-primary/50 transition-colors"
                  onClick={() => fileRef.current?.click()}
                >
                  {isUploading ? (
                    <Loader2 className="w-8 h-8 text-primary mx-auto animate-spin" />
                  ) : (
                    <Upload className="w-8 h-8 text-muted-foreground mx-auto mb-2" />
                  )}
                  <p className="text-sm text-muted-foreground">
                    {isUploading ? "Uploading to Firebase..." : "Click to select CSV file"}
                  </p>
                  <input ref={fileRef} type="file" accept=".csv" className="hidden" onChange={handleFileUpload} />
                </div>

                {uploadResult && (
                  <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex items-center gap-3 p-3 rounded-lg bg-primary/5 border border-primary/20">
                    {uploadResult.failed === 0 ? (
                      <CheckCircle className="w-5 h-5 text-green-600 shrink-0" />
                    ) : (
                      <AlertCircle className="w-5 h-5 text-yellow-600 shrink-0" />
                    )}
                    <div>
                      <p className="text-sm font-medium text-foreground">
                        {uploadResult.success} records uploaded successfully
                      </p>
                      {uploadResult.failed > 0 && (
                        <p className="text-xs text-destructive">{uploadResult.failed} records failed</p>
                      )}
                    </div>
                  </motion.div>
                )}
              </CardContent>
            </Card>
          </motion.div>

          {/* Seed Demo Data */}
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-lg">
                  <Database className="w-5 h-5 text-primary" /> Seed Demo Data
                </CardTitle>
                <CardDescription>Add sample student records to Firebase for testing analytics graphs.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex gap-3 flex-wrap">
                  <Select value={seedBranch} onValueChange={setSeedBranch}>
                    <SelectTrigger className="w-28">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {branches.map((b) => (
                        <SelectItem key={b.value} value={b.value}>{b.label}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <Select value={seedSemester} onValueChange={setSeedSemester}>
                    <SelectTrigger className="w-28">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {["1-1","1-2","2-1","2-2","3-1","3-2","4-1","4-2"].map((s) => (
                        <SelectItem key={s} value={s}>{s}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <Select value={seedSection} onValueChange={setSeedSection}>
                    <SelectTrigger className="w-20">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {["A","B","C","D"].map((s) => (
                        <SelectItem key={s} value={s}>{s}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <Button onClick={handleSeedDemo} disabled={isSeeding}>
                  {isSeeding ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <Database className="w-4 h-4 mr-2" />}
                  {isSeeding ? "Seeding..." : "Seed 15 Demo Students"}
                </Button>
                <p className="text-xs text-muted-foreground">
                  This adds 15 sample students with randomized attendance & results to your Firebase project.
                </p>
              </CardContent>
            </Card>
          </motion.div>

          {/* CSV Format Guide */}
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }} className="mt-6">
            <Card className="border-muted">
              <CardContent className="p-4">
                <p className="text-xs font-semibold text-muted-foreground mb-2">CSV FORMAT GUIDE</p>
                <code className="text-xs block bg-muted/50 p-3 rounded-lg overflow-x-auto whitespace-pre">
{`roll_number,name,branch,semester,section,Jan,Feb,Mar,Apr,May
21CSE001,Rahul Kumar,CSE,2-2,A,92,88,94,90,87
21CSE002,Priya Sharma,CSE,2-2,A,78,82,76,80,85`}
                </code>
                <div className="mt-3 flex gap-2 flex-wrap">
                  <Badge variant="secondary" className="text-xs">roll_number required</Badge>
                  <Badge variant="secondary" className="text-xs">name required</Badge>
                  <Badge variant="secondary" className="text-xs">Month columns = data values</Badge>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </main>
      <Footer />
      <MobileBottomNav />
    </div>
  );
};

export default FirebaseUpload;
