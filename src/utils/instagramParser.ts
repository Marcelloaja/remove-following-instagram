import JSZip from 'jszip';
import { InstagramUser, ParseResult } from '@/types/instagram';

interface RawItem {
  title?: string;
  href?: string;
  value?: string;
  timestamp?: number;
  string_list_data?: Array<{
    href?: string;
    value?: string;
    timestamp?: number;
  }>;
  [key: string]: unknown;
}

export function parseRawInstagramList(data: unknown): InstagramUser[] {
  const usersMap = new Map<string, InstagramUser>();

  const extractItem = (item: RawItem | string) => {
    if (!item) return;

    if (typeof item === 'string') {
      const clean = item.trim().replace(/^@/, '').toLowerCase();
      if (clean && !usersMap.has(clean)) {
        usersMap.set(clean, {
          username: clean,
          url: `https://www.instagram.com/${clean}`,
        });
      }
      return;
    }

    let username = '';
    let timestamp: number | undefined;
    let url = '';

    if (Array.isArray(item.string_list_data) && item.string_list_data.length > 0) {
      const entry = item.string_list_data[0];
      if (entry.value) {
        username = entry.value;
      }
      if (entry.href) {
        url = entry.href;
      }
      if (typeof entry.timestamp === 'number') {
        timestamp = entry.timestamp;
      }
    }

    if (!username && item.title) {
      username = item.title;
    }

    if (!username && item.value) {
      username = item.value;
    }

    if (!username && item.href) {
      const match = item.href.match(/instagram\.com\/([a-zA-Z0-9._]+)/);
      if (match && match[1]) {
        username = match[1];
      }
    }

    username = username.trim().replace(/^@/, '').toLowerCase();

    // Filter out generic strings that aren't valid usernames
    if (username && !username.includes('/') && !username.includes(' ') && !usersMap.has(username)) {
      let followedAtFormatted: string | undefined;
      if (timestamp) {
        const ms = timestamp > 10000000000 ? timestamp : timestamp * 1000;
        const d = new Date(ms);
        followedAtFormatted = d.toLocaleDateString('id-ID', {
          year: 'numeric',
          month: 'short',
          day: 'numeric',
        });
      }

      usersMap.set(username, {
        username,
        url: url || `https://www.instagram.com/${username}`,
        timestamp,
        followedAtFormatted,
      });
    }
  };

  if (Array.isArray(data)) {
    data.forEach(extractItem);
  } else if (data && typeof data === 'object') {
    // If wrapped in relationships_following or similar
    const obj = data as Record<string, unknown>;
    for (const key of Object.keys(obj)) {
      if (Array.isArray(obj[key])) {
        (obj[key] as unknown[]).forEach((item) => extractItem(item as RawItem));
      }
    }
  }

  return Array.from(usersMap.values());
}

export function parseHtmlContent(html: string): InstagramUser[] {
  const usersMap = new Map<string, InstagramUser>();
  const regex = /href=["'](?:https?:\/\/)?(?:www\.)?instagram\.com\/([a-zA-Z0-9._]+)\/?["']/gi;
  let match;

  while ((match = regex.exec(html)) !== null) {
    const rawUsername = match[1];
    if (
      rawUsername &&
      !['p', 'reel', 'explore', 'stories', 'direct', 'accounts', 'legal', 'about'].includes(rawUsername.toLowerCase())
    ) {
      const username = rawUsername.toLowerCase();
      if (!usersMap.has(username)) {
        usersMap.set(username, {
          username,
          url: `https://www.instagram.com/${username}`,
        });
      }
    }
  }

  return Array.from(usersMap.values());
}

export async function processZipFile(file: File): Promise<{ followers: InstagramUser[]; following: InstagramUser[] }> {
  const zip = new JSZip();
  const loadedZip = await zip.loadAsync(file);

  const followersUsers: InstagramUser[] = [];
  const followingUsers: InstagramUser[] = [];

  for (const relativePath of Object.keys(loadedZip.files)) {
    // Ignore folders
    if (loadedZip.files[relativePath].dir) continue;

    // Get ONLY the file basename (e.g., "followers_1.json", "following.json")
    const fileName = relativePath.split('/').pop()?.toLowerCase() || '';

    // Ignore irrelevant relationship files
    if (
      fileName.includes('recently') ||
      fileName.includes('pending') ||
      fileName.includes('blocked') ||
      fileName.includes('close_friends') ||
      fileName.includes('removed') ||
      fileName.includes('hide_story')
    ) {
      continue;
    }

    // Determine type strictly based on filename (NOT directory path!)
    const isFollowersFile = fileName.startsWith('follower') || fileName.includes('followers');
    const isFollowingFile = fileName.startsWith('following') && !fileName.includes('follower');

    if (fileName.endsWith('.json')) {
      try {
        const content = await loadedZip.files[relativePath].async('string');
        const json = JSON.parse(content);

        // Content heuristic backup
        if (json && typeof json === 'object' && !Array.isArray(json) && 'relationships_following' in json) {
          followingUsers.push(...parseRawInstagramList(json));
        } else if (isFollowingFile) {
          followingUsers.push(...parseRawInstagramList(json));
        } else if (isFollowersFile) {
          followersUsers.push(...parseRawInstagramList(json));
        }
      } catch (e) {
        console.warn('Gagal parse JSON:', relativePath, e);
      }
    } else if (fileName.endsWith('.html')) {
      const content = await loadedZip.files[relativePath].async('string');
      if (isFollowingFile) {
        followingUsers.push(...parseHtmlContent(content));
      } else if (isFollowersFile) {
        followersUsers.push(...parseHtmlContent(content));
      }
    }
  }

  // Deduplicate
  const uniqueFollowers = Array.from(
    new Map(followersUsers.map((u) => [u.username, u])).values()
  );
  const uniqueFollowing = Array.from(
    new Map(followingUsers.map((u) => [u.username, u])).values()
  );

  return {
    followers: uniqueFollowers,
    following: uniqueFollowing,
  };
}

export function computeComparison(followers: InstagramUser[], following: InstagramUser[]): ParseResult {
  const followersSet = new Set(followers.map((u) => u.username.toLowerCase()));
  const followingSet = new Set(following.map((u) => u.username.toLowerCase()));

  // Following who do NOT follow back (Not follback)
  const notFollowingBack = following.filter((u) => !followersSet.has(u.username.toLowerCase()));

  // Followers who you don't follow back (Fans)
  const fans = followers.filter((u) => !followingSet.has(u.username.toLowerCase()));

  // Mutuals (You follow each other)
  const mutuals = following.filter((u) => followersSet.has(u.username.toLowerCase()));

  return {
    followers,
    following,
    notFollowingBack,
    fans,
    mutuals,
  };
}
