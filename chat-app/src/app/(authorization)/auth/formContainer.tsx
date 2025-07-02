"use client";

import { useState } from "react";
import LoginForm from "./loginForm";
import RegisterForm from "./registerForm";
import ConfirmEmail from "./confirmEmail";

export default function FormContainer() {
    const [show, setShow] = useState<'login'|'register'|'confirm'>('login');


    return <div className="flex flex-col items-center gap-y-5">
        {
            show === 'login' && 
            <>
                <LoginForm/>
                <p>New here? <span className="text-orange-400 font-bold hover:text-orange-500 cursor-pointer" onClick={() => setShow('register')}>Sign up!</span></p>
            </>
        }
        {
            show === 'register' &&
            <>
                <RegisterForm onEmailSent={() => setShow('confirm')}/>
                <p>Have an account already? <span className="text-orange-400 font-bold hover:text-orange-500 cursor-pointer" onClick={() => setShow('login')}>Sign in!</span></p>
            </>
        }
        {
            show === 'confirm' && <ConfirmEmail/>
        }
    </div>
}