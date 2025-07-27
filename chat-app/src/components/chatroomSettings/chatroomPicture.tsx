"use client";

import { editChatroomPicure } from "@/app/(main)/chat/actions";
import { EditIcon, GearIcon } from "@/components/icons/icons";
import RoundedImage from "@/components/roundedImage/roundedImage";
import { PopupContext, TPopupContext } from "@/contexts/popup";
import { Chatroom } from "@/types/chat";
import { FormState } from "@/types/forms";
import Image, { ImageProps } from "next/image";
import { MouseEvent, useActionState, useContext, useEffect, useRef } from "react";

type ChatroomPicProps = Omit<Omit<ImageProps, "alt">, "src"> & { chatroom?: Chatroom };

const initialState: FormState = { errors: [] };

export default function ChatroomPicture({ chatroom, ...props } : ChatroomPicProps) {
    const { showPopup } = useContext(PopupContext) as TPopupContext;

    const [state, formAction, pending] = useActionState(editChatroomPicure.bind(null, chatroom?.id), initialState);
    const input = useRef <HTMLInputElement>(null);
    const form = useRef<HTMLFormElement>(null);

    useEffect(() => {
        if(input.current) {
            input.current.onchange = () => {
                form.current?.requestSubmit();
            }
        }
    }, [])

    useEffect(() => {
        if(state.success) {
            showPopup({ type: 'info', title: 'Success', timeout: 5000, children: 'Chatroom picture changed successfully.'});
        }
    }, [state]);

    const clickHandler = (e: MouseEvent) => {
        e.preventDefault();
        input.current?.click();
    }

    return <div className="flex flex-col items-center relative">
        <form ref={form} action={formAction} className="rounded-xl relative w-max h-max mb-5 z-2">
            <RoundedImage 
                alt="User profile pic" 
                src={chatroom?.picture || '/images/chat-no-pic.jpg'} 
                {...props}
                />
            <button disabled={pending} 
            className="absolute z-2 bg-opacity-90 w-full h-full top-0 flex items-center justify-center text-orange-400 opacity-0 hover:opacity-100 disabled:opacity-100 backdrop-blur-sm rounded-full transition-opacity duration-300"
            onClick={clickHandler}
            >
                {
                    pending ? <div className="animate-spin"><GearIcon size={70}/></div> : <EditIcon size={70}/>
                }
            </button>
            <input name="picture" ref={input} type="file" accept="image/*" className="absolute hidden"/>
        </form>
        { state.errors && state.errors.map(err => <div className="text-red-500 text-md" key={`${err}nameerror`}>{err}</div>)}
    </div>
}