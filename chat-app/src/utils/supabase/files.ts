import { SupabaseClient } from "@supabase/supabase-js";

export async function uploadImage(where: string, file: File, client: SupabaseClient) : Promise<{ error?: string, url?: string }> {
    const bucketPath = `${file.name}-${Date.now()}`;

    const { error } = await client.storage.from(where).upload(bucketPath, file);

    if(error) {
        return { error: error.message }
    }
    
    const { data } = await client.storage.from(where).getPublicUrl(bucketPath);

    return { url: data?.publicUrl }
}