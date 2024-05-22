import StatisticSection from "@/components/app/Statistics";
import OrderTable from "@/components/app/OrderTable";
// import UserOrderHistory from "@/components/app/User_order_history"
import FetchOrder from "@/components/Order/FetchOrder";
import { getUser } from "@/lib/supabase/server";

export default async function OrdersPage() {
  const { user } = await getUser();

  return (
    <>
      {/* <UserOrderHistory/> */}
      <FetchOrder />
    </>
    

    
  );
}
