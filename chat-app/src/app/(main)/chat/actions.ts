"use server";

import { FormState } from "@/types/forms";
import { uploadImage } from "@/utils/supabase/files";
import createClient from "@/utils/supabase/server";

export async function addChatroom(id: number|undefined, prevState: FormState, data: FormData) {
    const name = data.get('name') as string;
    const picture = data.get('picture') as File;

    console.log(picture);
    const newState:FormState = { errors: [] };

    if(!id) {
        newState.errors.push('Profile error.');
    }

    if(name.length === 0) {
        newState.errors.push('No name specified.');
    }

    if(newState.errors.length > 0) {
        return newState;
    }

    const client = await createClient();

    const newChatroom: { created_by: number|undefined, name: string, picture?: string } = { created_by: id, name };

    if(picture.size > 0) {
        const { error:fileError, url } = await uploadImage('chatroomicons', picture, client);

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

export async function editChatroomPicure(id: number|undefined, prevState: FormState, data: FormData) {
    const newState: FormState = { errors: [] };

    if(!id) {
        newState.errors.push('Chatroom not found.');
        return newState;
    }

    const picture = data.get('picture') as File;

    if(!picture) {
        newState.errors.push('No file selected.');
        return newState;
    }

    const client = await createClient();

    const { error: pictureError, url } = await uploadImage('chatroomicons', picture, client);

    if(pictureError) {
        newState.errors.push(pictureError);
        return newState;
    }

    const { error: chatroomError } = await client.from('chatrooms').update({ picture: url }).eq('id', id);

    if(chatroomError) {
        newState.errors.push(chatroomError.message);
        return newState;
    }
    else {
        newState.success = true;
    }

    return newState;
}

export async function editChatroomName(id:number|undefined, prevState: FormState, data: FormData) {
    const newState: FormState = { errors: [] };
    
    if(!id) {
        newState.errors.push('Chatroom not found.');
        return newState;
    }

    const name = data.get('name') as string;

    if(name.length === 0) {
        newState.errors.push('Name is required.');
        return newState;
    }

    const client = await createClient();

    const { error: chatroomError } = await client
        .from('chatrooms')
        .update({ name })
        .eq('id', id);

    if(chatroomError) {
        newState.errors.push(chatroomError.message);
        return newState;
    }
    else {
        newState.success = true;
    }

    return newState;
}

export async function deleteChatroom(id: number|undefined, prevState: FormState) {
    const newState: FormState = { errors: [] };
    
    if(!id) {
        newState.errors.push('Chatroom not found.');
        return newState;
    }

    const client = await createClient();

    const { error: chatroomError } = await client
        .from('chatrooms')
        .delete()
        .eq('id', id);

    if(chatroomError) {
        newState.errors.push(chatroomError.message);
        return newState;
    }
    else {
        newState.success = true;
    }

    return newState;
}

export async function quitChatroom(chatroom_id: number|undefined, profile_id: number|undefined, prevState: FormState) {
    const newState: FormState = { errors: [] };
    
    if(!chatroom_id || !profile_id) {
        newState.errors.push('Chatroom or profile not found.');
        return newState;
    }

    const client = await createClient();

    const { error: chatroomError } = await client
        .from('profiles_chatrooms')
        .delete()
        .eq('chatroom_id', chatroom_id)
        .eq('profile_id', profile_id);

    if(chatroomError) {
        newState.errors.push(chatroomError.message);
        return newState;
    }
    else {
        newState.success = true;
    }

    return newState;
}

export async function addChatroomMember(chatroom_id: number|undefined, prevState: FormState, data: FormData) {
    const email = data.get('email') as string;

    const newState: FormState = { errors: [] };

    if(!/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(email)) {
        newState.errors.push('Invalid email.');
    }
    
    if(!chatroom_id) {
        newState.errors.push('Chatroom not found.');
    }

    if(newState.errors.length > 0) return newState;

    const client = await createClient();

    const { data: profileData, error: profileError } = await client
        .from('profiles')
        .select('id')
        .eq('email', email)
        .single();

    if(profileError) {
        newState.errors.push(profileError.message);
        return newState;
    }
    if(!profileData) {
        newState.errors.push('Error retrieving profile data.');
        return newState;
    }

    const { error: pcError } = await client
        .from('profiles_chatrooms')
        .insert({ chatroom_id, profile_id: profileData.id });

    if(pcError) {
        newState.errors.push(pcError.message);
        return newState;
    }
    else {
        newState.success = true;
    }

    return newState;
}

export async function changeChatroomMemberRole(chatroom_id: number|undefined, profile_id: number|undefined, role: string, prevState: FormState) {
    const newState: FormState = { errors: [] };
    
    if(!chatroom_id) {
        newState.errors.push('Chatroom not found.');
    }

    if(!profile_id) {
        newState.errors.push('Profile not found.');
    }

    if(newState.errors.length > 0) return newState;

    const client = await createClient();

    const { error: roleError } = await client
        .from('profiles_chatrooms')
        .update({ role })
        .eq('chatroom_id', chatroom_id)
        .eq('profile_id', profile_id);

    if(roleError) {
        newState.errors.push(roleError.message);
        return newState;
    }
    else {
        newState.success = true;
    }

    return newState;
}

export async function removeMemberFromChatroom(chatroom_id: number|undefined, profile_id: number|undefined, prevState: FormState) {
    const newState: FormState = { errors: [] };
    
    if(!chatroom_id) {
        newState.errors.push('Chatroom not found.');
    }

    if(!profile_id) {
        newState.errors.push('Profile not found.');
    }

    if(newState.errors.length > 0) return newState;

    const client = await createClient();

    const { error: roleError } = await client
        .from('profiles_chatrooms')
        .delete()
        .eq('chatroom_id', chatroom_id)
        .eq('profile_id', profile_id);

    if(roleError) {
        newState.errors.push(roleError.message);
        return newState;
    }
    else {
        newState.success = true;
    }

    return newState;
}

export async function sendMessage(chatroom_id: number|undefined, created_by: number|undefined, prevState: FormState|undefined, data: FormData) {
    const text = data.get('text') as string;
    if(!text) return;

    const newState: FormState = { errors: [] };
    
    if(!chatroom_id) {
        newState.errors.push('Chatroom not found.');
    }

    if(!created_by) {
        newState.errors.push('Profile not found.');
    }

    if(newState.errors.length > 0) return newState;

    const client = await createClient();

    const { error: messageError } = await client
        .from('messages')
        .insert({ 
            chatroom_id,
            text,
            created_by
        });

    if(messageError) {
        newState.errors.push(messageError.message);
        return newState;
    }
    else {
        newState.success = true;
    }

    return newState;
}

export async function deleteMessage(id: number|undefined, prevState: FormState) {
    const newState: FormState = { errors: [] };
    
    if(!id) {
        newState.errors.push('Message not found.');
        return newState;
    }

    const client = await createClient();

    const { error: chatroomError } = await client
        .from('messages')
        .delete()
        .eq('id', id);

    if(chatroomError) {
        newState.errors.push('Could not delete message.');
        return newState;
    }
    else {
        newState.success = true;
    }

    return newState;
}

export async function editMessagesText(message_id: number|undefined, prevState: FormState, data: FormData) {
    const text = data.get('text') as string; 
    
    const newState: FormState = { errors: [] };
    
    if(!text) {
        newState.errors.push('Message can not be empty.');
    }

    if(!message_id) {
        newState.errors.push('Message not found.');
    }

    if(newState.errors.length > 0) return newState;

    const client = await createClient();

    const { error: msgError } = await client
        .from('messages')
        .update({ text })
        .eq('id', message_id);

    if(msgError) {
        newState.errors.push(msgError.message);
        return newState;
    }
    else {
        newState.success = true;
    }

    return newState;
}