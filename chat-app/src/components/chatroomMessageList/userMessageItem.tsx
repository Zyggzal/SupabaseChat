"use client";

import { Message } from "@/types/chat";
import RoundedImage from "../roundedImage/roundedImage";
import { HorisontalBarsIcon } from "../icons/icons";
import { useState } from "react";
import DeleteUserMessageButton from "./buttons/deleteUserMessageButton";
import { dateToAgo } from "@/utils/data/dates";
import EditUserMessageButton from "./buttons/editUserMessageButton";

export default function UserMessageItem({ message }: { message: Message }) {

    const [isEditModalOpen, setIsEditModalOpen] = useState(false);

    return <div className="bg-orange-400 rounded-l-xl rounded-tr-xl text-white p-5 pb-1 relative shadow-gray-600 shadow-md max-w-200 self-end hover:bg-orange-500 relative">
        {
            isEditModalOpen && <div className="absolute -top-8 right-0 bg-orange-300 w-max p-2 px-4 flex items-center gap-x-3 rounded-xl">
                <EditUserMessageButton message={message} onClick={() => setIsEditModalOpen(false)}/>
                <DeleteUserMessageButton messageId={message.id} onDelete={() => setIsEditModalOpen(false)}/>
            </div>
        }
        <div className="flex justify-between gap-x-5 items-center">
            <div className="flex gap-x-2 items-center mb-2">
                <RoundedImage className="w-10 h-10 shadow-md shadow-black" src={message.created_by.image_url} alt="message sender avatar"/>
                <h1 className="text-white font-bold text-xl">{message.created_by.name}</h1>
            </div>
            <button 
                className="rounded-full w-5 h-5 hover:text-orange-800"
                onClick={()=> setIsEditModalOpen(prev => !prev)}
                ><HorisontalBarsIcon size={20}/></button>
        </div>
        { message.text }
        <div className="flex justify-end items-center text-sm pt-2 gap-x-2">
            { message.isEdited && <p className="text-gray-100">(edited)</p>}
            <p>{dateToAgo(message.created_at)} ago</p>
        </div>
    </div>
}