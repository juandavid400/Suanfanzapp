import { MessageI } from './MessageI';

export interface ChatI{
    owner?: string
    integrants?: string[]
    email?: string
    number?: any
    title: string
    status?: string
    icon?: string
    msgPreview: string
    isRead: boolean
    lastMsg: string
    msgs: Array<MessageI>
}