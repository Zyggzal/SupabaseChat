import { Chatroom, Message } from "@/types/chat";

export function chatroomFromData(data: any) {
    if(!data) return;
    let newChatroom: Chatroom = data.chatrooms;
    newChatroom.role = data.role;
    return newChatroom;
}

export function chatroomFromResponse(data: any) {
    if(!data) return;

    let { messages, ...chatroom } : { messages: Message[] } & Chatroom = data.chatrooms; 

    chatroom.role = data.role;
    return { messages, chatroom: chatroom };
}