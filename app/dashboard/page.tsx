import StatisticSection from "@/components/app/Statistics";
import { getUser } from "@/lib/supabase/server";
import { redirect } from "next/navigation";

export default async function DashboardPage() {
  const { user } = await getUser();

  return (
    <>
      <StatisticSection />
      
    </>
  );
}
