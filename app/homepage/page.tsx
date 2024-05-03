import { redirect } from "next/navigation";

import { getUser } from "@/lib/supabase/server";
import { UserProvider } from "@/context/UserContext";
import UserHeader from "@/components/UserHeader";
import Hero from "@/components/Hero";
import Footer from "@/components/Footer";

export default async function Homepage({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const { user } = await getUser();

  if (!user) {
    return redirect("/signin");
  }
  // if (user?.role != "user") {
  //   return redirect("homepage");
  // }
  return (
    <UserProvider>
      <div className="bg-white">
        {/* User header */}
        <UserHeader user={user} />

        {/* Main content */}
        <main className="isolate">
          <Hero />
        </main>

        {/* Footer */}
        <Footer />
      </div>
    </UserProvider>
  );
}
