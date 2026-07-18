import { useEffect, useState } from "react";
import { loadCompanyIndex } from "../companies/companyData";
import type { CompanySummary } from "../companies/types";

export function useCompanyIndex() {
  const [companies, setCompanies] = useState<CompanySummary[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let active = true;

    void loadCompanyIndex()
      .then((loadedCompanies) => {
        if (active) setCompanies(loadedCompanies);
      })
      .catch((reason: unknown) => {
        if (active) setError(reason instanceof Error ? reason.message : "Could not load companies.");
      })
      .finally(() => {
        if (active) setLoading(false);
      });

    return () => { active = false; };
  }, []);

  return { companies, loading, error };
}

