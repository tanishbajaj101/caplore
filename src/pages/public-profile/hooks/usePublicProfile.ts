import { useEffect, useMemo, useState } from "react";
import type { ApiError, AuthUser, PublicProfile } from "../types";
import { apiBaseUrl } from "../../../api/config";
const AUTH_STORAGE_KEY = "caplore_auth";

function readUser(): AuthUser {
  try {
    return JSON.parse(localStorage.getItem(AUTH_STORAGE_KEY) || "{}") as AuthUser;
  } catch {
    return {};
  }
}

async function readApiError(response: Response, fallback: string) {
  const result = (await response.json().catch(() => ({}))) as ApiError;
  return result.error ?? fallback;
}

export function usePublicProfile(username: string) {
  const user = useMemo(readUser, []);
  const normalizedUsername = username.trim();
  const isOwnProfile = Boolean(
    user.username && user.username.toLowerCase() === normalizedUsername.toLowerCase(),
  );
  const isLoggedIn = Boolean(user.token);

  const [profile, setProfile] = useState<PublicProfile | null>(null);
  const [loadError, setLoadError] = useState<string | null>(null);
  const [isConnected, setIsConnected] = useState(false);
  const [connectBusy, setConnectBusy] = useState(false);
  const [connectError, setConnectError] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

  const profileUrl = useMemo(
    () => `${window.location.origin}/profile/${encodeURIComponent(normalizedUsername)}`,
    [normalizedUsername],
  );

  useEffect(() => {
    if (!normalizedUsername) {
      setLoadError("Profile not found.");
      return;
    }

    let cancelled = false;

    void (async () => {
      try {
        const response = await fetch(`${apiBaseUrl}/api/profile/${encodeURIComponent(normalizedUsername)}`);
        if (!response.ok) {
          throw new Error(
            await readApiError(
              response,
              response.status === 404 ? "Profile not found." : "Could not load profile.",
            )
          );
        }

        const result = (await response.json()) as { success: boolean; profile: PublicProfile };
        if (cancelled) return;

        setProfile(result.profile);
        setLoadError(null);
        document.title = `${result.profile.name} (@${result.profile.username}) - Caplore`;
      } catch (err) {
        if (!cancelled) {
          setLoadError(err instanceof Error ? err.message : "Could not load profile.");
        }
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [normalizedUsername]);

  useEffect(() => {
    if (!isLoggedIn || isOwnProfile || !user.token) return;

    let cancelled = false;

    void (async () => {
      try {
        const response = await fetch(`${apiBaseUrl}/api/community/connections`, {
          headers: { Authorization: `Bearer ${user.token}` },
        });
        if (!response.ok) return;

        const result = (await response.json()) as { connections: { username: string }[] };
        if (!cancelled) {
          setIsConnected(
            result.connections.some(
              (connection) => connection.username.toLowerCase() === normalizedUsername.toLowerCase(),
            )
          );
        }
      } catch {
        if (!cancelled) setIsConnected(false);
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [isLoggedIn, isOwnProfile, normalizedUsername, user.token]);

  const sendConnect = async () => {
    if (!user.token || connectBusy) return;

    setConnectBusy(true);
    setConnectError(null);

    try {
      const response = await fetch(`${apiBaseUrl}/api/community/connections`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${user.token}`,
        },
        body: JSON.stringify({ receiverUsername: normalizedUsername }),
      });
      if (!response.ok) {
        throw new Error(await readApiError(response, "Could not send connection request."));
      }

      setIsConnected(true);
    } catch (err) {
      setConnectError(err instanceof Error ? err.message : "Could not send connection request.");
    } finally {
      setConnectBusy(false);
    }
  };

  const copyShareLink = async () => {
    try {
      if (navigator.clipboard) {
        await navigator.clipboard.writeText(profileUrl);
      } else {
        const textArea = document.createElement("textarea");
        textArea.value = profileUrl;
        textArea.style.position = "fixed";
        textArea.style.opacity = "0";
        document.body.appendChild(textArea);
        textArea.select();
        document.execCommand("copy");
        document.body.removeChild(textArea);
      }

      setCopied(true);
      window.setTimeout(() => setCopied(false), 2000);
    } catch {
      setCopied(false);
    }
  };

  return {
    profile,
    loadError,
    isConnected,
    connectBusy,
    connectError,
    copied,
    isOwnProfile,
    isLoggedIn,
    sendConnect,
    copyShareLink,
  };
}
