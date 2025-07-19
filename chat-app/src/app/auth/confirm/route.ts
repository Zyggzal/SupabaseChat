import createClient from "@/utils/supabase/server";
import { NextRequest, NextResponse } from "next/server";
import { EmailOtpType } from "@supabase/supabase-js";
import { setProfileCookies } from "@/utils/cookies/server";

export async function GET(req: NextRequest) {
    const { searchParams } = new URL(req.url);
    const token_hash = searchParams.get('token_hash');
    const type = searchParams.get('type') as EmailOtpType;
    const next = '/account';

    const redirectTo = req.nextUrl.clone();
    redirectTo.pathname = next;
    redirectTo.searchParams.delete('token_hash');
    redirectTo.searchParams.delete('type');

    if (token_hash && type) {
        const supabase = await createClient();
        const { data, error } = await supabase.auth.verifyOtp({
            type,
            token_hash,
        })
        if (!error) {
            if(data.user) {
                await setProfileCookies(data.user.id, supabase);
            }
            redirectTo.searchParams.delete('next');
            return NextResponse.redirect(redirectTo);
        }
    }

    redirectTo.pathname = '/error'
    return NextResponse.redirect(redirectTo)
}