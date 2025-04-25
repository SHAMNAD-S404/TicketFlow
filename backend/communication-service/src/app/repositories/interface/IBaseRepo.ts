import { INotification } from "../../models/interface/INotification";

export interface IBaseRepo <T> {
    create(data: Partial<T>) : Promise<T>;
    getDocumentCount (searchQuery : Record<string,any>) : Promise<number>
    updateOneDocument (searchQuery : Record<string,any>,updateQuery:Record<string,any>) : Promise<T | null>
    updateAllDocument (searchQuery : Record<string,any>,updateQuery:Record<string,any>) : Promise<void>
}