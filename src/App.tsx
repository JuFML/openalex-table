import { useEffect, useState } from "react"
import { api } from "./services/api"
import type { Publication, Authorship, ApiResponse, RawPublication } from "./types";



function App() {
  const [publications, setPublications] = useState<Publication[]>([])
  console.log("publications", publications)

  const getAuthorNames = (authorships: Authorship[] = []): string => {
    const names = authorships
      .slice(0, 2)
      .map((item) => item?.author?.display_name)
    return names.join(", ");
  };


  useEffect(() => {
    const getPublications = async () => {
      try {
        const res = await api.get<ApiResponse>("", {
          params: {
            "per-page": 20,
            page: 1,
            sort: "cited_by_count:asc"
          }
        });

        const publication: Publication[] = res.data.results.map((item: RawPublication) => ({
          title: item.title,
          publication_year: item.publication_year,
          cited_by_count: item.cited_by_count,
          author_name: getAuthorNames(item.authorships),
        }));

        setPublications(publication);
      } catch (error) {
        console.error("Error fetching publications:", error);
      }
    };

    getPublications();
  }, []);


  return (
    <>
      <div>
        <h1>APP</h1>
      </div>
    </>
  )
}

export default App
