import StatisticSection from "@/components/app/Statistics";
import OrderTable from "@/components/app/OrderTable";
import { getUser } from "@/lib/supabase/server";

export default async function OrdersPage() {
  const { user } = await getUser();

  return (
    <>
      <OrderTable />
      {/* <pre>{JSON.stringify(user, null, 2)}</pre> */}
    </>
  );
}
