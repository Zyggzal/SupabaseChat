import { PencilIcon } from "@/components/icons/icons";
import { ChatroomMessagesContext, TChatroomMessagesContext } from "@/contexts/chatroomMessages";
import { Message } from "@/types/chat";
import { useContext } from "react";

export default function EditUserMessageButton({ message, onClick } : { 
        message: Message ,
        onClick: () => void
    }) {
    const { setMessageToEdit } = useContext(ChatroomMessagesContext) as TChatroomMessagesContext;

    return <button 
        className="rounded-full hover:text-orange-500"
        onClick={() => {
            setMessageToEdit(message);
            onClick();
        }}><PencilIcon size={20}/></button>
}