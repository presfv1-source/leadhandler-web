"use client";

import {
  type ColumnDef,
  type Row,
  flexRender,
  getCoreRowModel,
  useReactTable,
} from "@tanstack/react-table";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { RESPONSIVE_LIST_BREAKPOINT } from "@/lib/ui";

interface ResponsiveDataListProps<TData> {
  columns: ColumnDef<TData, unknown>[];
  data: TData[];
  onRowClick?: (row: Row<TData>) => void;
  className?: string;
  /** Custom mobile card renderer. If not provided, cells are stacked in a simple card. */
  mobileCard?: (row: Row<TData>) => React.ReactNode;
  emptyMessage?: string;
}

/**
 * Table on desktop (md+), stacked cards on mobile.
 * Uses design system breakpoint; no horizontal scroll on small screens.
 */
export function ResponsiveDataList<TData>({
  columns,
  data,
  onRowClick,
  className,
  mobileCard,
  emptyMessage = "No results.",
}: ResponsiveDataListProps<TData>) {
  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
  });

  const rows = table.getRowModel().rows ?? [];
  const hasRows = rows.length > 0;

  return (
    <div className={cn("min-w-0 space-y-4", className)}>
      {/* Desktop: table (hidden on small screens to avoid horizontal scroll) */}
      <div className={cn("hidden rounded-lg border overflow-hidden", `${RESPONSIVE_LIST_BREAKPOINT}:block`)}>
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => (
                  <TableHead key={header.id}>
                    {header.isPlaceholder
                      ? null
                      : flexRender(header.column.columnDef.header, header.getContext())}
                  </TableHead>
                ))}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {hasRows ? (
              rows.map((row) => (
                <TableRow
                  key={row.id}
                  data-state={row.getIsSelected() ? "selected" : undefined}
                  className={onRowClick ? "cursor-pointer hover:bg-muted/50" : undefined}
                  onClick={() => onRowClick?.(row)}
                >
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id}>
                      {flexRender(cell.column.columnDef.cell, cell.getContext())}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={columns.length} className="h-24 text-center text-muted-foreground">
                  {emptyMessage}
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      {/* Mobile: cards */}
      <div className={cn("space-y-3", `${RESPONSIVE_LIST_BREAKPOINT}:hidden`)}>
        {hasRows ? (
          rows.map((row) =>
            mobileCard ? (
              <div
                key={row.id}
                role={onRowClick ? "button" : undefined}
                tabIndex={onRowClick ? 0 : undefined}
                onClick={() => onRowClick?.(row)}
                onKeyDown={(e) => {
                  if (onRowClick && (e.key === "Enter" || e.key === " ")) {
                    e.preventDefault();
                    onRowClick(row);
                  }
                }}
                className={onRowClick ? "cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 rounded-lg" : undefined}
              >
                {mobileCard(row)}
              </div>
            ) : (
              <Card
                key={row.id}
                className={cn(
                  "overflow-hidden",
                  onRowClick && "cursor-pointer hover:bg-muted/50 transition-colors"
                )}
                onClick={() => onRowClick?.(row)}
              >
                <CardContent className="p-4 space-y-2">
                  {row.getVisibleCells().map((cell) => (
                    <div key={cell.id} className="text-sm">
                      {flexRender(cell.column.columnDef.cell, cell.getContext())}
                    </div>
                  ))}
                </CardContent>
              </Card>
            )
          )
        ) : (
          <p className="text-center text-muted-foreground py-8 text-sm">{emptyMessage}</p>
        )}
      </div>
    </div>
  );
}
