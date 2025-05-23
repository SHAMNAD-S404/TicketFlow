import { INotification } from "../../models/interface/INotification";
import { IBaseRepo } from "./IBaseRepo";

//========================= INTERFACE FOR NOTIFICATION  REPO =======================================================

export interface INotificationRepo extends IBaseRepo<INotification>{

   findNotifications (searchQuery:Record<string,any>,limit:number) : Promise<INotification[]>
   
}