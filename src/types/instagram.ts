export interface InstagramUser {
  username: string;
  url: string;
  timestamp?: number;
  followedAtFormatted?: string;
}

export interface ParseResult {
  followers: InstagramUser[];
  following: InstagramUser[];
  notFollowingBack: InstagramUser[]; // Following who don't follow back
  fans: InstagramUser[];             // Followers whom you don't follow back
  mutuals: InstagramUser[];          // Both follow each other
}

export type TabType = 'notFollowingBack' | 'fans' | 'mutuals' | 'whitelist';

