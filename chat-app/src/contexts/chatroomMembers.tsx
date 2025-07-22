"use client";

import { Chatroom, ChatroomMember, ProfileChatroom } from "@/types/chat";
import createClient from "@/utils/supabase/client";
import { RealtimeChannel } from "@supabase/supabase-js";
import { createContext, useContext, useEffect, useState } from "react";
import { UserProfile } from "@/types/authTypes";
import { PopupContext, TPopupContext } from "./popup";
import { ChatroomContext, TChatroomContext } from "./chatroom";

export type TChatroomMembersContext = {
    members: ChatroomMember[]|undefined,
}

export const ChatroomMembersContext = createContext<TChatroomMembersContext|null>(null)

const ChatroomMembersProvider = ({ children, serverMembers, } : { 
    children: React.ReactNode,
    serverMembers?: ChatroomMember[],
}) => {
    const { chatroom } = useContext(ChatroomContext) as TChatroomContext;
    const { showPopup } = useContext(PopupContext) as TPopupContext;

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
        else {
            showPopup({ type: 'error', title: 'Error', timeout: 5000, children: 'Could not add member.'});
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
        if(!members) return;
        setMembers(prev => prev?.filter(member => member.profile_id !== status.profile_id));
    }

    useEffect(() => {
        if(!chatroom) return;

        const client = createClient();
        let membersListChangesChannel: RealtimeChannel;

        const subscribeToMemberListChanges = () => {
            membersListChangesChannel = client.channel('chatroom members list changes channel');
            membersListChangesChannel.on('postgres_changes', {
                    event: '*',
                    schema: 'public',
                    table: 'profiles_chatrooms',
                    filter: `chatroom_id=eq.${chatroom.id}`
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

        subscribeToMemberListChanges();

        return () => {
            if(membersListChangesChannel) membersListChangesChannel.unsubscribe();
        }
    }, [chatroom])

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
        <ChatroomMembersContext.Provider value={{ members }}>
            {children}
        </ChatroomMembersContext.Provider>
    );
}

export default ChatroomMembersProvider;