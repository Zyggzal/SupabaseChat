"use client";

import { useContext } from "react";
import Modal from "../modal/modal";
import { ChatroomContext, TChatroomContext } from "@/contexts/chatroom";

export default function ChatroomSettings({
    isOpen,
    handleClose
} : {
    isOpen: boolean,
    handleClose: () => void
}) {
    const { chatroom } = useContext(ChatroomContext) as TChatroomContext;
    
    return <Modal isOpen={isOpen} id="chatroom settings window">
        <div 
            className="w-screen h-screen top-0 fixed backdrop-brightness-40 z-30"
            onClick={handleClose}>
            <div className="w-150 bg-gray-400 fixed bottom-0 right-0 h-full pt-5 flex flex-col items-center z-35">
                <h1 className="text-orange-400 font-bold">Chatroom info</h1>
            </div>
        </div>
    </Modal>
}