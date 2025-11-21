import { motion } from "framer-motion";
import { Calendar, Download, Filter, X, Search, ArrowLeft } from "lucide-react";
import { AttendanceTable } from "@/components/attendance/AttendanceTable";
import { BulkActionsToolbar } from "@/components/attendance/BulkActionsToolbar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useState } from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Calendar as CalendarComponent } from "@/components/ui/calendar";
import { format } from "date-fns";
import { toast } from "@/hooks/use-toast";
import { useParams, useNavigate } from "react-router-dom";

export type AttendanceFilter = "all" | "present" | "absent";

const Attendance = () => {
  const { section, deptId } = useParams<{ section?: string; deptId?: string }>();
  const navigate = useNavigate();
  const [statusFilter, setStatusFilter] = useState<AttendanceFilter>("all");
  const [startDate, setStartDate] = useState<Date | undefined>(undefined);
  const [endDate, setEndDate] = useState<Date | undefined>(undefined);
  const [showFilters, setShowFilters] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedStudents, setSelectedStudents] = useState<Set<string>>(new Set());

  const handleSelectStudent = (rollNo: string, selected: boolean) => {
    const newSelected = new Set(selectedStudents);
    if (selected) {
      newSelected.add(rollNo);
    } else {
      newSelected.delete(rollNo);
    }
    setSelectedStudents(newSelected);
  };

  const handleSelectAll = (rollNos: string[], selected: boolean) => {
    if (selected) {
      setSelectedStudents(new Set(rollNos));
    } else {
      setSelectedStudents(new Set());
    }
  };

  const handleClearSelection = () => {
    setSelectedStudents(new Set());
  };

  const handleSendNotifications = () => {
    toast({
      title: "Notifications Sent",
      description: `Successfully sent notifications to ${selectedStudents.size} student${selectedStudents.size === 1 ? '' : 's'}.`,
    });
    setSelectedStudents(new Set());
  };

  const handleMarkAttendance = (status: "P" | "A") => {
    const statusText = status === "P" ? "Present" : "Absent";
    toast({
      title: "Attendance Marked",
      description: `Marked ${selectedStudents.size} student${selectedStudents.size === 1 ? '' : 's'} as ${statusText}.`,
    });
    setSelectedStudents(new Set());
  };

  const clearFilters = () => {
    setStatusFilter("all");
    setStartDate(undefined);
    setEndDate(undefined);
    setSearchQuery("");
  };

  const hasActiveFilters = statusFilter !== "all" || startDate || endDate || searchQuery;

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-card border-b border-border sticky top-0 z-50"
      >
        <div className="container mx-auto px-4 py-4">
          {/* Back Button */}
          {section && deptId && (
            <motion.button
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              onClick={() => navigate(`/department/${deptId}/student-portal`)}
              className="flex items-center gap-2 text-foreground/70 hover:text-primary transition-colors mb-4"
            >
              <ArrowLeft className="w-5 h-5" />
              Back to Student Portal
            </motion.button>
          )}
          
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div className="flex-1">
              <h1 className="text-3xl font-bold text-foreground flex items-center gap-2">
                <Calendar className="w-8 h-8 text-primary" />
                Hourly Attendance {section && `- ${section}`}
              </h1>
              <p className="text-muted-foreground mt-1">
                {section ? `View attendance records for section ${section}` : 'View and track your attendance records'}
              </p>
            </div>

            {/* Search Bar */}
            <div className="flex-1 max-w-md">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input
                  type="text"
                  placeholder="Search by roll number or name..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-9 pr-10"
                />
                {searchQuery && (
                  <button
                    onClick={() => setSearchQuery("")}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                  >
                    <X className="w-4 h-4" />
                  </button>
                )}
              </div>
            </div>
            
            <div className="flex gap-2">
              <Button 
                variant={showFilters ? "default" : "outline"} 
                size="sm"
                onClick={() => setShowFilters(!showFilters)}
              >
                <Filter className="w-4 h-4 mr-2" />
                Filter
                {hasActiveFilters && (
                  <span className="ml-2 px-1.5 py-0.5 bg-primary-foreground text-primary text-xs rounded-full">
                    {[statusFilter !== "all", startDate, endDate].filter(Boolean).length}
                  </span>
                )}
              </Button>
              <Button variant="outline" size="sm">
                <Download className="w-4 h-4 mr-2" />
                Export
              </Button>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-6">
        {/* Filter Panel */}
        {showFilters && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="mb-6 bg-card border border-border rounded-lg p-4"
          >
            <div className="flex flex-col md:flex-row gap-4">
              {/* Status Filter */}
              <div className="flex-1">
                <label className="text-sm font-medium text-foreground mb-2 block">
                  Attendance Status
                </label>
                <Select value={statusFilter} onValueChange={(value) => setStatusFilter(value as AttendanceFilter)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Records</SelectItem>
                    <SelectItem value="present">Present Only</SelectItem>
                    <SelectItem value="absent">Absent Only</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Start Date Filter */}
              <div className="flex-1">
                <label className="text-sm font-medium text-foreground mb-2 block">
                  Start Date
                </label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      className="w-full justify-start text-left font-normal"
                    >
                      <Calendar className="mr-2 h-4 w-4" />
                      {startDate ? format(startDate, "dd/MM/yyyy") : "Pick a date"}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <CalendarComponent
                      mode="single"
                      selected={startDate}
                      onSelect={setStartDate}
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>
              </div>

              {/* End Date Filter */}
              <div className="flex-1">
                <label className="text-sm font-medium text-foreground mb-2 block">
                  End Date
                </label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      className="w-full justify-start text-left font-normal"
                    >
                      <Calendar className="mr-2 h-4 w-4" />
                      {endDate ? format(endDate, "dd/MM/yyyy") : "Pick a date"}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <CalendarComponent
                      mode="single"
                      selected={endDate}
                      onSelect={setEndDate}
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>
              </div>

              {/* Clear Filters Button */}
              {hasActiveFilters && (
                <div className="flex items-end">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={clearFilters}
                    className="text-muted-foreground hover:text-foreground"
                  >
                    <X className="w-4 h-4 mr-1" />
                    Clear
                  </Button>
                </div>
              )}
            </div>

            {/* Active Filters Summary */}
            {hasActiveFilters && (
              <div className="mt-4 flex flex-wrap gap-2">
                <span className="text-sm text-muted-foreground">Active filters:</span>
                {searchQuery && (
                  <span className="inline-flex items-center px-2 py-1 bg-primary/10 text-primary text-xs rounded-md">
                    Search: "{searchQuery}"
                  </span>
                )}
                {statusFilter !== "all" && (
                  <span className="inline-flex items-center px-2 py-1 bg-primary/10 text-primary text-xs rounded-md">
                    Status: {statusFilter === "present" ? "Present" : "Absent"}
                  </span>
                )}
                {startDate && (
                  <span className="inline-flex items-center px-2 py-1 bg-primary/10 text-primary text-xs rounded-md">
                    From: {format(startDate, "dd/MM/yyyy")}
                  </span>
                )}
                {endDate && (
                  <span className="inline-flex items-center px-2 py-1 bg-primary/10 text-primary text-xs rounded-md">
                    To: {format(endDate, "dd/MM/yyyy")}
                  </span>
                )}
              </div>
            )}
          </motion.div>
        )}

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          {/* Bulk Actions Toolbar */}
          <BulkActionsToolbar
            selectedCount={selectedStudents.size}
            onClearSelection={handleClearSelection}
            onSendNotifications={handleSendNotifications}
            onMarkAttendance={handleMarkAttendance}
          />

          <AttendanceTable 
            statusFilter={statusFilter}
            startDate={startDate}
            endDate={endDate}
            searchQuery={searchQuery}
            selectedStudents={selectedStudents}
            onSelectStudent={handleSelectStudent}
            onSelectAll={handleSelectAll}
          />
        </motion.div>
      </div>
    </div>
  );
};

export default Attendance;
