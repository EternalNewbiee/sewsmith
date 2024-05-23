import { createServerClient, type CookieOptions } from "@supabase/ssr";
import { cookies } from "next/headers";

export const createClient = () => {
  const cookieStore = cookies();

  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    // process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    process.env.NEXT_PUBLIC_SUPABASE_SERVICE_KEY!,

    {
      cookies: {
        get(name: string) {
          return cookieStore.get(name)?.value;
        },
        set(name: string, value: string, options: CookieOptions) {
          try {
            cookieStore.set({ name, value, ...options });
          } catch (error) {
            // The `set` method was called from a Server Component.
            // This can be ignored if you have middleware refreshing
            // user sessions.
          }
        },
        remove(name: string, options: CookieOptions) {
          try {
            cookieStore.set({ name, value: "", ...options });
          } catch (error) {
            // The `delete` method was called from a Server Component.
            // This can be ignored if you have middleware refreshing
            // user sessions.
          }
        },
      },
    }
  );
};

export async function getUser() {
  const supabase = createClient();
  const { data } = await supabase.auth.getUser();

  return data;
}





export async function getAllUsers() {
  const supabase = createClient();
  const {
    data: { users },
    error,
  } = await supabase.auth.admin.listUsers({
    page: 1,
    perPage: 1000,
  });

  if (!error) {
    return users;
  }

  return;
}

export async function sendPasswordRecovery(email: string) {
  const supabase = createClient();
  let { data, error } = await supabase.auth.resetPasswordForEmail(email);

  if (!error) {
    console.log(data);
    return data;
  }

  return;
}

interface UserInfo {
  id: number;
  last_name: string;
  first_name: string | null;
  userid: string | null; // Assuming uuid is a string
  role: string | null;
}

export async function getUserInfo(id: string): Promise<UserInfo[] | null> {
  const supabase = createClient();
  const { data, error } = await supabase
    .from('userinfo')
    .select('*')
    .eq('userid', id);

  if (error) {
    console.error("Error fetching user info:", error.message);
    return null;
  }

  return data as UserInfo[]; // Type assertion assuming the data structure matches UserInfo[]
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

export async function getAllOrders(){
  const supabase = createClient();
    const { data, error } = await supabase
        .from('orders')
        .select('*')

    if (error) {
        console.error('Error fetching orders:', error.message);
    }

    return data;
}

export async function getItems(){
  const supabase = createClient();
  const currentUser = await supabase.auth.getUser();

  const{ data } = await supabase
    .from('inventory')
    .select('*')
    .eq('user_id', currentUser?.data?.user?.id);
    
    return data;
}
export async function getAllItems(){
  const supabase = createClient();
  let {data} = await supabase
  .from('inventory')
  .select('*')

  return data;
}

export async function fetchStatistics() {
  const supabase = createClient();
  try {
    const { data, error } = await supabase.from("statistics").select("*");
    if (error) {
      throw error;
    }
    return data;
  } catch (error) {
    console.error("Error fetching statistics:", (error as Error).message);
    return null;
  }
}
