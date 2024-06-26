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
 
export async function getAllOrders(){
  const supabase = createClient();
    const currentUser = await supabase.auth.getUser();
    const { data, error } = await supabase
        .from('orders')
        .select('*')
     
 
    if (error) {
        console.error('Error fetching orders:', error.message);
    }
 
    return data;
} 
 
export async function getCart(){
  const supabase = createClient();
    const currentUser = await supabase.auth.getUser();
    const { data, error } = await supabase
        .from('cart')
        .select('*')
     
 
    if (error) {
        console.error('Error fetching orders:', error.message);
    }
 
    return data;
}
 
export async function cancelCart(id: any) {
  const supabase = createClient();
  const { data, error } = await supabase
    .from('cart')
    .delete()
    .eq('id', id);
 
  if (error) {
    console.error('Error canceling order:', error.message);
    return null;
  }
 
  return data;
}
 
export async function deleteCart() {
  const supabase = createClient();
  const { data, error } = await supabase
    .from('cart')
    .delete()
    .neq('id',0)
  if (error) {
    console.error('Error deleting all cart items:', error.message);
    return null;
  }

  return 'All cart items deleted successfully';
}

 
 
export async function getUserInfo( id: any){
  const supabase = createClient()
 
  let { data } = await supabase.from('userinfo').select('*').eq('userid', id )
 
    return data;
}
 