"use client";

import { Logout } from "@/app/(authorization)/actions";
import { AuthFormState } from "@/types/authTypes";
import Link from "next/link";
import { useActionState, useContext, useEffect, useState } from "react";
import ActionButton from "../actionButton/actionButton";
import RoundedImage from "../roundedImage/roundedImage";
import { ProfileContext, TProfileContext } from "@/contexts/profile";

const initialState: AuthFormState = { errors: {} };

export default function Navbar() {
    const { profile } = useContext(ProfileContext) as TProfileContext;
    const [ state, action, pending ] = useActionState(Logout, initialState);

    return <div className="absolute top-0 left-0 w-full flex justify-between p-5 items-center z-1 bg-gray-400 shadow-lg">
        { profile ? 
        <>
            <Link href={'/profile'} className="flex items-center gap-x-5 hover:text-orange-100">
                <RoundedImage
                    className="w-20 h-20"
                    alt="navbar user profile picture"
                    src={profile.image_url}
                />
                <div>
                    <p className="font-bold text-lg text-orange-500">{profile.name}</p>
                </div>
            </Link>

            <form action={action} className="w-50 flex flex-column gap-y-4 justify-end">
                <ActionButton pending={pending}>Logout</ActionButton>
                { state.message && <span>{state.message}</span> }
            </form>

        </> : 
            <Link href='/auth'>Sign In</Link> }
    </div>
}