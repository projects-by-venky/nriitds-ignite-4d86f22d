import { useParams, Link } from "react-router-dom";
import { useEvent } from "@/hooks/useEvents";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { 
  ArrowLeft, 
  Calendar, 
  Clock, 
  MapPin, 
  Users, 
  Building2, 
  ExternalLink,
  Mail,
  Phone,
  User,
  FileText,
  Image as ImageIcon,
  Download
} from "lucide-react";
import { format } from "date-fns";
import { motion } from "framer-motion";
import { 
  EVENT_TYPE_LABELS, 
  EVENT_STATUS_LABELS, 
  EVENT_TYPE_COLORS, 
  EVENT_STATUS_COLORS 
} from "@/types/events";

const EventDetail = () => {
  const { id } = useParams<{ id: string }>();
  const { data: event, isLoading, error } = useEvent(id || '');

  const formatTime = (time?: string) => {
    if (!time) return null;
    const [hours, minutes] = time.split(':');
    const date = new Date();
    date.setHours(parseInt(hours), parseInt(minutes));
    return format(date, 'h:mm a');
  };

  const formatDateRange = () => {
    if (!event) return '';
    const start = format(new Date(event.start_date), 'EEEE, MMMM d, yyyy');
    if (event.end_date && event.end_date !== event.start_date) {
      const end = format(new Date(event.end_date), 'MMMM d, yyyy');
      return `${start} - ${end}`;
    }
    return start;
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <main className="pt-16">
          <div className="container mx-auto px-4 py-12">
            <div className="animate-pulse space-y-6">
              <div className="h-8 bg-muted rounded w-32" />
              <div className="h-64 bg-muted rounded-xl" />
              <div className="h-12 bg-muted rounded w-2/3" />
              <div className="h-6 bg-muted rounded w-1/2" />
            </div>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  if (error || !event) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <main className="pt-16">
          <div className="container mx-auto px-4 py-20">
            <div className="text-center">
              <h1 className="text-3xl font-bold text-foreground mb-4">Event Not Found</h1>
              <p className="text-muted-foreground mb-8">
                The event you're looking for doesn't exist or has been removed.
              </p>
              <Link to="/events">
                <Button>
                  <ArrowLeft className="mr-2 h-4 w-4" />
                  Back to Events
                </Button>
              </Link>
            </div>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="pt-16">
        {/* Back Button */}
        <div className="container mx-auto px-4 py-6">
          <Link to="/events">
            <Button variant="ghost" className="gap-2 hover:bg-primary/10">
              <ArrowLeft className="h-4 w-4" />
              Back to Events
            </Button>
          </Link>
        </div>

        {/* Event Banner */}
        {event.poster_url && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="container mx-auto px-4"
          >
            <div className="relative h-[300px] md:h-[400px] rounded-2xl overflow-hidden">
              <img
                src={event.poster_url}
                alt={event.title}
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-background via-background/50 to-transparent" />
            </div>
          </motion.div>
        )}

        {/* Event Content */}
        <div className="container mx-auto px-4 py-8">
          <div className="grid lg:grid-cols-3 gap-8">
            {/* Main Content */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              className="lg:col-span-2 space-y-8"
            >
              {/* Title & Badges */}
              <div>
                <div className="flex flex-wrap gap-2 mb-4">
                  <Badge className={`${EVENT_TYPE_COLORS[event.event_type]} border`}>
                    {EVENT_TYPE_LABELS[event.event_type]}
                  </Badge>
                  <Badge className={`${EVENT_STATUS_COLORS[event.status]} border`}>
                    {EVENT_STATUS_LABELS[event.status]}
                  </Badge>
                </div>
                <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-foreground mb-4">
                  {event.title}
                </h1>
                <div className="flex flex-wrap items-center gap-4 text-muted-foreground">
                  <div className="flex items-center gap-2">
                    <Building2 className="w-4 h-4 text-primary" />
                    <span>{event.organized_by}</span>
                  </div>
                  {event.department && (
                    <div className="flex items-center gap-2">
                      <Users className="w-4 h-4 text-primary" />
                      <span>{event.department}</span>
                    </div>
                  )}
                </div>
              </div>

              {/* About the Event */}
              <Card className="border-border/50 bg-card/80 backdrop-blur-sm">
                <CardHeader>
                  <CardTitle className="text-xl">About the Event</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground leading-relaxed whitespace-pre-wrap">
                    {event.description}
                  </p>
                </CardContent>
              </Card>

              {/* Schedule/Agenda */}
              {event.schedule && event.schedule.length > 0 && (
                <Card className="border-border/50 bg-card/80 backdrop-blur-sm">
                  <CardHeader>
                    <CardTitle className="text-xl">Schedule / Agenda</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {event.schedule.map((item, index) => (
                        <div key={index} className="flex gap-4">
                          <div className="flex-shrink-0 w-20 text-sm font-medium text-primary">
                            {item.time}
                          </div>
                          <div className="flex-1">
                            <div className="h-full border-l-2 border-primary/30 pl-4">
                              <p className="text-foreground">{item.activity}</p>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              )}

              {/* Who Can Attend */}
              {event.who_can_attend && (
                <Card className="border-border/50 bg-card/80 backdrop-blur-sm">
                  <CardHeader>
                    <CardTitle className="text-xl flex items-center gap-2">
                      <Users className="w-5 h-5 text-primary" />
                      Who Can Attend
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-muted-foreground">{event.who_can_attend}</p>
                  </CardContent>
                </Card>
              )}

              {/* Gallery */}
              {event.gallery_urls && event.gallery_urls.length > 0 && (
                <Card className="border-border/50 bg-card/80 backdrop-blur-sm">
                  <CardHeader>
                    <CardTitle className="text-xl flex items-center gap-2">
                      <ImageIcon className="w-5 h-5 text-primary" />
                      Gallery
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                      {event.gallery_urls.map((url, index) => (
                        <a
                          key={index}
                          href={url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="block overflow-hidden rounded-lg group"
                        >
                          <img
                            src={url}
                            alt={`Gallery ${index + 1}`}
                            className="w-full h-32 object-cover group-hover:scale-105 transition-transform duration-300"
                            loading="lazy"
                          />
                        </a>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              )}

              {/* Attachments */}
              {event.attachment_urls && event.attachment_urls.length > 0 && (
                <Card className="border-border/50 bg-card/80 backdrop-blur-sm">
                  <CardHeader>
                    <CardTitle className="text-xl flex items-center gap-2">
                      <FileText className="w-5 h-5 text-primary" />
                      Attachments
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2">
                      {event.attachment_urls.map((url, index) => (
                        <a
                          key={index}
                          href={url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center gap-3 p-3 rounded-lg border border-border/50 hover:border-primary/50 hover:bg-muted/50 transition-all"
                        >
                          <Download className="w-4 h-4 text-primary" />
                          <span className="text-foreground truncate">
                            Document {index + 1}
                          </span>
                          <ExternalLink className="w-4 h-4 text-muted-foreground ml-auto" />
                        </a>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              )}
            </motion.div>

            {/* Sidebar */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.1 }}
              className="space-y-6"
            >
              {/* Event Details Card */}
              <Card className="border-border/50 bg-card/80 backdrop-blur-sm sticky top-24">
                <CardHeader>
                  <CardTitle className="text-lg">Event Details</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {/* Date */}
                  <div className="flex items-start gap-3">
                    <Calendar className="w-5 h-5 text-primary mt-0.5" />
                    <div>
                      <p className="font-medium text-foreground">{formatDateRange()}</p>
                    </div>
                  </div>

                  {/* Time */}
                  {event.start_time && (
                    <div className="flex items-start gap-3">
                      <Clock className="w-5 h-5 text-primary mt-0.5" />
                      <div>
                        <p className="font-medium text-foreground">
                          {formatTime(event.start_time)}
                          {event.end_time && ` - ${formatTime(event.end_time)}`}
                        </p>
                      </div>
                    </div>
                  )}

                  {/* Venue */}
                  <div className="flex items-start gap-3">
                    <MapPin className="w-5 h-5 text-primary mt-0.5" />
                    <div>
                      <p className="font-medium text-foreground">{event.venue}</p>
                    </div>
                  </div>

                  <Separator />

                  {/* Registration */}
                  {event.registration_required && event.registration_link && (
                    <div className="space-y-3">
                      <p className="text-sm text-muted-foreground">
                        Registration required for this event
                      </p>
                      {event.registration_deadline && (
                        <p className="text-sm text-muted-foreground">
                          Deadline: {format(new Date(event.registration_deadline), 'MMM d, yyyy h:mm a')}
                        </p>
                      )}
                      <a href={event.registration_link} target="_blank" rel="noopener noreferrer">
                        <Button className="w-full gap-2">
                          <ExternalLink className="w-4 h-4" />
                          Register Now
                        </Button>
                      </a>
                    </div>
                  )}

                  <Separator />

                  {/* Contact Information */}
                  <div className="space-y-4">
                    <h4 className="font-medium text-foreground">Contact Information</h4>
                    
                    {/* Faculty Coordinator */}
                    {event.faculty_coordinator && (
                      <div className="space-y-2">
                        <p className="text-sm text-muted-foreground">Faculty Coordinator</p>
                        <div className="flex items-center gap-2 text-foreground">
                          <User className="w-4 h-4 text-primary" />
                          <span>{event.faculty_coordinator}</span>
                        </div>
                        {event.faculty_email && (
                          <a 
                            href={`mailto:${event.faculty_email}`}
                            className="flex items-center gap-2 text-primary hover:underline text-sm"
                          >
                            <Mail className="w-4 h-4" />
                            <span>{event.faculty_email}</span>
                          </a>
                        )}
                        {event.faculty_phone && (
                          <a 
                            href={`tel:${event.faculty_phone}`}
                            className="flex items-center gap-2 text-primary hover:underline text-sm"
                          >
                            <Phone className="w-4 h-4" />
                            <span>{event.faculty_phone}</span>
                          </a>
                        )}
                      </div>
                    )}

                    {/* Student Coordinator */}
                    {event.student_coordinator && (
                      <div className="space-y-2">
                        <p className="text-sm text-muted-foreground">Student Coordinator</p>
                        <div className="flex items-center gap-2 text-foreground">
                          <User className="w-4 h-4 text-primary" />
                          <span>{event.student_coordinator}</span>
                        </div>
                        {event.student_email && (
                          <a 
                            href={`mailto:${event.student_email}`}
                            className="flex items-center gap-2 text-primary hover:underline text-sm"
                          >
                            <Mail className="w-4 h-4" />
                            <span>{event.student_email}</span>
                          </a>
                        )}
                        {event.student_phone && (
                          <a 
                            href={`tel:${event.student_phone}`}
                            className="flex items-center gap-2 text-primary hover:underline text-sm"
                          >
                            <Phone className="w-4 h-4" />
                            <span>{event.student_phone}</span>
                          </a>
                        )}
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default EventDetail;
