import Orderform from "@/components/app/OderForm";
import { getUser } from "@/lib/supabase/server";



export default async function DashboardPage() {
  const { user } = await getUser();

  return (
    <>
      <Orderform user={user}></Orderform>
      {/* <pre>{JSON.stringify(user, null, 2)}</pre> */}
    </>
  );
}
