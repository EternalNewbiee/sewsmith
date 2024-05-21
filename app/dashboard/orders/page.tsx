import StatisticSection from "@/components/app/Statistics";
import OrderTable from "@/components/app/OrderTable";
import UserOrderHistory from "@/components/app/User_order_history"
import { getUser } from "@/lib/supabase/server";

export default async function OrdersPage() {
  const { user } = await getUser();

  return (
    <>
      <UserOrderHistory/>
      {/* <pre>{JSON.stringify(user, null, 2)}</pre> */}
    </>
  );
}
