"use server";

import { FormState } from "@/types/forms";
import { uploadImage } from "@/utils/supabase/files";
import createClient from "@/utils/supabase/server";

export async function addChatroom(id: number|undefined, prevState: FormState, data: FormData) {
    const name = data.get('name') as string;
    const picture = data.get('picture') as File;

    const newState:FormState = { errors: [] };

    if(!id) {
        newState.errors.push('Profile error');
    }

    if(name.length === 0) {
        newState.errors.push('No name specified');
    }

    if(newState.errors.length > 0) {
        return newState;
    }

    const client = await createClient();

    const newChatroom: { created_by: number|undefined, name: string, picture?: string } = { created_by: id, name };

    if(picture) {
        const { error:fileError, url } = await uploadImage(picture, client);

        if(!fileError) {
            newChatroom.picture = url;
        }
    }

    const { error: chatroomError } = await client.from('chatrooms').insert(newChatroom);

    if(chatroomError) {
        newState.errors.push(chatroomError.message);
    }
    else {
        newState.success = true;
    }

    return newState;
}