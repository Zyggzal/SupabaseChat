import { UserProfile } from "./authTypes"

export type Message = {
    id: number,
    text: string,
    created_by: UserProfile,
    created_at: Date,
    isEdited: boolean
}

export type Chatroom = {
    id: number,
    role: 'creator'|'member'|'admin',
    name: string,
    picture: string|undefined,
    created_at: Date,
} 

export type ProfileChatroom = {
    profile_id: number,
    chatroom_id: number,
    role: 'creator'|'member'|'admin',
}

export type ChatroomMember = ProfileChatroom & {
    profile: UserProfile,
}