"use client";

import { Chatroom } from "@/types/chat";
import createClient from "@/utils/supabase/client";
import { RealtimeChannel, SupabaseClient } from "@supabase/supabase-js";
import { createContext, useCallback, useContext, useEffect, useState } from "react";
import { ProfileContext, TProfileContext } from "./profile";

export type TChatroomContext = {
    chatroom: Chatroom|undefined
}

export const ChatroomContext = createContext<TChatroomContext|null>(null)

const ChatroomProvider = ({ children, id } : { 
    children: React.ReactNode,
    id?: number
}) => {
    const { profile } = useContext(ProfileContext) as TProfileContext;
    const [chatroom, setChatroom] = useState<Chatroom>();

    const chatroomFromData = (data: any) => {
        if(!data) return;
        let newChatroom: Chatroom = data.chatrooms;
        newChatroom.role = data.role;
        setChatroom(newChatroom); 
    }

    const getChatroom = useCallback(async (client: SupabaseClient) => {
        if(!profile) return;

        const { data: chatroomData, error: chatroomError } = await client.from('profiles_chatrooms').select('*, chatrooms (*)').eq('profile_id', profile?.id).eq('chatroom_id', id).single();

        if(chatroomError) console.log(chatroomError);
        else {
            chatroomFromData(chatroomData);
        }
    }, [profile])

    useEffect(() => {
        const client = createClient();

        let chatroomChannel: RealtimeChannel | null = null;

        const subscribeToChatroom = async () => {
            chatroomChannel = await client.channel('chatroom-channel');
            chatroomChannel.on('postgres_changes', { 
                event: 'UPDATE',
                schema: 'public',
                table: 'chatrooms',
                filter: `id=eq.${id}`
            }, (payload) => {
                chatroomFromData({ role: chatroom?.role, chatrooms: payload.new});
            })
            .subscribe();
        }

        const initChatroom = async () => {
            if(!profile) {
                console.log('Profile error');
                return;
            }
            if(!id) {
                console.log('Chatroom not found');
                return;
            }

            await getChatroom(client);
            subscribeToChatroom();
        }

        initChatroom();

        return () => {
            if(chatroomChannel) chatroomChannel.unsubscribe();
        }
    }, [getChatroom])

    return (
        <ChatroomContext.Provider value={{ chatroom }}>
            {children}
        </ChatroomContext.Provider>
    );
}

export default ChatroomProvider;