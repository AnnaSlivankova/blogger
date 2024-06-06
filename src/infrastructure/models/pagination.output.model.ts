export class PaginationOutputModel<T> {
  public readonly pagesCount: number;
  public readonly page: number;
  public readonly pageSize: number;
  public readonly totalCount: number;
  public readonly items: T[];

  constructor(page: number, pageSize: number, totalCount: number, items: T[]) {
    this.page = page;
    this.pageSize = pageSize;
    this.totalCount = totalCount;
    this.pagesCount = Math.ceil(totalCount / pageSize);
    this.items = items;
  }
}
