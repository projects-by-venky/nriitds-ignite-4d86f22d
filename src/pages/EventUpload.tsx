import { useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Separator } from "@/components/ui/separator";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { 
  ArrowLeft, 
  Upload, 
  X, 
  Plus, 
  Trash2,
  CalendarIcon,
  Clock,
  Loader2,
  CheckCircle2
} from "lucide-react";
import { format } from "date-fns";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";
import { useToast } from "@/hooks/use-toast";
import { useCreateEvent } from "@/hooks/useEvents";
import { getBackendClient } from "@/integrations/backend/client";
import { EventType, EventStatus, ScheduleItem, EVENT_TYPE_LABELS, EVENT_STATUS_LABELS } from "@/types/events";

const EventUpload = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const createEvent = useCreateEvent();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const galleryInputRef = useRef<HTMLInputElement>(null);
  const attachmentInputRef = useRef<HTMLInputElement>(null);

  // Form state
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [shortDescription, setShortDescription] = useState("");
  const [eventType, setEventType] = useState<EventType>("other");
  const [status, setStatus] = useState<EventStatus>("upcoming");
  const [startDate, setStartDate] = useState<Date>();
  const [endDate, setEndDate] = useState<Date>();
  const [startTime, setStartTime] = useState("");
  const [endTime, setEndTime] = useState("");
  const [venue, setVenue] = useState("");
  const [organizedBy, setOrganizedBy] = useState("");
  const [department, setDepartment] = useState("");
  const [whoCanAttend, setWhoCanAttend] = useState("Open to all");
  const [schedule, setSchedule] = useState<ScheduleItem[]>([]);
  const [registrationRequired, setRegistrationRequired] = useState(false);
  const [registrationLink, setRegistrationLink] = useState("");
  const [registrationDeadline, setRegistrationDeadline] = useState<Date>();
  const [facultyCoordinator, setFacultyCoordinator] = useState("");
  const [facultyEmail, setFacultyEmail] = useState("");
  const [facultyPhone, setFacultyPhone] = useState("");
  const [studentCoordinator, setStudentCoordinator] = useState("");
  const [studentEmail, setStudentEmail] = useState("");
  const [studentPhone, setStudentPhone] = useState("");
  const [isPublished, setIsPublished] = useState(true);

  // File state
  const [posterFile, setPosterFile] = useState<File | null>(null);
  const [posterPreview, setPosterPreview] = useState<string>("");
  const [galleryFiles, setGalleryFiles] = useState<File[]>([]);
  const [attachmentFiles, setAttachmentFiles] = useState<File[]>([]);
  const [isUploading, setIsUploading] = useState(false);

  const handlePosterChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        toast({ title: "File too large", description: "Poster must be less than 5MB", variant: "destructive" });
        return;
      }
      setPosterFile(file);
      setPosterPreview(URL.createObjectURL(file));
    }
  };

  const handleGalleryChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    const validFiles = files.filter(file => {
      if (file.size > 5 * 1024 * 1024) {
        toast({ title: "File too large", description: `${file.name} is too large (max 5MB)`, variant: "destructive" });
        return false;
      }
      return true;
    });
    setGalleryFiles(prev => [...prev, ...validFiles]);
  };

  const handleAttachmentChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    const validFiles = files.filter(file => {
      if (file.size > 10 * 1024 * 1024) {
        toast({ title: "File too large", description: `${file.name} is too large (max 10MB)`, variant: "destructive" });
        return false;
      }
      return true;
    });
    setAttachmentFiles(prev => [...prev, ...validFiles]);
  };

  const uploadFile = async (file: File, folder: string): Promise<string> => {
    const supabase = getBackendClient();
    const fileExt = file.name.split('.').pop();
    const fileName = `${folder}/${Date.now()}-${Math.random().toString(36).substr(2, 9)}.${fileExt}`;
    
    const { error } = await supabase.storage
      .from('event-files')
      .upload(fileName, file);
    
    if (error) throw error;
    
    const { data: urlData } = supabase.storage
      .from('event-files')
      .getPublicUrl(fileName);
    
    return urlData.publicUrl;
  };

  const addScheduleItem = () => {
    setSchedule([...schedule, { time: "", activity: "" }]);
  };

  const updateScheduleItem = (index: number, field: keyof ScheduleItem, value: string) => {
    const updated = [...schedule];
    updated[index][field] = value;
    setSchedule(updated);
  };

  const removeScheduleItem = (index: number) => {
    setSchedule(schedule.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!title || !description || !startDate || !venue || !organizedBy) {
      toast({ title: "Missing required fields", description: "Please fill in all required fields", variant: "destructive" });
      return;
    }

    setIsUploading(true);

    try {
      // Upload files
      let posterUrl = "";
      if (posterFile) {
        posterUrl = await uploadFile(posterFile, "posters");
      }

      const galleryUrls: string[] = [];
      for (const file of galleryFiles) {
        const url = await uploadFile(file, "gallery");
        galleryUrls.push(url);
      }

      const attachmentUrls: string[] = [];
      for (const file of attachmentFiles) {
        const url = await uploadFile(file, "attachments");
        attachmentUrls.push(url);
      }

      // Create event
      await createEvent.mutateAsync({
        title,
        description,
        short_description: shortDescription || undefined,
        event_type: eventType,
        status,
        start_date: format(startDate, 'yyyy-MM-dd'),
        end_date: endDate ? format(endDate, 'yyyy-MM-dd') : undefined,
        start_time: startTime || undefined,
        end_time: endTime || undefined,
        venue,
        organized_by: organizedBy,
        department: department || undefined,
        who_can_attend: whoCanAttend || undefined,
        schedule: schedule.filter(s => s.time && s.activity),
        registration_required: registrationRequired,
        registration_link: registrationLink || undefined,
        registration_deadline: registrationDeadline ? registrationDeadline.toISOString() : undefined,
        faculty_coordinator: facultyCoordinator || undefined,
        faculty_email: facultyEmail || undefined,
        faculty_phone: facultyPhone || undefined,
        student_coordinator: studentCoordinator || undefined,
        student_email: studentEmail || undefined,
        student_phone: studentPhone || undefined,
        poster_url: posterUrl || undefined,
        gallery_urls: galleryUrls.length > 0 ? galleryUrls : undefined,
        attachment_urls: attachmentUrls.length > 0 ? attachmentUrls : undefined,
        is_published: isPublished,
      });

      toast({
        title: "Event created successfully!",
        description: isPublished ? "Your event is now visible to everyone." : "Your event has been saved as a draft.",
      });

      navigate("/events");
    } catch (error) {
      console.error("Error creating event:", error);
      toast({
        title: "Failed to create event",
        description: "Something went wrong. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="pt-16 pb-20">
        <div className="container mx-auto px-4 py-8 max-w-4xl">
          {/* Header */}
          <div className="mb-8">
            <Button 
              variant="ghost" 
              onClick={() => navigate("/events")}
              className="gap-2 mb-4 hover:bg-primary/10"
            >
              <ArrowLeft className="h-4 w-4" />
              Back to Events
            </Button>
            <h1 className="text-3xl md:text-4xl font-bold text-foreground mb-2">
              Add New Event
            </h1>
            <p className="text-muted-foreground">
              Fill in the details to create a new event
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-8">
            {/* Basic Information */}
            <Card className="border-border/50 bg-card/80 backdrop-blur-sm">
              <CardHeader>
                <CardTitle>Basic Information</CardTitle>
                <CardDescription>Event title, description, and type</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="title">Event Title *</Label>
                  <Input
                    id="title"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder="Enter event title"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="shortDescription">Short Description</Label>
                  <Input
                    id="shortDescription"
                    value={shortDescription}
                    onChange={(e) => setShortDescription(e.target.value)}
                    placeholder="Brief description for cards (max 2 lines)"
                    maxLength={150}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="description">Full Description *</Label>
                  <Textarea
                    id="description"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    placeholder="Detailed event description..."
                    rows={6}
                    required
                  />
                </div>

                <div className="grid sm:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Event Type *</Label>
                    <Select value={eventType} onValueChange={(v) => setEventType(v as EventType)}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {Object.entries(EVENT_TYPE_LABELS).map(([key, label]) => (
                          <SelectItem key={key} value={key}>{label}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label>Status *</Label>
                    <Select value={status} onValueChange={(v) => setStatus(v as EventStatus)}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {Object.entries(EVENT_STATUS_LABELS).map(([key, label]) => (
                          <SelectItem key={key} value={key}>{label}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Date, Time & Location */}
            <Card className="border-border/50 bg-card/80 backdrop-blur-sm">
              <CardHeader>
                <CardTitle>Date, Time & Location</CardTitle>
                <CardDescription>When and where the event will take place</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid sm:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Start Date *</Label>
                    <Popover>
                      <PopoverTrigger asChild>
                        <Button
                          variant="outline"
                          className={cn(
                            "w-full justify-start text-left font-normal",
                            !startDate && "text-muted-foreground"
                          )}
                        >
                          <CalendarIcon className="mr-2 h-4 w-4" />
                          {startDate ? format(startDate, "PPP") : "Select date"}
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0" align="start">
                        <Calendar
                          mode="single"
                          selected={startDate}
                          onSelect={setStartDate}
                          initialFocus
                        />
                      </PopoverContent>
                    </Popover>
                  </div>

                  <div className="space-y-2">
                    <Label>End Date (Optional)</Label>
                    <Popover>
                      <PopoverTrigger asChild>
                        <Button
                          variant="outline"
                          className={cn(
                            "w-full justify-start text-left font-normal",
                            !endDate && "text-muted-foreground"
                          )}
                        >
                          <CalendarIcon className="mr-2 h-4 w-4" />
                          {endDate ? format(endDate, "PPP") : "Select date"}
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0" align="start">
                        <Calendar
                          mode="single"
                          selected={endDate}
                          onSelect={setEndDate}
                          initialFocus
                        />
                      </PopoverContent>
                    </Popover>
                  </div>
                </div>

                <div className="grid sm:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="startTime">Start Time</Label>
                    <div className="relative">
                      <Clock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                      <Input
                        id="startTime"
                        type="time"
                        value={startTime}
                        onChange={(e) => setStartTime(e.target.value)}
                        className="pl-10"
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="endTime">End Time</Label>
                    <div className="relative">
                      <Clock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                      <Input
                        id="endTime"
                        type="time"
                        value={endTime}
                        onChange={(e) => setEndTime(e.target.value)}
                        className="pl-10"
                      />
                    </div>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="venue">Venue *</Label>
                  <Input
                    id="venue"
                    value={venue}
                    onChange={(e) => setVenue(e.target.value)}
                    placeholder="e.g., Main Auditorium, Computer Lab 3"
                    required
                  />
                </div>
              </CardContent>
            </Card>

            {/* Organizer Details */}
            <Card className="border-border/50 bg-card/80 backdrop-blur-sm">
              <CardHeader>
                <CardTitle>Organizer Details</CardTitle>
                <CardDescription>Who is organizing this event</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid sm:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="organizedBy">Organized By *</Label>
                    <Input
                      id="organizedBy"
                      value={organizedBy}
                      onChange={(e) => setOrganizedBy(e.target.value)}
                      placeholder="e.g., CSE Department, Tech Club"
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="department">Department</Label>
                    <Input
                      id="department"
                      value={department}
                      onChange={(e) => setDepartment(e.target.value)}
                      placeholder="e.g., Computer Science"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="whoCanAttend">Who Can Attend</Label>
                  <Input
                    id="whoCanAttend"
                    value={whoCanAttend}
                    onChange={(e) => setWhoCanAttend(e.target.value)}
                    placeholder="e.g., Open to all, CSE Students only"
                  />
                </div>
              </CardContent>
            </Card>

            {/* Schedule */}
            <Card className="border-border/50 bg-card/80 backdrop-blur-sm">
              <CardHeader>
                <CardTitle>Schedule / Agenda</CardTitle>
                <CardDescription>Add timeline items for the event</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <AnimatePresence>
                  {schedule.map((item, index) => (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: "auto" }}
                      exit={{ opacity: 0, height: 0 }}
                      className="flex gap-3 items-start"
                    >
                      <Input
                        value={item.time}
                        onChange={(e) => updateScheduleItem(index, "time", e.target.value)}
                        placeholder="Time (e.g., 10:00 AM)"
                        className="w-32 flex-shrink-0"
                      />
                      <Input
                        value={item.activity}
                        onChange={(e) => updateScheduleItem(index, "activity", e.target.value)}
                        placeholder="Activity description"
                        className="flex-1"
                      />
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        onClick={() => removeScheduleItem(index)}
                        className="text-destructive hover:bg-destructive/10"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </motion.div>
                  ))}
                </AnimatePresence>
                <Button
                  type="button"
                  variant="outline"
                  onClick={addScheduleItem}
                  className="gap-2"
                >
                  <Plus className="h-4 w-4" />
                  Add Schedule Item
                </Button>
              </CardContent>
            </Card>

            {/* Registration */}
            <Card className="border-border/50 bg-card/80 backdrop-blur-sm">
              <CardHeader>
                <CardTitle>Registration</CardTitle>
                <CardDescription>Registration details for the event</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Registration Required</Label>
                    <p className="text-sm text-muted-foreground">
                      Participants need to register for this event
                    </p>
                  </div>
                  <Switch
                    checked={registrationRequired}
                    onCheckedChange={setRegistrationRequired}
                  />
                </div>

                {registrationRequired && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    exit={{ opacity: 0, height: 0 }}
                    className="space-y-4"
                  >
                    <div className="space-y-2">
                      <Label htmlFor="registrationLink">Registration Link</Label>
                      <Input
                        id="registrationLink"
                        type="url"
                        value={registrationLink}
                        onChange={(e) => setRegistrationLink(e.target.value)}
                        placeholder="https://..."
                      />
                    </div>

                    <div className="space-y-2">
                      <Label>Registration Deadline</Label>
                      <Popover>
                        <PopoverTrigger asChild>
                          <Button
                            variant="outline"
                            className={cn(
                              "w-full justify-start text-left font-normal",
                              !registrationDeadline && "text-muted-foreground"
                            )}
                          >
                            <CalendarIcon className="mr-2 h-4 w-4" />
                            {registrationDeadline ? format(registrationDeadline, "PPP") : "Select deadline"}
                          </Button>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0" align="start">
                          <Calendar
                            mode="single"
                            selected={registrationDeadline}
                            onSelect={setRegistrationDeadline}
                            initialFocus
                          />
                        </PopoverContent>
                      </Popover>
                    </div>
                  </motion.div>
                )}
              </CardContent>
            </Card>

            {/* Contact Information */}
            <Card className="border-border/50 bg-card/80 backdrop-blur-sm">
              <CardHeader>
                <CardTitle>Contact Information</CardTitle>
                <CardDescription>Coordinator contact details</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-4">
                  <Label className="text-base">Faculty Coordinator</Label>
                  <div className="grid sm:grid-cols-3 gap-4">
                    <Input
                      value={facultyCoordinator}
                      onChange={(e) => setFacultyCoordinator(e.target.value)}
                      placeholder="Name"
                    />
                    <Input
                      type="email"
                      value={facultyEmail}
                      onChange={(e) => setFacultyEmail(e.target.value)}
                      placeholder="Email"
                    />
                    <Input
                      type="tel"
                      value={facultyPhone}
                      onChange={(e) => setFacultyPhone(e.target.value)}
                      placeholder="Phone"
                    />
                  </div>
                </div>

                <Separator />

                <div className="space-y-4">
                  <Label className="text-base">Student Coordinator</Label>
                  <div className="grid sm:grid-cols-3 gap-4">
                    <Input
                      value={studentCoordinator}
                      onChange={(e) => setStudentCoordinator(e.target.value)}
                      placeholder="Name"
                    />
                    <Input
                      type="email"
                      value={studentEmail}
                      onChange={(e) => setStudentEmail(e.target.value)}
                      placeholder="Email"
                    />
                    <Input
                      type="tel"
                      value={studentPhone}
                      onChange={(e) => setStudentPhone(e.target.value)}
                      placeholder="Phone"
                    />
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Media */}
            <Card className="border-border/50 bg-card/80 backdrop-blur-sm">
              <CardHeader>
                <CardTitle>Media</CardTitle>
                <CardDescription>Upload event poster, gallery images, and documents</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Event Poster */}
                <div className="space-y-2">
                  <Label>Event Poster</Label>
                  <div className="flex gap-4 items-start">
                    {posterPreview ? (
                      <div className="relative">
                        <img
                          src={posterPreview}
                          alt="Poster preview"
                          className="w-32 h-32 object-cover rounded-lg border"
                        />
                        <Button
                          type="button"
                          variant="destructive"
                          size="icon"
                          className="absolute -top-2 -right-2 h-6 w-6"
                          onClick={() => {
                            setPosterFile(null);
                            setPosterPreview("");
                          }}
                        >
                          <X className="h-3 w-3" />
                        </Button>
                      </div>
                    ) : (
                      <Button
                        type="button"
                        variant="outline"
                        onClick={() => fileInputRef.current?.click()}
                        className="h-32 w-32 flex flex-col gap-2"
                      >
                        <Upload className="h-6 w-6" />
                        <span className="text-xs">Upload Poster</span>
                      </Button>
                    )}
                    <input
                      ref={fileInputRef}
                      type="file"
                      accept="image/*"
                      onChange={handlePosterChange}
                      className="hidden"
                    />
                  </div>
                  <p className="text-xs text-muted-foreground">Max 5MB, JPG/PNG recommended</p>
                </div>

                <Separator />

                {/* Gallery Images */}
                <div className="space-y-2">
                  <Label>Gallery Images</Label>
                  <div className="flex flex-wrap gap-3">
                    {galleryFiles.map((file, index) => (
                      <div key={index} className="relative">
                        <img
                          src={URL.createObjectURL(file)}
                          alt={`Gallery ${index + 1}`}
                          className="w-20 h-20 object-cover rounded-lg border"
                        />
                        <Button
                          type="button"
                          variant="destructive"
                          size="icon"
                          className="absolute -top-2 -right-2 h-5 w-5"
                          onClick={() => setGalleryFiles(galleryFiles.filter((_, i) => i !== index))}
                        >
                          <X className="h-3 w-3" />
                        </Button>
                      </div>
                    ))}
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => galleryInputRef.current?.click()}
                      className="h-20 w-20 flex flex-col gap-1"
                    >
                      <Plus className="h-5 w-5" />
                      <span className="text-xs">Add</span>
                    </Button>
                  </div>
                  <input
                    ref={galleryInputRef}
                    type="file"
                    accept="image/*"
                    multiple
                    onChange={handleGalleryChange}
                    className="hidden"
                  />
                </div>

                <Separator />

                {/* Attachments */}
                <div className="space-y-2">
                  <Label>Attachments (PDFs, Documents)</Label>
                  <div className="space-y-2">
                    {attachmentFiles.map((file, index) => (
                      <div key={index} className="flex items-center gap-3 p-2 bg-muted/50 rounded-lg">
                        <span className="text-sm truncate flex-1">{file.name}</span>
                        <Button
                          type="button"
                          variant="ghost"
                          size="icon"
                          className="h-6 w-6 text-destructive"
                          onClick={() => setAttachmentFiles(attachmentFiles.filter((_, i) => i !== index))}
                        >
                          <X className="h-3 w-3" />
                        </Button>
                      </div>
                    ))}
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => attachmentInputRef.current?.click()}
                      className="gap-2"
                    >
                      <Plus className="h-4 w-4" />
                      Add Document
                    </Button>
                  </div>
                  <input
                    ref={attachmentInputRef}
                    type="file"
                    accept=".pdf,.doc,.docx,.xls,.xlsx,.ppt,.pptx"
                    multiple
                    onChange={handleAttachmentChange}
                    className="hidden"
                  />
                </div>
              </CardContent>
            </Card>

            {/* Visibility & Submit */}
            <Card className="border-border/50 bg-card/80 backdrop-blur-sm">
              <CardContent className="pt-6">
                <div className="flex items-center justify-between mb-6">
                  <div className="space-y-0.5">
                    <Label className="text-base">Publish Event</Label>
                    <p className="text-sm text-muted-foreground">
                      {isPublished ? "Event will be visible to everyone" : "Save as draft (not visible)"}
                    </p>
                  </div>
                  <Switch
                    checked={isPublished}
                    onCheckedChange={setIsPublished}
                  />
                </div>

                <div className="flex gap-4">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => navigate("/events")}
                    className="flex-1"
                    disabled={isUploading}
                  >
                    Cancel
                  </Button>
                  <Button
                    type="submit"
                    className="flex-1 gap-2"
                    disabled={isUploading}
                  >
                    {isUploading ? (
                      <>
                        <Loader2 className="h-4 w-4 animate-spin" />
                        Creating Event...
                      </>
                    ) : (
                      <>
                        <CheckCircle2 className="h-4 w-4" />
                        {isPublished ? "Publish Event" : "Save as Draft"}
                      </>
                    )}
                  </Button>
                </div>
              </CardContent>
            </Card>
          </form>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default EventUpload;
