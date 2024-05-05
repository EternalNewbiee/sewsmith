import StatisticSection from "@/components/app/Statistics";
import OrderHistory from "@/components/app/User_order_history";
import { getUser } from "@/lib/supabase/server";

export default async function DashboardPage() {
  const { user } = await getUser();

  return (
    <>
      <OrderHistory />
      {/* <pre>{JSON.stringify(user, null, 2)}</pre> */}
    </>
  );
}
