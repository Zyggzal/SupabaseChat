import createClient from "@/utils/supabase/server";
import Image from "next/image";
import Link from "next/link";

export default async function Home() {
  const client = await createClient();

  const user = await client.auth.getUser();

  return (
    <div className="wall h-full flex justify-center items-center flex-col">
      <Image src='/images/graffiti/chat.png' alt="chat pic" width={1000} height={800} className="w-200 h-150" priority/>
      {
        user.data.user ?
          <Link href='/chat' className="bg-orange-400 rounded-xl p-5 text-white font-bold hover:bg-orange-500">Let's get chatting!</Link>
          :
          <Link href='/auth' className="bg-orange-400 rounded-xl p-5 text-white font-bold hover:bg-orange-500">Let's get started!</Link>
        }
    </div>
  );
}
