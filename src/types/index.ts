// User types
export interface User {
  id: string;
  username: string;
  displayName: string;
  avatar: string;
  banner?: string;
  karma: number;
  createdAt: string;
}

// Subreddit types
export interface Subreddit {
  id: string;
  name: string;
  description: string;
  icon: string;
  banner: string;
  memberCount: number;
  createdAt: string;
  isUserSubscribed: boolean;
}

// Post types
export interface Post {
  id: string;
  title: string;
  content: string;
  authorId: string;
  author: User;
  subredditId: string;
  subreddit: string;
  upvotes: number;
  downvotes: number;
  userVote?: 1 | 0 | -1;
  commentCount: number;
  createdAt: string;
  updatedAt: string;
  type: "text" | "link" | "image" | "video";
  url?: string;
  thumbnail?: string;
}

// Comment types
export interface Comment {
  id: string;
  postId: string;
  content: string;
  authorId: string;
  author: User;
  parentId?: string;
  upvotes: number;
  downvotes: number;
  userVote?: 1 | 0 | -1;
  createdAt: string;
  updatedAt: string;
  replies?: Comment[];
  isDeleted?: boolean;
}

// Filter types
export type SortOption = "hot" | "new" | "top" | "controversial";
export type TimeRange = "hour" | "day" | "week" | "month" | "year" | "all";
