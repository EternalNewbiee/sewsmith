import { redirect } from "next/navigation";
import { getUser, getUserInfo } from "@/lib/supabase/server";
import { UserProvider } from "@/context/UserContext";
import UserHeader from "@/components/UserHeader";
import Hero from "@/components/Hero";
import Footer from "@/components/Footer";

export default async function Homepage() {

  const { user } = await getUser();

  if (!user) {
    return redirect("/signin");
  }

  if (user?.id) {
    const userInfoArray = await getUserInfo(user?.id);

    if (userInfoArray && userInfoArray.length > 0) {
      const userInfo = userInfoArray[0];
      if (userInfo.role !== "user") {
        return redirect("/dashboard");
      }
    }
  }

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