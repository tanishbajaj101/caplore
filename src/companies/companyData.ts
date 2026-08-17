import type { CompanyData, CompanySummary } from "./types";

const DATA_ROOT = "/data/companies";
const companyCache = new Map<string, Promise<CompanyData | null>>();
let companyIndexCache: Promise<CompanySummary[]> | undefined;

function isCompanyData(value: unknown): value is CompanyData {
  if (!value || typeof value !== "object") return false;

  const summary = (value as { summary?: unknown }).summary;
  if (!summary || typeof summary !== "object") return false;

  const candidate = summary as Partial<CompanySummary>;
  return (
    typeof candidate.slug === "string" &&
    typeof candidate.name === "string" &&
    typeof candidate.sector === "string" &&
    typeof candidate.score === "number"
  );
}

export function loadCompany(slug: string): Promise<CompanyData | null> {
  if (!/^[a-z0-9-]+$/.test(slug)) return Promise.resolve(null);

  const cached = companyCache.get(slug);
  if (cached) return cached;

  const request = fetch(`${DATA_ROOT}/${slug}.json`).then(async (response) => {
    if (response.status === 404) return null;
    if (!response.ok) {
      throw new Error(`Could not load company data (${response.status}).`);
    }

    const data: unknown = await response.json();
    if (!isCompanyData(data) || data.summary.slug !== slug) {
      throw new Error(`Invalid company data for "${slug}".`);
    }

    return data;
  });

  companyCache.set(slug, request);
  request.catch(() => companyCache.delete(slug));
  return request;
}

export function loadCompanyIndex(): Promise<CompanySummary[]> {
  if (companyIndexCache) return companyIndexCache;

  companyIndexCache = fetch(`${DATA_ROOT}/index.json`)
    .then(async (response) => {
      if (!response.ok) {
        throw new Error(`Could not load company index (${response.status}).`);
      }

      const slugs: unknown = await response.json();
      if (
        !Array.isArray(slugs) ||
        !slugs.every((slug) => typeof slug === "string")
      ) {
        throw new Error("Invalid company index.");
      }

      const companies = await Promise.all(slugs.map((slug) => loadCompany(slug)));
      return companies
        .filter((company): company is CompanyData => company !== null)
        .map((company) => company.summary);
    })
    .catch((error) => {
      companyIndexCache = undefined;
      throw error;
    });

  return companyIndexCache;
}
