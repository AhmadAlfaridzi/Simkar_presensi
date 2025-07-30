'use client'
import {
  ColumnDef,
  flexRender,
  getCoreRowModel,
  useReactTable,
  getPaginationRowModel,
} from '@tanstack/react-table'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { Skeleton } from '@/components/ui/skeleton'
import { Button } from '@/components/ui/button'

interface DataTableProps<TData> {
  columns: ColumnDef<TData>[]
  data: TData[]
  isLoading?: boolean
  noDataMessage?: string
  showPagination?: boolean
  pageSize?: number
  customHeaderClass?: string;
  customRowClass?: string;
}

export function GenericTable<TData>({
  columns,
  data,
  isLoading = false,
  noDataMessage = 'Tidak ada data yang ditemukan',
  showPagination = false,
  pageSize = 10,
}: DataTableProps<TData>) {
  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: showPagination ? getPaginationRowModel() : undefined,
    initialState: showPagination ? { pagination: { pageSize } } : undefined,
  })

  return (
    <div className="space-y-4">
      {/* Data Table  */}
      <div className="rounded-md border border-[#2e2e2e] overflow-hidden">
        <Table>
          <TableHeader className="bg-[#1e1e1e]">
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => (
                  <TableHead key={header.id} className="text-blue-300">
                    {flexRender(
                      header.column.columnDef.header,
                      header.getContext()
                    )}
                  </TableHead>
                ))}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {isLoading ? (
              Array.from({ length: 5 }).map((_, i) => (
                <TableRow key={i} className="border-[#2e2e2e] bg-[#1e1e1e]">
                  {[...Array(columns.length)].map((_, j) => (
                    <TableCell key={j}>
                      <Skeleton className="h-4 w-full bg-[#333]" />
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow
                  key={row.id}
                  className="border-[#2e2e2e] hover:bg-[#1f1f1f]"
                  data-state={row.getIsSelected() && "selected"}
                >
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id}>
                      {flexRender(cell.column.columnDef.cell, cell.getContext())}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow className="border-[#2e2e2e] bg-[#1e1e1e]">
                <TableCell colSpan={columns.length} className="text-center py-8 text-gray-400">
                  {noDataMessage}
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      {showPagination && (
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mt-4 px-2">
        <div className="text-sm text-gray-400">
          Showing <span className="text-blue-300">{table.getRowModel().rows.length}</span> of{' '}
          <span className="text-blue-300">{data.length}</span> items
        </div>
        
        <div className="flex items-center gap-1">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => table.setPageIndex(0)}
            disabled={!table.getCanPreviousPage()}
            className="text-blue-300 hover:bg-[#252525]"
          >
            «
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => table.previousPage()}
            disabled={!table.getCanPreviousPage()}
            className="text-blue-300 hover:bg-[#252525]"
          >
            ‹
          </Button>
          <span className="px-2 text-sm text-gray-400">
            Page {table.getState().pagination.pageIndex + 1} of {table.getPageCount()}
          </span>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => table.nextPage()}
            disabled={!table.getCanNextPage()}
            className="text-blue-300 hover:bg-[#252525]"
          >
            ›
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => table.setPageIndex(table.getPageCount() - 1)}
            disabled={!table.getCanNextPage()}
            className="text-blue-300 hover:bg-[#252525]"
          >
            »
          </Button>
        </div>
      </div>
    )}
    </div>
  )
}