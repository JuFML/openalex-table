import { useEffect, useRef, useState } from "react"
import { api } from "./services/api"
import type { Publication, Authorship, ApiResponse, RawPublication, SortingState } from "./types";
import { useReactTable, getCoreRowModel, flexRender, createColumnHelper, getSortedRowModel } from '@tanstack/react-table';
import { useVirtualizer } from "@tanstack/react-virtual"
import { Table, TableBody, TableCell, TableHeadCell, TableRow, TableHeader } from "./components/ui/table";
import { IoIosArrowDown, IoIosArrowUp } from "react-icons/io"


function App() {
  const [publications, setPublications] = useState<Publication[]>([])
  const [cursor, setCursor] = useState("*")
  const [sorting, setSorting] = useState<SortingState[]>([{ id: "cited_by_count", desc: true }])

  const getAuthorNames = (authorships: Authorship[] = []): string => {
    const names = authorships
      .slice(0, 2)
      .map((item) => item?.author?.display_name)
    return names.join(", ");
  };

  const columnHelper = createColumnHelper<Publication>()

  const getPublications = async () => {
    try {
      const res = await api.get<ApiResponse>("", {
        params: {
          "per-page": 20,
          cursor: cursor,
        }
      });

      const publication: Publication[] = res.data.results.map((item: RawPublication) => ({
        title: item.title,
        publication_year: item.publication_year,
        cited_by_count: item.cited_by_count,
        author_name: getAuthorNames(item.authorships),
      }));

      setPublications((prev) => [...prev, ...publication]);
      setCursor(res.data.meta.next_cursor)
    } catch (error) {
      console.error("Error fetching publications:", error);
    }
  };

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

  const table = useReactTable({
    data: publications,
    columns,
    state: {
      sorting,
    },
    enableSortingRemoval: false,
    onSortingChange: setSorting,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
  })

  const appRef = useRef<HTMLDivElement>(null)

  const rowVirtualizer = useVirtualizer({
    count: table.getRowModel().rows.length,
    getScrollElement: () => appRef.current,
    estimateSize: () => 90,
    overscan: 10,
  })

  const virtualRows = rowVirtualizer.getVirtualItems()
  const totalSize = rowVirtualizer.getTotalSize()

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

  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-4 bg-gray-50">
      <h1 className="text-4xl font-bold mb-7">Publicaciones Académicas</h1>
      <div
        ref={appRef}
        className="w-full max-w-5xl h-[500px] overflow-auto border border-gray-300 rounded-md bg-white shadow-sm"
      >
        <Table style={{ tableLayout: "fixed" }}>
          <TableHeader>
            {table.getHeaderGroups().map(headerGroup => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map(header => (
                  <TableHeadCell
                    key={header.id}
                    onClick={header.column.getToggleSortingHandler()}
                    style={{
                      width: header.column.columnDef.size, display: 'flex', alignItems: 'center', gap: 2
                    }}
                    className={header.column.getCanSort() ? "cursor-pointer" : ""}
                  >
                    {flexRender(header.column.columnDef.header, header.getContext())}
                    {{
                      asc: <IoIosArrowDown />,
                      desc: <IoIosArrowUp />,
                    }[header.column.getIsSorted() as string]}
                  </TableHeadCell>
                ))}
              </TableRow>
            ))}
          </TableHeader>

          <TableBody style={{ height: `${totalSize}px` }}>
            {virtualRows.map(virtualRow => {
              const row = table.getRowModel().rows[virtualRow.index];
              return (
                <TableRow
                  key={row.id}
                  style={{
                    position: "absolute",
                    transform: `translateY(${virtualRow.start}px)`,
                    height: `80px`,
                    width: "100%",
                  }}
                >
                  {row.getVisibleCells().map(cell => (
                    <TableCell
                      key={cell.id}
                      style={{ width: cell.column.columnDef.size }}
                    >
                      {flexRender(cell.column.columnDef.cell, cell.getContext())}
                    </TableCell>
                  ))}
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </div>
    </div >
  )
}

export default App
