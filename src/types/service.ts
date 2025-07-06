export interface GetListInput {
  page: number;
  pageSize: number;
  orderBy: "recent" | "like";
  keyword?: string | null;
}
