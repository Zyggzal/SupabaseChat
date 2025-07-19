"use client"

import { MouseEvent, useActionState, useCallback, useContext, useEffect, useRef, useState } from "react";
import { EditIcon, GearIcon, XIcon } from "../icons/icons";
import Modal from "../modal/modal";
import { ProfileContext, TProfileContext } from "@/contexts/profile";
import { addChatroom } from "@/app/(main)/chat/actions";
import { FormState } from "../../types/forms";
import ActionButton from "../actionButton/actionButton";
import RoundedImage from "../roundedImage/roundedImage";

const initialState: FormState = { errors: [] };

export default function NewChatroomModal({
    isOpen,
    handleClose
} : {
    isOpen: boolean,
    handleClose: () => void
}) {
    const { profile } = useContext(ProfileContext) as TProfileContext;

    const [state, formAction, pending] = useActionState(addChatroom.bind(null, profile?.id), initialState);

    const [picture, setPicture] = useState<string>();

    const input = useRef<HTMLInputElement>(null);
    const form = useRef<HTMLFormElement>(null);

    const clickHandler = (e: MouseEvent) => {
        e.preventDefault();
        input.current?.click();
    }

    const close = useCallback(() => {
        form.current?.reset();
        setPicture(undefined);

        handleClose();
    }, [handleClose])

    useEffect(() => {
        if(state.success) {
            close();
        }
    }, [state]);

    return <Modal isOpen={isOpen} id="new-chatroom-modal">
        <div className="fixed top-0 left-0 w-screen h-screen z-40 backdrop-brightness-50 flex justify-center">
            <form ref={form} action={formAction} className="bg-gray-400 w-160 min-w-100 h-max text-white flex flex-col items-center mt-40 p-10 relative">
                <button className="absolute top-5 right-5 hover:text-orange-400" onClick={close}><XIcon size={30}/></button>
                <h1 className="text-orange-400 font-bold text-4xl mb-10">Add Chatroom</h1>
                <div className="relative">
                    <RoundedImage 
                        className="w-30 h-30"
                        alt="User profile pic" 
                        src={picture || '/images/chat-no-pic.jpg'}/>
                    <button disabled={pending} 
                        className="absolute z-2 bg-opacity-90 w-full h-full top-0 flex items-center justify-center text-orange-400 opacity-0 hover:opacity-100 disabled:opacity-100 backdrop-blur-sm rounded-full transition-opacity duration-300"
                        onClick={clickHandler}
                    >
                        {
                            pending ? <div className="animate-spin"><GearIcon size={40}/></div> : <EditIcon size={40}/>
                        }
                    </button>
                    <input 
                        name="picture" 
                        ref={input} 
                        type="file" 
                        accept="image/*" 
                        className="absolute hidden"
                        onChange={(e) => e.target.files && setPicture(URL.createObjectURL(e.target.files[0]))}/>
                </div>
                <label className="w-full p-5 py-10 flex justify-between items-center text-xl">
                    Name:
                    <input
                        name="name"
                        disabled={pending}
                        className="bg-gray-500 p-4 text-white w-2/3 rounded-md" 
                        type="text"/>
                </label>

                <ActionButton className="mb-4 w-1/3" pending={pending}>Create</ActionButton>
                { state.errors && state.errors.map(err => <div className="text-red-500 text-md" key={`${err}nameerror`}>{err}</div>)}
            </form>
        </div>
    </Modal>
}