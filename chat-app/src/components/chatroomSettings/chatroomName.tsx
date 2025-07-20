"use client";

import ActionButton from "@/components/actionButton/actionButton";
import { MouseEvent, useActionState, useContext, useEffect, useState } from "react";
import { CheckIcon, EditIcon, XIcon } from "@/components/icons/icons";
import { FormState } from "@/types/forms";
import { editChatroomName } from "@/app/(main)/chat/actions";
import { Chatroom } from "@/types/chat";
import { PopupContext, TPopupContext } from "@/contexts/popup";

const initialState: FormState = { errors: [] };

export default function ChatroomName({ chatroom } : { chatroom?: Chatroom }) {
    const { showPopup } = useContext(PopupContext) as TPopupContext;

    const [state, formAction, pending] = useActionState(editChatroomName.bind(null, chatroom?.id), initialState);
    const [isEditing, setIsEditing] = useState(false);
    const [value, setValue] = useState(chatroom?.name);

    useEffect(() => {
        if(state.success) {
            showPopup({ type: 'info', title: 'Success', timeout: 5000, children: 'Chatroom renamed successfully.'});
            setIsEditing(false);
        }
    }, [state]);

    const changeState = (e: MouseEvent<HTMLButtonElement>) => {
        e.preventDefault();
        setIsEditing(prev => !prev);
    }

    return <div className="flex h-max text-2xl gap-x-4 px-2 text-white">
        {
            isEditing ? 
            <form action={formAction} className="grow">
                <div className="flex justify-between pr-5">
                    <input 
                        autoFocus 
                        className="grow mr-5 p-2" 
                        disabled={pending} 
                        type="text" 
                        name="name" 
                        placeholder="Profile name" 
                        value={value} 
                        onChange={(e)=>setValue(e.target.value)}/>
                    <ActionButton pending={pending}><CheckIcon/></ActionButton>
                </div>
                { state.errors && state.errors.map(err => <div className="text-red-500 text-sm" key={`${err}nameerror`}>{err}</div>)}
            </form>
            :
            <div className="grow capitalize">{chatroom?.name}</div>
        }
        <button className="text-orange-600 hover:text-orange-400" onClick={changeState}>{ isEditing ? <XIcon/> : <EditIcon/>}</button>
    </div>
}