export type Chatroom = {
    id: number,
    role: 'creator'|'member'|'admin',
    name: string,
    created_at: Date
} 

export type ProfileChatroom = {
    profile_id: number,
    chatroom_id: number,
    role: 'creator'|'member'|'admin',
}