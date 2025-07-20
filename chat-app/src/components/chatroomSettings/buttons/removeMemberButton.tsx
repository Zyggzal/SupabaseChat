"use client"

import { ChatroomMember } from "@/types/chat";
import { startTransition, useActionState, useContext, useEffect, useState } from "react";
import { UserMinusIcon } from "../../icons/icons";
import { FormState } from "@/types/forms";
import { removeMemberFromChatroom } from "@/app/(main)/chat/actions";
import { PopupContext, TPopupContext } from "@/contexts/popup";

const initialState: FormState = { errors: [] };

export default function RemoveMemberButton({ member } : { member: ChatroomMember }) {
    const { showPopup } = useContext(PopupContext) as TPopupContext;

    const [hovered, setHovered] = useState(false);

    const [state, action, pending] = useActionState(removeMemberFromChatroom.bind(
        null,
        member.chatroom_id, 
        member.profile_id), initialState);

    useEffect(() => {
        if(state.success) {
            showPopup({ type: 'info', title: 'Success', timeout: 5000, children: 'Member removed successfully.'});
        }
    }, [state.success])

    return <>
        <button disabled={pending} onClick={() => startTransition(() => action())} className="text-orange-500" onMouseEnter={() => setHovered(true)} onMouseLeave={() => setHovered(false)}>
            <UserMinusIcon size={30} filled={hovered}/>
        </button>
        { state.errors.length > 0 && <span>{ state.errors }</span>}
    </>
}