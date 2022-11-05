export interface IPaginationMeta {
  current_page: number;
  items_per_page: number;
  total_pages: number;
  total_items: number;
}

export interface IPaginationLinks {
  first: string;
  previous: string;
  next: string;
  last: string;
}

export interface IResponsePaginate {
  meta: IPaginationMeta;
  data: any[];
}
