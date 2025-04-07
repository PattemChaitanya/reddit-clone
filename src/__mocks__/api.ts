import { Post, Comment, Subreddit, User } from "../types";

// Mock data for testing
export const mockPosts: Post[] = [
  {
    id: "1",
    title: "Test Post 1",
    content: "This is test post 1 content",
    authorId: "1",
    author: {
      id: "1",
      username: "testuser1",
      displayName: "Test User 1",
      avatar: "https://example.com/avatar1.jpg",
      banner: "https://picsum.photos/seed/testuser1/1500/300",
      karma: 1000,
      createdAt: "2022-01-01T00:00:00.000Z",
    },
    subredditId: "1",
    subreddit: "testsubreddit",
    upvotes: 100,
    downvotes: 10,
    userVote: 1,
    commentCount: 5,
    createdAt: "2023-01-01T00:00:00.000Z",
    updatedAt: "2023-01-01T00:00:00.000Z",
    type: "text",
  },
  {
    id: "2",
    title: "Test Post 2",
    content: "This is test post 2 content",
    authorId: "2",
    author: {
      id: "2",
      username: "testuser2",
      displayName: "Test User 2",
      avatar: "https://example.com/avatar2.jpg",
      karma: 2000,
      createdAt: "2022-02-01T00:00:00.000Z",
    },
    subredditId: "2",
    subreddit: "anothersubreddit",
    upvotes: 200,
    downvotes: 20,
    userVote: 0,
    commentCount: 10,
    createdAt: "2023-02-01T00:00:00.000Z",
    updatedAt: "2023-02-01T00:00:00.000Z",
    type: "image",
    url: "https://example.com/image.jpg",
    thumbnail: "https://example.com/thumbnail.jpg",
  },
];

export const mockComments: Comment[] = [
  {
    id: "1",
    postId: "1",
    content: "This is a test comment",
    authorId: "1",
    author: {
      id: "1",
      username: "testuser1",
      displayName: "Test User 1",
      avatar: "https://example.com/avatar1.jpg",
      karma: 1000,
      createdAt: "2022-01-01T00:00:00.000Z",
    },
    upvotes: 5,
    downvotes: 1,
    userVote: 1,
    createdAt: "2023-01-02T00:00:00.000Z",
    updatedAt: "2023-01-02T00:00:00.000Z",
    replies: [],
  },
  {
    id: "2",
    postId: "1",
    content: "This is another test comment",
    authorId: "2",
    author: {
      id: "2",
      username: "testuser2",
      displayName: "Test User 2",
      avatar: "https://example.com/avatar2.jpg",
      karma: 2000,
      createdAt: "2022-02-01T00:00:00.000Z",
    },
    upvotes: 10,
    downvotes: 2,
    userVote: 0,
    createdAt: "2023-01-03T00:00:00.000Z",
    updatedAt: "2023-01-03T00:00:00.000Z",
    replies: [],
  },
];

export const mockSubreddits: Subreddit[] = [
  {
    id: "1",
    name: "testsubreddit",
    description: "This is a test subreddit",
    icon: "https://example.com/icon1.jpg",
    banner: "https://example.com/banner1.jpg",
    memberCount: 1000,
    createdAt: "2022-01-01T00:00:00.000Z",
    isUserSubscribed: true,
  },
  {
    id: "2",
    name: "anothersubreddit",
    description: "This is another test subreddit",
    icon: "https://example.com/icon2.jpg",
    banner: "https://example.com/banner2.jpg",
    memberCount: 2000,
    createdAt: "2022-02-01T00:00:00.000Z",
    isUserSubscribed: false,
  },
];

export const mockUsers: User[] = [
  {
    id: "1",
    username: "testuser1",
    displayName: "Test User 1",
    avatar: "https://example.com/avatar1.jpg",
    banner: "https://picsum.photos/seed/testuser1/1500/300",
    karma: 1000,
    createdAt: "2022-01-01T00:00:00.000Z",
  },
  {
    id: "2",
    username: "testuser2",
    displayName: "Test User 2",
    avatar: "https://example.com/avatar2.jpg",
    karma: 2000,
    createdAt: "2022-02-01T00:00:00.000Z",
  },
];

// Mock API service
export const mockApiService = {
  getPosts: jest.fn().mockResolvedValue(mockPosts),
  getSubredditPosts: jest.fn().mockResolvedValue(mockPosts),
  getPost: jest.fn().mockResolvedValue({
    post: mockPosts[0],
    comments: mockComments,
  }),
  votePost: jest.fn().mockResolvedValue(undefined),
  addComment: jest.fn().mockImplementation((postId, content, parentId) => {
    const newComment: Comment = {
      id: "new-comment-id",
      postId,
      content,
      authorId: "1",
      author: mockUsers[0],
      parentId,
      upvotes: 1,
      downvotes: 0,
      userVote: 1,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      replies: [],
    };
    return Promise.resolve(newComment);
  }),
  voteComment: jest.fn().mockResolvedValue(undefined),
  getSubreddits: jest.fn().mockResolvedValue(mockSubreddits),
  getSubreddit: jest.fn().mockImplementation((name) => {
    const subreddit = mockSubreddits.find((s) => s.name === name);
    return Promise.resolve(subreddit || null);
  }),
  toggleSubredditSubscription: jest.fn().mockResolvedValue(true),
  getUser: jest.fn().mockImplementation((username) => {
    const user = mockUsers.find((u) => u.username === username);
    return Promise.resolve(user || null);
  }),
  search: jest.fn().mockResolvedValue({
    posts: mockPosts,
    subreddits: mockSubreddits,
  }),
};

// Export a mock version for Jest to use
export const api = mockApiService;
