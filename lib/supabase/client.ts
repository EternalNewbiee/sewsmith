import { createBrowserClient } from "@supabase/ssr";

export const createClient = () =>
  createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );

export async function getUser() {
  const supabase = createClient();
  const { data } = await supabase.auth.getUser();

  return data;
}

export async function getAllItems(){
  const supabase = createClient();
  let {data} = await supabase
  .from('inventory')
  .select('*')

  return data;
}