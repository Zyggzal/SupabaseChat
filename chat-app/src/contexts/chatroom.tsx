"use client";

import { Chatroom, Message } from "@/types/chat";
import createClient from "@/utils/supabase/client";
import { RealtimeChannel } from "@supabase/supabase-js";
import { createContext, useContext, useEffect, useState } from "react";
import { chatroomFromData } from "@/utils/data/chatrooms";

export type TChatroomContext = {
    chatroom: Chatroom|undefined,
}

export const ChatroomContext = createContext<TChatroomContext|null>(null)

const ChatroomProvider = ({ children, serverChatroom } : { 
    children: React.ReactNode,
    serverChatroom?: Chatroom,
}) => {
    const [chatroom, setChatroom] = useState<Chatroom|undefined>(serverChatroom);

    useEffect(() => {
        if(!serverChatroom) return;

        const client = createClient();

        let chatroomChannel: RealtimeChannel;

        const subscribeToChatroom = () => {
            chatroomChannel = client.channel('chatroom-channel');
            chatroomChannel.on('postgres_changes', { 
                event: 'UPDATE',
                schema: 'public',
                table: 'chatrooms',
                filter: `id=eq.${serverChatroom.id}`
            }, (payload) => {
                setChatroom(chatroomFromData({ role: chatroom?.role, chatrooms: payload.new }));
            })
            .subscribe();
        }

        subscribeToChatroom();

        return () => {
            if(chatroomChannel) chatroomChannel.unsubscribe();
        }
    }, [serverChatroom])

    return (
        <ChatroomContext.Provider value={{ chatroom }}>
            {children}
        </ChatroomContext.Provider>
    );
}

export default ChatroomProvider;