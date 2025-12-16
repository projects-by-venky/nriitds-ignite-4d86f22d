import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import Home from "./pages/Home";
import About from "./pages/About";
import Branches from "./pages/Branches";
import Courses from "./pages/Courses";
import Research from "./pages/Research";
import Placements from "./pages/Placements";
import CampusLife from "./pages/CampusLife";
import Events from "./pages/Events";
import Contact from "./pages/Contact";
import Department from "./pages/Department";
import StudentPortal from "./pages/StudentPortal";
import FacultyPortal from "./pages/FacultyPortal";
import Attendance from "./pages/Attendance";
import MonthlyAttendance from "./pages/MonthlyAttendance";
import Timetable from "./pages/Timetable";
import YearNotes from "./pages/YearNotes";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/home" element={<Home />} />
          <Route path="/about" element={<About />} />
          <Route path="/branches" element={<Branches />} />
          <Route path="/courses" element={<Courses />} />
          <Route path="/research" element={<Research />} />
          <Route path="/placements" element={<Placements />} />
          <Route path="/campus-life" element={<CampusLife />} />
          <Route path="/events" element={<Events />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/department/:deptId" element={<Department />} />
          <Route path="/department/:deptId/student-portal" element={<StudentPortal />} />
          <Route path="/department/:deptId/faculty-portal" element={<FacultyPortal />} />
          <Route path="/attendance" element={<Attendance />} />
          <Route path="/department/:deptId/attendance/:section" element={<Attendance />} />
          <Route path="/department/:deptId/monthly-attendance/:section" element={<MonthlyAttendance />} />
          <Route path="/department/:deptId/timetable/:section" element={<Timetable />} />
          <Route path="/department/:deptId/notes/:year" element={<YearNotes />} />
          {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
