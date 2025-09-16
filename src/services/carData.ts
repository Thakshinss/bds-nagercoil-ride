import { supabase } from '@/integrations/supabase/client';

export interface Car {
  id: string;
  name: string;
  category: string;
  type: string;
  price: string;
  features: string[];
  rating: number;
  description: string;
  image?: string;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export const carService = {
  async getAllCars(): Promise<Car[]> {
    try {
      const { data, error } = await supabase
        .from('cars')
        .select('*')
        .order('category', { ascending: true })
        .order('name', { ascending: true });

      if (error) {
        console.error('Error fetching cars:', error);
        return [];
      }

      return data || [];
    } catch (error) {
      console.error('Error fetching cars:', error);
      return [];
    }
  },

  async getActiveCars(): Promise<Car[]> {
    try {
      const { data, error } = await supabase
        .from('cars')
        .select('*')
        .eq('is_active', true)
        .order('category', { ascending: true })
        .order('name', { ascending: true });

      if (error) {
        console.error('Error fetching active cars:', error);
        return [];
      }

      return data || [];
    } catch (error) {
      console.error('Error fetching active cars:', error);
      return [];
    }
  },

  async addCar(carData: Omit<Car, 'id' | 'created_at' | 'updated_at'>): Promise<Car | null> {
    try {
      const { data, error } = await supabase
        .from('cars')
        .insert([carData])
        .select()
        .single();

      if (error) {
        console.error('Error adding car:', error);
        return null;
      }

      return data;
    } catch (error) {
      console.error('Error adding car:', error);
      return null;
    }
  },

  async updateCar(id: string, carData: Omit<Car, 'id' | 'created_at' | 'updated_at'>): Promise<boolean> {
    try {
      const { error } = await supabase
        .from('cars')
        .update(carData)
        .eq('id', id);

      if (error) {
        console.error('Error updating car:', error);
        return false;
      }

      return true;
    } catch (error) {
      console.error('Error updating car:', error);
      return false;
    }
  },

  async deleteCar(id: string): Promise<boolean> {
    try {
      const { error } = await supabase
        .from('cars')
        .delete()
        .eq('id', id);

      if (error) {
        console.error('Error deleting car:', error);
        return false;
      }

      return true;
    } catch (error) {
      console.error('Error deleting car:', error);
      return false;
    }
  }
};