import { useParams, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  ArrowLeft, 
  FileText, 
  Download, 
  ExternalLink, 
  Video, 
  Image as ImageIcon,
  Github,
  GraduationCap,
  UserCircle,
  Calendar,
  Building2,
  Wrench,
  Target,
  Lightbulb,
  TrendingUp,
  BookOpen
} from 'lucide-react';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useResearchProject } from '@/hooks/useResearchProjects';
import { Skeleton } from '@/components/ui/skeleton';

const categoryColors = {
  research: 'bg-blue-500/20 text-blue-400 border-blue-500/30',
  project: 'bg-green-500/20 text-green-400 border-green-500/30',
  innovation: 'bg-purple-500/20 text-purple-400 border-purple-500/30',
};

const ResearchDetail = () => {
  const { id } = useParams<{ id: string }>();
  const { data: project, isLoading, error } = useResearchProject(id || '');

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <main className="pt-24 pb-16">
          <div className="container mx-auto px-4 max-w-5xl">
            <Skeleton className="h-8 w-32 mb-8" />
            <Skeleton className="h-12 w-3/4 mb-4" />
            <Skeleton className="h-6 w-1/2 mb-8" />
            <div className="grid gap-6">
              {[1, 2, 3].map((i) => (
                <Skeleton key={i} className="h-48 w-full" />
              ))}
            </div>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  if (error || !project) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <main className="pt-24 pb-16">
          <div className="container mx-auto px-4 text-center">
            <h1 className="text-3xl font-bold mb-4">Project Not Found</h1>
            <p className="text-muted-foreground mb-8">The project you're looking for doesn't exist or has been removed.</p>
            <Link to="/research">
              <Button>
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back to Research
              </Button>
            </Link>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  const linkIcons = {
    github: Github,
    paper: FileText,
    demo: ExternalLink,
    drive: FileText,
    other: ExternalLink,
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="pt-24 pb-16">
        <div className="container mx-auto px-4 max-w-5xl">
          {/* Back Button */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="mb-8"
          >
            <Link to="/research">
              <Button variant="ghost" className="group">
                <ArrowLeft className="w-4 h-4 mr-2 group-hover:-translate-x-1 transition-transform" />
                Back to Research
              </Button>
            </Link>
          </motion.div>

          {/* Header Section */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-12"
          >
            <div className="flex flex-wrap gap-3 mb-4">
              <Badge className={`${categoryColors[project.category]} border font-semibold`}>
                {project.category.charAt(0).toUpperCase() + project.category.slice(1)}
              </Badge>
              <Badge variant="secondary" className="flex items-center gap-1">
                {project.contributor_type === 'student' ? (
                  <GraduationCap className="w-3 h-3" />
                ) : (
                  <UserCircle className="w-3 h-3" />
                )}
                {project.contributor_type === 'student' ? 'Student' : 'Faculty'}
              </Badge>
            </div>
            
            <h1 className="text-4xl md:text-5xl font-black mb-6 bg-gradient-to-r from-foreground to-foreground/70 bg-clip-text">
              {project.title}
            </h1>
            
            <p className="text-xl text-muted-foreground leading-relaxed">
              {project.summary}
            </p>
          </motion.div>

          {/* Contributors Card */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
          >
            <Card className="mb-8 border-primary/20">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-lg">
                  {project.contributor_type === 'student' ? (
                    <GraduationCap className="w-5 h-5 text-primary" />
                  ) : (
                    <UserCircle className="w-5 h-5 text-primary" />
                  )}
                  Contributors
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid md:grid-cols-2 gap-4">
                  {project.contributor_names.map((name, index) => (
                    <div key={index} className="flex items-start gap-4 p-4 rounded-xl bg-muted/50">
                      <div className="w-12 h-12 rounded-full bg-primary/20 flex items-center justify-center">
                        <span className="text-lg font-bold text-primary">
                          {name.charAt(0)}
                        </span>
                      </div>
                      <div>
                        <p className="font-semibold">{name}</p>
                        {project.contributor_type === 'student' && project.roll_numbers?.[index] && (
                          <p className="text-sm text-muted-foreground">Roll: {project.roll_numbers[index]}</p>
                        )}
                        {project.contributor_type === 'faculty' && project.designations?.[index] && (
                          <p className="text-sm text-muted-foreground">{project.designations[index]}</p>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
                
                <div className="flex flex-wrap gap-4 mt-6 pt-6 border-t">
                  <div className="flex items-center gap-2 text-sm">
                    <Building2 className="w-4 h-4 text-muted-foreground" />
                    <span>{project.department}</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <BookOpen className="w-4 h-4 text-muted-foreground" />
                    <span>{project.branch}</span>
                  </div>
                  {project.year_section && (
                    <div className="flex items-center gap-2 text-sm">
                      <Calendar className="w-4 h-4 text-muted-foreground" />
                      <span>{project.year_section}</span>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* Problem Statement */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            <Card className="mb-8">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-lg">
                  <Target className="w-5 h-5 text-red-500" />
                  Problem Statement
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground leading-relaxed whitespace-pre-wrap">
                  {project.problem_statement}
                </p>
              </CardContent>
            </Card>
          </motion.div>

          {/* Proposed Solution */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
          >
            <Card className="mb-8">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-lg">
                  <Lightbulb className="w-5 h-5 text-yellow-500" />
                  Proposed Solution
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground leading-relaxed whitespace-pre-wrap">
                  {project.proposed_solution}
                </p>
              </CardContent>
            </Card>
          </motion.div>

          {/* Tools & Technologies */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
          >
            <Card className="mb-8">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-lg">
                  <Wrench className="w-5 h-5 text-secondary" />
                  Tools & Technologies
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex flex-wrap gap-2">
                  {project.tools_technologies.map((tool, index) => (
                    <Badge key={index} variant="secondary" className="px-3 py-1">
                      {tool}
                    </Badge>
                  ))}
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* How It Was Built */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
          >
            <Card className="mb-8">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-lg">
                  <Wrench className="w-5 h-5 text-blue-500" />
                  How It Was Built
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground leading-relaxed whitespace-pre-wrap">
                  {project.how_it_was_built}
                </p>
              </CardContent>
            </Card>
          </motion.div>

          {/* Outcomes & Impact */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
          >
            <Card className="mb-8">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-lg">
                  <TrendingUp className="w-5 h-5 text-green-500" />
                  Outcomes & Impact
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground leading-relaxed whitespace-pre-wrap">
                  {project.outcomes_impact}
                </p>
              </CardContent>
            </Card>
          </motion.div>

          {/* Resources Section */}
          {(project.document_urls.length > 0 || project.image_urls.length > 0 || project.video_urls.length > 0 || project.external_links.length > 0) && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.7 }}
            >
              <Card className="mb-8">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-lg">
                    <FileText className="w-5 h-5 text-primary" />
                    Resources
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  {/* Documents */}
                  {project.document_urls.length > 0 && (
                    <div>
                      <h4 className="font-semibold mb-3 flex items-center gap-2">
                        <FileText className="w-4 h-4" />
                        Documents
                      </h4>
                      <div className="flex flex-wrap gap-2">
                        {project.document_urls.map((url, index) => (
                          <a key={index} href={url} target="_blank" rel="noopener noreferrer">
                            <Button variant="outline" size="sm">
                              <Download className="w-4 h-4 mr-2" />
                              Document {index + 1}
                            </Button>
                          </a>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Images */}
                  {project.image_urls.length > 0 && (
                    <div>
                      <h4 className="font-semibold mb-3 flex items-center gap-2">
                        <ImageIcon className="w-4 h-4" />
                        Images
                      </h4>
                      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                        {project.image_urls.map((url, index) => (
                          <a key={index} href={url} target="_blank" rel="noopener noreferrer">
                            <img 
                              src={url} 
                              alt={`Project image ${index + 1}`}
                              className="w-full h-40 object-cover rounded-lg border hover:opacity-80 transition-opacity"
                            />
                          </a>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Videos */}
                  {project.video_urls.length > 0 && (
                    <div>
                      <h4 className="font-semibold mb-3 flex items-center gap-2">
                        <Video className="w-4 h-4" />
                        Videos
                      </h4>
                      <div className="grid gap-4">
                        {project.video_urls.map((url, index) => (
                          <div key={index} className="aspect-video bg-muted rounded-lg overflow-hidden">
                            <iframe 
                              src={url}
                              className="w-full h-full"
                              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                              allowFullScreen
                            />
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* External Links */}
                  {project.external_links.length > 0 && (
                    <div>
                      <h4 className="font-semibold mb-3 flex items-center gap-2">
                        <ExternalLink className="w-4 h-4" />
                        External Links
                      </h4>
                      <div className="flex flex-wrap gap-2">
                        {project.external_links.map((link, index) => {
                          const Icon = linkIcons[link.type] || ExternalLink;
                          return (
                            <a key={index} href={link.url} target="_blank" rel="noopener noreferrer">
                              <Button variant="outline" size="sm">
                                <Icon className="w-4 h-4 mr-2" />
                                {link.label}
                              </Button>
                            </a>
                          );
                        })}
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            </motion.div>
          )}
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default ResearchDetail;
