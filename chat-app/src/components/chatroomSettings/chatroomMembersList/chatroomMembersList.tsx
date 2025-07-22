"use client";

import { Chatroom } from "@/types/chat";
import { useContext, useMemo } from "react";
import ChatroomMembersListItem from "./chatroomMembersListItem";
import { ProfileContext, TProfileContext } from "@/contexts/profile";
import AddChatroomMemberModal from "./addChatroomMemberModal";
import { ChatroomMembersContext, TChatroomMembersContext } from "@/contexts/chatroomMembers";

type ChatroomMembersListProps = { chatroom?: Chatroom };

export default function ChatroomMembersList({ chatroom } : ChatroomMembersListProps) {
    const { profile } = useContext(ProfileContext) as TProfileContext;
    const { members } = useContext(ChatroomMembersContext) as TChatroomMembersContext;

    const allMembers = useMemo(() => {
        if(!members) return;
        const newMembers = [ ...members];
        const userMember = newMembers.splice(newMembers.findIndex((member) => member.profile_id === profile?.id), 1)[0]

        return {
            userMember,
            membersList: newMembers
        }
    }, [members]);

    return <div className="flex flex-col items-center w-full mb-5">
        {
            allMembers && <>
                <h3 className="text-orange-400 font-bold py-5">Members</h3>
                {
                    chatroom?.role !== 'member' && <AddChatroomMemberModal chatroom={chatroom}/>
                }
                {
                    allMembers.userMember && <ChatroomMembersListItem self member={allMembers?.userMember}/>
                }
                {
                    allMembers.membersList ?
                    allMembers.membersList.map(member => {
                        return <ChatroomMembersListItem editable={chatroom?.role !== 'member'} key={`chatroom${member.chatroom_id}memberlistitem${member.profile_id}`} member={member}/>
                    })
                    :
                    <h1>No members</h1>
                }
            </>
        }
    </div>
}