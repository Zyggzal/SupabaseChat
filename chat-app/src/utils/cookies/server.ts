import { SupabaseClient } from "@supabase/supabase-js";
import { cookies } from 'next/headers'

export async function setProfileCookies(userId: string, client: SupabaseClient) {
    const { data, error } = await client.from('profiles').select('id').eq('user_id', userId).single();

    if(!error) {
        const cookieStore = await cookies();
        cookieStore.set('profileId', data.id);
    }
}

export async function getProfileCookies() : Promise<number | undefined> {
    const cookieStore = await cookies();

    const profileString = cookieStore.get('profileId')?.value;

    if(profileString) {
        return Number.parseInt(profileString);
    }
}

export async function clearProfileCookies() {
    const cookieStore = await cookies();

    cookieStore.delete('profileId');
}