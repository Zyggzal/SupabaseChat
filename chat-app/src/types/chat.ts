export type Chatroom = {
    id: number,
    role: 'creator'|'member'|'admin',
    name: string,
    created_at: Date
} 