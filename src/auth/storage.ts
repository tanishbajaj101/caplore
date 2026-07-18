export const AUTH_STORAGE_KEY = "caplore_auth";

export type AuthUser = {
  username?: string;
  name?: string;
  email?: string;
  phone_number?: string;
  token?: string;
};

export function readStoredUser(): AuthUser {
  try {
    return JSON.parse(localStorage.getItem(AUTH_STORAGE_KEY) || "{}") as AuthUser;
  } catch {
    return {};
  }
}

export function hasValidStoredUser(): boolean {
  const user = readStoredUser();
  return Boolean(
    user.username?.trim() &&
      typeof user.name === "string" &&
      typeof user.email === "string" &&
      typeof user.phone_number === "string" &&
      user.token?.trim(),
  );
}

export function clearStoredUser() {
  localStorage.removeItem(AUTH_STORAGE_KEY);
}

