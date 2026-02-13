import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Loader2, CheckCircle, Send, RotateCcw, Mail, BookOpen, User, Clock, Target, Layers, FileText, Percent } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { getBackendClient } from "@/integrations/backend/client";
import { toast } from "@/hooks/use-toast";

// Validation schema matching Google Form fields
const syllabusReviewSchema = z.object({
  email: z.string().trim().email({ message: "Please enter a valid email address" }),
  subject_type: z.enum(["Theory", "Lab"], { required_error: "Please select subject type" }),
  teacher_name: z.string().trim().min(1, { message: "Please select a teacher" }),
  hours_planned: z.coerce.number().int().min(0, { message: "Must be a positive number" }),
  hours_completed: z.coerce.number().int().min(0, { message: "Must be a positive number" }),
  percentage_completion: z.coerce.number().min(0).max(100, { message: "Must be between 0 and 100" }),
  hours_required: z.coerce.number().int().min(0, { message: "Must be a positive number" }),
  units_completed: z.coerce.number().int().min(0, { message: "Must be a positive number" }),
  unit_in_progress: z.string().trim().min(1, { message: "Please enter unit in progress" }),
  teaching_notes_digitization: z.coerce.number().min(0).max(100, { message: "Must be between 0 and 100" }),
  comments: z.string().optional(),
});

type SyllabusReviewFormData = z.infer<typeof syllabusReviewSchema>;

// Sample teacher names - these can be customized per department
const teachersByDepartment: Record<string, string[]> = {
  cse: ["Dr. Ramesh Kumar", "Dr. Priya Sharma", "Prof. Suresh Reddy", "Dr. Lakshmi Devi", "Prof. Venkat Rao"],
  ece: ["Dr. Anil Kumar", "Prof. Sridevi", "Dr. Ravi Prasad", "Prof. Meena Kumari", "Dr. Kiran Babu"],
  eee: ["Dr. Prasad Rao", "Prof. Sunitha", "Dr. Mohan Reddy", "Prof. Padma", "Dr. Srikanth"],
  mech: ["Dr. Srinivas", "Prof. Rajesh", "Dr. Bhaskar", "Prof. Anand", "Dr. Mahesh"],
  civil: ["Dr. Nagaraj", "Prof. Shiva", "Dr. Ramana", "Prof. Sudhakar", "Dr. Ganesh"],
  aids: ["Dr. Kavitha", "Prof. Harish", "Dr. Swetha", "Prof. Raju", "Dr. Deepak"],
  mba: ["Dr. Suman", "Prof. Rani", "Dr. Krishna", "Prof. Vijay", "Dr. Saritha"],
  mca: ["Dr. Chandra", "Prof. Uma", "Dr. Satish", "Prof. Revathi", "Dr. Naveen"],
};

interface SyllabusReviewFormFieldsProps {
  branch: string;
  semester: string;
  section: string;
}

const SyllabusReviewFormFields = ({ branch, semester, section }: SyllabusReviewFormFieldsProps) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const form = useForm<SyllabusReviewFormData>({
    resolver: zodResolver(syllabusReviewSchema),
    defaultValues: {
      email: "",
      subject_type: undefined,
      teacher_name: "",
      hours_planned: 0,
      hours_completed: 0,
      percentage_completion: 0,
      hours_required: 0,
      units_completed: 0,
      unit_in_progress: "",
      teaching_notes_digitization: 0,
      comments: "",
    },
  });

  const teachers = teachersByDepartment[branch] || teachersByDepartment.cse;

  const onSubmit = async (data: SyllabusReviewFormData) => {
    setIsSubmitting(true);
    try {
      const supabase = getBackendClient();

      const { error } = await supabase.from("syllabus_reviews").insert({
        branch,
        semester,
        section: section.toUpperCase(),
        email: data.email,
        subject_type: data.subject_type,
        teacher_name: data.teacher_name,
        hours_planned: data.hours_planned,
        hours_completed: data.hours_completed,
        percentage_completion: data.percentage_completion,
        hours_required: data.hours_required,
        units_completed: data.units_completed,
        unit_in_progress: data.unit_in_progress,
        teaching_notes_digitization: data.teaching_notes_digitization,
        comments: data.comments || null,
      });

      if (error) throw error;

      setIsSubmitted(true);
      toast({
        title: "Form Submitted Successfully",
        description: "Your syllabus review has been recorded.",
      });
    } catch (error) {
      if (import.meta.env.DEV) {
        console.error("Error submitting form:", error);
      }
      toast({
        title: "Submission Failed",
        description: "Please try again later.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleClearForm = () => {
    form.reset();
    setIsSubmitted(false);
  };

  if (isSubmitted) {
    return (
      <div className="p-8 md:p-12 text-center">
        <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-green-500/20 mb-6">
          <CheckCircle className="w-10 h-10 text-green-500" />
        </div>
        <h3 className="text-2xl font-bold text-foreground mb-3">Response Recorded!</h3>
        <p className="text-muted-foreground mb-8 max-w-md mx-auto">
          Your syllabus review has been submitted successfully. Thank you for your contribution.
        </p>
        <Button 
          onClick={handleClearForm} 
          variant="outline"
          className="gap-2 border-primary/30 hover:border-primary hover:bg-primary/10"
        >
          <RotateCcw className="w-4 h-4" />
          Submit Another Response
        </Button>
      </div>
    );
  }

  return (
    <div className="divide-y divide-border">
      {/* Required Notice */}
      <div className="p-6 bg-destructive/5 border-b border-destructive/20">
        <p className="text-sm text-destructive flex items-center gap-2">
          <span className="text-lg">*</span>
          Indicates required question
        </p>
      </div>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="divide-y divide-border">
          {/* Email */}
          <div className="p-6 hover:bg-muted/30 transition-colors">
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-sm font-semibold text-foreground flex items-center gap-2">
                    <Mail className="w-4 h-4 text-primary" />
                    Email <span className="text-destructive">*</span>
                  </FormLabel>
                  <FormControl>
                    <Input 
                      type="email" 
                      placeholder="Enter your email address" 
                      className="mt-2 bg-background/50 border-border focus:border-primary"
                      {...field} 
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          {/* Subject Type */}
          <div className="p-6 hover:bg-muted/30 transition-colors">
            <FormField
              control={form.control}
              name="subject_type"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-sm font-semibold text-foreground flex items-center gap-2">
                    <BookOpen className="w-4 h-4 text-primary" />
                    Subject Type (Theory/Lab) <span className="text-destructive">*</span>
                  </FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger className="mt-2 w-full sm:w-64 bg-background/50 border-border">
                        <SelectValue placeholder="Select type" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="Theory">📚 Theory</SelectItem>
                      <SelectItem value="Lab">🔬 Lab</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          {/* Teacher Name */}
          <div className="p-6 hover:bg-muted/30 transition-colors">
            <FormField
              control={form.control}
              name="teacher_name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-sm font-semibold text-foreground flex items-center gap-2">
                    <User className="w-4 h-4 text-primary" />
                    Name of the Teacher <span className="text-destructive">*</span>
                  </FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger className="mt-2 w-full sm:w-80 bg-background/50 border-border">
                        <SelectValue placeholder="Select teacher" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {teachers.map((teacher) => (
                        <SelectItem key={teacher} value={teacher}>
                          {teacher}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          {/* Hours Section */}
          <div className="p-6 hover:bg-muted/30 transition-colors">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              {/* Hours Planned */}
              <FormField
                control={form.control}
                name="hours_planned"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-sm font-semibold text-foreground flex items-center gap-2">
                      <Clock className="w-4 h-4 text-primary" />
                      Hours Planned <span className="text-destructive">*</span>
                    </FormLabel>
                    <FormControl>
                      <Input 
                        type="number" 
                        placeholder="0" 
                        className="mt-2 bg-background/50 border-border"
                        {...field} 
                      />
                    </FormControl>
                    <p className="text-xs text-muted-foreground mt-1">As per lesson plan</p>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Hours Completed */}
              <FormField
                control={form.control}
                name="hours_completed"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-sm font-semibold text-foreground flex items-center gap-2">
                      <Clock className="w-4 h-4 text-secondary" />
                      Hours Completed <span className="text-destructive">*</span>
                    </FormLabel>
                    <FormControl>
                      <Input 
                        type="number" 
                        placeholder="0" 
                        className="mt-2 bg-background/50 border-border"
                        {...field} 
                      />
                    </FormControl>
                    <p className="text-xs text-muted-foreground mt-1">Till date</p>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          </div>

          {/* Percentage & Hours Required */}
          <div className="p-6 hover:bg-muted/30 transition-colors">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              {/* Percentage Completion */}
              <FormField
                control={form.control}
                name="percentage_completion"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-sm font-semibold text-foreground flex items-center gap-2">
                      <Percent className="w-4 h-4 text-primary" />
                      Completion % <span className="text-destructive">*</span>
                    </FormLabel>
                    <FormControl>
                      <Input 
                        type="number" 
                        step="0.01"
                        placeholder="0" 
                        className="mt-2 bg-background/50 border-border"
                        {...field} 
                      />
                    </FormControl>
                    <p className="text-xs text-muted-foreground mt-1">Syllabus completion till date</p>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Hours Required */}
              <FormField
                control={form.control}
                name="hours_required"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-sm font-semibold text-foreground flex items-center gap-2">
                      <Target className="w-4 h-4 text-secondary" />
                      Hours Required <span className="text-destructive">*</span>
                    </FormLabel>
                    <FormControl>
                      <Input 
                        type="number" 
                        placeholder="0" 
                        className="mt-2 bg-background/50 border-border"
                        {...field} 
                      />
                    </FormControl>
                    <p className="text-xs text-muted-foreground mt-1">To complete syllabus</p>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          </div>

          {/* Units Section */}
          <div className="p-6 hover:bg-muted/30 transition-colors">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              {/* Units Completed */}
              <FormField
                control={form.control}
                name="units_completed"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-sm font-semibold text-foreground flex items-center gap-2">
                      <Layers className="w-4 h-4 text-primary" />
                      Units Completed <span className="text-destructive">*</span>
                    </FormLabel>
                    <FormControl>
                      <Input 
                        type="number" 
                        placeholder="0" 
                        className="mt-2 bg-background/50 border-border"
                        {...field} 
                      />
                    </FormControl>
                    <p className="text-xs text-muted-foreground mt-1">100% completed units</p>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Unit in Progress */}
              <FormField
                control={form.control}
                name="unit_in_progress"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-sm font-semibold text-foreground flex items-center gap-2">
                      <Layers className="w-4 h-4 text-secondary" />
                      Unit in Progress <span className="text-destructive">*</span>
                    </FormLabel>
                    <FormControl>
                      <Input 
                        placeholder="e.g., Unit 3 - 60%" 
                        className="mt-2 bg-background/50 border-border"
                        {...field} 
                      />
                    </FormControl>
                    <p className="text-xs text-muted-foreground mt-1">With % completion</p>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          </div>

          {/* Teaching Notes Digitization */}
          <div className="p-6 hover:bg-muted/30 transition-colors">
            <FormField
              control={form.control}
              name="teaching_notes_digitization"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-sm font-semibold text-foreground flex items-center gap-2">
                    <FileText className="w-4 h-4 text-primary" />
                    Teaching Notes Digitization (%) <span className="text-destructive">*</span>
                  </FormLabel>
                  <FormControl>
                    <Input 
                      type="number" 
                      step="0.01"
                      placeholder="0" 
                      className="mt-2 w-full sm:w-64 bg-background/50 border-border"
                      {...field} 
                    />
                  </FormControl>
                  <p className="text-xs text-muted-foreground mt-1">Progress percentage</p>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          {/* Comments */}
          <div className="p-6 hover:bg-muted/30 transition-colors">
            <FormField
              control={form.control}
              name="comments"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-sm font-semibold text-foreground">
                    Comments (Optional)
                  </FormLabel>
                  <FormControl>
                    <Textarea 
                      placeholder="Any additional comments or notes..." 
                      className="mt-2 bg-background/50 border-border resize-none min-h-[100px]"
                      {...field} 
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          {/* Submit Section */}
          <div className="p-6 bg-muted/20">
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
              <Button 
                type="submit" 
                disabled={isSubmitting}
                size="lg"
                className="w-full sm:w-auto gap-2 bg-gradient-to-r from-primary to-secondary hover:opacity-90 transition-opacity"
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    Submitting...
                  </>
                ) : (
                  <>
                    <Send className="w-4 h-4" />
                    Submit Response
                  </>
                )}
              </Button>
              <Button 
                type="button" 
                variant="ghost" 
                onClick={handleClearForm}
                className="text-muted-foreground hover:text-foreground gap-2"
              >
                <RotateCcw className="w-4 h-4" />
                Clear form
              </Button>
            </div>
          </div>
        </form>
      </Form>

      {/* Footer Notice */}
      <div className="p-4 bg-muted/10 text-center">
        <p className="text-xs text-muted-foreground">
          🔒 Never submit passwords through this form
        </p>
      </div>
    </div>
  );
};

export default SyllabusReviewFormFields;
