import { apiBaseUrl } from "../../api/config";
import { AUTH_STORAGE_KEY } from "../../auth/storage";

export async function requestCommunityJson<T>(
  path: string,
  token: string,
  init?: RequestInit,
): Promise<T> {
  const response = await fetch(`${apiBaseUrl}${path}`, {
    ...init,
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
      ...(init?.headers ?? {}),
    },
  });

  if (response.status === 401) {
    localStorage.removeItem(AUTH_STORAGE_KEY);
    window.location.assign("/login");
    throw new Error("Your session expired. Please log in again.");
  }

  const result = await response.json();
  if (!response.ok) {
    throw new Error(result.error || "Request failed.");
  }

  return result as T;
}

