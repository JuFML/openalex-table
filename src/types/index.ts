export interface Publication {
  title: string;
  publication_year: number;
  cited_by_count: number;
  author_name: string
}
export interface Author {
  display_name: string;
  id: string;
  orcid: string | null;
}

export interface Authorship {
  affiliations: string[];
  author: Author;
  author_position: string;
  countries: string[];
  institutions: string[];
  is_corresponding: boolean;
  raw_affiliation_strings: string[];
  raw_author_name: string;
}

export interface RawPublication {
  title: string;
  publication_year: number;
  cited_by_count: number;
  authorships: Authorship[];
}

export interface MetaResponse {
  count: number;
  db_response_time_ms: number;
  groups_count: null;
  next_cursor: string;
  page: null
  per_page: number;
}

export interface ApiResponse {
  results: RawPublication[];
  meta: MetaResponse;
}