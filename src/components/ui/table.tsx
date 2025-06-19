import * as React from "react";

const Table = React.forwardRef<
  HTMLTableElement,
  React.HTMLAttributes<HTMLTableElement>
>(({ className, style, ...props }, ref) => (
  <table
    ref={ref}
    style={style}
    className={`w-full table-fixed border-collapse border border-gray-300 ${className}`}
    {...props}
  />
));
Table.displayName = "Table";

const TableHeader = React.forwardRef<
  HTMLTableSectionElement,
  React.HTMLAttributes<HTMLTableSectionElement>
>(({ className, style, ...props }, ref) => (
  <thead
    ref={ref}
    style={style}
    className={`flex sticky top-0 bg-white border-b border-gray-200 shadow-sm z-10 ${className}`}
    {...props}
  />
));
TableHeader.displayName = "TableHeader";

const TableRow = React.forwardRef<
  HTMLTableRowElement,
  React.HTMLAttributes<HTMLTableRowElement>
>(({ className, style, ...props }, ref) => (
  <tr
    ref={ref}
    style={style}
    className={`border-b border-gray-200 w-full flex ${className}`}
    {...props}
  />
));
TableRow.displayName = "TableRow";

const TableHeadCell = React.forwardRef<
  HTMLTableCellElement,
  React.ThHTMLAttributes<HTMLTableCellElement>
>(({ className, style, ...props }, ref) => (
  <th
    ref={ref}
    style={style}
    className={`text-lg text-left p-3 font-semibold select-none ${className} bg-yellow-400`}
    {...props}
  />
));
TableHeadCell.displayName = "TableHeadCell";

const TableBody = React.forwardRef<
  HTMLTableSectionElement,
  React.HTMLAttributes<HTMLTableSectionElement>
>(({ className, style, ...props }, ref) => (
  <tbody
    ref={ref}
    style={style}
    className={`relative block ${className}`}
    {...props}
  />
));
TableBody.displayName = "TableBody";

const TableCell = React.forwardRef<
  HTMLTableCellElement,
  React.TdHTMLAttributes<HTMLTableCellElement>
>(({ className, style, ...props }, ref) => (
  <td
    ref={ref}
    style={style}
    className={`py-1 px-3 overflow-hidden overflow-ellipsis line-clamp-3 ${className}`}
    {...props}
  />
));
TableCell.displayName = "TableCell";

export { Table, TableHeader, TableRow, TableHeadCell, TableBody, TableCell };