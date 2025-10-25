import { Code, Cpu, Database, Brain, Rocket, Briefcase } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

const CoursesSection = () => {
  const courses = [
    {
      icon: Code,
      title: "Computer Science",
      description: "Master programming, algorithms, and software development with industry-standard tools.",
      duration: "4 Years",
      students: "1200+",
      color: "from-blue-500 to-cyan-500",
    },
    {
      icon: Brain,
      title: "Artificial Intelligence",
      description: "Explore machine learning, deep learning, and neural networks with hands-on projects.",
      duration: "4 Years",
      students: "800+",
      color: "from-purple-500 to-pink-500",
    },
    {
      icon: Database,
      title: "Data Science",
      description: "Analyze data, build models, and extract insights using advanced analytics techniques.",
      duration: "4 Years",
      students: "950+",
      color: "from-green-500 to-emerald-500",
    },
    {
      icon: Cpu,
      title: "Electronics & Comm.",
      description: "Design circuits, IoT systems, and embedded solutions for modern technology.",
      duration: "4 Years",
      students: "700+",
      color: "from-orange-500 to-red-500",
    },
    {
      icon: Rocket,
      title: "Mechanical Engineering",
      description: "Innovation in design, manufacturing, and automation with cutting-edge technology.",
      duration: "4 Years",
      students: "850+",
      color: "from-indigo-500 to-blue-500",
    },
    {
      icon: Briefcase,
      title: "Business Management",
      description: "Develop leadership, strategy, and entrepreneurial skills for the business world.",
      duration: "2-3 Years",
      students: "600+",
      color: "from-yellow-500 to-orange-500",
    },
  ];

  return (
    <section id="courses" className="py-20">
      <div className="container mx-auto px-4">
        <div className="max-w-6xl mx-auto">
          {/* Section Header */}
          <div className="text-center mb-16">
            <span className="text-accent font-semibold text-sm uppercase tracking-wider">Our Programs</span>
            <h2 className="text-4xl md:text-5xl font-bold text-foreground mt-3 mb-4">
              Explore Our Courses
            </h2>
            <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
              Choose from a wide range of undergraduate and postgraduate programs designed for the future.
            </p>
          </div>

          {/* Courses Grid */}
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {courses.map((course, index) => (
              <Card 
                key={index}
                className="gradient-card border-0 hover:shadow-accent transition-all duration-300 hover:-translate-y-2 group"
              >
                <CardHeader>
                  <div className={`w-14 h-14 rounded-xl bg-gradient-to-br ${course.color} flex items-center justify-center mb-4 shadow-lg group-hover:scale-110 transition-transform`}>
                    <course.icon className="w-7 h-7 text-white" />
                  </div>
                  <CardTitle className="text-xl mb-2">{course.title}</CardTitle>
                  <div className="flex gap-2">
                    <Badge variant="secondary" className="text-xs">{course.duration}</Badge>
                    <Badge variant="outline" className="text-xs">{course.students} Students</Badge>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground mb-4 leading-relaxed">
                    {course.description}
                  </p>
                  <Button variant="ghost" className="w-full group-hover:text-primary">
                    Learn More →
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* View All CTA */}
          <div className="text-center mt-12">
            <Button size="lg" className="gradient-primary text-primary-foreground shadow-accent">
              View All Programs
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default CoursesSection;
