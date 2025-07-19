"use client"

import { ChatroomMember } from "@/types/chat";
import { startTransition, useActionState, useState } from "react";
import { BoltIcon, CrossedBoltIcon } from "../../icons/icons";
import { FormState } from "@/types/forms";
import { changeChatroomMemberRole } from "@/app/(main)/chat/actions";

const initialState: FormState = { errors: [] };

export default function PromoteMemberButton({ member } : { member: ChatroomMember }) {
    const [hovered, setHovered] = useState(false);

    const [state, action, pending] = useActionState(changeChatroomMemberRole.bind(
        null,
        member.chatroom_id, 
        member.profile_id,
        member.role === 'admin' ? 'member' : 'admin'), initialState);

    return <>
        <button disabled={pending} onClick={() => startTransition(() => action())} className="text-orange-500" onMouseEnter={() => setHovered(true)} onMouseLeave={() => setHovered(false)}>
            {
                member.role === 'admin' ? 
                <CrossedBoltIcon size={30} filled={hovered}/>
                :
                <BoltIcon size={30} filled={hovered}/>
            }
        </button>
        { state.errors.length > 0 && <span>{ state.errors }</span>}
    </>
}