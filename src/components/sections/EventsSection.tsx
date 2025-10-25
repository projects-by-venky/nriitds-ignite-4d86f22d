import { Calendar, MapPin, Clock, ArrowRight } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

const EventsSection = () => {
  const events = [
    {
      title: "Annual Tech Fest 2025",
      date: "March 15-17, 2025",
      time: "9:00 AM - 6:00 PM",
      location: "Main Campus Auditorium",
      type: "Festival",
      description: "Join us for three days of innovation, competitions, and tech exhibitions.",
      status: "Upcoming",
    },
    {
      title: "AI & Machine Learning Workshop",
      date: "February 20, 2025",
      time: "2:00 PM - 5:00 PM",
      location: "Computer Lab 3",
      type: "Workshop",
      description: "Hands-on workshop on latest ML frameworks and real-world applications.",
      status: "Register Now",
    },
    {
      title: "Industry Connect Seminar",
      date: "February 28, 2025",
      time: "10:00 AM - 1:00 PM",
      location: "Conference Hall",
      type: "Seminar",
      description: "Industry leaders share insights on career opportunities and trends.",
      status: "Upcoming",
    },
    {
      title: "Sports Day Championship",
      date: "March 5, 2025",
      time: "7:00 AM - 5:00 PM",
      location: "Sports Complex",
      type: "Sports",
      description: "Annual inter-department sports competition with exciting prizes.",
      status: "Registration Open",
    },
  ];

  const announcements = [
    "Mid-semester exams scheduled for Week 8-9",
    "New AI Lab inauguration on Feb 15",
    "Guest lecture by Dr. Sharma on Quantum Computing",
    "Summer internship applications now open",
  ];

  return (
    <section id="events" className="py-20 bg-muted/30">
      <div className="container mx-auto px-4">
        <div className="max-w-6xl mx-auto">
          {/* Section Header */}
          <div className="text-center mb-16">
            <span className="text-accent font-semibold text-sm uppercase tracking-wider">What's Happening</span>
            <h2 className="text-4xl md:text-5xl font-bold text-foreground mt-3 mb-4">
              Events & Announcements
            </h2>
            <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
              Stay updated with upcoming events, workshops, and important announcements.
            </p>
          </div>

          <div className="grid lg:grid-cols-3 gap-8">
            {/* Events List */}
            <div className="lg:col-span-2 space-y-6">
              {events.map((event, index) => (
                <Card 
                  key={index}
                  className="gradient-card border-0 hover:shadow-accent transition-all duration-300 hover:-translate-y-1 group"
                >
                  <CardHeader className="pb-3">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <Badge className="gradient-primary text-primary-foreground">{event.type}</Badge>
                          <Badge variant="outline">{event.status}</Badge>
                        </div>
                        <CardTitle className="text-xl group-hover:text-primary transition-colors">
                          {event.title}
                        </CardTitle>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <p className="text-muted-foreground mb-4">{event.description}</p>
                    <div className="space-y-2 text-sm">
                      <div className="flex items-center gap-2 text-muted-foreground">
                        <Calendar className="w-4 h-4 text-accent" />
                        <span>{event.date}</span>
                      </div>
                      <div className="flex items-center gap-2 text-muted-foreground">
                        <Clock className="w-4 h-4 text-accent" />
                        <span>{event.time}</span>
                      </div>
                      <div className="flex items-center gap-2 text-muted-foreground">
                        <MapPin className="w-4 h-4 text-accent" />
                        <span>{event.location}</span>
                      </div>
                    </div>
                    <Button variant="ghost" className="mt-4 group-hover:text-primary">
                      View Details <ArrowRight className="ml-2 w-4 h-4" />
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>

            {/* Announcements Sidebar */}
            <div className="space-y-6">
              <Card className="gradient-primary border-0 text-white">
                <CardHeader>
                  <CardTitle className="text-xl">Quick Announcements</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {announcements.map((announcement, index) => (
                    <div 
                      key={index}
                      className="flex items-start gap-3 pb-4 border-b border-white/20 last:border-0 last:pb-0"
                    >
                      <div className="w-2 h-2 rounded-full bg-accent mt-2 flex-shrink-0"></div>
                      <p className="text-sm text-white/90 leading-relaxed">{announcement}</p>
                    </div>
                  ))}
                </CardContent>
              </Card>

              <Card className="gradient-card border-0">
                <CardHeader>
                  <CardTitle className="text-xl">Motivational Quote</CardTitle>
                </CardHeader>
                <CardContent>
                  <blockquote className="text-muted-foreground italic leading-relaxed">
                    "Education is the most powerful weapon which you can use to change the world."
                  </blockquote>
                  <p className="text-sm text-accent font-semibold mt-3">- Nelson Mandela</p>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default EventsSection;
