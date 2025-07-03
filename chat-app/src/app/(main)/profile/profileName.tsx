"use client";

import ActionButton from "@/components/actionButton/actionButton";
import { EditUserName } from "../../(authorization)/actions";
import { MouseEvent, useActionState, useEffect, useState } from "react";
import { CheckIcon, EditIcon, XIcon } from "@/components/icons/icons";
import { FormState } from "@/types/forms";

const initialState: FormState = { errors: [] };

export default function ProfileName({ name } : { name: string }) {
    const [state, formAction, pending] = useActionState(EditUserName, initialState);
    const [isEditing, setIsEditing] = useState(false);
    const [value, setValue] = useState(name);

    useEffect(() => {
        if(state.success) setIsEditing(false);
    }, [state]);

    const changeState = (e: MouseEvent<HTMLButtonElement>) => {
        e.preventDefault();
        setIsEditing(prev => !prev);
    }

    return <div className="flex h-max text-2xl w-full px-2">
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
            <div className="grow">{name}</div>
        }
        <button className="text-orange-600 hover:text-orange-400" onClick={changeState}>{ isEditing ? <XIcon/> : <EditIcon/>}</button>
    </div>
}