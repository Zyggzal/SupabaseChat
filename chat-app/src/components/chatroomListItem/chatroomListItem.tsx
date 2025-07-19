import { Chatroom } from "@/types/chat";
import Link from "next/link";
import RoundedImage from "../roundedImage/roundedImage";

export default function ChatroomListItem({ chatroom } : { chatroom: Chatroom }) {
    return chatroom && <Link
        href={`/chat/${chatroom.id}`}
        className="bg-gray-300 p-5 border-b-2 border-orange-400 hover:bg-gray-400 hover:border-b-5 flex items-center">
            <RoundedImage
                className="w-25 h-25"
                src={chatroom.picture || '/images/chat-no-pic.jpg'}
                alt="chatroom picture"
                />
            <div className="pl-8">
                <h1 className="capitalize text-orange-400 font-bold text-2xl mb-3">{chatroom.name}</h1>
                <p className="text-gray-500">{chatroom.created_at.toLocaleString()}</p>
            </div>
    </Link>
}