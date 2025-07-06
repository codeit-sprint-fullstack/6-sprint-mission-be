export interface GetListQuery {
  page?: string;
  pageSize?: string;
  orderBy?: "recent" | "like";
  keyword?: string;
}
