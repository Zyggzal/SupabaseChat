"use client";

import { deleteMessage } from "@/app/(main)/chat/actions";
import ActionButton from "@/components/actionButton/actionButton";
import { TrashCanIcon } from "@/components/icons/icons";
import Modal from "@/components/modal/modal";
import { PopupContext, TPopupContext } from "@/contexts/popup";
import { FormState } from "@/types/forms";
import { startTransition, useActionState, useContext, useEffect, useState } from "react";

const initialState: FormState = { errors: [] };

export default function DeleteUserMessageButton({ messageId, onDelete } : { 
    messageId: number,
    onDelete: () => void
}) {
    const { showPopup } = useContext(PopupContext) as TPopupContext;

    const [ state, action, pending ] = useActionState(deleteMessage.bind(null, messageId), initialState);
    const [isWarningOpen, setIsWarningOpen] = useState(false);

    useEffect(() => {
        if(state.errors.length > 0) {
            showPopup({ children: 'Could not delete message.', timeout: 5000, title: 'Error', type: 'error' })
        }
    }, [state.errors])

    useEffect(() => {
        if(state.success) {
            setIsWarningOpen(false);
            onDelete();
        }
    }, [state.success]);

    return <>
        <button onClick={() => setIsWarningOpen(true)} disabled={pending} className="rounded-full hover:text-orange-500"><TrashCanIcon size={20}/></button> 
        <Modal id="RUSure modal" isOpen={isWarningOpen}>
            <div className="fixed top-0 left-0 w-screen h-screen z-40 backdrop-brightness-50 flex justify-center">
                <div className="flex flex-col items-center text-white bg-gray-500 h-max p-10 pt-3 rounded-b-lg">
                    <h1 className="text-orange-500 font-bold text-3xl mb-5">Are you sure?</h1>
                    <p>The message will be permanently removed from the chatroom!</p>
                    <div className="mt-5 w-full flex justify-between px-6">
                        <ActionButton onClick={() => startTransition(() => action())} pending={pending}>Yes</ActionButton>
                        <button className="bg-gray-400 hover:bg-gray-600 px-6 rounded-md" onClick={()=> setIsWarningOpen(false)}>No</button>
                    </div>
                </div>
            </div>
        </Modal>
    </>
}