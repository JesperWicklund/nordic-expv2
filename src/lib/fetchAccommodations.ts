import { supabase } from "../../lib/supabaseClient";

export const fetchAccommodations = async () => {
  const { data, error } = await supabase.from('accommodations').select('*');
  if (error) {
    console.error('Error fetching accommodations:', error);
    return [];
  }
  return data;
};