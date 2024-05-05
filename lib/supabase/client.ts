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

export async function cancelOrder(id: any) {
  const supabase = createClient();
  const { data, error } = await supabase
    .from('orders')
    .delete()
    .eq('id', id);

  if (error) {
    console.error('Error canceling order:', error.message);
    return null;
  }

  return data;
}

export async function getOrders(){
  const supabase = createClient();
    const currentUser = await supabase.auth.getUser();
    const { data, error } = await supabase
        .from('orders')
        .select('*')
        .eq('user_id', currentUser?.data?.user?.id);

    if (error) {
        console.error('Error fetching orders:', error.message);
    }

    return data;
}