"use client";

import { Chatroom, ChatroomMember, ProfileChatroom } from "@/types/chat";
import createClient from "@/utils/supabase/client";
import { RealtimeChannel } from "@supabase/supabase-js";
import { createContext, useEffect, useState } from "react";
import { chatroomFromData } from "@/utils/data/chatrooms";
import { UserProfile } from "@/types/authTypes";

export type TChatroomContext = {
    chatroom: Chatroom|undefined,
    members: ChatroomMember[]|undefined
}

export const ChatroomContext = createContext<TChatroomContext|null>(null)

const ChatroomProvider = ({ children, serverChatroom, serverMembers } : { 
    children: React.ReactNode,
    serverChatroom?: Chatroom,
    serverMembers?: ChatroomMember[],
}) => {
    const [chatroom, setChatroom] = useState<Chatroom|undefined>(serverChatroom);
    const [members, setMembers] = useState<ChatroomMember[]|undefined>(serverMembers);

    const addMember = async (status: ProfileChatroom) => {
        const client = createClient();

        const { data, error } = await client.from('profiles')
        .select('*')
        .eq('id', status.profile_id)
        .single();

        if(!error) {
            let newMember:ChatroomMember = { ...status, profile: data };

            setMembers(prev => prev ? [...prev, newMember] : [newMember]);
        }
    }
    
    const updateMemberStatus = (status: ProfileChatroom) => {
        if(!members) return;

        const updatedIndex = members.findIndex(member => member.profile_id === status.profile_id);

        if(updatedIndex === -1) return;

        const updatedMember = members[updatedIndex];
        updatedMember.role = status.role;

        setMembers(prev => prev?.with(updatedIndex, updatedMember));
    }

    const updateMember = (newMember: UserProfile) => {
        if(!members) return;

        const updatedIndex = members.findIndex(member => member.profile_id === newMember.id);

        if(updatedIndex === -1) return;

        const updatedMember = members[updatedIndex];
        updatedMember.profile = newMember;

        setMembers(prev => prev?.with(updatedIndex, updatedMember));
    }
    
    const removeMember = (status: ProfileChatroom) => {
        console.log(members)
        if(!members) return;
        setMembers(prev => prev?.filter(member => member.profile_id !== status.profile_id));
    }

    useEffect(() => {
        if(!serverChatroom) return;

        const client = createClient();

        let chatroomChannel: RealtimeChannel;
        let membersListChangesChannel: RealtimeChannel;

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

        const subscribeToMemberListChanges = () => {
            membersListChangesChannel = client.channel('chatroom members list changes channel');
            membersListChangesChannel.on('postgres_changes', {
                    event: '*',
                    schema: 'public',
                    table: 'profiles_chatrooms',
                    filter: `chatroom_id=eq.${serverChatroom.id}`
                },
                (payload) => {
                    switch(payload.eventType) {
                        case "DELETE":
                            removeMember(payload.old as ProfileChatroom); break;
                        case "UPDATE":
                            updateMemberStatus(payload.new as ProfileChatroom); break;
                        case "INSERT":
                            addMember(payload.new as ProfileChatroom); break;
                    }
                }
            ).subscribe();
        }

        subscribeToChatroom();
        subscribeToMemberListChanges();

        return () => {
            if(chatroomChannel) chatroomChannel.unsubscribe();
            if(membersListChangesChannel) membersListChangesChannel.unsubscribe();
        }
    }, [serverChatroom])

    useEffect(() => {
        if(!members) return;

        const client = createClient();
        let membersUpdatesChannel: RealtimeChannel;

        const subscribeToMemberUpdates = () => {
            membersUpdatesChannel = client.channel('chatroom members update channel');
                membersUpdatesChannel.on('postgres_changes', {
                    event: 'UPDATE',
                    schema: 'public',
                    table: 'profiles',
                    filter: `id=in.(${members.map(member => member.profile_id)})`
                },
                (payload) => {
                    updateMember(payload.new as UserProfile);
                }
            ).subscribe();
        }

        subscribeToMemberUpdates();

        return () => {
            if(membersUpdatesChannel) membersUpdatesChannel.unsubscribe();
        }
    }, [members])

    return (
        <ChatroomContext.Provider value={{ chatroom, members }}>
            {children}
        </ChatroomContext.Provider>
    );
}

export default ChatroomProvider;