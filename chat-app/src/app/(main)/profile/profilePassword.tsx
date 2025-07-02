"use client";

import ActionButton from "@/components/actionButton/actionButton";
import { EditUserPassword } from "../../(authorization)/actions";
import { ProfileState } from "@/types/authTypes";
import { MouseEvent, useActionState, useEffect, useRef, useState } from "react";
import { CheckIcon, EditIcon, XIcon } from "@/components/icons/icons";
import PasswordToggle from "@/components/passwordToggle/passwordToggle";

const initialState: ProfileState = { errors: [] };

export default function ProfilePassword() {
    const [state, formAction, pending] = useActionState(EditUserPassword, initialState);
    const [isEditing, setIsEditing] = useState(false);
    const [currentPassword, setCurrentPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');

    useEffect(() => {
        if(state.success) setIsEditing(false);
    }, [state]);

    const changeState = (e: MouseEvent<HTMLButtonElement>) => {
        e.preventDefault();
        setIsEditing(prev => !prev);
    }

    return isEditing ? <div className="flex h-max text-2xl w-full px-2">
            <form action={formAction} className="flex flex-col w-full gap-y-5">
                <PasswordToggle 
                    autoFocus 
                    className="grow p-2" 
                    disabled={pending} 
                    name="password" 
                    placeholder="New Password" 
                    value={currentPassword} 
                    containerClassName="w-full"
                    onChange={(e) => setCurrentPassword(e.target.value)}/>
                <PasswordToggle 
                    className="grow p-2" 
                    disabled={pending} 
                    name="confirmPassword" 
                    placeholder="Confirm Password" 
                    value={confirmPassword} 
                    onChange={(e) => setConfirmPassword(e.target.value)}/>
                    <div className="flex gap-x-5">
                        <ActionButton className="w-max" pending={pending}><CheckIcon/></ActionButton>
                        <button className="text-orange-600 hover:text-orange-400" onClick={changeState}><XIcon/></button>
                    </div>
                { state.errors && state.errors.map(err => <div className="text-red-500 text-sm" key={`${err}nameerror`}>{err}</div>)}
            </form>
    </div> 
    :
    <div className="flex h-max text-2xl w-full px-2">
        <div className="grow">Change password</div>
        <button className="text-orange-600 hover:text-orange-400" onClick={changeState}><EditIcon/></button>
    </div> 
}