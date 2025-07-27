"use client";

import { Message } from "@/types/chat";
import createClient from "@/utils/supabase/client";
import { RealtimeChannel } from "@supabase/supabase-js";
import { createContext, useContext, useEffect, useState } from "react";
import { ChatroomContext, TChatroomContext } from "./chatroom";

export type TChatroomMessagesContext = {
    messages: Message[]|undefined,
    messageToEdit: Message|null,
    setMessageToEdit: (message: Message|null) => void
}

export const ChatroomMessagesContext = createContext<TChatroomMessagesContext|null>(null)

const ChatroomMessagesProvider = ({ children, serverMessages } : { 
    children: React.ReactNode,
    serverMessages?: Message[],
}) => {
    const { chatroom } = useContext(ChatroomContext) as TChatroomContext;

    const [messages, setMessages] = useState<Message[]|undefined>(serverMessages);
    const [messageToEdit, setMessageToEdit] = useState<Message|null>(null);

    const addMessage = async (message: Message) => {
        const client = createClient();

        const { data, error } = await client.from('messages')
        .select('*, created_by: profiles(*)')
        .eq('id', message.id)
        .single();

        if(!error) setMessages(prev => prev ? [...prev, data] : [data]);
    }

    const updateMessage = (message: Message) => {
        if(!messages) return;

        const updatedIndex = messages.findIndex(msg => msg.id === message.id);

        if(updatedIndex === -1) return;

        const newMessage = { ...message, created_by: messages[updatedIndex].created_by };

        setMessages(prev => prev?.with(updatedIndex, newMessage));
    }

    const removeMessage = (message: Message) => {
        if(!messages) return;
        setMessages(prev => prev?.filter(msg => msg.id !== message.id));
    }

    useEffect(() => {
        if(!chatroom) return;

        const client = createClient();

        let messagesChannel: RealtimeChannel;

        const subscribeToMessagesChanges = () => {
            messagesChannel = client.channel('chatroom messages list changes channel');
            messagesChannel.on('postgres_changes', {
                    event: '*',
                    schema: 'public',
                    table: 'messages',
                    filter: `chatroom_id=eq.${chatroom.id}`
                },
                (payload) => {
                    switch(payload.eventType) {
                        case "DELETE":
                            removeMessage(payload.old as Message); break;
                        case "UPDATE":
                            updateMessage(payload.new as Message); break;
                        case "INSERT":
                            addMessage(payload.new as Message); break;
                    }
                }
            ).subscribe();
        }

        subscribeToMessagesChanges();

        return () => {
            if(messagesChannel) messagesChannel.unsubscribe();
        }
    }, [chatroom])

    return (
        <ChatroomMessagesContext.Provider value={{ messages, messageToEdit, setMessageToEdit }}>
            {children}
        </ChatroomMessagesContext.Provider>
    );
}

export default ChatroomMessagesProvider;