// Student Aid Portal — Supabase connection
// Replace these placeholders with your Supabase project details.

const SUPABASE_URL = "YOUR_SUPABASE_PROJECT_URL";
const SUPABASE_PUBLISHABLE_KEY = "YOUR_SUPABASE_PUBLISHABLE_KEY";

if (
  SUPABASE_URL.startsWith("https://") &&
  !SUPABASE_URL.includes("YOUR_SUPABASE")
) {
  window.supabaseClient = window.supabase.createClient(
    SUPABASE_URL,
    SUPABASE_PUBLISHABLE_KEY
  );
  console.log("Supabase connection initialized.");
} else {
  console.warn("Add your Supabase project URL and publishable key.");
}


