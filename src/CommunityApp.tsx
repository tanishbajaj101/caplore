import { useEffect, useMemo, useState, type ChangeEvent, type FormEvent, type ReactNode } from "react";
import { AppSidebar, AppSidebarToggle } from "./AppSidebar";
import { useSidebarState } from "./useSidebarState";

const apiBaseUrl = (
  import.meta.env.VITE_API_BASE_URL ??
  "https://caplore-backend-production.up.railway.app"
).replace(/\/$/, "");
const AUTH_STORAGE_KEY = "caplore_auth";

type AuthUser = {
  username?: string;
  name?: string;
  email?: string;
};

type CommunityMember = {
  username: string;
  name: string;
  email?: string;
  initials: string;
};

type CommunityComment = {
  id: number;
  text: string;
  createdAt: string;
  author: CommunityMember;
};

type CommunityPost = {
  id: number;
  postType: PostType;
  text: string;
  createdAt: string;
  images: string[];
  likeCount: number;
  commentCount: number;
  likedByCurrentUser: boolean;
  savedByCurrentUser: boolean;
  author: CommunityMember;
  comments: CommunityComment[];
};

type ConnectionRequest = {
  id: number;
  createdAt: string;
  user: CommunityMember;
};

type TrendingItem = {
  label: string;
  metric: string;
  tone: "blue" | "green" | "amber" | "purple";
};

type CommunityEvent = {
  title: string;
  date: string;
  time: string;
  type: string;
};

type CommunityClub = {
  id: number;
  name: string;
  description: string;
  privacy: "public" | "private";
  icon: string;
  memberCount: number;
  membershipStatus: "accepted" | "pending" | "none";
};

type ProfileStats = {
  connections: number;
  posts: number;
  investments: number;
  profileViews: number;
  postImpressions: number;
  savedPosts: number;
};

type CommunityData = {
  currentUser: CommunityMember;
  profileStats: ProfileStats;
  suggestions: CommunityMember[];
  requests: ConnectionRequest[];
  connections: CommunityMember[];
  clubs: CommunityClub[];
  posts: CommunityPost[];
  trending: TrendingItem[];
  events: CommunityEvent[];
};

type PostType = "discussion" | "deal_insight" | "event" | "question" | "market_insight";

type IconName =
  | "home"
  | "network"
  | "discussion"
  | "club"
  | "calendar"
  | "founder"
  | "message"
  | "search"
  | "bell"
  | "chevron"
  | "image"
  | "bolt"
  | "question"
  | "heart"
  | "comment"
  | "share"
  | "bookmark"
  | "check"
  | "x"
  | "more";

const postTypeLabels: Record<PostType, string> = {
  discussion: "Discussion",
  deal_insight: "Deal Insight",
  event: "Event",
  question: "Question",
  market_insight: "Market Insight",
};

const postTypeTones: Record<PostType, string> = {
  discussion: "blue",
  deal_insight: "blue",
  event: "amber",
  question: "purple",
  market_insight: "green",
};

function Icon({ name, size = 16 }: { name: IconName; size?: number }) {
  const paths: Record<IconName, ReactNode> = {
    home: <><path d="M3 11 12 4l9 7" /><path d="M5 10v10h14V10" /></>,
    network: <><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" /><circle cx="9" cy="7" r="4" /><path d="M22 21v-2a4 4 0 0 0-3-3.8M16 3.2a4 4 0 0 1 0 7.6" /></>,
    discussion: <path d="M21 15a4 4 0 0 1-4 4H8l-5 3V7a4 4 0 0 1 4-4h10a4 4 0 0 1 4 4z" />,
    club: <><circle cx="12" cy="7" r="4" /><path d="M6 21v-2a6 6 0 0 1 12 0v2" /></>,
    calendar: <><rect x="3" y="5" width="18" height="16" rx="2" /><path d="M8 3v4m8-4v4M3 10h18" /></>,
    founder: <><path d="M12 3v18" /><path d="M5 8h14" /><path d="M7 21h10" /><path d="M8 8l4-5 4 5" /></>,
    message: <><path d="M4 5h16v11H7l-3 3z" /></>,
    search: <><circle cx="11" cy="11" r="7" /><path d="m20 20-4-4" /></>,
    bell: <><path d="M18 8a6 6 0 0 0-12 0c0 7-3 7-3 9h18c0-2-3-2-3-9" /><path d="M10 21h4" /></>,
    chevron: <path d="m8 10 4 4 4-4" />,
    image: <><rect x="3" y="5" width="18" height="14" rx="2" /><circle cx="8" cy="10" r="1.5" /><path d="m21 16-5-5L5 19" /></>,
    bolt: <path d="m13 2-9 12h8l-1 8 9-12h-8z" />,
    question: <><circle cx="12" cy="12" r="9" /><path d="M9.5 9a2.8 2.8 0 0 1 5.1 1.6c0 2.4-2.6 2.3-2.6 4" /><path d="M12 18h.01" /></>,
    heart: <path d="M20.8 4.6a5.5 5.5 0 0 0-7.8 0L12 5.6l-1-1a5.5 5.5 0 0 0-7.8 7.8l1 1L12 21l7.8-7.6 1-1a5.5 5.5 0 0 0 0-7.8z" />,
    comment: <><path d="M21 15a4 4 0 0 1-4 4H8l-5 3V7a4 4 0 0 1 4-4h10a4 4 0 0 1 4 4z" /></>,
    share: <><circle cx="18" cy="5" r="3" /><circle cx="6" cy="12" r="3" /><circle cx="18" cy="19" r="3" /><path d="m8.6 10.8 6.8-4.6M8.6 13.2l6.8 4.6" /></>,
    bookmark: <path d="M6 3h12v18l-6-4-6 4z" />,
    check: <path d="m5 12 4 4L19 6" />,
    x: <><path d="M18 6 6 18" /><path d="m6 6 12 12" /></>,
    more: <><circle cx="5" cy="12" r="1" /><circle cx="12" cy="12" r="1" /><circle cx="19" cy="12" r="1" /></>,
  };

  return <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">{paths[name]}</svg>;
}

function readUser(): AuthUser {
  try {
    return JSON.parse(localStorage.getItem(AUTH_STORAGE_KEY) || "{}") as AuthUser;
  } catch {
    return {};
  }
}

function initialsFor(name?: string, username?: string) {
  return (name || username || "Investor")
    .split(/\s+/)
    .slice(0, 2)
    .map((part) => part[0])
    .join("")
    .toUpperCase();
}

function formatTime(value: string) {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "Just now";

  const diff = Date.now() - date.getTime();
  const minute = 60 * 1000;
  const hour = 60 * minute;
  const day = 24 * hour;

  if (diff < minute) return "Just now";
  if (diff < hour) return `${Math.max(1, Math.floor(diff / minute))}m ago`;
  if (diff < day) return `${Math.floor(diff / hour)}h ago`;
  return date.toLocaleDateString(undefined, { day: "numeric", month: "short" });
}

function formatNumber(value: number) {
  return new Intl.NumberFormat("en-IN").format(value);
}

function titleCaseUsername(username?: string) {
  return (username || "investor")
    .split(/[._-]/)
    .filter(Boolean)
    .map((part) => `${part[0]?.toUpperCase() ?? ""}${part.slice(1)}`)
    .join(" ");
}

async function requestJson<T>(path: string, init?: RequestInit): Promise<T> {
  const response = await fetch(`${apiBaseUrl}${path}`, {
    ...init,
    headers: {
      "Content-Type": "application/json",
      ...(init?.headers ?? {}),
    },
  });
  const result = await response.json();

  if (!response.ok) {
    throw new Error(result.error || "Request failed.");
  }

  return result as T;
}

function imageUrl(pathname: string) {
  if (/^https?:\/\//.test(pathname) || pathname.startsWith("data:")) return pathname;
  return `${apiBaseUrl}${pathname}`;
}

function buildFallbackData(user: AuthUser): CommunityData {
  const currentUser = {
    username: user.username || "investor",
    name: user.name || titleCaseUsername(user.username),
    email: user.email,
    initials: initialsFor(user.name, user.username),
  };
  const members: CommunityMember[] = [
    { username: "vikram.kapoor", name: "Vikram Kapoor", email: "vikram.kapoor@example.com", initials: "VK" },
    { username: "anjali.mehta", name: "Anjali Mehta", email: "anjali.mehta@example.com", initials: "AM" },
    { username: "ramesh.agarwal", name: "Ramesh Agarwal", email: "ramesh.agarwal@example.com", initials: "RA" },
    { username: "nikhil.rao", name: "Nikhil Rao, CA", email: "nikhil.rao@example.com", initials: "NR" },
    { username: "shalini.kumar", name: "Shalini Kumar", email: "shalini.kumar@example.com", initials: "SK" },
  ];

  return {
    currentUser,
    profileStats: {
      connections: 148,
      posts: 24,
      investments: 6,
      profileViews: 34,
      postImpressions: 1240,
      savedPosts: 9,
    },
    suggestions: members.slice(3),
    requests: [{ id: 9001, createdAt: new Date().toISOString(), user: members[2] }],
    connections: members.slice(0, 3),
    clubs: [
      { id: 1, name: "Manufacturing Investors", description: "842 members", privacy: "public", icon: "MI", memberCount: 842, membershipStatus: "accepted" },
      { id: 2, name: "Healthcare & Pharma", description: "614 members", privacy: "public", icon: "HP", memberCount: 614, membershipStatus: "accepted" },
      { id: 3, name: "Pre-IPO Deal Hunters", description: "1,230 members", privacy: "public", icon: "PI", memberCount: 1230, membershipStatus: "none" },
      { id: 4, name: "Family Office Network", description: "286 members private", privacy: "private", icon: "FO", memberCount: 286, membershipStatus: "none" },
      { id: 5, name: "SME IPO Watchers", description: "2,100 members", privacy: "public", icon: "SM", memberCount: 2100, membershipStatus: "none" },
    ],
    posts: [
      {
        id: 7001,
        postType: "deal_insight",
        text: "Just completed due diligence on ABC Engineering Ltd. One of the cleaner pre-IPO balance sheets I have reviewed this year. D/E at 0.38x, 3-year revenue CAGR of 27%, and a confirmed BRLM mandate. The Rs 480 Cr pre-money valuation is a meaningful discount to listed peers.",
        createdAt: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
        images: [],
        likeCount: 48,
        commentCount: 14,
        likedByCurrentUser: false,
        savedByCurrentUser: false,
        author: members[0],
        comments: [
          { id: 8001, text: "Agree on the balance sheet. The USFDA approval for Healix in the same cohort is interesting too.", createdAt: new Date().toISOString(), author: members[1] },
          { id: 8002, text: "What is the lock-in structure post-IPO? That is always the key variable for pre-IPO pricing.", createdAt: new Date().toISOString(), author: { username: "rohit.suri", name: "Rohit Suri", initials: "RS" } },
        ],
      },
      {
        id: 7002,
        postType: "market_insight",
        text: "SME IPO listings have quietly outperformed mainboard listings on listing-day returns in FY25. Average SME IPO listing gain: +42%. Mainboard: +18%. Governance standards are rising sector-wide.",
        createdAt: new Date(Date.now() - 5 * 60 * 60 * 1000).toISOString(),
        images: [],
        likeCount: 31,
        commentCount: 6,
        likedByCurrentUser: true,
        savedByCurrentUser: true,
        author: { username: "priya.deshmukh", name: "Priya Deshmukh", initials: "PD" },
        comments: [],
      },
    ],
    trending: [
      { label: "#ABCEngineering", metric: "142 posts", tone: "blue" },
      { label: "#NSEmerge2025", metric: "98 posts", tone: "green" },
      { label: "#CCDStructure", metric: "61 posts", tone: "amber" },
      { label: "#SEBICircular", metric: "54 posts", tone: "purple" },
      { label: "#PharmaIPO", metric: "42 posts", tone: "blue" },
    ],
    events: [
      { title: "Founder AMA: ABC Engineering", date: "22 May", time: "5:00 PM IST", type: "Live room" },
      { title: "SME IPO Pipeline Roundtable", date: "24 May", time: "11:00 AM IST", type: "Webinar" },
      { title: "Investor Networking Meet", date: "5 Jun", time: "6:30 PM IST", type: "Community" },
    ],
  };
}

function fileToDataUrl(file: File) {
  return new Promise<string>((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(String(reader.result));
    reader.onerror = () => reject(new Error("Could not read image."));
    reader.readAsDataURL(file);
  });
}

function Panel({ title, action, children }: { title: string; action?: ReactNode; children: ReactNode }) {
  return (
    <section className="community-card">
      <header className="community-card-header">
        <h2>{title}</h2>
        {action}
      </header>
      {children}
    </section>
  );
}

export default function CommunityApp() {
  const user = useMemo(readUser, []);
  const [sidebarOpen, setSidebarOpen] = useSidebarState();
  const [accountOpen, setAccountOpen] = useState(false);
  const [data, setData] = useState<CommunityData | null>(null);
  const [loading, setLoading] = useState(true);
  const [status, setStatus] = useState("");
  const [postText, setPostText] = useState("");
  const [postType, setPostType] = useState<PostType>("discussion");
  const [postImages, setPostImages] = useState<{ name: string; dataUrl: string }[]>([]);
  const [commentDrafts, setCommentDrafts] = useState<Record<number, string>>({});
  const username = user.username || "";
  const displayName = user.name || titleCaseUsername(user.username);
  const currentInitials = initialsFor(user.name, user.username);
  const profile = data?.profileStats ?? buildFallbackData(user).profileStats;
  const currentUser = data?.currentUser ?? {
    username: username || "investor",
    name: displayName,
    initials: currentInitials,
  };

  const loadCommunity = async () => {
    if (!username) return;

    setLoading(true);
    try {
      const result = await requestJson<CommunityData>(`/api/community?username=${encodeURIComponent(username)}`);
      setData(result);
      setStatus("");
    } catch (error) {
      setData(buildFallbackData(user));
      setStatus(
        error instanceof Error
          ? `${error.message} Showing local preview data.`
          : "Could not load community. Showing local preview data.",
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    void loadCommunity();
  }, [username]);

  useEffect(() => {
    const closeOnEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") setSidebarOpen(false);
    };
    window.addEventListener("keydown", closeOnEscape);
    return () => window.removeEventListener("keydown", closeOnEscape);
  }, []);

  const logout = () => {
    localStorage.removeItem(AUTH_STORAGE_KEY);
    window.location.assign("/");
  };

  const handleImages = async (event: ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(event.target.files ?? []).slice(0, 4);
    const nextImages = await Promise.all(
      files.map(async (file) => ({ name: file.name, dataUrl: await fileToDataUrl(file) })),
    );
    setPostImages(nextImages);
  };

  const createPost = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!postText.trim() && postImages.length === 0) return;

    try {
      await requestJson("/api/community/posts", {
        method: "POST",
        body: JSON.stringify({ username, postType, text: postText, images: postImages }),
      });
      setPostText("");
      setPostImages([]);
      setPostType("discussion");
      await loadCommunity();
    } catch (error) {
      const previewPost: CommunityPost = {
        id: Date.now(),
        postType,
        text: postText.trim(),
        createdAt: new Date().toISOString(),
        images: postImages.map((image) => image.dataUrl),
        likeCount: 0,
        commentCount: 0,
        likedByCurrentUser: false,
        savedByCurrentUser: false,
        author: currentUser,
        comments: [],
      };
      setData((current) => current ? { ...current, posts: [previewPost, ...current.posts] } : current);
      setPostText("");
      setPostImages([]);
      setPostType("discussion");
      setStatus(error instanceof Error ? `${error.message} Added locally for preview.` : "Added locally for preview.");
    }
  };

  const sendConnectionRequest = async (receiverUsername: string) => {
    try {
      await requestJson("/api/community/connections", {
        method: "POST",
        body: JSON.stringify({ username, receiverUsername }),
      });
      await loadCommunity();
    } catch (error) {
      setData((current) => current ? {
        ...current,
        suggestions: current.suggestions.filter((member) => member.username !== receiverUsername),
      } : current);
      setStatus(error instanceof Error ? `${error.message} Preview request marked locally.` : "Preview request marked locally.");
    }
  };

  const respondToRequest = async (connectionId: number, responseStatus: "accepted" | "rejected") => {
    try {
      await requestJson("/api/community/connections/respond", {
        method: "POST",
        body: JSON.stringify({ username, connectionId, status: responseStatus }),
      });
      await loadCommunity();
    } catch (error) {
      setData((current) => current ? {
        ...current,
        requests: current.requests.filter((request) => request.id !== connectionId),
      } : current);
      setStatus(error instanceof Error ? `${error.message} Preview request updated locally.` : "Preview request updated locally.");
    }
  };

  const toggleLike = async (postId: number) => {
    try {
      await requestJson(`/api/community/posts/${postId}/like`, {
        method: "POST",
        body: JSON.stringify({ username }),
      });
      await loadCommunity();
    } catch (error) {
      setData((current) => current ? {
        ...current,
        posts: current.posts.map((post) => {
          if (post.id !== postId) return post;
          const likedByCurrentUser = !post.likedByCurrentUser;
          return {
            ...post,
            likedByCurrentUser,
            likeCount: Math.max(0, post.likeCount + (likedByCurrentUser ? 1 : -1)),
          };
        }),
      } : current);
      setStatus(error instanceof Error ? `${error.message} Preview like updated locally.` : "Preview like updated locally.");
    }
  };

  const toggleSave = async (postId: number) => {
    try {
      await requestJson(`/api/community/posts/${postId}/save`, {
        method: "POST",
        body: JSON.stringify({ username }),
      });
      await loadCommunity();
    } catch (error) {
      setData((current) => current ? {
        ...current,
        posts: current.posts.map((post) => post.id === postId
          ? { ...post, savedByCurrentUser: !post.savedByCurrentUser }
          : post),
      } : current);
      setStatus(error instanceof Error ? `${error.message} Preview save updated locally.` : "Preview save updated locally.");
    }
  };

  const joinClub = async (clubId: number) => {
    try {
      await requestJson(`/api/community/clubs/${clubId}/membership`, {
        method: "POST",
        body: JSON.stringify({ username }),
      });
      await loadCommunity();
    } catch (error) {
      setData((current) => current ? {
        ...current,
        clubs: current.clubs.map((club) => club.id === clubId
          ? { ...club, membershipStatus: club.privacy === "private" ? "pending" : "accepted" }
          : club),
      } : current);
      setStatus(error instanceof Error ? `${error.message} Preview club action updated locally.` : "Preview club action updated locally.");
    }
  };

  const createComment = async (postId: number) => {
    const text = commentDrafts[postId]?.trim() ?? "";
    if (!text) return;

    try {
      await requestJson("/api/community/comments", {
        method: "POST",
        body: JSON.stringify({ username, postId, text }),
      });
      setCommentDrafts((drafts) => ({ ...drafts, [postId]: "" }));
      await loadCommunity();
    } catch (error) {
      const comment: CommunityComment = {
        id: Date.now(),
        text,
        createdAt: new Date().toISOString(),
        author: currentUser,
      };
      setData((current) => current ? {
        ...current,
        posts: current.posts.map((post) => post.id === postId
          ? { ...post, commentCount: post.commentCount + 1, comments: [...post.comments, comment] }
          : post),
      } : current);
      setCommentDrafts((drafts) => ({ ...drafts, [postId]: "" }));
      setStatus(error instanceof Error ? `${error.message} Added locally for preview.` : "Added locally for preview.");
    }
  };

  const connectedUsernames = new Set(data?.connections.map((member) => member.username) ?? []);
  const people = [
    ...(data?.connections.map((member) => ({ ...member, connected: true })) ?? []),
    ...(data?.suggestions.map((member) => ({ ...member, connected: false })) ?? []),
  ].slice(0, 5);

  const tabs = [
    { label: "Feed", icon: "home" as IconName, count: null, active: true },
    { label: "My Network", icon: "network" as IconName, count: profile.connections },
    { label: "Discussions", icon: "discussion" as IconName, count: 12 },
    { label: "Investor Clubs", icon: "club" as IconName, count: data?.clubs.length ?? 0 },
    { label: "Events", icon: "calendar" as IconName, count: null },
    { label: "Founder Connect", icon: "founder" as IconName, count: null },
    { label: "Messages", icon: "message" as IconName, count: 4 },
  ];

  return (
    <div className={`community-page dashboard-app ${sidebarOpen ? "sidebar-open" : "sidebar-closed"}`}>
      <AppSidebar activeItem="community" open={sidebarOpen} onClose={() => setSidebarOpen(false)} />

      <div className="community-app-shell app-page-shell">
        <header className="community-topbar">
          <div className="community-title-row">
            <AppSidebarToggle open={sidebarOpen} onToggle={() => setSidebarOpen((open) => !open)} />
            <h1>Community</h1>
          </div>
          <div className="community-topbar-actions">
            <label className="community-search">
              <Icon name="search" size={14} />
              <input type="search" placeholder="Search investors, posts, clubs..." />
            </label>
            <button className="community-icon-button" type="button" aria-label="Notifications">
              <Icon name="bell" size={15} />
              <span>{data?.requests.length ?? 0}</span>
            </button>
            <div className="community-account">
              <button type="button" onClick={() => setAccountOpen((open) => !open)} aria-expanded={accountOpen}>
                <i>{currentInitials}</i>
                <span><strong>{displayName}</strong><small>Premium Investor</small></span>
                <Icon name="chevron" size={12} />
              </button>
              {accountOpen && (
                <div className="community-account-menu">
                  {user.email && <span>{user.email}</span>}
                  <button type="button" onClick={logout}>Log out</button>
                </div>
              )}
              </div>
          </div>
        </header>

        <nav className="community-tabs" aria-label="Community sections">
          {tabs.map((tab) => (
            <button className={tab.active ? "active" : ""} type="button" key={tab.label}>
              <Icon name={tab.icon} size={14} />
              {tab.label}
              {typeof tab.count === "number" && <b>{tab.count}</b>}
            </button>
          ))}
        </nav>

        <main className="community-workspace">
        <aside className="community-left-rail">
          <section className="profile-card">
            <div className="profile-cover" />
            <i>{currentInitials}</i>
            <div className="profile-body">
              <h2>{displayName}</h2>
              <p>HNI Investor | Pune | Member since Apr 2024</p>
              <div className="profile-badges">
                <span>Premium</span>
                <span>Verified</span>
                <span>CAPLORE+ Member</span>
              </div>
            </div>
            <dl>
              <div><dt>{formatNumber(profile.connections)}</dt><dd>Connections</dd></div>
              <div><dt>{formatNumber(profile.posts)}</dt><dd>Posts</dd></div>
              <div><dt>{formatNumber(profile.investments)}</dt><dd>Investments</dd></div>
            </dl>
            <footer>
              <span>Profile views this week <b>{formatNumber(profile.profileViews)}</b></span>
              <span>Post impressions <b>{formatNumber(profile.postImpressions)}</b></span>
            </footer>
          </section>

          <Panel title="Investor Clubs" action={<button className="text-action" type="button">Explore All</button>}>
            <div className="club-list">
              {data?.clubs.map((club) => (
                <article key={club.id}>
                  <i>{club.icon}</i>
                  <div>
                    <strong>{club.name}</strong>
                    <span>{formatNumber(club.memberCount)} members{club.privacy === "private" ? " | Private" : ""}</span>
                  </div>
                  {club.membershipStatus === "accepted" && <b>Joined</b>}
                  {club.membershipStatus === "pending" && <b>Requested</b>}
                  {club.membershipStatus === "none" && (
                    <button type="button" onClick={() => joinClub(club.id)}>
                      {club.privacy === "private" ? "Request" : "+ Join"}
                    </button>
                  )}
                </article>
              ))}
            </div>
          </Panel>
        </aside>

        <section className="community-feed-column">
          {status && <p className="community-status">{status}</p>}
          {loading && <p className="community-status">Loading community...</p>}

          <form className="community-composer-card" onSubmit={createPost}>
            <div className="composer-main-row">
              <i>{currentInitials}</i>
              <textarea
                value={postText}
                onChange={(event) => setPostText(event.target.value)}
                placeholder="Share a deal insight, market update, or question with your network..."
                maxLength={4000}
              />
            </div>
            {postImages.length > 0 && (
              <div className="composer-preview">
                {postImages.map((image) => <img src={image.dataUrl} alt={image.name} key={image.name} />)}
              </div>
            )}
            <footer>
              <div className="composer-tools">
                <label>
                  <Icon name="image" size={14} />
                  Image
                  <input type="file" accept="image/*" multiple onChange={handleImages} />
                </label>
                {(["deal_insight", "event", "question"] as PostType[]).map((type) => (
                  <button className={postType === type ? "active" : ""} type="button" onClick={() => setPostType(type)} key={type}>
                    <Icon name={type === "deal_insight" ? "bolt" : type === "event" ? "calendar" : "question"} size={14} />
                    {postTypeLabels[type]}
                  </button>
                ))}
              </div>
              <button className="post-submit" type="submit">Post</button>
            </footer>
          </form>

          <section className="feed-list" aria-label="Community feed">
            {data?.posts.map((post) => (
              <article className="feed-card" key={post.id}>
                <header className="feed-card-head">
                  <i>{post.author.initials}</i>
                  <div>
                    <strong>{post.author.name} <span>Verified</span></strong>
                    <small>Managing Director | Caplore Network | {formatTime(post.createdAt)}</small>
                  </div>
                  <button type="button" aria-label="More options"><Icon name="more" size={15} /></button>
                </header>

                <span className={`post-type ${postTypeTones[post.postType]}`}>{postTypeLabels[post.postType]}</span>
                {post.text && <p className="post-text">{post.text}</p>}
                {post.images.length > 0 && (
                  <div className={`post-images count-${Math.min(post.images.length, 4)}`}>
                    {post.images.map((src) => <img src={imageUrl(src)} alt="" key={src} />)}
                  </div>
                )}
                {post.postType === "deal_insight" && (
                  <div className="deal-attachment">
                    <i>AB</i>
                    <div><strong>ABC Engineering Ltd.</strong><span>Pre-IPO | Industrial Machinery | CAPLORE Score 85/100</span></div>
                    <b>Rs 120 Cr<small>Target Raise</small></b>
                  </div>
                )}
                {post.postType === "market_insight" && (
                  <div className="mini-chart" aria-label="SME vs Mainboard listing day returns">
                    <strong>SME vs Mainboard - Listing Day Returns (FY25)</strong>
                    <div>{[42, 48, 61, 50, 55, 64, 45, 67].map((height, index) => <span style={{ height: `${height}%` }} className={index % 3 === 2 ? "green" : ""} key={index} />)}</div>
                  </div>
                )}

                <div className="post-actions">
                  <button className={post.likedByCurrentUser ? "active" : ""} type="button" onClick={() => toggleLike(post.id)}>
                    <Icon name="heart" size={15} /> {formatNumber(post.likeCount)}
                  </button>
                  <span><Icon name="comment" size={15} /> {formatNumber(post.commentCount)} Comments</span>
                  <button type="button"><Icon name="share" size={15} /> Share</button>
                  <button className={post.savedByCurrentUser ? "active save" : ""} type="button" onClick={() => toggleSave(post.id)}>
                    <Icon name="bookmark" size={15} /> Save
                  </button>
                </div>

                <div className="comment-list">
                  {post.comments.slice(0, 3).map((comment) => (
                    <article key={comment.id}>
                      <i>{comment.author.initials}</i>
                      <div><strong>{comment.author.name}</strong><p>{comment.text}</p></div>
                    </article>
                  ))}
                </div>
                <form className="comment-form" onSubmit={(event) => { event.preventDefault(); void createComment(post.id); }}>
                  <input
                    value={commentDrafts[post.id] ?? ""}
                    onChange={(event) => setCommentDrafts((drafts) => ({ ...drafts, [post.id]: event.target.value }))}
                    placeholder="Write a comment"
                    maxLength={1200}
                  />
                  <button type="submit">Comment</button>
                </form>
              </article>
            ))}
            {!loading && data?.posts.length === 0 && <p className="community-status">Your feed is quiet. Connect with people or share the first post.</p>}
          </section>
        </section>

        <aside className="community-right-rail">
          <Panel title="People to Connect With" action={<button className="text-action" type="button">See All</button>}>
            <div className="people-list">
              {people.map((member) => (
                <article key={member.username}>
                  <i>{member.initials}</i>
                  <div><strong>{member.name}{connectedUsernames.has(member.username) ? " Verified" : ""}</strong><span>{member.email ?? `@${member.username}`}</span></div>
                  {connectedUsernames.has(member.username)
                    ? <b>Connected</b>
                    : <button type="button" onClick={() => sendConnectionRequest(member.username)}>Connect</button>}
                </article>
              ))}
            </div>
          </Panel>

          {Boolean(data?.requests.length) && (
            <Panel title="Connection Requests">
              <div className="request-list">
                {data?.requests.map((request) => (
                  <article key={request.id}>
                    <i>{request.user.initials}</i>
                    <div><strong>{request.user.name}</strong><span>wants to connect</span></div>
                    <button type="button" aria-label="Accept request" onClick={() => respondToRequest(request.id, "accepted")}><Icon name="check" size={13} /></button>
                    <button type="button" aria-label="Reject request" onClick={() => respondToRequest(request.id, "rejected")}><Icon name="x" size={13} /></button>
                  </article>
                ))}
              </div>
            </Panel>
          )}

          <Panel title="Trending in Network">
            <ol className="trend-list">
              {data?.trending.map((item, index) => (
                <li key={item.label}>
                  <small>{index + 1} | {item.tone}</small>
                  <strong>{item.label}</strong>
                  <span>{item.metric}</span>
                </li>
              ))}
            </ol>
          </Panel>

          <Panel title="Upcoming Events" action={<button className="text-action" type="button">View All</button>}>
            <div className="community-events" id="events">
              {data?.events.map((event) => (
                <article key={event.title}>
                  <i>{event.date}</i>
                  <div><strong>{event.title}</strong><span>{event.time} | {event.type}</span></div>
                  <button type="button">Register</button>
                </article>
              ))}
            </div>
          </Panel>
        </aside>
        </main>
      </div>
    </div>
  );
}
