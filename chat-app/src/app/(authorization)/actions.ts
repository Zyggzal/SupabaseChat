"use server";

import { AuthFormState } from "@/types/authTypes";
import { FormState } from "@/types/forms";
import { uploadImage } from "@/utils/supabase/files";
import createClient from "@/utils/supabase/server";
import { revalidatePath } from "next/cache";
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

export async function Login(prevState: AuthFormState, data: FormData) {
    const email = data.get('email') as string;
    const password = data.get('password') as string;

    const newState:AuthFormState = { errors: {} };

    validateFormData({ email, password }, newState);

    if(Object.values(newState.errors).length > 0) {
        return newState;
    }

    const client = await createClient();

    const { error } = await client.auth.signInWithPassword({
        email, 
        password 
    });

    if(error) {
        newState.message = error.message;
        return newState;
    }
    else {
        redirect('/');
    }
}

export async function Register(prevState: AuthFormState, data: FormData) {
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

export async function Logout(prevState: AuthFormState, data: FormData) {
    const client = await createClient();

    const { error } = await client.auth.signOut();

    const newState:AuthFormState = { 
        message: error?.message, 
        errors: {} 
    };

    if(error) return newState;
    else redirect('/auth');
}

export async function EditUserName(prevState: FormState, data: FormData) {
    const name = data.get('name') as string;

    const newState: FormState = { errors: [] };

    if(name.length === 0) {
        newState.errors.push('Name is required');
    }

    if(newState.errors.length > 0) {
        return newState;
    }

    const client = await createClient();

    const { data: userData, error: userError } = await client.auth.getUser();

    if(userError) {
        newState.errors.push(userError.message);
        return newState;
    }

    const { error } = await client
    .from('profiles')
    .update({ name })
    .eq('user_id', userData.user.id);

    if(error) {
        newState.errors.push(error.message);
    }
    else {
        newState.success = true;
        revalidatePath('/profile');
    }

    return newState;
}

export async function EditUserPassword(prevState: FormState, data: FormData) {
    const password = data.get('password') as string;
    const confirmPassword = data.get('confirmPassword') as string;

    const newState: FormState = { errors: [] };

    if(password.length === 0) {
        newState.errors.push('Password is required');
    }

    if(password.localeCompare(confirmPassword)) {
        newState.errors.push('Passwords do not match');
    }

    if(newState.errors.length > 0) {
        return newState;
    }

    const client = await createClient();

    const { error } = await client.auth.updateUser({
        password
    });

    if(error) {
        newState.errors.push(error.message);
    }
    else {
        newState.success = true;
    }

    return newState;
}

export async function EditUserAvatar(prevState: FormState, data: FormData) {
    const image = data.get('image') as File;

    const newState: FormState = { errors: [] };

    if(!image) {
        newState.errors.push('No file selected');
        return newState;
    }

    const client = await createClient();

    const { error: imgError, url } = await uploadImage(image, client);

    if(imgError) {
        newState.errors.push(imgError);
        return newState;
    }

    const { error: userError, data: { user } } = await client.auth.getUser();

    if(userError || !user) {
        newState.errors.push(userError ? userError.message : 'User not found');
        return newState;
    }

    const { error: profileError } = await client.from('profiles').update({ image_url: url }).eq('user_id', user.id);

    if(profileError) {
        newState.errors.push(profileError.message);
        return newState;
    }
    else {
        newState.success = true;
        revalidatePath('/profile');
    }

    return newState;
}