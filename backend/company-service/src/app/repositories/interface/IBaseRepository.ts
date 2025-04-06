export interface IBaseRepository<T> {
    create(data: Partial<T>) : Promise<T>;
    findAll() : Promise<T[]| null>;
    findOneDocument(searchQuery:Record<string,string>) : Promise<T|null>
    findOneWithEmail(email:string) : Promise<T | null>;
    findOneByUUID(authUserUUID:string) : Promise<T | null>
    isUserExistByEmail(email : string) : Promise<T | null>
    updatByEmail(email:string,updateData:Partial<T>) : Promise<T | null>
    updateUserStatus(email:string,blockStatus:boolean) : Promise<T | null>
    updateOneDocument(searchQuery:Record<string,string>,updateData:Record<string,string>) : Promise<T|null>
   

}