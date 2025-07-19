"use client";

import { useContext } from "react";
import Modal from "../modal/modal";
import { ChatroomContext, TChatroomContext } from "@/contexts/chatroom";
import ChatroomPicture from "./chatroomPicture";
import ChatroomName from "./chatroomName";
import ChatroomDeleteButton from "./buttons/chatroomDeleteButton";
import RoundedImage from "../roundedImage/roundedImage";
import ChatroomMembersList from "./chatroomMembersList/chatroomMembersList";
import ChatroomQuitButton from "./buttons/chatroomQuitButton";

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
            <div onClick={(e) => e.stopPropagation()} className="w-150 bg-gray-400 fixed bottom-0 right-0 h-full pt-5 px-10 flex flex-col items-center z-35">
                <h1 className="text-orange-400 font-bold mb-4">Chatroom info</h1>
                {
                    chatroom?.role === 'creator' ?
                    <>
                        <ChatroomPicture
                            chatroom={chatroom}
                            className="w-35 h-35"
                            />
                        <ChatroomName chatroom={chatroom}/>
                        <ChatroomDeleteButton chatroom={chatroom}/>
                    </>
                    :
                    <>
                        <RoundedImage
                            src={chatroom?.picture || '/images/chat-no-pic.jpg'}
                            alt="chatroom picture"
                            className="w-35 h-35"
                            />
                        <h1 className="text-white text-2xl capitalize py-4">{chatroom?.name}</h1>
                        <ChatroomQuitButton chatroom={chatroom}/>
                    </>
                }
                <ChatroomMembersList chatroom={chatroom}/>
                {chatroom?.role}
            </div>
        </div>
    </Modal>
}