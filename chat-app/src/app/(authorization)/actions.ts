"use server";

import { AuthFormState } from "@/types/authTypes";
import { clearProfileCookies, setProfileCookies } from "@/utils/cookies/server";
import createClient from "@/utils/supabase/server";
import { redirect } from "next/navigation";

const validateFormData = (data: any, state: AuthFormState) => {
    if(!/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(data.email)) {
        if(!state.errors.email) state.errors.email = [];
        state.errors.email.push('Invalid email');
    }

    if(data.password.length === 0) {
        if(!state.errors.password) state.errors.password = [];
        state.errors.password.push('Password is required');
    }
}

export async function login(prevState: AuthFormState, data: FormData) {
    const email = data.get('email') as string;
    const password = data.get('password') as string;

    const newState:AuthFormState = { errors: {} };

    validateFormData({ email, password }, newState);

    if(Object.values(newState.errors).length > 0) {
        return newState;
    }

    const client = await createClient();

    const { data: userData, error } = await client.auth.signInWithPassword({
        email, 
        password 
    });

    if(error) {
        newState.message = error.message;
        return newState;
    }
    else {
        await setProfileCookies(userData.user.id, client);
        redirect('/');
    }
}

export async function register(prevState: AuthFormState, data: FormData) {
    const email = data.get('email') as string;
    const password = data.get('password') as string;

    const newState:AuthFormState = { errors: {} };

    validateFormData({ email, password }, newState);

    if(Object.values(newState.errors).length > 0) {
        return newState;
    }

    const client = await createClient();

    const { error } = await client.auth.signUp({ 
        email,
        password
    });

    if(error) {
        newState.message = error.message;
    }
    else {
        newState.success = true;
    }

    return newState;
}

export async function logout(prevState: AuthFormState, data: FormData) {
    const client = await createClient();

    const { error } = await client.auth.signOut();

    const newState:AuthFormState = { 
        message: error?.message, 
        errors: {} 
    };

    if(error) return newState;
    else {
        await clearProfileCookies();
        redirect('/auth');
    }
}