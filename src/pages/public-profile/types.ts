export type AuthUser = { 
  username?: string; 
  name?: string; 
  token?: string 
};

export type PublicProfile = {
  username: string;
  name: string;
  memberSince: string;
  postCount: number;
  connectionCount: number;
};

export type ApiError = { 
  error?: string 
};
