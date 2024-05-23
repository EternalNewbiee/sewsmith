import StatisticSection from "@/components/app/Statistics";
import { fetchStatistics, getUser } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import FetchOrder from "@/components/Order/FetchOrder";

export default async function DashboardPage() {
  const { user } = await getUser();

  return (
    <>
       <FetchOrder />
      
    </>
  );
}
