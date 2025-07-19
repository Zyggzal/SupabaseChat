"use client";

import ChatroomListItem from "@/components/chatroomListItem/chatroomListItem";
import { PlusIcon } from "@/components/icons/icons";
import NewChatroomModal from "@/components/newChatroomModal/newChatroomModal";
import { ProfileContext, TProfileContext } from "@/contexts/profile";
import { Chatroom, ProfileChatroom } from "@/types/chat";
import createClient from "@/utils/supabase/client";
import { RealtimeChannel } from "@supabase/supabase-js";
import { useContext, useEffect, useState } from "react";
import './style.css'


export default function ChatList({ serverChatrooms } : { serverChatrooms? : Chatroom[] }) {
    const { profile } = useContext(ProfileContext) as TProfileContext;
    const [chatrooms, setChatrooms] = useState<Chatroom[]>();
    const [isNewChatroomModalOpen, setIsNewChatroomModalOpen] = useState(false);

    const addChatroom = async (pc: ProfileChatroom) => {
        const client = createClient();

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

    const updateChatroom = (newChatroom: Chatroom) => {
        if(!chatrooms) return;

        const updatedIndex = chatrooms.findIndex(room => room.id === newChatroom.id)
        
        if(updatedIndex === -1) return;

        let updatedChatroom = chatrooms[updatedIndex];

        updatedChatroom.name = newChatroom.name;
        updatedChatroom.picture = newChatroom.picture;

        setChatrooms(prev => prev?.with(updatedIndex, updatedChatroom));
    }

    const removeChatroom = (pc: ProfileChatroom) => {
        setChatrooms(prev => prev && prev.filter(room => room.id !== pc.chatroom_id));
    }

    useEffect(() => {
        let chatroomsUpdateChannel: RealtimeChannel;

        if(!chatrooms) return;

        const subscribeToChannelUpdates = () => {
            const client = createClient();

            chatroomsUpdateChannel = client.channel('chatroom update channel');
                chatroomsUpdateChannel.on('postgres_changes', {
                    event: 'UPDATE',
                    schema: 'public',
                    table: 'chatrooms',
                    filter: `id=in.(${chatrooms.map(room => room.id).join(',')})`
                },
                (payload) => {
                    updateChatroom(payload.new as Chatroom);
                }
            ).subscribe();
        }


        subscribeToChannelUpdates();

        return () => {
            if(chatroomsUpdateChannel) chatroomsUpdateChannel.unsubscribe();
        }
    }, [chatrooms])

    useEffect(() => {
        if(profile) {
            let chatroomsChannel: RealtimeChannel;
            const client = createClient();

            const subscribeToChatroomsChannel = () => {
                chatroomsChannel = client.channel('chatroom channel');
                chatroomsChannel.on('postgres_changes', {
                    event: '*',
                    schema: 'public',
                    table: 'profiles_chatrooms',
                    filter: `profile_id=eq.${profile.id}`
                },
                (payload) => {
                    switch(payload.eventType) {
                        case "INSERT":
                            addChatroom(payload.new as ProfileChatroom); break;
                        case "DELETE":
                            removeChatroom(payload.old as ProfileChatroom); break;
                    }
                })
                .subscribe();
            }

            subscribeToChatroomsChannel();

            return () => {
                if(chatroomsChannel) chatroomsChannel.unsubscribe();
            }
        }
    }, [profile])

    useEffect(() => {
        setChatrooms(serverChatrooms);
    }, [])

    return <div className="flex flex-col relative h-full overflow-y-scroll">
        {
            chatrooms && chatrooms.map(room => <ChatroomListItem key={`${room.id}chatroomlistlink`} chatroom={room}/>)
        }
        <button 
            className="fixed bottom-5 left-95 w-20 h-20 z-20 text-white bg-orange-400 hover:bg-orange-500 rounded-full flex items-center justify-center" 
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