import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { FileText, Link2, Video, Image, GraduationCap, UserCircle } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { ResearchProject } from '@/types/research';

interface ResearchCardProps {
  project: ResearchProject;
  index: number;
}

const categoryColors = {
  research: 'bg-blue-500/20 text-blue-400 border-blue-500/30',
  project: 'bg-green-500/20 text-green-400 border-green-500/30',
  innovation: 'bg-purple-500/20 text-purple-400 border-purple-500/30',
};

const categoryLabels = {
  research: 'Research',
  project: 'Project',
  innovation: 'Innovation',
};

const ResearchCard = ({ project, index }: ResearchCardProps) => {
  const hasDocuments = project.document_urls.length > 0;
  const hasImages = project.image_urls.length > 0;
  const hasVideos = project.video_urls.length > 0;
  const hasLinks = project.external_links.length > 0;

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
    >
      <Link to={`/research/${project.id}`}>
        <div className="group bg-card/80 backdrop-blur-sm border border-border rounded-2xl overflow-hidden h-full hover:border-primary/50 transition-all duration-300 hover:shadow-[0_0_40px_hsl(217_91%_60%_/_0.2)] hover:-translate-y-1">
          {/* Header Image Area */}
          <div className="h-40 bg-gradient-to-br from-primary/20 via-secondary/10 to-primary/5 relative overflow-hidden">
            {project.image_urls.length > 0 ? (
              <img 
                src={project.image_urls[0]} 
                alt={project.title}
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="w-20 h-20 rounded-full bg-primary/20 flex items-center justify-center group-hover:scale-110 transition-transform">
                  {project.contributor_type === 'student' ? (
                    <GraduationCap className="w-10 h-10 text-primary/60" />
                  ) : (
                    <UserCircle className="w-10 h-10 text-primary/60" />
                  )}
                </div>
              </div>
            )}
            
            {/* Category Badge */}
            <div className="absolute top-4 left-4">
              <Badge className={`${categoryColors[project.category]} border font-semibold`}>
                {categoryLabels[project.category]}
              </Badge>
            </div>

            {/* Role Badge */}
            <div className="absolute top-4 right-4">
              <Badge variant="secondary" className="bg-white/10 backdrop-blur-md border-white/20 text-white">
                {project.contributor_type === 'student' ? 'Student' : 'Faculty'}
              </Badge>
            </div>
          </div>

          {/* Content */}
          <div className="p-6">
            {/* Title */}
            <h3 className="text-xl font-bold mb-2 group-hover:text-primary transition-colors line-clamp-2">
              {project.title}
            </h3>

            {/* Authors */}
            <p className="text-sm text-muted-foreground mb-2">
              By: {project.contributor_names.join(', ')}
            </p>

            {/* Department */}
            <p className="text-xs text-secondary mb-4">
              {project.department} • {project.branch}
            </p>

            {/* Summary */}
            <p className="text-sm text-muted-foreground line-clamp-3 mb-4">
              {project.summary}
            </p>

            {/* Resource Icons */}
            <div className="flex items-center gap-3 pt-4 border-t border-border">
              {hasDocuments && (
                <div className="flex items-center gap-1 text-muted-foreground">
                  <FileText className="w-4 h-4" />
                  <span className="text-xs">{project.document_urls.length}</span>
                </div>
              )}
              {hasImages && (
                <div className="flex items-center gap-1 text-muted-foreground">
                  <Image className="w-4 h-4" />
                  <span className="text-xs">{project.image_urls.length}</span>
                </div>
              )}
              {hasVideos && (
                <div className="flex items-center gap-1 text-muted-foreground">
                  <Video className="w-4 h-4" />
                  <span className="text-xs">{project.video_urls.length}</span>
                </div>
              )}
              {hasLinks && (
                <div className="flex items-center gap-1 text-muted-foreground">
                  <Link2 className="w-4 h-4" />
                  <span className="text-xs">{project.external_links.length}</span>
                </div>
              )}
            </div>
          </div>
        </div>
      </Link>
    </motion.div>
  );
};

export default ResearchCard;
