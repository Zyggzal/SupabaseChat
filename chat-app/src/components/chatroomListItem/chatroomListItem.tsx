import { Chatroom } from "@/types/chat";
import Link from "next/link";

export default function ChatroomListItem({ chatroom } : { chatroom: Chatroom }) {
    return chatroom && <Link
        href={`/chat/${chatroom.id}`}
        className="bg-gray-300 p-5 border-b-2 border-orange-400 hover:bg-gray-400 hover:border-b-5">
            <h1 className="capitalize text-orange-400 font-bold text-2xl mb-5">{chatroom.name}</h1>
            <p className="text-gray-500">{chatroom.created_at.toLocaleString()}</p>
    </Link>
}