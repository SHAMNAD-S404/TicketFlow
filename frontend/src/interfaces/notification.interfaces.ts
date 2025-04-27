export interface INotification {
    _id : string;
    recipient : string;
    type : string;
    title : string;
    message : string;
    relatedId ? : string;
    read : boolean;
    createdAt : Date;
}

export interface NotificatonState {
    notifications : INotification[];
    unreadCount : number;
    isOpen : boolean;
}