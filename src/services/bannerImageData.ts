import { supabase } from "@/integrations/supabase/client";

export interface BannerImage {
  id: string;
  image_url: string;
  alt_text: string;
  link_url: string | null;
  is_active: boolean;
  display_order: number;
  created_at: string;
  updated_at: string;
}

export type BannerImageInput = Omit<BannerImage, 'id' | 'created_at' | 'updated_at'>;

export const bannerImageService = {
  async getActive(): Promise<BannerImage[]> {
    const { data, error } = await supabase
      .from('banner_images')
      .select('*')
      .eq('is_active', true)
      .order('display_order', { ascending: true });

    if (error) throw error;
    return data || [];
  },

  async getAll(): Promise<BannerImage[]> {
    const { data, error } = await supabase
      .from('banner_images')
      .select('*')
      .order('display_order', { ascending: true });

    if (error) throw error;
    return data || [];
  },

  async create(banner: BannerImageInput): Promise<BannerImage> {
    const { data, error } = await supabase
      .from('banner_images')
      .insert([banner])
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  async update(id: string, banner: Partial<BannerImageInput>): Promise<BannerImage> {
    const { data, error } = await supabase
      .from('banner_images')
      .update(banner)
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  async delete(id: string): Promise<void> {
    const { error } = await supabase.from('banner_images').delete().eq('id', id);
    if (error) throw error;
  },
};
