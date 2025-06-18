import { useEffect, useRef, useState } from "react"
import { api } from "./services/api"
import type { Publication, Authorship, ApiResponse, RawPublication } from "./types";
import { useReactTable, getCoreRowModel, flexRender, createColumnHelper } from '@tanstack/react-table';
import { useVirtualizer } from "@tanstack/react-virtual"



function App() {
  const [publications, setPublications] = useState<Publication[]>([])
  const [cursor, setCursor] = useState("*")

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
          sort: "cited_by_count:desc"
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
      cell: info => info.getValue(),
    }),
    columnHelper.accessor("publication_year", {
      header: "Año",
      cell: info => info.getValue(),
    }),
    columnHelper.accessor("cited_by_count", {
      header: "Citaciones",
      cell: info => info.getValue(),
    }),
    columnHelper.accessor("author_name", {
      header: "Autores",
      cell: info => info.getValue(),
    }),
  ];

  const table = useReactTable({
    data: publications,
    columns,
    getCoreRowModel: getCoreRowModel(),
  })

  const appRef = useRef<HTMLDivElement>(null)

  const rowVirtualizer = useVirtualizer({
    count: table.getRowModel().rows.length,
    getScrollElement: () => appRef.current,
    estimateSize: () => 100,
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
    <>
      <div style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        minHeight: '100vh',
        padding: '1rem',
        backgroundColor: '#f3f4f6'
      }}>
        <h1 style={{
          fontSize: '2.5rem',
          fontWeight: '700',
          marginBottom: '1rem'
        }}>Publicaciones Académicas</h1>

        <div
          ref={appRef}
          style={{
            width: '100%',
            maxWidth: '56rem',
            height: '500px',
            overflow: 'auto',
            border: '1px solid #d1d5db',
            borderRadius: '0.375rem',
            backgroundColor: '#fff',
            boxShadow: '0 1px 3px rgba(0,0,0,0.1), 0 1px 2px rgba(0,0,0,0.06)'
          }}
        >
          <table style={{ width: '100%', tableLayout: 'fixed' }}>
            <thead style={{
              position: 'sticky',
              top: 0,
              backgroundColor: '#fff',
              borderBottom: '1px solid #e5e7eb',
              boxShadow: '0 1px 2px rgba(0, 0, 0, 0.05)',
              zIndex: 10
            }}>
              {table.getHeaderGroups().map(headerGroup => (
                <tr key={headerGroup.id}>
                  {headerGroup.headers.map(header => (
                    <th key={header.id} style={{
                      textAlign: 'left',
                      padding: '0.5rem',
                      fontWeight: 600
                    }}>
                      {flexRender(header.column.columnDef.header, header.getContext())}
                    </th>
                  ))}
                </tr>
              ))}
            </thead>

            <tbody style={{ height: `${totalSize}px`, position: "relative" }}>
              {virtualRows.map(virtualRow => {
                const row = table.getRowModel().rows[virtualRow.index]
                return (
                  <tr
                    key={row.id}
                    style={{
                      position: "absolute",
                      transform: `translateY(${virtualRow.start}px)`,
                      width: "100%",
                      display: 'flex'
                    }}
                    className="border-b"
                  >
                    {row.getVisibleCells().map(cell => (
                      <td key={cell.id} style={{
                        padding: "2px",
                        flex: '1'
                      }}>
                        {flexRender(cell.column.columnDef.cell, cell.getContext())}
                      </td>
                    ))}
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
      </div>
    </>
  )
}

export default App
