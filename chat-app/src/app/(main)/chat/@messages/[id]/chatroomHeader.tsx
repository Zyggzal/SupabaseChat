"use client";

import ChatroomSettings from "@/components/chatroomSettings/chatroomSettings";
import { SettingsIcon } from "@/components/icons/icons";
import RoundedImage from "@/components/roundedImage/roundedImage";
import { ChatroomContext, TChatroomContext } from "@/contexts/chatroom";
import { useContext, useState } from "react";

export default function ChatroomHeader() {
    const { chatroom } = useContext(ChatroomContext) as TChatroomContext;
    const [areSettingsOpen, setAreSettingsOpen] = useState(false);

    return <div className="flex justify-between items-center bg-gray-400 shadow-sm absolute top-0 left-0 w-full height-max p-5 h-35 z-5">
        {
            chatroom && <>
                <div className="flex items-center">
                    <RoundedImage
                        src={chatroom.picture || '/images/chat-no-pic.jpg'}
                        alt="chatroom header picture"
                        className="w-25 h-25"
                        />
                    <h1 className="ml-5 text-white font-bold text-xl capitalize">{chatroom.name}</h1>
                </div>
                <button 
                    className="text-orange-400 hover:text-orange-300"
                    onClick={() => setAreSettingsOpen(true)}
                ><SettingsIcon size={30}/></button>
            </>
        }
        <ChatroomSettings 
            isOpen={areSettingsOpen} 
            handleClose={()=> setAreSettingsOpen(false)}/>
    </div>
}