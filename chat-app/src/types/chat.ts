import { UserProfile } from "./authTypes"

export type Chatroom = {
    id: number,
    role: 'creator'|'member'|'admin',
    name: string,
    picture: string|undefined,
    created_at: Date
} 

export type ProfileChatroom = {
    profile_id: number,
    chatroom_id: number,
    role: 'creator'|'member'|'admin',
}

export type ChatroomMember = ProfileChatroom & {
    profile: UserProfile,
}