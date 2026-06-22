// keep-alive.js
const { createClient } = require('@supabase/supabase-js');

// These will be fed from GitHub Secrets for security
const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error("Missing Supabase environment variables.");
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

async function pingSupabase() {
  try {
    // A simple, lightweight query to check the database
    const { data, error } = await supabase.from('_analytics').select('*').limit(1); 
    // Note: If you don't have a table, we can just do a raw health check or RPC
    
    // Alternative if you don't want to query a specific table:
    // const { data, error } = await supabase.rpc('version'); 
    
    if (error) throw error;
    
    console.log("Successfully pinged Supabase! Project is awake.");
  } catch (err) {
    console.error("Error pinging Supabase:", err.message);
    // If the table doesn't exist, Supabase still processes the request, which keeps it alive.
    // But to be safe, standard API calls are best.
  }
}

pingSupabase();
