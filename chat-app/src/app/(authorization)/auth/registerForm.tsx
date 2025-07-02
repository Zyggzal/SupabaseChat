"use client";

import ActionButton from "@/components/actionButton/actionButton";
import { Register } from "../actions";
import { AuthFormState } from "@/types/authTypes";
import { useActionState, useEffect } from "react";

const initialState: AuthFormState = { errors: {} };

export default function RegisterForm({ onEmailSent } : {
    onEmailSent: () => void
}) {
    const [state, formAction, pending] = useActionState(Register, initialState);

    useEffect(() => {
        if(state.success) {
            onEmailSent();
        }
    }, [state.success]);
    
    return <form action={formAction} className="bg-gray-300 flex flex-col justify-between gap-y-5 p-5 h-110 shadow-lg w-130">
        <div className="flex flex-col items-center gap-y-10">
            <h1 className="font-bold text-3xl mb-5">SIGN UP</h1>
            <div className="w-full h-max flex flex-col gap-y-2">
                <label className="px-5 flex justify-between items-center w-full text-2xl">Email: <input className="w-7/10 text-lg rounded-md p-4 bg-gray-400 text-orange-400 placeholder-white" type="text" name="email" placeholder="somebody@gmail.com"/></label>
                { state.errors.email && <span className="text-red-500 ml-5">{state.errors.email}</span> }
            </div>
            <div className="w-full h-max flex flex-col gap-y-2">
                <label className="px-5 flex justify-between items-center w-full text-2xl">Password: <input className="w-7/10 text-lg rounded-md p-4 bg-gray-400 text-orange-400 placeholder-white" type="password" name="password" placeholder="your password"/></label>
                { state.errors.password && <span className="text-red-500 ml-5">{state.errors.password}</span> }
            </div> 
        </div>

        <div className="flex flex-col items-center">
            <ActionButton className="w-1/2 h-max" pending={pending}>Sign Up</ActionButton>
            { state.message && <span className="text-red-500 pt-4">{state.message}</span> }
        </div>
    </form>
}