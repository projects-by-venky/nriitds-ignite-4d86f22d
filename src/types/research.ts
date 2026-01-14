export type ContributorType = 'student' | 'faculty';
export type ProjectCategory = 'research' | 'project' | 'innovation';
export type ApprovalStatus = 'pending' | 'approved' | 'rejected';

export interface ExternalLink {
  label: string;
  url: string;
  type: 'github' | 'paper' | 'demo' | 'drive' | 'other';
}

export interface ResearchProject {
  id: string;
  created_at: string;
  updated_at: string;
  title: string;
  category: ProjectCategory;
  summary: string;
  description: string;
  problem_statement: string;
  proposed_solution: string;
  tools_technologies: string[];
  how_it_was_built: string;
  outcomes_impact: string;
  contributor_type: ContributorType;
  contributor_names: string[];
  roll_numbers: string[] | null;
  year_section: string | null;
  designations: string[] | null;
  branch: string;
  department: string;
  document_urls: string[];
  image_urls: string[];
  video_urls: string[];
  external_links: ExternalLink[];
  status: ApprovalStatus;
  approved_by: string | null;
  approved_at: string | null;
  rejection_reason: string | null;
  contact_email: string;
}

export interface ResearchProjectInsert {
  title: string;
  category: ProjectCategory;
  summary: string;
  description: string;
  problem_statement: string;
  proposed_solution: string;
  tools_technologies: string[];
  how_it_was_built: string;
  outcomes_impact: string;
  contributor_type: ContributorType;
  contributor_names: string[];
  roll_numbers?: string[];
  year_section?: string;
  designations?: string[];
  branch: string;
  department: string;
  document_urls?: string[];
  image_urls?: string[];
  video_urls?: string[];
  external_links?: ExternalLink[];
  contact_email: string;
}
