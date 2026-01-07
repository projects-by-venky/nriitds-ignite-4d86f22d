import { useState } from "react";
import { useParams, Link } from "react-router-dom";
import { ArrowLeft, FileText, ChevronDown, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";

interface FormLink {
  section: string;
  formUrl: string;
}

interface BranchForms {
  branch: string;
  sections: FormLink[];
}

interface SemesterData {
  semester: string;
  branches: BranchForms[];
}

interface YearData {
  year: string;
  semesters: SemesterData[];
}

// Common Google Form URL for all sections
const GOOGLE_FORM_URL = "https://docs.google.com/forms/d/e/1FAIpQLSeczgdFhUVJ9gq5ca7rKdd-M34aKxbsbi7eQ8nmU7X_Qk-ogQ/viewform?embedded=true";

// Form data structure - easily maintainable
const syllabusFormsData: YearData[] = [
  {
    year: "1st Year",
    semesters: [
      {
        semester: "1-1",
        branches: [
          {
            branch: "CSE",
            sections: [
              { section: "Section A", formUrl: GOOGLE_FORM_URL },
              { section: "Section B", formUrl: GOOGLE_FORM_URL },
              { section: "Section C", formUrl: GOOGLE_FORM_URL },
            ],
          },
          {
            branch: "DS",
            sections: [{ section: "Section A", formUrl: GOOGLE_FORM_URL }],
          },
        ],
      },
      {
        semester: "1-2",
        branches: [
          {
            branch: "CSE",
            sections: [
              { section: "Section A", formUrl: GOOGLE_FORM_URL },
              { section: "Section B", formUrl: GOOGLE_FORM_URL },
              { section: "Section C", formUrl: GOOGLE_FORM_URL },
            ],
          },
          {
            branch: "DS",
            sections: [{ section: "Section A", formUrl: GOOGLE_FORM_URL }],
          },
        ],
      },
    ],
  },
  {
    year: "2nd Year",
    semesters: [
      {
        semester: "2-1",
        branches: [
          {
            branch: "CSE",
            sections: [
              { section: "Section A", formUrl: GOOGLE_FORM_URL },
              { section: "Section B", formUrl: GOOGLE_FORM_URL },
              { section: "Section C", formUrl: GOOGLE_FORM_URL },
            ],
          },
          {
            branch: "DS",
            sections: [{ section: "Section A", formUrl: GOOGLE_FORM_URL }],
          },
        ],
      },
      {
        semester: "2-2",
        branches: [
          {
            branch: "CSE",
            sections: [
              { section: "Section A", formUrl: GOOGLE_FORM_URL },
              { section: "Section B", formUrl: GOOGLE_FORM_URL },
              { section: "Section C", formUrl: GOOGLE_FORM_URL },
            ],
          },
          {
            branch: "DS",
            sections: [{ section: "Section A", formUrl: GOOGLE_FORM_URL }],
          },
        ],
      },
    ],
  },
  {
    year: "3rd Year",
    semesters: [
      {
        semester: "3-1",
        branches: [
          {
            branch: "CSE",
            sections: [
              { section: "Section A", formUrl: GOOGLE_FORM_URL },
              { section: "Section B", formUrl: GOOGLE_FORM_URL },
              { section: "Section C", formUrl: GOOGLE_FORM_URL },
            ],
          },
          {
            branch: "DS",
            sections: [{ section: "Section A", formUrl: GOOGLE_FORM_URL }],
          },
        ],
      },
      {
        semester: "3-2",
        branches: [
          {
            branch: "CSE",
            sections: [
              { section: "Section A", formUrl: GOOGLE_FORM_URL },
              { section: "Section B", formUrl: GOOGLE_FORM_URL },
              { section: "Section C", formUrl: GOOGLE_FORM_URL },
            ],
          },
          {
            branch: "DS",
            sections: [{ section: "Section A", formUrl: GOOGLE_FORM_URL }],
          },
        ],
      },
    ],
  },
  {
    year: "4th Year",
    semesters: [
      {
        semester: "4-1",
        branches: [
          {
            branch: "CSE",
            sections: [
              { section: "Section A", formUrl: GOOGLE_FORM_URL },
              { section: "Section B", formUrl: GOOGLE_FORM_URL },
              { section: "Section C", formUrl: GOOGLE_FORM_URL },
            ],
          },
          {
            branch: "DS",
            sections: [{ section: "Section A", formUrl: GOOGLE_FORM_URL }],
          },
        ],
      },
      {
        semester: "4-2",
        branches: [
          {
            branch: "CSE",
            sections: [
              { section: "Section A", formUrl: GOOGLE_FORM_URL },
              { section: "Section B", formUrl: GOOGLE_FORM_URL },
              { section: "Section C", formUrl: GOOGLE_FORM_URL },
            ],
          },
          {
            branch: "DS",
            sections: [{ section: "Section A", formUrl: GOOGLE_FORM_URL }],
          },
        ],
      },
    ],
  },
];

const SyllabusReviewForms = () => {
  const { deptId } = useParams();
  const [selectedForm, setSelectedForm] = useState<{
    semester: string;
    branch: string;
    section: string;
    url: string;
  } | null>(null);
  const [openYears, setOpenYears] = useState<string[]>([]);
  const [openSemesters, setOpenSemesters] = useState<string[]>([]);

  const toggleYear = (year: string) => {
    setOpenYears((prev) =>
      prev.includes(year) ? prev.filter((y) => y !== year) : [...prev, year]
    );
  };

  const toggleSemester = (semester: string) => {
    setOpenSemesters((prev) =>
      prev.includes(semester)
        ? prev.filter((s) => s !== semester)
        : [...prev, semester]
    );
  };

  const handleFormSelect = (
    semester: string,
    branch: string,
    section: string,
    url: string
  ) => {
    if (!url) {
      return;
    }
    setSelectedForm({ semester, branch, section, url });
  };

  const closeForm = () => {
    setSelectedForm(null);
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-card/95 backdrop-blur-sm border-b border-border shadow-sm">
        <div className="container mx-auto px-4 py-3 md:py-4">
          <div className="flex items-center gap-3">
            <Link to={`/department/${deptId}/faculty-portal`}>
              <Button variant="ghost" size="icon" className="shrink-0">
                <ArrowLeft className="h-5 w-5" />
              </Button>
            </Link>
            <div>
              <h1 className="text-lg md:text-xl font-bold text-foreground">
                Syllabus Review Forms
              </h1>
              <p className="text-xs md:text-sm text-muted-foreground">
                Faculty Portal • {deptId?.toUpperCase()} Department
              </p>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-6 md:py-8">
        {selectedForm ? (
          /* Form View */
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-lg font-semibold text-foreground">
                  {selectedForm.semester} • {selectedForm.branch} •{" "}
                  {selectedForm.section}
                </h2>
                <p className="text-sm text-muted-foreground">
                  Syllabus Review Form
                </p>
              </div>
              <Button variant="outline" onClick={closeForm}>
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to List
              </Button>
            </div>

            {/* Embedded Google Form */}
            <div className="w-full bg-card rounded-lg border border-border overflow-hidden shadow-sm">
              <iframe
                src={selectedForm.url}
                className="w-full border-none"
                style={{ height: "calc(100vh - 200px)", minHeight: "600px" }}
                loading="lazy"
                title={`Syllabus Review Form - ${selectedForm.semester} ${selectedForm.branch} ${selectedForm.section}`}
              />
            </div>
          </div>
        ) : (
          /* Year/Semester/Branch Selection */
          <div className="space-y-4">
            <div className="mb-6">
              <h2 className="text-lg md:text-xl font-semibold text-foreground mb-2">
                Select Year & Section
              </h2>
              <p className="text-sm text-muted-foreground">
                Choose the academic year, semester, and section to access the
                syllabus review form.
              </p>
            </div>

            <div className="space-y-3">
              {syllabusFormsData.map((yearData) => (
                <Collapsible
                  key={yearData.year}
                  open={openYears.includes(yearData.year)}
                  onOpenChange={() => toggleYear(yearData.year)}
                >
                  <CollapsibleTrigger className="w-full">
                    <div className="flex items-center justify-between p-4 bg-card rounded-lg border border-border hover:bg-accent/50 transition-colors">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                          <FileText className="h-5 w-5 text-primary" />
                        </div>
                        <span className="font-semibold text-foreground">
                          {yearData.year}
                        </span>
                      </div>
                      {openYears.includes(yearData.year) ? (
                        <ChevronDown className="h-5 w-5 text-muted-foreground" />
                      ) : (
                        <ChevronRight className="h-5 w-5 text-muted-foreground" />
                      )}
                    </div>
                  </CollapsibleTrigger>

                  <CollapsibleContent className="mt-2 ml-4 md:ml-6 space-y-2">
                    {yearData.semesters.map((semesterData) => (
                      <Collapsible
                        key={semesterData.semester}
                        open={openSemesters.includes(semesterData.semester)}
                        onOpenChange={() =>
                          toggleSemester(semesterData.semester)
                        }
                      >
                        <CollapsibleTrigger className="w-full">
                          <div className="flex items-center justify-between p-3 bg-secondary/30 rounded-lg border border-border/50 hover:bg-secondary/50 transition-colors">
                            <span className="font-medium text-foreground">
                              Semester {semesterData.semester}
                            </span>
                            {openSemesters.includes(semesterData.semester) ? (
                              <ChevronDown className="h-4 w-4 text-muted-foreground" />
                            ) : (
                              <ChevronRight className="h-4 w-4 text-muted-foreground" />
                            )}
                          </div>
                        </CollapsibleTrigger>

                        <CollapsibleContent className="mt-2 ml-4 space-y-2">
                          {semesterData.branches.map((branchData) => (
                            <div
                              key={branchData.branch}
                              className="bg-muted/30 rounded-lg p-3 border border-border/30"
                            >
                              <h4 className="font-medium text-sm text-foreground mb-2">
                                {branchData.branch}
                              </h4>
                              <div className="flex flex-wrap gap-2">
                                {branchData.sections.map((sectionData) => (
                                  <button
                                    key={sectionData.section}
                                    onClick={() =>
                                      handleFormSelect(
                                        semesterData.semester,
                                        branchData.branch,
                                        sectionData.section,
                                        sectionData.formUrl
                                      )
                                    }
                                    disabled={!sectionData.formUrl}
                                    className={`px-3 py-1.5 text-sm rounded-md transition-colors ${
                                      sectionData.formUrl
                                        ? "bg-primary text-primary-foreground hover:bg-primary/90"
                                        : "bg-muted text-muted-foreground cursor-not-allowed"
                                    }`}
                                  >
                                    {sectionData.section}
                                    {!sectionData.formUrl && (
                                      <span className="ml-1 text-xs">
                                        (Coming Soon)
                                      </span>
                                    )}
                                  </button>
                                ))}
                              </div>
                            </div>
                          ))}
                        </CollapsibleContent>
                      </Collapsible>
                    ))}
                  </CollapsibleContent>
                </Collapsible>
              ))}
            </div>
          </div>
        )}
      </main>
    </div>
  );
};

export default SyllabusReviewForms;
