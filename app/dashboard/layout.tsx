import { redirect } from "next/navigation";

import { getUser } from "@/lib/supabase/server";
import { UserProvider } from "@/context/UserContext";
import Header from "@/components/app/Header";
import SideNavMenu from "@/components/app/SideNavMenu";
import { getUserInfo } from "@/lib/supabase/server";


export default async function DashboardLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const { user } = await getUser();

  if (!user) {
    return redirect("/signin");
  }

  if (user?.id) {
    const userInfoArray = await getUserInfo(user?.id);

  if (userInfoArray && userInfoArray.length > 0) {
    const userInfo = userInfoArray[0]; 
    if (userInfo.role!="admin") {
      return redirect("/homepage");
    }
  }
}


  
  return (
    <UserProvider>
      <div>
        <SideNavMenu />

        <div className="lg:pl-72">
          <Header user={user} />

          <main className="py-10">
            <div className="px-4 sm:px-6 lg:px-8">{children}</div>
          </main>
        </div>
      </div>
    </UserProvider>
  );
}

// ^ we may add or wrap more components above if necessary
