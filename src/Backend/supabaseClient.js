import { createClient } from "@supabase/supabase-js";

const supabaseUrl = "https://mflvlybbferhazuaprva.supabase.co";
const supabaseAnonKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im1mbHZseWJiZmVyaGF6dWFwcnZhIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MjU5ODE5NzUsImV4cCI6MjA0MTU1Nzk3NX0.D0kXCRn5xyMn9dPgmmy9otOaUL1qMy0zaeWyQ8wbhbQ"; 

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
