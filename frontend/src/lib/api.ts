const STRAPI_URL = process.env.NEXT_PUBLIC_STRAPI_URL || "http://localhost:1337";

interface StrapiRequestOptions {
  populate?: string | string[];
  fields?: string[];
  filters?: Record<string, unknown>;
  sort?: string | string[];
  pagination?: { page?: number; pageSize?: number };
}

export async function fetchFromStrapi(
  path: string,
  options: StrapiRequestOptions = {}
) {
  const params = new URLSearchParams();

  if (options.populate) {
    const populate = Array.isArray(options.populate)
      ? options.populate.join(",")
      : options.populate;
    params.set("populate", populate);
  }
  if (options.fields) {
    params.set("fields", options.fields.join(","));
  }
  if (options.sort) {
    const sort = Array.isArray(options.sort)
      ? options.sort.join(",")
      : options.sort;
    params.set("sort", sort);
  }
  if (options.pagination) {
    if (options.pagination.page)
      params.set("pagination[page]", String(options.pagination.page));
    if (options.pagination.pageSize)
      params.set(
        "pagination[pageSize]",
        String(options.pagination.pageSize)
      );
  }

  const qs = params.toString();
  const url = `${STRAPI_URL}/api${path}${qs ? `?${qs}` : ""}`;

  const res = await fetch(url, { next: { revalidate: 3600 } });

  if (!res.ok) {
    throw new Error(`Strapi API error: ${res.status} ${res.statusText}`);
  }

  return res.json();
}
