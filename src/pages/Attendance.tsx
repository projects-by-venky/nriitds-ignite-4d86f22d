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
import { useParams, useNavigate, Link } from "react-router-dom";
import Header from "@/components/layout/Header";
import MobileBottomNav from "@/components/layout/MobileBottomNav";
import MobileSearchBar from "@/components/mobile/MobileSearchBar";
import MobileFilterSheet from "@/components/mobile/MobileFilterSheet";
import { useIsMobile } from "@/hooks/use-mobile";

export type AttendanceFilter = "all" | "present" | "absent";

const Attendance = () => {
  const { section, deptId } = useParams<{ section?: string; deptId?: string }>();
  const navigate = useNavigate();
  const isMobile = useIsMobile();
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
  const activeFilterCount = [statusFilter !== "all", startDate, endDate].filter(Boolean).length;

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      {/* Mobile Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-card border-b border-border sticky top-14 md:top-16 z-40"
      >
        <div className="container mx-auto px-4 py-3 md:py-4">
          {/* Back Button - Mobile */}
          {section && deptId && (
            <Link
              to={`/department/${deptId}/student-portal`}
              className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors mb-3 touch-target justify-start"
            >
              <ArrowLeft className="w-5 h-5" />
              <span className="text-sm">Back</span>
            </Link>
          )}
          
          {/* Title */}
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 md:w-12 md:h-12 rounded-xl bg-gradient-cyber flex items-center justify-center flex-shrink-0">
              <Calendar className="w-5 h-5 md:w-6 md:h-6 text-white" />
            </div>
            <div className="min-w-0 flex-1">
              <h1 className="text-lg md:text-2xl font-bold text-foreground truncate">
                Hourly Attendance
              </h1>
              {section && (
                <p className="text-xs md:text-sm text-muted-foreground truncate">
                  Section: {section}
                </p>
              )}
            </div>
          </div>

          {/* Search & Filter Row */}
          <div className="flex gap-2 md:gap-3">
            {/* Mobile Search */}
            <div className="flex-1">
              <MobileSearchBar
                value={searchQuery}
                onChange={setSearchQuery}
                placeholder="Exact roll no. or suffix (e.g., 40)"
              />
            </div>

            {/* Filter Button - Mobile uses bottom sheet */}
            {isMobile ? (
              <MobileFilterSheet
                statusFilter={statusFilter}
                onStatusFilterChange={setStatusFilter}
                startDate={startDate}
                onStartDateChange={setStartDate}
                endDate={endDate}
                onEndDateChange={setEndDate}
                onClear={clearFilters}
                hasActiveFilters={!!hasActiveFilters}
                activeFilterCount={activeFilterCount}
              />
            ) : (
              <Button 
                variant={showFilters ? "default" : "outline"} 
                size="sm"
                className="h-12"
                onClick={() => setShowFilters(!showFilters)}
              >
                <Filter className="w-4 h-4 mr-2" />
                Filter
                {hasActiveFilters && (
                  <span className="ml-2 px-1.5 py-0.5 bg-primary-foreground text-primary text-xs rounded-full">
                    {activeFilterCount}
                  </span>
                )}
              </Button>
            )}

            {/* Export Button */}
            <Button variant="outline" size="sm" className="h-12 px-3 md:px-4">
              <Download className="w-4 h-4 md:mr-2" />
              <span className="hidden md:inline">Export</span>
            </Button>
          </div>
        </div>
      </motion.div>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-4 md:py-6 pb-24 md:pb-6">
        {/* Desktop Filter Panel */}
        {!isMobile && showFilters && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="mb-6 bg-card border border-border rounded-xl p-4"
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
          </motion.div>
        )}

        {/* Active Filters Summary */}
        {hasActiveFilters && (
          <div className="mb-4 flex flex-wrap gap-2">
            <span className="text-xs text-muted-foreground">Filters:</span>
            {searchQuery && (
              <span className="inline-flex items-center px-2 py-1 bg-primary/10 text-primary text-xs rounded-lg">
                Roll: "{searchQuery}"
                <button onClick={() => setSearchQuery("")} className="ml-1.5">
                  <X className="w-3 h-3" />
                </button>
              </span>
            )}
            {statusFilter !== "all" && (
              <span className="inline-flex items-center px-2 py-1 bg-primary/10 text-primary text-xs rounded-lg">
                {statusFilter === "present" ? "Present" : "Absent"}
                <button onClick={() => setStatusFilter("all")} className="ml-1.5">
                  <X className="w-3 h-3" />
                </button>
              </span>
            )}
          </div>
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

          {/* Attendance Table - Responsive wrapper */}
          <div className="bg-card border border-border rounded-xl overflow-hidden">
            <AttendanceTable 
              statusFilter={statusFilter}
              startDate={startDate}
              endDate={endDate}
              searchQuery={searchQuery}
              selectedStudents={selectedStudents}
              onSelectStudent={handleSelectStudent}
              onSelectAll={handleSelectAll}
            />
          </div>
        </motion.div>
      </div>

      <MobileBottomNav />
    </div>
  );
};

export default Attendance;
