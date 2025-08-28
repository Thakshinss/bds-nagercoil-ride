import { supabase } from "@/integrations/supabase/client";

export interface FareData {
  id: string;
  from: string;
  to: string;
  vehicleType: string;
  price: string;
}

export const fareDataService = {
  async getAllFares(): Promise<FareData[]> {
    const { data, error } = await supabase
      .from('fares')
      .select('*')
      .order('created_at', { ascending: true });
    
    if (error) {
      console.error('Error fetching fares:', error);
      return [];
    }
    
    return data.map(fare => ({
      id: fare.id,
      from: fare.from_location,
      to: fare.to_location,
      vehicleType: fare.vehicle_type,
      price: fare.price
    }));
  },

  async addFare(fare: Omit<FareData, 'id'>): Promise<FareData | null> {
    const { data, error } = await supabase
      .from('fares')
      .insert([{
        from_location: fare.from,
        to_location: fare.to,
        vehicle_type: fare.vehicleType,
        price: fare.price
      }])
      .select()
      .single();
    
    if (error) {
      console.error('Error adding fare:', error);
      return null;
    }
    
    return {
      id: data.id,
      from: data.from_location,
      to: data.to_location,
      vehicleType: data.vehicle_type,
      price: data.price
    };
  },

  async updateFare(id: string, updatedFare: Omit<FareData, 'id'>): Promise<boolean> {
    const { error } = await supabase
      .from('fares')
      .update({
        from_location: updatedFare.from,
        to_location: updatedFare.to,
        vehicle_type: updatedFare.vehicleType,
        price: updatedFare.price
      })
      .eq('id', id);
    
    if (error) {
      console.error('Error updating fare:', error);
      return false;
    }
    
    return true;
  },

  async deleteFare(id: string): Promise<boolean> {
    const { error } = await supabase
      .from('fares')
      .delete()
      .eq('id', id);
    
    if (error) {
      console.error('Error deleting fare:', error);
      return false;
    }
    
    return true;
  },

  async getFareById(id: string): Promise<FareData | null> {
    const { data, error } = await supabase
      .from('fares')
      .select('*')
      .eq('id', id)
      .single();
    
    if (error) {
      console.error('Error fetching fare by id:', error);
      return null;
    }
    
    return {
      id: data.id,
      from: data.from_location,
      to: data.to_location,
      vehicleType: data.vehicle_type,
      price: data.price
    };
  }
};