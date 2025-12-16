import { useParams, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowLeft, Book, Download, FileText } from "lucide-react";
import { Button } from "@/components/ui/button";

interface Subject {
  name: string;
  code: string;
  materials: { title: string; type: string }[];
}

interface YearData {
  title: string;
  semesters: {
    name: string;
    subjects: Subject[];
  }[];
}

const yearData: Record<string, YearData> = {
  "1": {
    title: "1st Year",
    semesters: [
      {
        name: "Semester 1",
        subjects: [
          { name: "Mathematics I", code: "MA101", materials: [{ title: "Unit 1-5 Notes", type: "PDF" }, { title: "Practice Problems", type: "PDF" }] },
          { name: "Physics", code: "PH101", materials: [{ title: "Complete Notes", type: "PDF" }, { title: "Lab Manual", type: "PDF" }] },
          { name: "Chemistry", code: "CH101", materials: [{ title: "Theory Notes", type: "PDF" }, { title: "Lab Manual", type: "PDF" }] },
          { name: "English", code: "EN101", materials: [{ title: "Grammar & Communication", type: "PDF" }] },
          { name: "Engineering Drawing", code: "ED101", materials: [{ title: "Drawing Sheets", type: "PDF" }, { title: "CAD Notes", type: "PDF" }] },
        ],
      },
      {
        name: "Semester 2",
        subjects: [
          { name: "Mathematics II", code: "MA102", materials: [{ title: "Unit 1-5 Notes", type: "PDF" }, { title: "Previous Papers", type: "PDF" }] },
          { name: "Programming in C", code: "CS101", materials: [{ title: "Complete Notes", type: "PDF" }, { title: "Lab Programs", type: "PDF" }] },
          { name: "Environmental Science", code: "ES101", materials: [{ title: "Theory Notes", type: "PDF" }] },
          { name: "Basic Electrical Engineering", code: "EE101", materials: [{ title: "Circuit Theory", type: "PDF" }, { title: "Lab Manual", type: "PDF" }] },
        ],
      },
    ],
  },
  "2": {
    title: "2nd Year",
    semesters: [
      {
        name: "Semester 3",
        subjects: [
          { name: "Data Structures", code: "CS201", materials: [{ title: "Complete Notes", type: "PDF" }, { title: "Programs", type: "PDF" }] },
          { name: "Digital Logic Design", code: "CS202", materials: [{ title: "Theory Notes", type: "PDF" }, { title: "Lab Manual", type: "PDF" }] },
          { name: "Mathematics III", code: "MA201", materials: [{ title: "Unit 1-5 Notes", type: "PDF" }] },
          { name: "Object Oriented Programming", code: "CS203", materials: [{ title: "Java/C++ Notes", type: "PDF" }, { title: "Lab Programs", type: "PDF" }] },
          { name: "Discrete Mathematics", code: "MA202", materials: [{ title: "Complete Notes", type: "PDF" }] },
        ],
      },
      {
        name: "Semester 4",
        subjects: [
          { name: "Database Management Systems", code: "CS204", materials: [{ title: "Theory Notes", type: "PDF" }, { title: "SQL Lab", type: "PDF" }] },
          { name: "Operating Systems", code: "CS205", materials: [{ title: "Complete Notes", type: "PDF" }, { title: "Lab Manual", type: "PDF" }] },
          { name: "Computer Organization", code: "CS206", materials: [{ title: "Architecture Notes", type: "PDF" }] },
          { name: "Software Engineering", code: "CS207", materials: [{ title: "Theory Notes", type: "PDF" }, { title: "Case Studies", type: "PDF" }] },
        ],
      },
    ],
  },
  "3": {
    title: "3rd Year",
    semesters: [
      {
        name: "Semester 5",
        subjects: [
          { name: "Computer Networks", code: "CS301", materials: [{ title: "Complete Notes", type: "PDF" }, { title: "Lab Manual", type: "PDF" }] },
          { name: "Theory of Computation", code: "CS302", materials: [{ title: "Theory Notes", type: "PDF" }, { title: "Problem Sets", type: "PDF" }] },
          { name: "Compiler Design", code: "CS303", materials: [{ title: "Complete Notes", type: "PDF" }, { title: "Lab Programs", type: "PDF" }] },
          { name: "Web Technologies", code: "CS304", materials: [{ title: "HTML/CSS/JS Notes", type: "PDF" }, { title: "Projects", type: "PDF" }] },
          { name: "Machine Learning", code: "CS305", materials: [{ title: "Theory Notes", type: "PDF" }, { title: "Python Labs", type: "PDF" }] },
        ],
      },
      {
        name: "Semester 6",
        subjects: [
          { name: "Artificial Intelligence", code: "CS306", materials: [{ title: "Complete Notes", type: "PDF" }, { title: "Lab Programs", type: "PDF" }] },
          { name: "Cryptography & Network Security", code: "CS307", materials: [{ title: "Theory Notes", type: "PDF" }] },
          { name: "Cloud Computing", code: "CS308", materials: [{ title: "Complete Notes", type: "PDF" }, { title: "AWS Labs", type: "PDF" }] },
          { name: "Data Mining", code: "CS309", materials: [{ title: "Theory Notes", type: "PDF" }, { title: "Lab Manual", type: "PDF" }] },
        ],
      },
    ],
  },
  "4": {
    title: "4th Year",
    semesters: [
      {
        name: "Semester 7",
        subjects: [
          { name: "Deep Learning", code: "CS401", materials: [{ title: "Neural Networks", type: "PDF" }, { title: "TensorFlow Labs", type: "PDF" }] },
          { name: "Big Data Analytics", code: "CS402", materials: [{ title: "Hadoop Notes", type: "PDF" }, { title: "Spark Labs", type: "PDF" }] },
          { name: "Internet of Things", code: "CS403", materials: [{ title: "Complete Notes", type: "PDF" }, { title: "Arduino Labs", type: "PDF" }] },
          { name: "Elective I", code: "CS4E1", materials: [{ title: "Subject Notes", type: "PDF" }] },
        ],
      },
      {
        name: "Semester 8",
        subjects: [
          { name: "Project Work", code: "CS404", materials: [{ title: "Guidelines", type: "PDF" }, { title: "Report Format", type: "PDF" }] },
          { name: "Elective II", code: "CS4E2", materials: [{ title: "Subject Notes", type: "PDF" }] },
          { name: "Internship", code: "CS405", materials: [{ title: "Report Guidelines", type: "PDF" }] },
        ],
      },
    ],
  },
};

const YearNotes = () => {
  const { year, deptId } = useParams();
  const navigate = useNavigate();
  const data = yearData[year || "1"];

  if (!data) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900 flex items-center justify-center">
        <p className="text-white text-xl">Year not found</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center gap-4 mb-8"
        >
          <Button
            variant="ghost"
            size="icon"
            onClick={() => navigate(`/department/${deptId}/student-portal`)}
            className="text-white hover:bg-white/10"
          >
            <ArrowLeft className="w-6 h-6" />
          </Button>
          <div>
            <h1 className="text-3xl md:text-4xl font-bold text-white">
              {data.title} Notes & Materials
            </h1>
            <p className="text-blue-200 mt-1">Download subject-wise study materials</p>
          </div>
        </motion.div>

        {/* Semesters */}
        <div className="space-y-8">
          {data.semesters.map((semester, semIndex) => (
            <motion.div
              key={semester.name}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: semIndex * 0.1 }}
              className="bg-white/5 backdrop-blur-sm rounded-xl p-6 border border-blue-500/20"
            >
              <h2 className="text-2xl font-semibold text-white mb-6 flex items-center gap-2">
                <Book className="w-6 h-6 text-blue-400" />
                {semester.name}
              </h2>

              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                {semester.subjects.map((subject, subIndex) => (
                  <motion.div
                    key={subject.code}
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: semIndex * 0.1 + subIndex * 0.05 }}
                    className="bg-gradient-to-br from-blue-600/20 to-indigo-600/20 rounded-lg p-4 border border-blue-400/30 hover:border-blue-400/50 transition-all"
                  >
                    <div className="flex items-start justify-between mb-3">
                      <div>
                        <h3 className="text-white font-medium">{subject.name}</h3>
                        <p className="text-blue-300 text-sm">{subject.code}</p>
                      </div>
                      <FileText className="w-5 h-5 text-blue-400" />
                    </div>

                    <div className="space-y-2">
                      {subject.materials.map((material, matIndex) => (
                        <button
                          key={matIndex}
                          className="w-full flex items-center justify-between p-2 bg-white/5 rounded-lg hover:bg-white/10 transition-colors text-left group"
                        >
                          <span className="text-blue-100 text-sm">{material.title}</span>
                          <Download className="w-4 h-4 text-blue-400 group-hover:text-blue-300" />
                        </button>
                      ))}
                    </div>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default YearNotes;
