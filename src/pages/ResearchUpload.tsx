import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  ArrowLeft, 
  ArrowRight, 
  GraduationCap, 
  UserCircle, 
  Upload,
  Check,
  Loader2,
  FileText,
  Image as ImageIcon,
  Video,
  Link2,
  Plus,
  X
} from 'lucide-react';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import { useSubmitResearchProject } from '@/hooks/useResearchProjects';
import { ContributorType, ProjectCategory, ExternalLink, ResearchProjectInsert } from '@/types/research';
import { getBackendClient } from '@/integrations/backend/client';

const STEPS = [
  { id: 1, title: 'Contributor Type', icon: GraduationCap },
  { id: 2, title: 'Basic Information', icon: FileText },
  { id: 3, title: 'Details', icon: FileText },
  { id: 4, title: 'Resources', icon: Upload },
  { id: 5, title: 'Review', icon: Check },
];

const BRANCHES = ['CSE', 'CSE-DS', 'ECE', 'EEE', 'MECH', 'CIVIL', 'IT', 'AIDS', 'AIML'];
const DEPARTMENTS = ['Computer Science', 'Data Science', 'Electronics', 'Electrical', 'Mechanical', 'Civil', 'Information Technology', 'Artificial Intelligence'];

const ResearchUpload = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const submitMutation = useSubmitResearchProject();
  
  const [currentStep, setCurrentStep] = useState(1);
  const [isUploading, setIsUploading] = useState(false);
  
  // Form state
  const [contributorType, setContributorType] = useState<ContributorType>('student');
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState<ProjectCategory>('project');
  const [summary, setSummary] = useState('');
  const [description, setDescription] = useState('');
  const [problemStatement, setProblemStatement] = useState('');
  const [proposedSolution, setProposedSolution] = useState('');
  const [toolsTechnologies, setToolsTechnologies] = useState<string[]>([]);
  const [newTool, setNewTool] = useState('');
  const [howItWasBuilt, setHowItWasBuilt] = useState('');
  const [outcomesImpact, setOutcomesImpact] = useState('');
  
  // Contributor fields
  const [contributorNames, setContributorNames] = useState<string[]>(['']);
  const [rollNumbers, setRollNumbers] = useState<string[]>(['']);
  const [yearSection, setYearSection] = useState('');
  const [designations, setDesignations] = useState<string[]>(['']);
  const [branch, setBranch] = useState('');
  const [department, setDepartment] = useState('');
  const [contactEmail, setContactEmail] = useState('');
  
  // Media
  const [documentFiles, setDocumentFiles] = useState<File[]>([]);
  const [imageFiles, setImageFiles] = useState<File[]>([]);
  const [videoUrls, setVideoUrls] = useState<string[]>(['']);
  const [externalLinks, setExternalLinks] = useState<ExternalLink[]>([{ label: '', url: '', type: 'other' }]);

  const addContributor = () => {
    setContributorNames([...contributorNames, '']);
    if (contributorType === 'student') {
      setRollNumbers([...rollNumbers, '']);
    } else {
      setDesignations([...designations, '']);
    }
  };

  const removeContributor = (index: number) => {
    if (contributorNames.length > 1) {
      setContributorNames(contributorNames.filter((_, i) => i !== index));
      if (contributorType === 'student') {
        setRollNumbers(rollNumbers.filter((_, i) => i !== index));
      } else {
        setDesignations(designations.filter((_, i) => i !== index));
      }
    }
  };

  const addTool = () => {
    if (newTool.trim()) {
      setToolsTechnologies([...toolsTechnologies, newTool.trim()]);
      setNewTool('');
    }
  };

  const removeTool = (index: number) => {
    setToolsTechnologies(toolsTechnologies.filter((_, i) => i !== index));
  };

  const addExternalLink = () => {
    setExternalLinks([...externalLinks, { label: '', url: '', type: 'other' }]);
  };

  const removeExternalLink = (index: number) => {
    if (externalLinks.length > 1) {
      setExternalLinks(externalLinks.filter((_, i) => i !== index));
    }
  };

  const uploadFile = async (file: File, folder: string): Promise<string> => {
    const supabase = getBackendClient();

    const fileExt = file.name.split('.').pop();
    const fileName = `${folder}/${Date.now()}-${Math.random().toString(36).substr(2, 9)}.${fileExt}`;
    
    const { error } = await supabase.storage
      .from('research-files')
      .upload(fileName, file);
    
    if (error) throw error;
    
    const { data } = supabase.storage
      .from('research-files')
      .getPublicUrl(fileName);
    
    return data.publicUrl;
  };

  const handleSubmit = async () => {
    setIsUploading(true);
    
    try {
      // Upload files
      const documentUrls: string[] = [];
      const imageUrls: string[] = [];
      
      for (const file of documentFiles) {
        const url = await uploadFile(file, 'documents');
        documentUrls.push(url);
      }
      
      for (const file of imageFiles) {
        const url = await uploadFile(file, 'images');
        imageUrls.push(url);
      }
      
      const projectData: ResearchProjectInsert = {
        title,
        category,
        summary,
        description,
        problem_statement: problemStatement,
        proposed_solution: proposedSolution,
        tools_technologies: toolsTechnologies,
        how_it_was_built: howItWasBuilt,
        outcomes_impact: outcomesImpact,
        contributor_type: contributorType,
        contributor_names: contributorNames.filter(n => n.trim()),
        roll_numbers: contributorType === 'student' ? rollNumbers.filter(r => r.trim()) : undefined,
        year_section: contributorType === 'student' ? yearSection : undefined,
        designations: contributorType === 'faculty' ? designations.filter(d => d.trim()) : undefined,
        branch,
        department,
        document_urls: documentUrls,
        image_urls: imageUrls,
        video_urls: videoUrls.filter(v => v.trim()),
        external_links: externalLinks.filter(l => l.url.trim()),
        contact_email: contactEmail,
      };
      
      await submitMutation.mutateAsync(projectData);
      
      toast({
        title: "Submission Successful!",
        description: "Your project has been submitted for review. You'll be notified once it's approved.",
      });
      
      navigate('/research');
    } catch (error) {
      console.error('Error submitting project:', error);
      toast({
        title: "Submission Failed",
        description: "There was an error submitting your project. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsUploading(false);
    }
  };

  const canProceed = () => {
    switch (currentStep) {
      case 1:
        return true;
      case 2:
        return title && category && summary && branch && department && contactEmail && contributorNames[0];
      case 3:
        return problemStatement && proposedSolution && toolsTechnologies.length > 0 && howItWasBuilt && outcomesImpact;
      case 4:
        return true;
      case 5:
        return true;
      default:
        return false;
    }
  };

  const renderStep = () => {
    switch (currentStep) {
      case 1:
        return (
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
          >
            <CardHeader>
              <CardTitle className="text-2xl">Select Contributor Type</CardTitle>
            </CardHeader>
            <CardContent>
              <RadioGroup
                value={contributorType}
                onValueChange={(v) => setContributorType(v as ContributorType)}
                className="grid md:grid-cols-2 gap-6"
              >
                <Label
                  htmlFor="student"
                  className={`flex flex-col items-center gap-4 p-8 rounded-2xl border-2 cursor-pointer transition-all ${
                    contributorType === 'student' 
                      ? 'border-primary bg-primary/10' 
                      : 'border-border hover:border-primary/50'
                  }`}
                >
                  <RadioGroupItem value="student" id="student" className="sr-only" />
                  <div className="w-20 h-20 rounded-full bg-primary/20 flex items-center justify-center">
                    <GraduationCap className="w-10 h-10 text-primary" />
                  </div>
                  <div className="text-center">
                    <p className="text-xl font-bold">Student</p>
                    <p className="text-sm text-muted-foreground mt-1">
                      Submit your academic projects, research papers, or innovations
                    </p>
                  </div>
                </Label>
                
                <Label
                  htmlFor="faculty"
                  className={`flex flex-col items-center gap-4 p-8 rounded-2xl border-2 cursor-pointer transition-all ${
                    contributorType === 'faculty' 
                      ? 'border-primary bg-primary/10' 
                      : 'border-border hover:border-primary/50'
                  }`}
                >
                  <RadioGroupItem value="faculty" id="faculty" className="sr-only" />
                  <div className="w-20 h-20 rounded-full bg-secondary/20 flex items-center justify-center">
                    <UserCircle className="w-10 h-10 text-secondary" />
                  </div>
                  <div className="text-center">
                    <p className="text-xl font-bold">Faculty</p>
                    <p className="text-sm text-muted-foreground mt-1">
                      Share your research work, publications, or faculty-led projects
                    </p>
                  </div>
                </Label>
              </RadioGroup>
            </CardContent>
          </motion.div>
        );
        
      case 2:
        return (
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
          >
            <CardHeader>
              <CardTitle className="text-2xl">Basic Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="title">Project / Research Title *</Label>
                <Input
                  id="title"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="Enter your project title"
                />
              </div>
              
              <div className="space-y-2">
                <Label>Category *</Label>
                <Select value={category} onValueChange={(v) => setCategory(v as ProjectCategory)}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="research">Research</SelectItem>
                    <SelectItem value="project">Project</SelectItem>
                    <SelectItem value="innovation">Innovation</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="summary">Short Summary *</Label>
                <Textarea
                  id="summary"
                  value={summary}
                  onChange={(e) => setSummary(e.target.value)}
                  placeholder="Brief 2-3 line summary of your work"
                  rows={3}
                />
              </div>
              
              <div className="grid md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Branch *</Label>
                  <Select value={branch} onValueChange={setBranch}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select branch" />
                    </SelectTrigger>
                    <SelectContent>
                      {BRANCHES.map((b) => (
                        <SelectItem key={b} value={b}>{b}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="space-y-2">
                  <Label>Department *</Label>
                  <Select value={department} onValueChange={setDepartment}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select department" />
                    </SelectTrigger>
                    <SelectContent>
                      {DEPARTMENTS.map((d) => (
                        <SelectItem key={d} value={d}>{d}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="email">Contact Email *</Label>
                <Input
                  id="email"
                  type="email"
                  value={contactEmail}
                  onChange={(e) => setContactEmail(e.target.value)}
                  placeholder="your.email@example.com"
                />
              </div>
              
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <Label>Contributors *</Label>
                  <Button type="button" variant="outline" size="sm" onClick={addContributor}>
                    <Plus className="w-4 h-4 mr-1" />
                    Add
                  </Button>
                </div>
                
                {contributorNames.map((name, index) => (
                  <div key={index} className="flex gap-4 items-start">
                    <div className="flex-1 grid md:grid-cols-2 gap-4">
                      <Input
                        value={name}
                        onChange={(e) => {
                          const newNames = [...contributorNames];
                          newNames[index] = e.target.value;
                          setContributorNames(newNames);
                        }}
                        placeholder="Full Name"
                      />
                      {contributorType === 'student' ? (
                        <Input
                          value={rollNumbers[index] || ''}
                          onChange={(e) => {
                            const newRolls = [...rollNumbers];
                            newRolls[index] = e.target.value;
                            setRollNumbers(newRolls);
                          }}
                          placeholder="Roll Number"
                        />
                      ) : (
                        <Input
                          value={designations[index] || ''}
                          onChange={(e) => {
                            const newDesignations = [...designations];
                            newDesignations[index] = e.target.value;
                            setDesignations(newDesignations);
                          }}
                          placeholder="Designation"
                        />
                      )}
                    </div>
                    {contributorNames.length > 1 && (
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        onClick={() => removeContributor(index)}
                      >
                        <X className="w-4 h-4" />
                      </Button>
                    )}
                  </div>
                ))}
                
                {contributorType === 'student' && (
                  <div className="space-y-2">
                    <Label htmlFor="yearSection">Year & Section</Label>
                    <Input
                      id="yearSection"
                      value={yearSection}
                      onChange={(e) => setYearSection(e.target.value)}
                      placeholder="e.g., 3rd Year - Section A"
                    />
                  </div>
                )}
              </div>
            </CardContent>
          </motion.div>
        );
        
      case 3:
        return (
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
          >
            <CardHeader>
              <CardTitle className="text-2xl">Project Details</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="problem">Problem Statement *</Label>
                <Textarea
                  id="problem"
                  value={problemStatement}
                  onChange={(e) => setProblemStatement(e.target.value)}
                  placeholder="Describe the problem your project addresses"
                  rows={4}
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="solution">Proposed Solution *</Label>
                <Textarea
                  id="solution"
                  value={proposedSolution}
                  onChange={(e) => setProposedSolution(e.target.value)}
                  placeholder="Explain your solution step-by-step"
                  rows={4}
                />
              </div>
              
              <div className="space-y-4">
                <Label>Tools & Technologies *</Label>
                <div className="flex gap-2">
                  <Input
                    value={newTool}
                    onChange={(e) => setNewTool(e.target.value)}
                    placeholder="Add a tool or technology"
                    onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addTool())}
                  />
                  <Button type="button" onClick={addTool}>Add</Button>
                </div>
                <div className="flex flex-wrap gap-2">
                  {toolsTechnologies.map((tool, index) => (
                    <Badge key={index} variant="secondary" className="px-3 py-1 text-sm">
                      {tool}
                      <button
                        type="button"
                        onClick={() => removeTool(index)}
                        className="ml-2 hover:text-destructive"
                      >
                        <X className="w-3 h-3" />
                      </button>
                    </Badge>
                  ))}
                </div>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="howBuilt">How It Was Built *</Label>
                <Textarea
                  id="howBuilt"
                  value={howItWasBuilt}
                  onChange={(e) => setHowItWasBuilt(e.target.value)}
                  placeholder="Describe the workflow and architecture"
                  rows={4}
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="outcomes">Outcomes & Impact *</Label>
                <Textarea
                  id="outcomes"
                  value={outcomesImpact}
                  onChange={(e) => setOutcomesImpact(e.target.value)}
                  placeholder="What are the results and benefits?"
                  rows={4}
                />
              </div>
            </CardContent>
          </motion.div>
        );
        
      case 4:
        return (
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
          >
            <CardHeader>
              <CardTitle className="text-2xl">Resources & Media</CardTitle>
            </CardHeader>
            <CardContent className="space-y-8">
              {/* Documents */}
              <div className="space-y-4">
                <Label className="flex items-center gap-2">
                  <FileText className="w-4 h-4" />
                  Documents (PDF, DOC, DOCX)
                </Label>
                <div className="border-2 border-dashed border-border rounded-xl p-8 text-center">
                  <input
                    type="file"
                    accept=".pdf,.doc,.docx"
                    multiple
                    className="hidden"
                    id="documents"
                    onChange={(e) => setDocumentFiles(Array.from(e.target.files || []))}
                  />
                  <label htmlFor="documents" className="cursor-pointer">
                    <Upload className="w-12 h-12 mx-auto text-muted-foreground mb-4" />
                    <p className="text-muted-foreground">Drop files here or click to upload</p>
                    <p className="text-xs text-muted-foreground mt-2">Max 10MB per file</p>
                  </label>
                </div>
                {documentFiles.length > 0 && (
                  <div className="flex flex-wrap gap-2">
                    {documentFiles.map((file, index) => (
                      <Badge key={index} variant="secondary">
                        {file.name}
                        <button
                          type="button"
                          onClick={() => setDocumentFiles(documentFiles.filter((_, i) => i !== index))}
                          className="ml-2"
                        >
                          <X className="w-3 h-3" />
                        </button>
                      </Badge>
                    ))}
                  </div>
                )}
              </div>
              
              {/* Images */}
              <div className="space-y-4">
                <Label className="flex items-center gap-2">
                  <ImageIcon className="w-4 h-4" />
                  Images (JPG, PNG, GIF)
                </Label>
                <div className="border-2 border-dashed border-border rounded-xl p-8 text-center">
                  <input
                    type="file"
                    accept="image/*"
                    multiple
                    className="hidden"
                    id="images"
                    onChange={(e) => setImageFiles(Array.from(e.target.files || []))}
                  />
                  <label htmlFor="images" className="cursor-pointer">
                    <ImageIcon className="w-12 h-12 mx-auto text-muted-foreground mb-4" />
                    <p className="text-muted-foreground">Drop images here or click to upload</p>
                    <p className="text-xs text-muted-foreground mt-2">Max 5MB per image</p>
                  </label>
                </div>
                {imageFiles.length > 0 && (
                  <div className="flex flex-wrap gap-2">
                    {imageFiles.map((file, index) => (
                      <Badge key={index} variant="secondary">
                        {file.name}
                        <button
                          type="button"
                          onClick={() => setImageFiles(imageFiles.filter((_, i) => i !== index))}
                          className="ml-2"
                        >
                          <X className="w-3 h-3" />
                        </button>
                      </Badge>
                    ))}
                  </div>
                )}
              </div>
              
              {/* Video URLs */}
              <div className="space-y-4">
                <Label className="flex items-center gap-2">
                  <Video className="w-4 h-4" />
                  Video URLs (YouTube, Vimeo)
                </Label>
                {videoUrls.map((url, index) => (
                  <div key={index} className="flex gap-2">
                    <Input
                      value={url}
                      onChange={(e) => {
                        const newUrls = [...videoUrls];
                        newUrls[index] = e.target.value;
                        setVideoUrls(newUrls);
                      }}
                      placeholder="https://youtube.com/..."
                    />
                    {videoUrls.length > 1 && (
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        onClick={() => setVideoUrls(videoUrls.filter((_, i) => i !== index))}
                      >
                        <X className="w-4 h-4" />
                      </Button>
                    )}
                  </div>
                ))}
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => setVideoUrls([...videoUrls, ''])}
                >
                  <Plus className="w-4 h-4 mr-1" />
                  Add Video URL
                </Button>
              </div>
              
              {/* External Links */}
              <div className="space-y-4">
                <Label className="flex items-center gap-2">
                  <Link2 className="w-4 h-4" />
                  External Links
                </Label>
                {externalLinks.map((link, index) => (
                  <div key={index} className="flex gap-2 items-start">
                    <div className="flex-1 grid md:grid-cols-3 gap-2">
                      <Input
                        value={link.label}
                        onChange={(e) => {
                          const newLinks = [...externalLinks];
                          newLinks[index].label = e.target.value;
                          setExternalLinks(newLinks);
                        }}
                        placeholder="Label (e.g., GitHub)"
                      />
                      <Input
                        value={link.url}
                        onChange={(e) => {
                          const newLinks = [...externalLinks];
                          newLinks[index].url = e.target.value;
                          setExternalLinks(newLinks);
                        }}
                        placeholder="https://..."
                        className="md:col-span-2"
                      />
                    </div>
                    {externalLinks.length > 1 && (
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        onClick={() => removeExternalLink(index)}
                      >
                        <X className="w-4 h-4" />
                      </Button>
                    )}
                  </div>
                ))}
                <Button type="button" variant="outline" size="sm" onClick={addExternalLink}>
                  <Plus className="w-4 h-4 mr-1" />
                  Add Link
                </Button>
              </div>
            </CardContent>
          </motion.div>
        );
        
      case 5:
        return (
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
          >
            <CardHeader>
              <CardTitle className="text-2xl">Review & Submit</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="bg-muted/50 rounded-xl p-6 space-y-4">
                <div className="flex items-center gap-3">
                  <Badge className="capitalize">{category}</Badge>
                  <Badge variant="secondary" className="capitalize">{contributorType}</Badge>
                </div>
                
                <h3 className="text-xl font-bold">{title}</h3>
                <p className="text-muted-foreground">{summary}</p>
                
                <div className="grid md:grid-cols-2 gap-4 text-sm">
                  <div>
                    <span className="font-semibold">Contributors: </span>
                    {contributorNames.filter(n => n.trim()).join(', ')}
                  </div>
                  <div>
                    <span className="font-semibold">Branch: </span>
                    {branch}
                  </div>
                  <div>
                    <span className="font-semibold">Department: </span>
                    {department}
                  </div>
                  <div>
                    <span className="font-semibold">Contact: </span>
                    {contactEmail}
                  </div>
                </div>
                
                <div className="pt-4 border-t">
                  <span className="font-semibold">Technologies: </span>
                  <div className="flex flex-wrap gap-2 mt-2">
                    {toolsTechnologies.map((tool, index) => (
                      <Badge key={index} variant="outline">{tool}</Badge>
                    ))}
                  </div>
                </div>
                
                <div className="pt-4 border-t">
                  <span className="font-semibold">Resources: </span>
                  <div className="flex gap-4 mt-2 text-sm text-muted-foreground">
                    <span>{documentFiles.length} documents</span>
                    <span>{imageFiles.length} images</span>
                    <span>{videoUrls.filter(v => v.trim()).length} videos</span>
                    <span>{externalLinks.filter(l => l.url.trim()).length} links</span>
                  </div>
                </div>
              </div>
              
              <div className="bg-yellow-500/10 border border-yellow-500/30 rounded-xl p-4">
                <p className="text-sm text-yellow-600 dark:text-yellow-400">
                  ⚠️ Your submission will be reviewed by the department before being published. 
                  You'll receive an email notification once it's approved.
                </p>
              </div>
            </CardContent>
          </motion.div>
        );
        
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="pt-24 pb-16">
        <div className="container mx-auto px-4 max-w-4xl">
          {/* Back Button */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="mb-8"
          >
            <Button variant="ghost" onClick={() => navigate('/research')}>
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Research
            </Button>
          </motion.div>

          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center mb-12"
          >
            <h1 className="text-4xl font-black mb-4">Upload Your Work</h1>
            <p className="text-muted-foreground">Share your research, projects, or innovations with the academic community</p>
          </motion.div>

          {/* Progress Steps */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="mb-8"
          >
            <div className="flex justify-between items-center">
              {STEPS.map((step, index) => (
                <div key={step.id} className="flex items-center">
                  <div
                    className={`w-10 h-10 rounded-full flex items-center justify-center font-semibold transition-all ${
                      currentStep >= step.id
                        ? 'bg-primary text-white'
                        : 'bg-muted text-muted-foreground'
                    }`}
                  >
                    {currentStep > step.id ? (
                      <Check className="w-5 h-5" />
                    ) : (
                      step.id
                    )}
                  </div>
                  {index < STEPS.length - 1 && (
                    <div
                      className={`hidden sm:block h-1 w-16 md:w-24 lg:w-32 mx-2 rounded ${
                        currentStep > step.id ? 'bg-primary' : 'bg-muted'
                      }`}
                    />
                  )}
                </div>
              ))}
            </div>
            <div className="flex justify-between mt-2">
              {STEPS.map((step) => (
                <span
                  key={step.id}
                  className={`text-xs font-medium hidden sm:block ${
                    currentStep >= step.id ? 'text-primary' : 'text-muted-foreground'
                  }`}
                >
                  {step.title}
                </span>
              ))}
            </div>
          </motion.div>

          {/* Form Card */}
          <Card className="border-primary/20">
            <AnimatePresence mode="wait">
              {renderStep()}
            </AnimatePresence>
            
            {/* Navigation Buttons */}
            <div className="p-6 pt-0 flex justify-between">
              <Button
                variant="outline"
                onClick={() => setCurrentStep(Math.max(1, currentStep - 1))}
                disabled={currentStep === 1}
              >
                <ArrowLeft className="w-4 h-4 mr-2" />
                Previous
              </Button>
              
              {currentStep < 5 ? (
                <Button
                  onClick={() => setCurrentStep(Math.min(5, currentStep + 1))}
                  disabled={!canProceed()}
                >
                  Next
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
              ) : (
                <Button
                  onClick={handleSubmit}
                  disabled={isUploading}
                  className="bg-gradient-to-r from-primary to-secondary"
                >
                  {isUploading ? (
                    <>
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      Submitting...
                    </>
                  ) : (
                    <>
                      <Upload className="w-4 h-4 mr-2" />
                      Submit for Review
                    </>
                  )}
                </Button>
              )}
            </div>
          </Card>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default ResearchUpload;
