import Orderform from "@/components/app/OderForm";
import { getUser } from "@/lib/supabase/server";



export default async function DashboardPage() {
  const { user } = await getUser();

  return (
    <div>
    <UserHeader user={user} />
      <div>
        <OrderProcess user={user}/>
      </div>
    <Footer/>
    </div>
  );
}