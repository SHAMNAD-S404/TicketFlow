import IChatRoom from "../../models/interface/IChatRoom";

//========================= INTERFACE FOR CHAT ROOM REPOSITORY =======================================================

export default interface IChatRoomRepo {
    
    updateWithLastMessage ( ticketId : string, message : string,sender:string,user1?:string,user2?:string) : Promise<boolean>
    findAllChatRooms      ( participantId: string) : Promise <IChatRoom[] | any>;
    findOneDoc            ( searchQuery:Record<string,string>) : Promise<any> 
}