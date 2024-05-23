import StatisticSection from "@/components/app/Statistics";
import OrderTable from "@/components/app/OrderTable";
// import UserOrderHistory from "@/components/app/User_order_history"
import FetchOrder from "@/components/Order/FetchOrder";
import { getUser } from "@/lib/supabase/server";
import { fetchStatistics } from "@/lib/supabase/server";

export default async function OrdersPage() {
  const { user } = await getUser();
  const statistics = await fetchStatistics();
  
  console.log("STATL", statistics)

  return (
    <>
      {statistics ? (
        <StatisticSection statistics={statistics} />
      ) : (
        <p>Loading statistics...</p>
      )}
    </>
  );
}