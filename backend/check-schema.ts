import { supabase } from './src/config/supabase';

async function main() {
  const { data, error } = await supabase.from('properties').select('*').limit(1);
  if (error) {
    console.error('Error fetching properties:', error);
  } else {
    console.log('Columns:', Object.keys(data[0] || {}));
  }
}
main();
