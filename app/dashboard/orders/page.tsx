import StatisticSection from "@/components/app/Statistics";
import FetchOrder from "@/components/Order/FetchOrder";
import { getUser } from "@/lib/supabase/server";

export default async function OrdersPage() {
  const { user } = await getUser();

  return (
    
       <FetchOrder />
    
  );
}
