export interface MessageI{
    from?: any;
    id?: any;
    status?: string;
    content: string;
    time: string;
    isRead: boolean;
    owner?: string;
    isMe: boolean;
}
