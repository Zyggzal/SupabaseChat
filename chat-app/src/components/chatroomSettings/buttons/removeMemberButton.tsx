"use client"

import { ChatroomMember } from "@/types/chat";
import { startTransition, useActionState, useState } from "react";
import { UserMinusIcon } from "../../icons/icons";
import { FormState } from "@/types/forms";
import { removeMemberFromChatroom } from "@/app/(main)/chat/actions";

const initialState: FormState = { errors: [] };

export default function RemoveMemberButton({ member } : { member: ChatroomMember }) {
    const [hovered, setHovered] = useState(false);

    const [state, action, pending] = useActionState(removeMemberFromChatroom.bind(
        null,
        member.chatroom_id, 
        member.profile_id), initialState);

    return <>
        <button disabled={pending} onClick={() => startTransition(() => action())} className="text-orange-500" onMouseEnter={() => setHovered(true)} onMouseLeave={() => setHovered(false)}>
            <UserMinusIcon size={30} filled={hovered}/>
        </button>
        { state.errors.length > 0 && <span>{ state.errors }</span>}
    </>
}