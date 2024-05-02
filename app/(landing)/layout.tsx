import { redirect } from "next/navigation";

import { getUser } from "@/lib/supabase/server";


export default async function LandingLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {

  const { user } = await getUser();

  if (user) {
    return redirect("/dashboard");
  }

  
  return <>{children}</>;
}

// ^ we may add or wrap more components above if necessary
