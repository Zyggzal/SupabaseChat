import { Message } from "@/types/chat";
import RoundedImage from "../roundedImage/roundedImage";
import UserMessageItem from "./userMessageItem";
import { dateToAgo } from "@/utils/data/dates";

export default function ChatroomMessageListItem({ message, isSelf } : 
    { 
        message: Message,
        isSelf: boolean 
    }) {
    
    if(isSelf) {
        return <UserMessageItem message={message}/>
    }
    else {
        return <div className="bg-gray-300 rounded-r-xl rounded-tl-xl text-white p-5 pb-2 relative shadow-gray-600 shadow-md max-w-200 self-start hover:bg-gray-400">
            <div className="flex gap-x-2 items-center mb-2">
                <RoundedImage className="w-10 h-10 shadow-xl" src={message.created_by.image_url} alt="message sender avatar"/>
                <h1 className="text-orange-400 font-bold text-xl">{message.created_by.name}</h1>
            </div>
            { message.text }
            <div className="flex justify-end items-center text-sm pt-2 gap-x-2">
                { message.isEdited && <p className="text-gray-100">(edited)</p>}
                <p>{dateToAgo(message.created_at)} ago</p>
            </div>
        </div>
    }
}