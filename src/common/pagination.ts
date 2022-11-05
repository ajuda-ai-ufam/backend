import { QueryPaginationDto } from './dto/query-pagination.dto';
import { IResponsePaginate } from './interfaces/pagination';

export const pagination = (
  data: any[],
  query: QueryPaginationDto,
): IResponsePaginate => {
  const page = +query.page || 1;
  const quantity = +query.quantity || 10;
  const total = data.length;
  const total_pages = Math.ceil(total / (quantity ? quantity : total));
  const response = data.slice(
    (page ? page - 1 : 0) * (quantity ? quantity : total),
    (page ? page : 1) * (quantity ? quantity : total),
  );
  return {
    meta: {
      current_page: page ? page : 1,
      items_per_page: quantity ? quantity : total,
      total_pages,
      total_items: total,
    },
    data: response,
  };
};
