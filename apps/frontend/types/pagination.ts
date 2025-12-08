export type Pagination<T extends object> = {
  items: T[];
  pagination: {
    currentPage: number;
    limit: number;
    totalItems: number;
    totalPages: number;
  };
};
