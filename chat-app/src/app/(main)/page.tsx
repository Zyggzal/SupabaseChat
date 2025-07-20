import createClient from "@/utils/supabase/server";
import Link from "next/link";

export default async function Home() {
  const client = await createClient();

  const { data } = await client.auth.getUser();
  
  return (
    <div className="grid grid-rows-[20px_1fr_20px] items-center justify-items-center min-h-screen p-8 pb-20 gap-16 sm:p-20 font-[family-name:var(--font-geist-sans)]">
      {data.user ? data.user?.email : 
        <div>
          <Link href={'/login'}>Sign in</Link>
          <Link href={'/register'}>Sign up</Link>
        </div>
      }
    </div>
  );
}
