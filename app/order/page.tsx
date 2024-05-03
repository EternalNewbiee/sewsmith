// page.tsx
'use client'
import Orderform from "@/components/app/OderForm";
import { getUser } from "@/lib/supabase/client";
import { User } from '@supabase/supabase-js';
import { useState, useEffect } from 'react';

export default function OrderPage() {
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    async function fetchUser() {
      const userData = await getUser();
      setUser(userData.user);
    }
    fetchUser();
  }, []);

  return (
    <>
      <Orderform user={user}></Orderform>
      {/* <pre>{JSON.stringify(user, null, 2)}</pre> */}
    </>
  );
}
