"use client"

import { useActionState, useContext } from "react";
import { XIcon } from "../icons/icons";
import Modal from "../modal/modal";
import { ProfileContext, TProfileContext } from "@/contexts/profile";
import { addChatroom } from "@/app/(main)/chat/actions";
import { FormState } from "@/types/forms";

const initialState: FormState = { errors: [] };

export default function NewChatroomModal({
    isOpen,
    handleClose
} : {
    isOpen: boolean,
    handleClose: () => void
}) {
    const { profile } = useContext(ProfileContext) as TProfileContext;
    //const [state, formAction, pending] = useActionState(addChatroom, initialState);

    return <Modal isOpen={isOpen} id="new-chatroom-modal">
        <div className="fixed top-0 left-0 w-screen h-screen z-40 backdrop-blur-sm flex justify-center">
            <form className="bg-gray-400 w-160 min-w-100 h-100 text-white flex flex-col items-center mt-40 p-10 relative">
                <button className="absolute top-5 right-5 hover:text-orange-400" onClick={handleClose}><XIcon size={30}/></button>
                <h1 className="text-orange-400 font-bold text-4xl mb-10">Add Chatroom</h1>
                <label className="w-full p-5 flex justify-between items-center text-xl">
                    Name:
                    <input
                        className="bg-gray-500 p-4 text-white w-2/3" 
                        type="text"/>
                </label>
            </form>
        </div>
    </Modal>
}