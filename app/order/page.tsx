import { redirect } from "next/navigation";

import Orderform from "@/components/app/OderForm";
import { getUser } from "@/lib/supabase/server";
import UserHeader from "@/components/UserHeader";



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
    <>
      <UserHeader user={user} />
      <Orderform user={user}></Orderform>
      {/* <pre>{JSON.stringify(user, null, 2)}</pre> */}
    </>
  );
}
