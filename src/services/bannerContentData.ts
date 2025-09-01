import { supabase } from "@/integrations/supabase/client";

export interface BannerContent {
  id: string;
  text: string;
  is_active: boolean;
  display_order: number;
  created_at: string;
  updated_at: string;
}

export const bannerContentService = {
  async getAll(): Promise<BannerContent[]> {
    const { data, error } = await supabase
      .from('banner_content')
      .select('*')
      .eq('is_active', true)
      .order('display_order', { ascending: true });

    if (error) {
      console.error('Error fetching banner content:', error);
      throw error;
    }

    return data || [];
  },

  async create(bannerContent: Omit<BannerContent, 'id' | 'created_at' | 'updated_at'>): Promise<BannerContent> {
    const { data, error } = await supabase
      .from('banner_content')
      .insert([bannerContent])
      .select()
      .single();

    if (error) {
      console.error('Error creating banner content:', error);
      throw error;
    }

    return data;
  },

  async update(id: string, bannerContent: Partial<Omit<BannerContent, 'id' | 'created_at' | 'updated_at'>>): Promise<BannerContent> {
    const { data, error } = await supabase
      .from('banner_content')
      .update(bannerContent)
      .eq('id', id)
      .select()
      .single();

    if (error) {
      console.error('Error updating banner content:', error);
      throw error;
    }

    return data;
  },

  async delete(id: string): Promise<void> {
    const { error } = await supabase
      .from('banner_content')
      .delete()
      .eq('id', id);

    if (error) {
      console.error('Error deleting banner content:', error);
      throw error;
    }
  }
};