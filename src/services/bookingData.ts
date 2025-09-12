import { supabase } from '@/integrations/supabase/client';

export interface Booking {
  id: string;
  pickup_location: string;
  drop_location: string;
  customer_name: string;
  mobile_number: string;
  booking_date: string;
  booking_time: string;
  vehicle_type: string;
  trip_type: string;
  additional_message?: string;
  status: string;
  created_at: string;
  updated_at: string;
}

export interface BookingFormData {
  pickup_location: string;
  drop_location: string;
  customer_name: string;
  mobile_number: string;
  booking_date: string;
  booking_time: string;
  vehicle_type: string;
  trip_type: string;
  additional_message?: string;
}

export const bookingService = {
  async getAllBookings(): Promise<Booking[]> {
    try {
      const { data, error } = await supabase
        .from('bookings')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error fetching bookings:', error);
        return [];
      }

      return data || [];
    } catch (error) {
      console.error('Error fetching bookings:', error);
      return [];
    }
  },

  async createBooking(bookingData: BookingFormData): Promise<Booking | null> {
    try {
      const { data, error } = await supabase
        .from('bookings')
        .insert([bookingData])
        .select()
        .single();

      if (error) {
        console.error('Error creating booking:', error);
        return null;
      }

      return data;
    } catch (error) {
      console.error('Error creating booking:', error);
      return null;
    }
  },

  async updateBookingStatus(id: string, status: string): Promise<boolean> {
    try {
      const { error } = await supabase
        .from('bookings')
        .update({ status })
        .eq('id', id);

      if (error) {
        console.error('Error updating booking status:', error);
        return false;
      }

      return true;
    } catch (error) {
      console.error('Error updating booking status:', error);
      return false;
    }
  },

  async deleteBooking(id: string): Promise<boolean> {
    try {
      const { error } = await supabase
        .from('bookings')
        .delete()
        .eq('id', id);

      if (error) {
        console.error('Error deleting booking:', error);
        return false;
      }

      return true;
    } catch (error) {
      console.error('Error deleting booking:', error);
      return false;
    }
  }
};