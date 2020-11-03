import { MessageI } from './MessageI';

export interface ChatI{
    email: string
    title: string
    icon: string
    msgPreview: string
    isRead: boolean
    lastMsg: string
    msgs: Array<MessageI>
}