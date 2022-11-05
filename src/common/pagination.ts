export interface ResponsePagination {
  page: number;
  limit: number;
  total_pages: number;
  data: any[];
}

export const pagination = (
  data: any[],
  query: {
    quantity: number;
    page: number;
  },
): ResponsePagination => {
  const { page, quantity } = query;
  const total = data.length;
  const total_pages = Math.ceil(total / (quantity ? +quantity : total));
  const response = data.slice(
    (page ? +page : 1 - 1) * (quantity ? +quantity : total),
    (page ? +page : 1) * (quantity ? +quantity : total),
  );
  return {
    page: page ? +page : 1,
    limit: quantity ? +quantity : total,
    total_pages,
    data: response,
  };
};
