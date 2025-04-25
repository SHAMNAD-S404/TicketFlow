import { INotification } from "../../models/interface/INotification";
import { IBaseRepo } from "./IBaseRepo";

export interface INotificationRepo extends IBaseRepo<INotification>{

   findNotifications (searchQuery:Record<string,string>,limit:number) : Promise<INotification[]>
   
}