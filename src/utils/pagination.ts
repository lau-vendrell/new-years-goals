export const getTotalPages = (itemsCount: number, pageSize: number) =>
  Math.max(1, Math.ceil(itemsCount / pageSize));

export const clampPage = (page: number, totalPages: number) =>
  Math.min(Math.max(page, 0), totalPages - 1);

export const slicePage = <T>(items: T[], page: number, pageSize: number) =>
  items.slice(page * pageSize, page * pageSize + pageSize);
