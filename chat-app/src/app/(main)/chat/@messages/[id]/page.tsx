import ChatroomProvider from "@/contexts/chatroom";
import createClient from "@/utils/supabase/server";
import ChatroomHeader from "./chatroomHeader";

export default async function MessagesPage({ params } : { params: Promise<{ id: number }> }) {
    const id = (await params).id;

    return <ChatroomProvider id={id}>
        <div className="w-full h-full relative">
            <ChatroomHeader/>
        </div>
    </ChatroomProvider>
}