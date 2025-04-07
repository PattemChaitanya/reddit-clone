import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { Post, Comment, Subreddit, User } from "../types";

// Define a service using a base URL and expected endpoints
export const api = createApi({
  reducerPath: "redditApi",
  baseQuery: fetchBaseQuery({ baseUrl: "/api" }), // In a real app, you'd use your actual API here
  tagTypes: ["Post", "Comment", "Subreddit", "User"],
  endpoints: (builder) => ({
    // Get all posts (with optional filter)
    getPosts: builder.query<Post[], { sort?: string; limit?: number }>({
      query: ({ sort = "hot", limit = 25 }) =>
        `posts?sort=${sort}&limit=${limit}`,
      providesTags: (result) =>
        result
          ? [
              ...result.map(({ id }) => ({ type: "Post" as const, id })),
              { type: "Post", id: "LIST" },
            ]
          : [{ type: "Post", id: "LIST" }],
    }),

    // Get subreddit posts
    getSubredditPosts: builder.query<
      Post[],
      { subreddit: string; sort?: string; limit?: number }
    >({
      query: ({ subreddit, sort = "hot", limit = 25 }) =>
        `r/${subreddit}/posts?sort=${sort}&limit=${limit}`,
      providesTags: (result) =>
        result
          ? [
              ...result.map(({ id }) => ({ type: "Post" as const, id })),
              { type: "Post", id: "LIST" },
            ]
          : [{ type: "Post", id: "LIST" }],
    }),

    // Get a single post with comments
    getPost: builder.query<
      { post: Post; comments: Comment[] },
      { postId: string }
    >({
      query: ({ postId }) => `posts/${postId}`,
      providesTags: (result) =>
        result
          ? [
              { type: "Post", id: result.post.id },
              ...result.comments.map(({ id }) => ({
                type: "Comment" as const,
                id,
              })),
            ]
          : [],
    }),

    // Get subreddit info
    getSubreddit: builder.query<Subreddit, string>({
      query: (name) => `r/${name}/about`,
      providesTags: (result) =>
        result ? [{ type: "Subreddit", id: result.id }] : [],
    }),

    // Get all subreddits
    getSubreddits: builder.query<Subreddit[], void>({
      query: () => "subreddits",
      providesTags: (result) =>
        result
          ? [
              ...result.map(({ id }) => ({ type: "Subreddit" as const, id })),
              { type: "Subreddit", id: "LIST" },
            ]
          : [{ type: "Subreddit", id: "LIST" }],
    }),

    // Get user info
    getUser: builder.query<User, string>({
      query: (username) => `users/${username}`,
      providesTags: (result) =>
        result ? [{ type: "User", id: result.id }] : [],
    }),

    // Search posts and subreddits
    search: builder.query<{ posts: Post[]; subreddits: Subreddit[] }, string>({
      query: (query) => `search?q=${encodeURIComponent(query)}`,
      providesTags: ["Post", "Subreddit"],
    }),

    // Add a new comment
    addComment: builder.mutation<
      Comment,
      { postId: string; content: string; parentId?: string }
    >({
      query: (body) => ({
        url: `comments`,
        method: "POST",
        body,
      }),
      invalidatesTags: (result) => [{ type: "Post", id: result?.postId }],
    }),

    // Vote on a post
    votePost: builder.mutation<void, { postId: string; direction: 1 | 0 | -1 }>(
      {
        query: ({ postId, direction }) => ({
          url: `posts/${postId}/vote`,
          method: "POST",
          body: { direction },
        }),
        invalidatesTags: (result, error, { postId }) => [
          { type: "Post", id: postId },
        ],
      }
    ),
  }),
});

// Export hooks for usage in components
export const {
  useGetPostsQuery,
  useGetSubredditPostsQuery,
  useGetPostQuery,
  useGetSubredditQuery,
  useGetSubredditsQuery,
  useGetUserQuery,
  useSearchQuery,
  useAddCommentMutation,
  useVotePostMutation,
} = api;
