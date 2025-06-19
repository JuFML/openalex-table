// src/hooks/useVirtualTable.ts
import { useRef, useEffect, useState } from "react";
import { useReactTable, getCoreRowModel, getSortedRowModel, createColumnHelper } from "@tanstack/react-table";
import { useVirtualizer } from "@tanstack/react-virtual";
import { usePublications } from "./usePublications";
import type { Publication, SortingState } from "../types";

const columnHelper = createColumnHelper<Publication>()

const columns = [
  columnHelper.accessor("title", {
    header: "Título",
    size: 500,
    cell: info => info.getValue(),
    enableSorting: false,
  }),
  columnHelper.accessor("publication_year", {
    header: "Año",
    cell: info => info.getValue(),
    enableSorting: false,
  }),
  columnHelper.accessor("cited_by_count", {
    header: "Citaciones",
    size: 160,
    cell: info => info.getValue(),
    enableSorting: true,
  }),
  columnHelper.accessor("author_name", {
    header: "Autores",
    size: 250,
    cell: info => info.getValue(),
    enableSorting: false,
  }),
];

export function useVirtualTable() {
  const [sorting, setSorting] = useState<SortingState[]>([{ id: "cited_by_count", desc: true }])
  const { publications, getPublications } = usePublications();

  const table = useReactTable({
    data: publications,
    columns,
    state: { sorting },
    onSortingChange: setSorting,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    enableSortingRemoval: false,
  });

  const appRef = useRef<HTMLDivElement>(null);

  const rowVirtualizer = useVirtualizer({
    count: table.getRowModel().rows.length,
    getScrollElement: () => appRef.current,
    estimateSize: () => 90,
    overscan: 10,
  });

  const virtualRows = rowVirtualizer.getVirtualItems();
  const totalSize = rowVirtualizer.getTotalSize();

  useEffect(() => {
    getPublications();
  }, []);

  useEffect(() => {
    const lastItem = virtualRows[virtualRows.length - 1];
    const totalItems = table.getRowModel().rows.length;
    if (lastItem?.index >= totalItems - 1) {
      getPublications();
    }
  }, [virtualRows]);

  return { table, appRef, virtualRows, totalSize };
}
