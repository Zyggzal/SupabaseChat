"use client";

import { useContext } from "react";
import ProfileName from "./profileName";
import ProfilePassword from "./profilePassword";
import ProfilePicture from "./profilePicture";
import { ProfileContext, TProfileContext } from "@/contexts/profile";

export default function ProfileDetails() {
    const { profile } = useContext(ProfileContext) as TProfileContext;

    return profile &&
    <div className="bg-gray-300 p-20 pt-15 pb-30 flex flex-col items-center h-max w-150 gap-y-5">
        <h1 className="text-5xl font-bold mb-10">User profile</h1>
        <ProfilePicture src={profile.image_url} className="w-40 h-40"/>
        <div className="w-full">
            <p className="text-gray-500 mb-3">Name</p>
            <ProfileName name={profile.name}/>
            <hr className="border-orange-300 border-2 mt-3"/>
        </div>
        <div className="w-full">
            <p className="text-gray-500 mb-3">Password</p>
            <ProfilePassword/>
            <hr className="border-orange-300 border-2 mt-3"/>
        </div>
    </div>
}