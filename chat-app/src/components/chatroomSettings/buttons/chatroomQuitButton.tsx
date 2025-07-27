"use client";

import { startTransition, useActionState, useContext, useEffect, useState } from "react";
import Modal from "../../modal/modal";
import { FormState } from "@/types/forms";
import { Chatroom } from "@/types/chat";
import { ProfileContext, TProfileContext } from "@/contexts/profile";
import { quitChatroom } from "@/app/(main)/chat/actions";
import ActionButton from "../../actionButton/actionButton";
import { ExitDoorIcon } from "../../icons/icons";
import { redirect } from "next/navigation";
import { PopupContext, TPopupContext } from "@/contexts/popup";
import Image from "next/image";

const initialState: FormState = { errors: [] };

export default function ChatroomQuitButton({ chatroom } : { chatroom: Chatroom|undefined }) {
    const { profile } = useContext(ProfileContext) as TProfileContext;
    const { showPopup } = useContext(PopupContext) as TPopupContext;

    const [ state, action, pending ] = useActionState(quitChatroom.bind(null, chatroom?.id, profile?.id), initialState);
    const [isWarningOpen, setIsWarningOpen] = useState(false);

    useEffect(() => {
        setIsWarningOpen(false);
        if(state.success) {
            showPopup({ type: 'info', title: 'Success', timeout: 5000, children: 'Left chatroom successfully.'});
            redirect('/chat');
        }
    }, [state.success])

    return <>
        <button className="flex text-red-600 border-2 gap-x-2 border-red-600 rounded-md px-3 py-2 mt-5 hover:bg-red-600 hover:text-white" onClick={() => setIsWarningOpen(true)}><ExitDoorIcon/> Quit</button>
        { state.errors.length > 0 && state.errors.map(err => <div className="text-red-500 text-sm" key={`${err}nameerror`}>{err}</div>) }
        <Modal id="RUSure modal" isOpen={isWarningOpen}>
            <div className="fixed top-0 left-0 w-screen h-screen z-40 backdrop-brightness-50 flex justify-center">
                <div className="flex flex-col items-center text-white bg-gray-500 h-max p-10 pt-5 rounded-b-lg">
                    <p><b className="text-orange-400">{ chatroom?.name }</b> will be removed from your chat list.</p>
                    <Image src="/images/graffiti/RUSure.png" className="w-80 h-60 absolute top-10 z-1" alt="are you sure pic" width={2000} height={2000}/>
                    <div className="mt-18 mb-15 w-100 flex justify-between z-5">
                        <ActionButton onClick={() => startTransition(() => action())} pending={pending}>Yes</ActionButton>
                        <button className="bg-gray-400 hover:bg-gray-600 px-6 rounded-md" onClick={()=> setIsWarningOpen(false)}>No</button>
                    </div>
                </div>
            </div>
        </Modal>
    </>
}