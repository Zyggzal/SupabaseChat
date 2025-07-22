"use client";

import { FormState } from "@/types/forms";
import { PaperPlaneIcon } from "../icons/icons";
import { useActionState, useContext, useEffect, useRef, useState } from "react";
import { editMessagesText, sendMessage } from "@/app/(main)/chat/actions";
import { ChatroomContext, TChatroomContext } from "@/contexts/chatroom";
import { ProfileContext, TProfileContext } from "@/contexts/profile";
import { PopupContext, TPopupContext } from "@/contexts/popup";
import { ChatroomMessagesContext, TChatroomMessagesContext } from "@/contexts/chatroomMessages";
import { Message } from "@/types/chat";

const initialState: FormState = { errors: [] };

function NewMessageInput() {
    const { chatroom } = useContext(ChatroomContext) as TChatroomContext;
    const { profile } = useContext(ProfileContext) as TProfileContext;
    const { showPopup } = useContext(PopupContext) as TPopupContext;

    const [state, action, pending] = useActionState(sendMessage.bind(
        null, 
        chatroom?.id, 
        profile?.id), initialState);

    useEffect(() => {
        state?.errors.forEach((error) => {
            showPopup({ type: 'error', title: 'Error', children: error, timeout: 5000 });
        });
    }, [state?.errors])

    return <form action={action} className="flex items-center w-full">
        <input disabled={pending} type="text" name="text" placeholder="Say your piece..." className="bg-gray-400 p-5 rounded-xl text-white font-bold flex-grow hover:bg-gray-500"/>
        <button disabled={pending} type="submit" className="text-white bg-orange-400 rounded-full w-15 h-15 flex items-center justify-center ml-5 hover:bg-orange-500">
            <PaperPlaneIcon size={25}/>
        </button>
    </form>
}

function EditMessageInput() {
    const { messageToEdit, setMessageToEdit } = useContext(ChatroomMessagesContext) as TChatroomMessagesContext;
    const { showPopup } = useContext(PopupContext) as TPopupContext;

    const [state, action, pending] = useActionState(editMessagesText.bind(null, messageToEdit?.id), initialState);

    const input = useRef<HTMLInputElement>(null);

    useEffect(() => {
        if(messageToEdit && input.current) input.current.value = messageToEdit.text;
    }, [messageToEdit])

    useEffect(() => {
        if(state.success) setMessageToEdit(null);
        else if(state.errors.length > 0) {
            state?.errors.forEach((error) => {
                showPopup({ type: 'error', title: 'Error', children: error, timeout: 5000 });
            });
        }
    }, [state])

    return <form action={action} className="flex items-center w-full">
        <input ref={input} disabled={pending} type="text" name="text" placeholder="Changed your mind...?" className="bg-gray-400 p-5 rounded-xl text-white font-bold flex-grow hover:bg-gray-500"/>
        <button disabled={pending} type="submit" className="text-white bg-orange-400 rounded-full w-15 h-15 flex items-center justify-center ml-5 hover:bg-orange-500">
            <PaperPlaneIcon size={25}/>
        </button>
    </form>
}

export default function ChatroomMessageInput() {
    const { messageToEdit } = useContext(ChatroomMessagesContext) as TChatroomMessagesContext;

    return <div className="bg-gray-300 w-full p-5 h-30 flex items-center">
        {
            messageToEdit ?
            <EditMessageInput/>
            :
            <NewMessageInput/>
        }
    </div>
}