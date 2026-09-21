import { supabase } from './src/config/supabase';

async function main() {
  const { data, error } = await supabase.from('properties').select('*, property_images(*)').limit(1);
  console.log('Error?', error);
  // Let's use the REST API via fetch to query the information_schema using the service role key? 
  // We can't do that easily without pg connection. 
  // Let's just try to find if there is a features table.
  const { data: data2, error: err2 } = await supabase.from('property_features').select('*').limit(1);
  console.log('property_features error:', err2);
  const { data: data3, error: err3 } = await supabase.from('property_amenities').select('*').limit(1);
  console.log('property_amenities error:', err3);
}
main();
