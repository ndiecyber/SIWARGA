export interface PaginatedInput<TSelect = unknown> {
  page: number;
  pageSize: number;
  filters?: Record<string, unknown>;
  sort?: { field: string; dir: "asc" | "desc" };
  select?: TSelect;
}

export interface PaginatedResult<T> {
  data: T[];
  totalCount: number;
  page: number;
  pageSize: number;
  totalPages: number;
}

export function buildPaginationArgs(input: PaginatedInput) {
  const page = Math.max(1, input.page);
  const pageSize = Math.min(Math.max(1, input.pageSize), 100);
  const skip = (page - 1) * pageSize;

  return {
    skip,
    take: pageSize,
    orderBy: input.sort
      ? { [input.sort.field]: input.sort.dir }
      : undefined,
    where: input.filters ?? undefined,
  };
}

export function toPaginatedResult<T>(
  data: T[],
  totalCount: number,
  input: PaginatedInput,
): PaginatedResult<T> {
  return {
    data,
    totalCount,
    page: input.page,
    pageSize: input.pageSize,
    totalPages: Math.ceil(totalCount / input.pageSize),
  };
}
