"use server";

import { FormState } from "@/types/forms";
import { setProfileCookies } from "@/utils/cookies/server";
import { uploadImage } from "@/utils/supabase/files";
import createClient from "@/utils/supabase/server";
import { revalidatePath } from "next/cache";

export async function editUserName(prevState: FormState, data: FormData) {
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
        await setProfileCookies(userData.user.id, client);
        newState.success = true;
        revalidatePath('/profile');
    }

    return newState;
}

export async function editUserPassword(prevState: FormState, data: FormData) {
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

export async function editUserAvatar(prevState: FormState, data: FormData) {
    const image = data.get('image') as File;

    const newState: FormState = { errors: [] };

    if(!image) {
        newState.errors.push('No file selected');
        return newState;
    }

    const client = await createClient();

    const { error: imgError, url } = await uploadImage('avatars', image, client);

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
        await setProfileCookies(user.id, client);
        newState.success = true;
        revalidatePath('/profile');
    }

    return newState;
}