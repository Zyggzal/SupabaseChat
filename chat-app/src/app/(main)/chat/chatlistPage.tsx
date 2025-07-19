import { getProfileCookies } from "@/utils/cookies/server";
import ChatList from "./chatList";
import { redirect } from "next/navigation";
import createClient from "@/utils/supabase/server";
import { Chatroom } from "@/types/chat";


export default async function ChatListPage() {
    const profileId = await getProfileCookies();
    if(!profileId) redirect('/auth');

    let chatrooms;

    const client = await createClient();

    const { data: pcData, error: pcError } = await client.from('profiles_chatrooms').select('*, chatrooms (*)').eq('profile_id', profileId);

    if(pcError) console.log(pcError);
    else {
        chatrooms = pcData.map(e => {
            let room: Chatroom = e.chatrooms[0] ? e.chatrooms[0] : e.chatrooms;
            room.role = e.role;

            return room;
        });
    }   
    
    return <div className="w-full h-full shadow-inner-lg">
        <ChatList serverChatrooms={chatrooms}/>
    </div>
}