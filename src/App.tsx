import { useEffect, useState } from "react"
import { api } from "./services/api"
import type { Publication, Authorship, ApiResponse, RawPublication } from "./types";
import {
  useReactTable,
  getCoreRowModel,
  createColumnHelper,
} from '@tanstack/react-table';



function App() {
  const [publications, setPublications] = useState<Publication[]>([])

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
          cursor: "*",
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
    } catch (error) {
      console.error("Error fetching publications:", error);
    }
  };


  useEffect(() => {
    getPublications();
  }, []);

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
  console.log("table", table)

  return (
    <>
      <div>APP</div>
    </>
  )
}

export default App
