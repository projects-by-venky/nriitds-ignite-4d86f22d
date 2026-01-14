import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { ResearchProject, ResearchProjectInsert, ContributorType, ExternalLink } from '@/types/research';

export const useResearchProjects = (contributorType?: ContributorType) => {
  return useQuery({
    queryKey: ['research-projects', contributorType],
    queryFn: async () => {
      let query = supabase
        .from('research_projects')
        .select('*')
        .eq('status', 'approved')
        .order('created_at', { ascending: false });
      
      if (contributorType) {
        query = query.eq('contributor_type', contributorType);
      }
      
      const { data, error } = await query;
      
      if (error) throw error;
      
      // Transform the data to match our types
      return (data || []).map(item => ({
        ...item,
        external_links: (item.external_links as unknown as ExternalLink[]) || []
      })) as ResearchProject[];
    },
  });
};

export const useResearchProject = (id: string) => {
  return useQuery({
    queryKey: ['research-project', id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('research_projects')
        .select('*')
        .eq('id', id)
        .maybeSingle();
      
      if (error) throw error;
      if (!data) return null;
      
      return {
        ...data,
        external_links: (data.external_links as unknown as ExternalLink[]) || []
      } as ResearchProject;
    },
    enabled: !!id,
  });
};

export const useSubmitResearchProject = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (project: ResearchProjectInsert) => {
      const { data, error } = await supabase
        .from('research_projects')
        .insert({
          ...project,
          external_links: project.external_links as unknown as any
        })
        .select()
        .single();
      
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['research-projects'] });
    },
  });
};
