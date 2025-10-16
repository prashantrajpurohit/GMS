"use client";

import {
  ColumnDef,
  flexRender,
  getCoreRowModel,
  useReactTable,
  getFilteredRowModel,
  getPaginationRowModel,
  RowSelectionState,
} from "@tanstack/react-table";
import { useState } from "react";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { IconGitBranch } from "@tabler/icons-react";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
} from "@/components/ui/pagination";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Eye, Pencil, Trash2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { useDispatch } from "react-redux";
import { addEditData } from "@/reduxstore/editIDataSlice";

interface DataTableProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[];
  data: TData[];
  heading: string;
  editButton?: boolean;
  viewButton?: boolean;
  deleteButton?: Boolean;
  editRoute?: string;
  viewRoute?: string;
  status?:boolean
  addButton?:boolean
  action?:boolean
}

export function UniversalDataTable<TData, TValue>({
  columns,
  data,
  heading,
  editButton = true,
  viewButton = true,
  deleteButton = true,
  editRoute = "",
  viewRoute = "",
  status=true,
  addButton=true,
  action=true
}: DataTableProps<TData, TValue>) {
  const router = useRouter();
  const [searchTerm, setSearchTerm] = useState("");
  const [globalFilter, setGlobalFilter] = useState("");
  const [rowSelection, setRowSelection] = useState<RowSelectionState>({});
  const dispatch = useDispatch();
  const table = useReactTable({
    data,
    columns,
    state: {
      globalFilter,
      rowSelection,
    },
    enableRowSelection: true,
    onRowSelectionChange: setRowSelection,
    onGlobalFilterChange: setGlobalFilter,
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
  });

  return (
    <>
      <div className="space-y-4">
        {/* Search + Row Info */}
        <div className="flex justify-between items-center">
          <h2 style={{ fontSize: "22px" }}>{heading}</h2>
          <div className="flex gap-5">
            <Input
              placeholder="Search..."
              value={searchTerm}
              style={{ width: "250px" }}
              onChange={(e) => {
                setSearchTerm(e.target.value);
                setGlobalFilter(e.target.value);
              }}
              className="w-1/3"
            />
            {addButton && <Button
              variant="destructive"
              onClick={() => {
                dispatch(addEditData(null)), router.push(`${editRoute}`);
              }}
            >
              Add
            </Button>}
            
          </div>

          {/* <div className="text-sm text-muted-foreground">
            {Object.keys(rowSelection).length} of{" "}
            {table.getFilteredRowModel().rows.length} row(s) selected
          </div> */}
        </div>

        {/* Table */}
        <div className="rounded-md border">
          <Table>
            <TableHeader className="bg-muted sticky top-0 z-10">
              {table.getHeaderGroups().map((headerGroup) => (
                <TableRow key={headerGroup.id}>
                  <TableHead style={{ textAlign: "center" }}>Sr. No.</TableHead>
                  {headerGroup.headers.map((header) => (
                    <TableHead key={header.id} style={{ textAlign: "center" }}>
                      {header.isPlaceholder
                        ? null
                        : flexRender(
                            header.column.columnDef.header,
                            header.getContext()
                          )}
                    </TableHead>
                  ))}
                  {status &&  <TableHead style={{ textAlign: "center" }}>Status</TableHead>}
                 
                  {action && <TableHead style={{ textAlign: "center" }}>Action</TableHead>}
                </TableRow>
              ))}
            </TableHeader>
            <TableBody>
              {table.getRowModel().rows?.length ? (
                table.getRowModel().rows.map((row, index) => (
                  <TableRow
                    key={row.id}
                    data-state={row.getIsSelected() && "selected"}
                  >
                    <TableCell style={{ textAlign: "center" }}>
                      {table.getState().pagination.pageIndex *
                        table.getState().pagination.pageSize +
                        index +
                        1}
                    </TableCell>
                    {row.getVisibleCells().map((cell) => (
                      <TableCell key={cell.id} style={{ textAlign: "center" }}>
                        {flexRender(
                          cell.column.columnDef.cell,
                          cell.getContext()
                        )}
                      </TableCell>
                    ))}
                    {status && <TableCell align="center">
                      {(row.original as any).is_active || (row.original as any).store_is_active === true ? (
                        <Badge className="bg-green-100 text-green-800 border border-green-500">
                          Active
                        </Badge>
                      ) : (
                        <Badge className="bg-red-100 text-red-800 border border-red-500">
                          Inactive
                        </Badge>
                      )}
                    </TableCell>}
                    
{action && <TableCell
                      className="flex gap-4"
                      style={{ justifyContent: "center" }}
                    >
                      {/* Edit Button */}
                      {editButton && (
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => {
                            dispatch(addEditData(row.original as any)),
                              router.push(`${editRoute}`);
                          }}
                          className="flex items-center gap-2 text-blue-600 border border-blue-500 hover:bg-blue-50 hover:text-blue-700 rounded-full shadow-sm transition-all duration-200 px-4 py-2"
                        >
                          <Pencil className="w-4 h-4" />
                          <span className="text-sm font-medium">Edit</span>
                        </Button>
                      )}

                      {/* View Button */}
                      {viewButton && (
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => {
                            router.push(`${viewRoute}`);
                          }}
                          className="flex items-center gap-2 text-green-600 border border-green-500 hover:bg-green-50 hover:text-green-700 rounded-full shadow-sm transition-all duration-200 px-4 py-2"
                        >
                          <Eye className="w-4 h-4" />
                          <span className="text-sm font-medium">View</span>
                        </Button>
                      )}

                      {/* Delete Button */}
                      {deleteButton && (
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() =>
                            confirm(
                              `Are you sure you want to delete ID: ${row.id}?`
                            )
                          }
                          className="flex items-center gap-2 text-red-600 border border-red-500 hover:bg-red-50 hover:text-red-700 rounded-full shadow-sm transition-all duration-200 px-4 py-2"
                        >
                          <Trash2 className="w-4 h-4" />
                          <span className="text-sm font-medium">Delete</span>
                        </Button>
                      )}
                    </TableCell>}
                    
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell
                    colSpan={columns.length + 1}
                    className="text-center"
                  >
                    No results.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>

        {/* Pagination + Rows per page */}
      </div>

      <div
        style={{
          marginTop: "20px",
          display: "flex",
          justifyContent: "space-between",
        }}
      >
        <div
          className="flex items-end gap-4"
          style={{ alignItems: "center", width: "100%" }}
        >
          <Label htmlFor="rows-per-page">Rows per page:</Label>
          <Select
            value={table.getState().pagination.pageSize.toString()}
            onValueChange={(value) => {
              table.setPageSize(Number(value));
            }}
          >
            <SelectTrigger className="w-[80px]">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {[5, 10, 20, 30, 50].map((pageSize) => (
                <SelectItem key={pageSize} value={pageSize.toString()}>
                  {pageSize}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <Pagination style={{ justifyContent: "end" }}>
          <PaginationContent>
            <PaginationItem>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => table.previousPage()}
                disabled={!table.getCanPreviousPage()}
              >
                Previous
              </Button>
            </PaginationItem>
            <PaginationItem>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => table.nextPage()}
                disabled={!table.getCanNextPage()}
              >
                Next
              </Button>
            </PaginationItem>
          </PaginationContent>
        </Pagination>
      </div>
    </>
  );
}
