import { PaginationProps } from '../components/Pagination';

const BOUNDARY_COUNT = 1;

export function getPaginationItems({
  totalPages,
  page,
  siblings,
}: Required<Pick<PaginationProps, 'totalPages' | 'page' | 'siblings'>>) {
  const startPages = range(1, Math.min(BOUNDARY_COUNT, totalPages));
  const endPages = range(Math.max(totalPages - BOUNDARY_COUNT + 1, BOUNDARY_COUNT + 1), totalPages);

  const siblingsStart = Math.max(
    Math.min(page - siblings, totalPages - BOUNDARY_COUNT - siblings * 2 - 1),
    BOUNDARY_COUNT + 2,
  );
  const siblingsEnd = Math.min(
    Math.max(page + siblings, BOUNDARY_COUNT + siblings * 2 + 2),
    endPages.length > 0 ? endPages[0]! - 2 : totalPages - 1,
  );

  return [
    ...startPages,
    ...(siblingsStart > BOUNDARY_COUNT + 2
      ? (['ellipsis'] as const)
      : BOUNDARY_COUNT + 1 < totalPages - BOUNDARY_COUNT
        ? [BOUNDARY_COUNT + 1]
        : []),
    ...range(siblingsStart, siblingsEnd),
    ...(siblingsEnd < totalPages - BOUNDARY_COUNT - 1
      ? (['ellipsis'] as const)
      : totalPages - BOUNDARY_COUNT > BOUNDARY_COUNT
        ? [totalPages - BOUNDARY_COUNT]
        : []),
    ...endPages,
  ];
}

function range(start: number, end: number): number[] {
  return Array.from({ length: Math.max(Math.ceil(end - start) + 1, 0) }).map((_, i) => start + i);
}
