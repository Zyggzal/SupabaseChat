import ChatroomProvider from "@/contexts/chatroom";
import ChatroomHeader from "./chatroomHeader";
import { getProfileCookies } from "@/utils/cookies/server";
import createClient from "@/utils/supabase/server";
import { chatroomFromResponse } from "@/utils/data/chatrooms";
import { redirect } from "next/navigation";
import ChatroomMessagesList from "@/components/chatroomMessageList/chatroomMessageList";
import ChatroomMessageInput from "@/components/chatroomMessageInput/chatroomMessageInput";
import ChatroomMembersProvider from "@/contexts/chatroomMembers";
import ChatroomMessagesProvider from "@/contexts/chatroomMessages";

export default async function MessagesPage({ params } : { params: Promise<{ id: number }> }) {
    let chatroom;
    let members;
    let messages;

    const id = (await params).id;
    const profileId = await getProfileCookies();

    const client = await createClient();

    const { data: chatroomResponse, error: chatroomError } = await client.from('profiles_chatrooms')
    .select('*, chatrooms (*, messages (*, created_by:profiles (*)))')
    .eq('profile_id', profileId)
    .eq('chatroom_id', id)
    .single();

    if(chatroomError) {
        console.log(chatroomError);
        redirect('/chat')
    }
    else {
        const chatroomData = chatroomFromResponse(chatroomResponse);
        if(chatroomData) {
            ({ messages, chatroom } = chatroomData);
            messages = messages.sort((a, b) => {
                return new Date(a.created_at).getTime() - new Date(b.created_at).getTime();
            });

            const { data: membersData, error: membersError } = await client.from('profiles_chatrooms').select('*, profile:profiles (*)').eq('chatroom_id', chatroom.id);

            if(membersError) console.log(membersError);
            else {
                members = membersData;
            }
        }
    }

    return <ChatroomProvider serverChatroom={chatroom}>
        <ChatroomMembersProvider serverMembers={members}>
            <ChatroomMessagesProvider serverMessages={messages}>
                <div className="w-full h-full relative flex flex-col">
                    <ChatroomHeader/>
                    <ChatroomMessagesList/>
                    <ChatroomMessageInput/>
                </div>
            </ChatroomMessagesProvider>
        </ChatroomMembersProvider>
    </ChatroomProvider>
}