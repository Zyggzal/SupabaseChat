"use client";

import { ProfileContext, TProfileContext } from "@/contexts/profile";
import { useContext, useEffect, useRef } from "react";
import ChatroomMessageListItem from "./chatroomMessageListItem";
import { ChatroomMessagesContext, TChatroomMessagesContext } from "@/contexts/chatroomMessages";

export default function ChatroomMessagesList() {
    const { profile } = useContext(ProfileContext) as TProfileContext;
    const { messages } = useContext(ChatroomMessagesContext) as TChatroomMessagesContext;

    const list = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const scrollToBottom = () => {
            if(list.current) {
                list.current.scrollTop = list.current.scrollHeight;
            }
        }

        scrollToBottom();
    }, [list]);

    return <div ref={list} className="w-full h-200 px-5 pb-5 pt-40 flex flex-col flex-grow gap-y-5 overflow-y-scroll z-3">
        {
            messages && messages.map(message => 
                <ChatroomMessageListItem 
                    key={`messagelistitem${message.id}`} 
                    message={message} 
                    isSelf={profile?.id === message.created_by.id}/>
            )
        }
    </div>
}