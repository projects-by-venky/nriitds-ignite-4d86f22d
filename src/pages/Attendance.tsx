import { motion } from "framer-motion";
import { Calendar, Download, Filter } from "lucide-react";
import { AttendanceTable } from "@/components/attendance/AttendanceTable";
import { Button } from "@/components/ui/button";

const Attendance = () => {
  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-card border-b border-border sticky top-0 z-10"
      >
        <div className="container mx-auto px-4 py-4">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div>
              <h1 className="text-3xl font-bold text-foreground flex items-center gap-2">
                <Calendar className="w-8 h-8 text-primary" />
                Hourly Attendance
              </h1>
              <p className="text-muted-foreground mt-1">
                View and track your attendance records
              </p>
            </div>
            
            <div className="flex gap-2">
              <Button variant="outline" size="sm">
                <Filter className="w-4 h-4 mr-2" />
                Filter
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
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <AttendanceTable />
        </motion.div>
      </div>
    </div>
  );
};

export default Attendance;
