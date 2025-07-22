"use client"

import { addChatroomMember } from "@/app/(main)/chat/actions";
import ActionButton from "@/components/actionButton/actionButton";
import { UserPlusIcon, XIcon } from "@/components/icons/icons";
import Modal from "@/components/modal/modal";
import { PopupContext, TPopupContext } from "@/contexts/popup";
import { Chatroom } from "@/types/chat";
import { FormState } from "@/types/forms";
import { useActionState, useContext, useEffect, useRef, useState } from "react";

const initialState: FormState = { errors: [] };

export default function AddChatroomMemberModal({
    chatroom,
} : {
    chatroom?: Chatroom
}) {
    const { showPopup } = useContext(PopupContext) as TPopupContext;
    const [state, formAction, pending] = useActionState(addChatroomMember.bind(null, chatroom?.id), initialState);

    const [isOpen, setIsOpen] = useState(false);
    const form = useRef<HTMLFormElement>(null);

    const close = () => {
        form.current?.reset();
        setIsOpen(false);
    }

    useEffect(() => {
        if(state.success) {
            showPopup({ type: 'info', title: 'Invited', timeout: 5000, children: 'User invited to chatroom.'});
            close();
        }
        if(state.errors) {
            state.errors.map(error => showPopup({ type: 'error', title: 'Error', timeout: 5000, children: error})) 
        }
    }, [state]);

    return <>
        <button className="bg-none text-orange-500 font-bold flex gap-x-5 hover:text-orange-400 mb-3" onClick={() => setIsOpen(true)}><UserPlusIcon/> Add new member</button>
        <Modal isOpen={isOpen} id="new-chatroom-modal">
                <div className="fixed top-0 left-0 w-screen h-screen z-40 backdrop-brightness-50 flex justify-center">
                    <form ref={form} action={formAction} className="bg-gray-400 w-160 min-w-100 h-max text-white flex flex-col items-center mt-40 p-10 relative">
                        <button className="absolute top-5 right-5 hover:text-orange-400" onClick={close}><XIcon size={30}/></button>
                        <h1 className="text-orange-400 font-bold text-4xl mb-10">New Member?</h1>
                        <label className="w-full p-5 py-10 flex justify-between items-center text-xl">
                            Email:
                            <input
                                name="email"
                                disabled={pending}
                                className="bg-gray-500 p-4 text-white w-2/3 rounded-md" 
                                type="text"/>
                        </label>

                        <ActionButton className="mb-4 w-1/3" pending={pending}>Invite</ActionButton>
                        { state.errors && state.errors.map(err => <div className="text-red-500 text-md" key={`${err}nameerror`}>{err}</div>)}
                    </form>
                </div>
            </Modal>
    </>
}