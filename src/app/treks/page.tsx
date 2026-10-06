import TreksList from "./TreksList";

type SearchParams = Promise<Record<string, string | string[] | undefined>>;

function single(value: string | string[] | undefined): string | undefined {
  return typeof value === "string" ? value : undefined;
}

/**
 * Server entry for `/treks`.
 *
 * The list used to sit behind `useSearchParams()` inside a `<Suspense>`, which
 * made Next prerender only the fallback — so crawlers got "Loading trek
 * packages..." instead of the treks. Reading the query here keeps the full,
 * already-filtered list in the first HTML response.
 *
 * The `key` remounts the list when a navbar link changes `?filter=` or
 * `?region=` while the page is already open, so those links still apply.
 */
export default async function AllTreksPage({ searchParams }: { searchParams: SearchParams }) {
  const params = await searchParams;
  const filter = single(params.filter);
  const region = single(params.region);

  return <TreksList key={`${filter ?? ""}|${region ?? ""}`} filter={filter} region={region} />;
}
