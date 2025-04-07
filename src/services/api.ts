import { v4 as uuidv4 } from "uuid";

import { Post, Comment, Subreddit, User, SortOption } from "../types";

// API Gateway URL
const API_URL = "https://apigateway-k2jc5kdq2a-uc.a.run.app";

// Helper for API requests
const fetchApi = async (endpoint: string, options = {}) => {
  const response = await fetch(`${API_URL}${endpoint}`, options);
  console.log(response, "response", `${API_URL}${endpoint}`);
  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.error || "API request failed");
  }
  return response.json();
};

// Mappers to convert API responses to our app types
const mapPostFromApi = (apiPost: any): Post => ({
  id: apiPost.id,
  title: apiPost.title,
  content: apiPost.selftext || "",
  authorId: apiPost.author,
  author: {
    id: apiPost.author,
    username: apiPost.author,
    displayName: apiPost.author,
    avatar: "",
    karma: 0,
    createdAt: new Date(apiPost.created_utc * 1000).toISOString(),
  },
  subredditId: apiPost.subreddit,
  subreddit: apiPost.subreddit,
  upvotes: apiPost.score,
  downvotes: 0, // Reddit API doesn't provide this separately
  userVote: 0, // Default to no vote
  commentCount: apiPost.num_comments,
  createdAt: new Date(apiPost.created_utc * 1000).toISOString(),
  updatedAt: new Date(apiPost.created_utc * 1000).toISOString(),
  type: apiPost.is_self
    ? "text"
    : apiPost.url?.match(/\.(jpg|jpeg|png|gif)$/i)
    ? "image"
    : "link",
  url: apiPost.url,
  thumbnail: apiPost.thumbnail !== "self" ? apiPost.thumbnail : undefined,
});

const mapCommentFromApi = (apiComment: any): Comment => ({
  id: apiComment.id,
  postId: apiComment.link_id?.replace("t3_", "") || "",
  content: apiComment.body || "",
  authorId: apiComment.author,
  author: {
    id: apiComment.author,
    username: apiComment.author,
    displayName: apiComment.author,
    avatar: "",
    karma: 0,
    createdAt: new Date(apiComment.created_utc * 1000).toISOString(),
  },
  parentId: apiComment.parent_id?.startsWith("t1_")
    ? apiComment.parent_id.replace("t1_", "")
    : undefined,
  upvotes: apiComment.score,
  downvotes: 0,
  userVote: 0,
  createdAt: new Date(apiComment.created_utc * 1000).toISOString(),
  updatedAt: new Date(apiComment.created_utc * 1000).toISOString(),
  replies: apiComment.replies?.data?.children
    ? apiComment.replies.data.children
        .filter((reply: any) => reply.kind === "t1")
        .map((reply: any) => mapCommentFromApi(reply.data))
    : [],
});

const mapSubredditFromApi = (apiSubreddit: any): Subreddit => ({
  id: apiSubreddit.name,
  name: apiSubreddit.display_name,
  description:
    apiSubreddit.description || apiSubreddit.public_description || "",
  icon: apiSubreddit.icon_img || "",
  banner: apiSubreddit.banner_img || "",
  memberCount: apiSubreddit.subscribers || 0,
  createdAt: new Date(apiSubreddit.created_utc * 1000).toISOString(),
  isUserSubscribed: false, // We can't determine this without authentication
});

// Mock API service with real Reddit API integrations
export const api = {
  // Posts
  async getPosts(
    sort: SortOption = "hot",
    limit: number = 25
  ): Promise<Post[]> {
    const response = await fetchApi(
      `/api/v1/reddit/r/popular?sort=${sort}&limit=${limit}`
    );
    if (!response.success) {
      throw new Error(response.error || "Failed to fetch posts");
    }
    return response.data.map(mapPostFromApi);
  },

  async getSubredditPosts(
    subreddit: string,
    sort: SortOption = "hot",
    limit: number = 25
  ): Promise<Post[]> {
    const response = await fetchApi(
      `/api/v1/reddit/r/${subreddit}?sort=${sort}&limit=${limit}`
    );
    if (!response.success) {
      throw new Error(response.error || "Failed to fetch subreddit posts");
    }
    return response.data.map(mapPostFromApi);
  },

  async getPost(
    postId: string
  ): Promise<{ post: Post; comments: Comment[] } | null> {
    // We need to extract subreddit from the post ID or use a generic endpoint
    // For now, we'll use a search to find the post first
    const searchResponse = await fetchApi(
      `/api/v1/reddit/search/posts?q=id:${postId}&limit=1`
    );
    if (!searchResponse.success || searchResponse.data.length === 0) {
      return null;
    }

    const postData = searchResponse.data[0];
    const subreddit = postData.subreddit;

    // Now we can get the post with comments
    const response = await fetchApi(
      `/api/v1/reddit/r/${subreddit}/comments/${postId}`
    );
    if (!response.success) {
      return null;
    }

    return {
      post: mapPostFromApi(response.post),
      comments: response.comments.map(mapCommentFromApi),
    };
  },

  // This is a client-side only operation since we don't have write access to Reddit
  async votePost(postId: string, direction: 1 | 0 | -1): Promise<void> {
    // In a real app, this would call the Reddit API to vote
    // For now, we'll simulate it client-side
    console.log(`Voted ${direction} on post ${postId}`);
  },

  // Comments - this is a client-side only operation
  async addComment(
    postId: string,
    content: string,
    parentId?: string
  ): Promise<Comment> {
    // In a real app with authentication, this would call the Reddit API
    // For now, we'll create a dummy comment
    const newComment: Comment = {
      id: uuidv4(),
      postId,
      content,
      authorId: "current-user", // Use logged-in user ID in a real app
      author: {
        id: "current-user",
        username: "current-user",
        displayName: "Current User",
        avatar: "",
        karma: 1,
        createdAt: new Date().toISOString(),
      },
      parentId,
      upvotes: 1,
      downvotes: 0,
      userVote: 1,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      replies: [],
    };

    console.log("Added comment:", newComment);
    return newComment;
  },

  // This is a client-side only operation
  async voteComment(commentId: string, direction: 1 | 0 | -1): Promise<void> {
    // In a real app, this would call the Reddit API to vote
    console.log(`Voted ${direction} on comment ${commentId}`);
  },

  // Subreddits
  async getSubreddits(): Promise<Subreddit[]> {
    // Get popular subreddits
    const response = await fetchApi(
      `/api/v1/reddit/search/subreddits?q=popular&limit=25`
    );
    if (!response.success) {
      throw new Error(response.error || "Failed to fetch subreddits");
    }
    return response.data.map(mapSubredditFromApi);
  },

  async getSubreddit(name: string): Promise<Subreddit | null> {
    const response = await fetchApi(`/api/v1/reddit/r/${name}/about`);
    if (!response.success) {
      return null;
    }
    return mapSubredditFromApi(response.data);
  },

  // This is a client-side only operation
  async toggleSubredditSubscription(subredditId: string): Promise<boolean> {
    // In a real app with authentication, this would call the Reddit API
    console.log(`Toggled subscription for subreddit ${subredditId}`);
    return true; // Assuming successful toggle
  },

  // Users
  async getUser(username: string): Promise<User | null> {
    const response = await fetchApi(`/api/v1/reddit/user/${username}`);
    if (!response.success) {
      return null;
    }

    return {
      id: response.data.name,
      username: response.data.name,
      displayName: response.data.name,
      avatar: response.data.icon_img || "",
      karma: response.data.link_karma + response.data.comment_karma,
      createdAt: new Date(response.data.created_utc * 1000).toISOString(),
    };
  },

  // Search
  async search(
    query: string
  ): Promise<{ posts: Post[]; subreddits: Subreddit[] }> {
    const [postsResponse, subredditsResponse] = await Promise.all([
      fetchApi(
        `/api/v1/reddit/search/posts?q=${encodeURIComponent(query)}&limit=25`
      ),
      fetchApi(
        `/api/v1/reddit/search/subreddits?q=${encodeURIComponent(
          query
        )}&limit=10`
      ),
    ]);

    return {
      posts: postsResponse.success
        ? postsResponse.data.map(mapPostFromApi)
        : [],
      subreddits: subredditsResponse.success
        ? subredditsResponse.data.map(mapSubredditFromApi)
        : [],
    };
  },
};
