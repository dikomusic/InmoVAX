import { supabase } from './src/config/supabase';

async function main() {
  const { data, error } = await supabase.storage.createBucket('property-images', {
    public: true,
    fileSizeLimit: 10485760, // 10MB
  });
  if (error) {
    console.error('Error creating bucket:', error);
  } else {
    console.log('Bucket created:', data);
  }
}
main();
