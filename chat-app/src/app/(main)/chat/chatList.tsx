"use client";

import ChatroomListItem from "@/components/chatroomListItem/chatroomListItem";
import { ProfileContext, TProfileContext } from "@/contexts/profile";
import { Chatroom } from "@/types/chat";
import createClient from "@/utils/supabase/client";
import { useContext, useEffect, useState } from "react";



export default function ChatList() {
    const { profile } = useContext(ProfileContext) as TProfileContext;
    const [chatrooms, setChatrooms] = useState<Chatroom[]>();

    useEffect(() => {
        if(profile) {
            const getCharooms = async () => {
                const client = await createClient();
                const { data, error } = await client.from('profiles_chatrooms').select('role, chatrooms (*)').eq('profile_id', profile.id);

                if(error) console.log(error);
                else setChatrooms(data.map(e => {
                    let room: Chatroom = e.chatrooms[0] ? e.chatrooms[0] : e.chatrooms;
                    room.role = e.role;

                    return room;
                }));
            }

            getCharooms();
        }
    }, [profile])

    return <div className="flex flex-col relaive">
        {
            chatrooms && chatrooms.map(room => <ChatroomListItem key={`${room.id}chatroomlistlink`} chatroom={room}/>)
        }
    </div>
}