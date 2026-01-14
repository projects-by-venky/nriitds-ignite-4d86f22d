import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Loader2, CheckCircle } from "lucide-react";
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
      console.error("Error submitting form:", error);
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
      <div className="bg-white rounded-lg shadow-sm border p-8 text-center">
        <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />
        <h3 className="text-xl font-semibold text-gray-900 mb-2">Response Recorded</h3>
        <p className="text-gray-600 mb-6">Your syllabus review has been submitted successfully.</p>
        <Button onClick={handleClearForm} variant="outline">
          Submit Another Response
        </Button>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-sm border overflow-hidden">
      {/* Form Header */}
      <div className="bg-primary h-2" />
      <div className="p-6 border-b">
        <p className="text-sm text-red-500 mt-2">* Indicates required question</p>
      </div>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-0">
          {/* Email */}
          <div className="p-6 border-b">
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-sm font-medium text-gray-900">
                    Email <span className="text-red-500">*</span>
                  </FormLabel>
                  <FormControl>
                    <Input 
                      type="email" 
                      placeholder="Your email" 
                      className="border-0 border-b border-gray-300 rounded-none px-0 focus:border-primary focus-visible:ring-0"
                      {...field} 
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          {/* Subject Type */}
          <div className="p-6 border-b">
            <FormField
              control={form.control}
              name="subject_type"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-sm font-medium text-gray-900">
                    SUBJECT(Theory/Lab) <span className="text-red-500">*</span>
                  </FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger className="w-48 mt-2">
                        <SelectValue placeholder="Choose" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="Theory">Theory</SelectItem>
                      <SelectItem value="Lab">Lab</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          {/* Teacher Name */}
          <div className="p-6 border-b">
            <FormField
              control={form.control}
              name="teacher_name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-sm font-medium text-gray-900">
                    NAME OF THE TEACHER <span className="text-red-500">*</span>
                  </FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger className="w-64 mt-2">
                        <SelectValue placeholder="Choose" />
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

          {/* Hours Planned */}
          <div className="p-6 border-b">
            <FormField
              control={form.control}
              name="hours_planned"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-sm font-medium text-gray-900">
                    No. of hours planned as per lesson plan <span className="text-red-500">*</span>
                  </FormLabel>
                  <FormControl>
                    <Input 
                      type="number" 
                      placeholder="Your answer" 
                      className="border-0 border-b border-gray-300 rounded-none px-0 focus:border-primary focus-visible:ring-0 w-64"
                      {...field} 
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          {/* Hours Completed */}
          <div className="p-6 border-b">
            <FormField
              control={form.control}
              name="hours_completed"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-sm font-medium text-gray-900">
                    No. of hours completed till date <span className="text-red-500">*</span>
                  </FormLabel>
                  <FormControl>
                    <Input 
                      type="number" 
                      placeholder="Your answer" 
                      className="border-0 border-b border-gray-300 rounded-none px-0 focus:border-primary focus-visible:ring-0 w-64"
                      {...field} 
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          {/* Percentage Completion */}
          <div className="p-6 border-b">
            <FormField
              control={form.control}
              name="percentage_completion"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-sm font-medium text-gray-900">
                    Percentage completion of syllabus till date <span className="text-red-500">*</span>
                  </FormLabel>
                  <FormControl>
                    <Input 
                      type="number" 
                      step="0.01"
                      placeholder="Your answer" 
                      className="border-0 border-b border-gray-300 rounded-none px-0 focus:border-primary focus-visible:ring-0 w-64"
                      {...field} 
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          {/* Hours Required */}
          <div className="p-6 border-b">
            <FormField
              control={form.control}
              name="hours_required"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-sm font-medium text-gray-900">
                    No. of hours required further to complete the syllabus <span className="text-red-500">*</span>
                  </FormLabel>
                  <FormControl>
                    <Input 
                      type="number" 
                      placeholder="Your answer" 
                      className="border-0 border-b border-gray-300 rounded-none px-0 focus:border-primary focus-visible:ring-0 w-64"
                      {...field} 
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          {/* Units Completed */}
          <div className="p-6 border-b">
            <FormField
              control={form.control}
              name="units_completed"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-sm font-medium text-gray-900">
                    No. of units totally(100%) completed <span className="text-red-500">*</span>
                  </FormLabel>
                  <FormControl>
                    <Input 
                      type="number" 
                      placeholder="Your answer" 
                      className="border-0 border-b border-gray-300 rounded-none px-0 focus:border-primary focus-visible:ring-0 w-64"
                      {...field} 
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          {/* Unit in Progress */}
          <div className="p-6 border-b">
            <FormField
              control={form.control}
              name="unit_in_progress"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-sm font-medium text-gray-900">
                    Unit no. presently in progress with % completion <span className="text-red-500">*</span>
                  </FormLabel>
                  <FormControl>
                    <Input 
                      placeholder="Your answer" 
                      className="border-0 border-b border-gray-300 rounded-none px-0 focus:border-primary focus-visible:ring-0 w-64"
                      {...field} 
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          {/* Teaching Notes Digitization */}
          <div className="p-6 border-b">
            <FormField
              control={form.control}
              name="teaching_notes_digitization"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-sm font-medium text-gray-900">
                    Teaching notes digitization progress(%) <span className="text-red-500">*</span>
                  </FormLabel>
                  <FormControl>
                    <Input 
                      type="number" 
                      step="0.01"
                      placeholder="Your answer" 
                      className="border-0 border-b border-gray-300 rounded-none px-0 focus:border-primary focus-visible:ring-0 w-64"
                      {...field} 
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          {/* Comments */}
          <div className="p-6 border-b">
            <FormField
              control={form.control}
              name="comments"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-sm font-medium text-gray-900">
                    Comments if any
                  </FormLabel>
                  <FormControl>
                    <Textarea 
                      placeholder="Your answer" 
                      className="border-0 border-b border-gray-300 rounded-none px-0 focus:border-primary focus-visible:ring-0 resize-none min-h-[60px]"
                      {...field} 
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          {/* Submit Button */}
          <div className="p-6 flex items-center justify-between">
            <Button 
              type="submit" 
              disabled={isSubmitting}
              className="bg-primary hover:bg-primary/90"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Submitting...
                </>
              ) : (
                "Submit"
              )}
            </Button>
            <Button 
              type="button" 
              variant="ghost" 
              onClick={handleClearForm}
              className="text-primary hover:text-primary/80"
            >
              Clear form
            </Button>
          </div>
        </form>
      </Form>

      {/* Footer */}
      <div className="p-4 bg-gray-50 text-center text-xs text-gray-500 border-t">
        <p>Never submit passwords through this form.</p>
      </div>
    </div>
  );
};

export default SyllabusReviewFormFields;
