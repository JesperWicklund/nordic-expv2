// src/lib/fetchEvents.ts
import { supabase } from "../../lib/supabaseClient";

export const fetchEvents = async () => {
  const { data, error } = await supabase.from('events').select('*');
  if (error) {
    console.error('Error fetching events:', error);
    return [];
  }
  return data;
};