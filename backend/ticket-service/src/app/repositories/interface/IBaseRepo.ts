export interface IBaseRepository<T> {

  create(data: Partial<T>): Promise<T>;

  findOneWithSingleField(query: Record<string, string>): Promise<T | null>;

  deleteOneDocument(query:Record<string,string>) : Promise<boolean>

  findOneDocAndUpdate(
    searchQuery: Record<string, string>,
    updateQuery: Record<string, string | number>
  ): Promise<T | null>;

  getDocumentCount(searchQuery:Record<string,any>) : Promise<number>;

}
