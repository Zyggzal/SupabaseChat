"use client";

import ChatroomListItem from "@/components/chatroomListItem/chatroomListItem";
import { PlusIcon } from "@/components/icons/icons";
import NewChatroomModal from "@/components/newChatroomModal/newChatroomModal";
import { ProfileContext, TProfileContext } from "@/contexts/profile";
import { Chatroom, ProfileChatroom } from "@/types/chat";
import createClient from "@/utils/supabase/client";
import { RealtimeChannel } from "@supabase/supabase-js";
import { useContext, useEffect, useState } from "react";



export default function ChatList() {
    const { profile } = useContext(ProfileContext) as TProfileContext;
    const [chatrooms, setChatrooms] = useState<Chatroom[]>();
    const [isNewChatroomModalOpen, setIsNewChatroomModalOpen] = useState(false);

    const addChatroom = async (pc: ProfileChatroom) => {
        const client = await createClient();

        const { data, error } = await client.from('chatrooms')
        .select('*')
        .eq('id', pc.chatroom_id)
        .single();

        if(!error) {
            let newChatroom = data as Chatroom;
            newChatroom.role = pc.role;

            setChatrooms(prev => prev ? ([ ...prev, newChatroom]) : [newChatroom]);
        }
    }

    const removeChatroom = async (pc: ProfileChatroom) => {
        setChatrooms(prev => prev && prev.filter(room => room.id !== pc.chatroom_id));
    }

    useEffect(() => {
        if(profile) {
            let chatroomsChannel: RealtimeChannel;

            const getCharooms = async () => {
                const client = await createClient();
                const { data, error } = await client.from('profiles_chatrooms').select('role, chatrooms (*)').eq('profile_id', profile.id);

                if(error) console.log(error);
                else setChatrooms(data.map(e => {
                    let room: Chatroom = e.chatrooms[0] ? e.chatrooms[0] : e.chatrooms;
                    room.role = e.role;

                    return room;
                }));

                chatroomsChannel = await client.channel('chatroom channel');
                chatroomsChannel.on('postgres_changes', {
                    event: '*',
                    schema: 'public',
                    table: 'profiles_chatrooms',
                    filter: `profile_id=eq.${profile.id}`
                },
                async (payload) => {
                    switch(payload.eventType) {
                        case "INSERT":
                            addChatroom(payload.new as ProfileChatroom); break;
                        case "DELETE":
                            removeChatroom(payload.old as ProfileChatroom); break;
                    }
                })
                .subscribe();
            }

            getCharooms();

            return () => {
                if(chatroomsChannel)chatroomsChannel.unsubscribe();
            }
        }
    }, [profile])

    return <div className="flex flex-col relative h-full">
        {
            chatrooms && chatrooms.map(room => <ChatroomListItem key={`${room.id}chatroomlistlink`} chatroom={room}/>)
        }
        <button 
            className="absolute bottom-5 right-5 w-20 h-20 z-20 text-white bg-orange-400 hover:bg-orange-500 rounded-full flex items-center justify-center" 
            onClick={()=>setIsNewChatroomModalOpen(true)}>
            <PlusIcon size={40}/>
        </button>
        <NewChatroomModal 
            isOpen={isNewChatroomModalOpen}
            handleClose={() => {
                setIsNewChatroomModalOpen(false);
            }}
        />
    </div>
}