import ChatroomProvider from "@/contexts/chatroom";
import ChatroomHeader from "./chatroomHeader";
import { getProfileCookies } from "@/utils/cookies/server";
import createClient from "@/utils/supabase/server";
import { chatroomFromData } from "@/utils/data/chatrooms";
import { redirect } from "next/navigation";

export default async function MessagesPage({ params } : { params: Promise<{ id: number }> }) {
    let chatroom;
    let members;

    const id = (await params).id;
    const profileId = await getProfileCookies();

    const client = await createClient();

    const { data: chatroomData, error: chatroomError } = await client.from('profiles_chatrooms')
    .select('*, chatrooms (*)')
    .eq('profile_id', profileId)
    .eq('chatroom_id', id)
    .single();

    if(chatroomError) {
        console.log(chatroomError);
        redirect('/chat')
    }
    else {
        chatroom = chatroomFromData(chatroomData);

        if(chatroom) {
            const { data: membersData, error: membersError } = await client.from('profiles_chatrooms').select('*, profile:profiles (*)').eq('chatroom_id', chatroom.id);

            if(membersError) console.log(membersError);
            else {
                members = membersData;
            }
        }
    }

    return <ChatroomProvider serverChatroom={chatroom} serverMembers={members}>
        <div className="w-full h-full relative">
            <ChatroomHeader/>
        </div>
    </ChatroomProvider>
}