import { Chatroom } from "@/types/chat";

export function chatroomFromData(data: any) {
    if(!data) return;
    let newChatroom: Chatroom = data.chatrooms;
    newChatroom.role = data.role;
    return newChatroom;
}