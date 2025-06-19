import { Table, TableBody, TableCell, TableHeadCell, TableRow, TableHeader } from "./components/ui/table";
import { useVirtualTable } from "./hooks/useVirtualTable";
import { flexRender } from "@tanstack/react-table";
import { IoIosArrowDown, IoIosArrowUp } from "react-icons/io"


function App() {
  const { table, appRef, virtualRows, totalSize } = useVirtualTable()

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
