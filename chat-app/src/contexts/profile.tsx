"use client";

import { UserProfile } from "@/types/authTypes";
import createClient from "@/utils/supabase/client";
import { RealtimeChannel } from "@supabase/supabase-js";
import { createContext, useContext, useEffect, useState } from "react";
import { PopupContext, TPopupContext } from "./popup";

export type TProfileContext = {
    profile: UserProfile|undefined
}

export const ProfileContext = createContext<TProfileContext|null>(null)

const ProfileProvider = ({ children } : { 
    children: React.ReactNode
}) => {
    const { showPopup } = useContext(PopupContext) as TPopupContext;

    const [profile, setProfile] = useState<UserProfile>();

    useEffect(() => {
        const client = createClient();
        
        const getProfile = async (userId: string) => {
            const { error: profileError, data: profileData } = await client
            .from('profiles')
            .select('*')
            .eq('user_id', userId);

            if(profileError) {
                showPopup({ type: 'error', title: 'Error', timeout: 5000, children: 'Error getting profile info.'});
            }
            else if(profileData) setProfile(profileData[0]);
        }

        let profileChannel: RealtimeChannel | null = null;

        const subscribeToProfile = async (userId: string) => {
            profileChannel = await client.channel('profile-channel');
            profileChannel.on('postgres_changes', { 
                event: 'UPDATE',
                schema: 'public',
                table: 'profiles',
                filter: `user_id=eq.${userId}`
            }, (payload) => {
                setProfile(payload.new as UserProfile);
            })
            .subscribe();
        }

        const initProfile = async () => {
            const { data: userData, error: userError } = await client.auth.getUser();

            if(userError) 
            {
                showPopup({ type: 'error', title: 'Error', timeout: 5000, children: 'Error getting user info.'});
            }
            else if(userData.user) {
                getProfile(userData.user.id);
                subscribeToProfile(userData.user.id);
            }
        }

        initProfile();

        const { data: { subscription: authChannel } } = client.auth.onAuthStateChange((event, session) => {
            if(!session) {
                profileChannel?.unsubscribe();
                setProfile(undefined);
            }
            else {
                getProfile(session.user.id);
                subscribeToProfile(session.user.id);
            }
        });

        return () => {
            if(profileChannel) profileChannel.unsubscribe();
            if(authChannel) authChannel.unsubscribe();
        }
    }, [])

    return (
        <ProfileContext.Provider value={{ profile }}>
            {children}
        </ProfileContext.Provider>
    );
}

export default ProfileProvider;