"use client";

import {
  type ColumnDef,
  type Row,
  flexRender,
  getCoreRowModel,
  useReactTable,
} from "@tanstack/react-table";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { cn } from "@/lib/utils";

interface DataTableProps<TData> {
  columns: ColumnDef<TData, unknown>[];
  data: TData[];
  onRowClick?: (row: Row<TData>) => void;
  className?: string;
  mobileCard?: (row: Row<TData>) => React.ReactNode;
}

export function DataTable<TData>({
  columns,
  data,
  onRowClick,
  className,
  mobileCard,
}: DataTableProps<TData>) {
  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
  });

  return (
    <div className={cn("space-y-4", className)}>
      <div className="hidden md:block rounded-lg border">
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
            {table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow
                  key={row.id}
                  data-state={row.getIsSelected() && "selected"}
                  className={onRowClick ? "cursor-pointer hover:bg-muted/50" : ""}
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
                <TableCell colSpan={columns.length} className="h-24 text-center">
                  No results.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
      <div className="md:hidden space-y-3">
        {table.getRowModel().rows?.length ? (
          table.getRowModel().rows.map((row) =>
            mobileCard ? (
              <div key={row.id} onClick={() => onRowClick?.(row)}>
                {mobileCard(row)}
              </div>
            ) : (
              <Card key={row.id} className="cursor-pointer" onClick={() => onRowClick?.(row)}>
                <CardContent className="p-4">
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
          <p className="text-center text-muted-foreground py-8">No results.</p>
        )}
      </div>
    </div>
  );
}
