import { SupabaseClient } from "@supabase/supabase-js";

export async function uploadImage(file: File, client: SupabaseClient) : Promise<{ error?: string, url?: string }> {
    const bucketPath = `${file.name}-${Date.now()}`;

    const { error } = await client.storage.from('avatars').upload(bucketPath, file);

    if(error) {
        return { error: error.message }
    }
    
    const { data } = await client.storage.from('avatars').getPublicUrl(bucketPath);

    return { url: data?.publicUrl }
}