import { useEffect, useState } from "react";
import { apiBaseUrl } from "../api/config";
import { readStoredUser } from "../auth/storage";

export type DailyBrief = {
  article_id: string;
  category: "Market" | "Sectors" | "Pre-IPO";
  heading: string;
  sentiment: "Positive" | "Neutral" | "Negative";
  summary: string;
  impact: string;
  detailed_brief: string;
  published_date: string | null;
  created_at: string;
};

export function useAiDailyBriefs(briefFilter: string, sortOrder: "ASC" | "DESC") {
  const [briefs, setBriefs] = useState<DailyBrief[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const fetchBriefs = async () => {
    setLoading(true);
    setError("");
    try {
      const token = readStoredUser().token;
      let url = `${apiBaseUrl}/api/caplore-ai-news-feed?page=1&order=${sortOrder}`;
      if (briefFilter !== "All") {
        url += `&category=${encodeURIComponent(briefFilter)}`;
      }

      const response = await fetch(url, {
        headers: {
          Authorization: `Bearer ${token ?? ""}`,
        },
      });

      const result = await response.json();
      if (!response.ok) {
        throw new Error(result.error || "Failed to load daily briefs.");
      }

      setBriefs(result.briefs || []);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Could not load daily briefs.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    void fetchBriefs();
  }, [briefFilter, sortOrder]);

  return { briefs, loading, error, fetchBriefs };
}

