import { redirect } from "next/navigation";

import OrderProcess from "@/components/app/OrderProcess";
import { getUser } from "@/lib/supabase/server";
import UserHeader from "@/components/UserHeader";
import Footer from "@/components/Footer"




export default async function DashboardPage({
    children,
  }: Readonly<{
    children: React.ReactNode;
  }>) {
    const { user } = await getUser();
  
    if (!user) {
      return redirect("/signin");
    }

  return (
    <div className="min-h-screen bg-cover bg-fixed bg-gradient-to-tr from-blue-100 to-white">
    <UserHeader user={user} />
      <div>
        <OrderProcess user={user}/>
      </div>
    <Footer/>
    </div>
  );
}
