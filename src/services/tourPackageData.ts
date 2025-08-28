import { supabase } from "@/integrations/supabase/client";

export interface TourPackage {
  id: string;
  title: string;
  description: string;
  price: string;
  image: string;
  highlights: string[];
  inclusions: string[];
}

export const tourPackageService = {
  async getAllPackages(): Promise<TourPackage[]> {
    const { data, error } = await supabase
      .from('tour_packages')
      .select('*')
      .order('created_at', { ascending: true });
    
    if (error) {
      console.error('Error fetching tour packages:', error);
      return [];
    }
    
    return data.map(pkg => ({
      id: pkg.id,
      title: pkg.title,
      description: pkg.description,
      price: pkg.price,
      image: pkg.image || '/placeholder.svg',
      highlights: pkg.highlights || [],
      inclusions: pkg.inclusions || []
    }));
  },

  async addPackage(pkg: Omit<TourPackage, 'id'>): Promise<TourPackage | null> {
    const { data, error } = await supabase
      .from('tour_packages')
      .insert([{
        title: pkg.title,
        description: pkg.description,
        price: pkg.price,
        image: pkg.image,
        highlights: pkg.highlights,
        inclusions: pkg.inclusions
      }])
      .select()
      .single();
    
    if (error) {
      console.error('Error adding tour package:', error);
      return null;
    }
    
    return {
      id: data.id,
      title: data.title,
      description: data.description,
      price: data.price,
      image: data.image || '/placeholder.svg',
      highlights: data.highlights || [],
      inclusions: data.inclusions || []
    };
  },

  async updatePackage(id: string, updatedPackage: Omit<TourPackage, 'id'>): Promise<boolean> {
    const { error } = await supabase
      .from('tour_packages')
      .update({
        title: updatedPackage.title,
        description: updatedPackage.description,
        price: updatedPackage.price,
        image: updatedPackage.image,
        highlights: updatedPackage.highlights,
        inclusions: updatedPackage.inclusions
      })
      .eq('id', id);
    
    if (error) {
      console.error('Error updating tour package:', error);
      return false;
    }
    
    return true;
  },

  async deletePackage(id: string): Promise<boolean> {
    const { error } = await supabase
      .from('tour_packages')
      .delete()
      .eq('id', id);
    
    if (error) {
      console.error('Error deleting tour package:', error);
      return false;
    }
    
    return true;
  },

  async getPackageById(id: string): Promise<TourPackage | null> {
    const { data, error } = await supabase
      .from('tour_packages')
      .select('*')
      .eq('id', id)
      .single();
    
    if (error) {
      console.error('Error fetching tour package by id:', error);
      return null;
    }
    
    return {
      id: data.id,
      title: data.title,
      description: data.description,
      price: data.price,
      image: data.image || '/placeholder.svg',
      highlights: data.highlights || [],
      inclusions: data.inclusions || []
    };
  }
};