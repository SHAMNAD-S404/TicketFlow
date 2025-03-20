export interface IBaseRepository<T> {

  create(data: Partial<T>): Promise<T>;

  findOneWithSingleField(query: Record<string, string>): Promise<T | null>;

  findOneDocAndUpdate(
    searchQuery: Record<string, string>,
    updateQuery: Record<string, string | number>
  ): Promise<T | null>;

}
