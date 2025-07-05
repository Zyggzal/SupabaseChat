"use client";

import { EditUserAvatar } from "@/app/(authorization)/actions";
import { EditIcon, GearIcon } from "@/components/icons/icons";
import RoundedImage from "@/components/roundedImage/roundedImage";
import { FormState } from "@/types/forms";
import { ImageProps } from "next/image";
import { MouseEvent, useActionState, useEffect, useRef } from "react";

type PfpfProps = Omit<ImageProps, 'alt'>;
const initialState: FormState = { errors: [] };

export default function ProfilePicture(props : PfpfProps) {
    const [state, formAction, pending] = useActionState(EditUserAvatar, initialState);
    const input = useRef <HTMLInputElement>(null);
    const form = useRef<HTMLFormElement>(null);

    useEffect(() => {
        if(input.current) {
            input.current.onchange = () => {
                form.current?.requestSubmit();
            }
        }
    }, [])

    const clickHandler = (e: MouseEvent) => {
        e.preventDefault();
        input.current?.click();
    }

    return <div className="flex flex-col items-center">
        <form ref={form} action={formAction} className="rounded-xl relative w-max h-max mb-5">
            <RoundedImage alt="User profile pic" {...props}/>
            <button disabled={pending} 
            className="absolute z-2 bg-opacity-90 w-full h-full top-0 flex items-center justify-center text-orange-400 opacity-0 hover:opacity-100 disabled:opacity-100 backdrop-blur-sm rounded-full transition-opacity duration-300"
            onClick={clickHandler}
            >
                {
                    pending ? <div className="animate-spin"><GearIcon size={70}/></div> : <EditIcon size={70}/>
                }
            </button>
            <input name="image" ref={input} type="file" accept="image/*" className="absolute hidden"/>
        </form>
        { state.errors && state.errors.map(err => <div className="text-red-500 text-md" key={`${err}nameerror`}>{err}</div>)}
    </div>
}