const createClient = require("@supabase/supabase-js").createClient

const supabaseUrl = "https://jogwxsdoorsvsnikwyii.supabase.co";
const supabaseAnonKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImpvZ3d4c2Rvb3JzdnNuaWt3eWlpIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MjA5MjYwMjQsImV4cCI6MjAzNjUwMjAyNH0.SrcvJayPKxzrY9H3gDtx3p3zlAMpuDACQOMwJ-G0BOs";
const serviceRoleKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImpvZ3d4c2Rvb3JzdnNuaWt3eWlpIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTcyMDkyNjAyNCwiZXhwIjoyMDM2NTAyMDI0fQ.Pqem7m5f02Y_TQL-TfX_zAeX596RSS4URpbE5lZ0gGE"
const otherOptions = {
  auth: {
    autoRefreshToken: false,
    persistSession: false
  }
};

const supabaseInstance = createClient(supabaseUrl, serviceRoleKey, otherOptions);
exports.supabase = supabaseInstance;