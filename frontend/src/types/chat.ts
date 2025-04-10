export interface User {
    id: string;
    name: string;
    avatar: string;
    lastSeen?: string;
  }
  
  export interface Message {
    id: string;
    senderId: string;
    content: string;
    timestamp: string;
  }
  
  export interface Chat {
    id: string;
    user: User;
    lastMessage: string;
    timestamp: string;

  }