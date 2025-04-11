import IChatRoom from "../../models/interface/IChatRoom";

export default interface IChatRoomRepo {
    updateWithLastMessage (ticketId : string, message : string,sender:string) : Promise<boolean>
    findAllChatRooms () : Promise <IChatRoom[] | any>;
    findOneDoc(searchQuery:Record<string,string>) : Promise<any> 
}