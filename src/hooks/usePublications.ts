import { useState } from 'react'
import type { ApiResponse, Authorship, Publication, RawPublication } from '../types'
import { api } from '../services/api'

export const usePublications = () => {
  const [publications, setPublications] = useState<Publication[]>([])
  const [cursor, setCursor] = useState("*")

  const getAuthorNames = (authorships: Authorship[] = []): string => {
    const names = authorships
      .slice(0, 2)
      .map((item) => item?.author?.display_name)
    return names.join(", ");
  };

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

  return { publications, getPublications }
}
