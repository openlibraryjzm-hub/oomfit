import { createClient } from "@supabase/supabase-js";

const supabaseUrl =
  process.env.NEXT_PUBLIC_SUPABASE_URL || "https://rlbusxvbglynmpszhqzd.supabase.co";
const supabaseKey =
  process.env.SUPABASE_SERVICE_ROLE_KEY ||
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ||
  "sb_publishable_BVa2M7jW_rX9Gi02z4po7w_JNGT3VVD";

export const supabase = createClient(supabaseUrl, supabaseKey);
