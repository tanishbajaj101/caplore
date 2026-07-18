export type PostImage = { id: number; url: string };

export type UserProfile = {
  name: string;
  username: string;
  email: string;
  company?: string;
};

export type CommunityPost = {
  id: number;
  authorUsername: string;
  authorName: string;
  body: string;
  category?: string;
  createdAt: string;
  images: PostImage[];
  likeCount: number;
  commentCount: number;
  likedByMe: boolean;
  bookmarkedByMe?: boolean;
};

export type CommunityComment = {
  id: number;
  authorUsername: string;
  authorName: string;
  body: string;
  createdAt: string;
};

export type Connection = {
  username: string;
  name: string;
  connectedSince: string;
};

export type ConnectionRequest = {
  id: number;
  createdAt: string;
  fromUser: { username: string; name: string };
};

export type Suggestion = {
  username: string;
  name: string;
};

export type CommunityStatus = {
  state: "" | "error";
  message: string;
};

