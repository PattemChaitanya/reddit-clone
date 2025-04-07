import { User, Subreddit, Post, Comment } from "../types";

// Mock Users
export const users: User[] = [
  {
    id: "1",
    username: "johndoe",
    displayName: "John Doe",
    avatar: "https://i.pravatar.cc/150?u=johndoe",
    banner: "https://picsum.photos/seed/johndoe/1500/300",
    karma: 15243,
    createdAt: "2020-01-12T00:00:00.000Z",
  },
  {
    id: "2",
    username: "janedoe",
    displayName: "Jane Doe",
    avatar: "https://i.pravatar.cc/150?u=janedoe",
    karma: 7865,
    createdAt: "2020-05-20T00:00:00.000Z",
  },
  {
    id: "3",
    username: "mikebrown",
    displayName: "Mike Brown",
    avatar: "https://i.pravatar.cc/150?u=mikebrown",
    banner: "https://picsum.photos/seed/mikebrown/1500/300",
    karma: 4521,
    createdAt: "2021-03-15T00:00:00.000Z",
  },
  {
    id: "4",
    username: "sarahsmith",
    displayName: "Sarah Smith",
    avatar: "https://i.pravatar.cc/150?u=sarahsmith",
    karma: 9743,
    createdAt: "2019-11-05T00:00:00.000Z",
  },
  {
    id: "5",
    username: "alexjones",
    displayName: "Alex Jones",
    avatar: "https://i.pravatar.cc/150?u=alexjones",
    banner: "https://picsum.photos/seed/alexjones/1500/300",
    karma: 2134,
    createdAt: "2022-01-25T00:00:00.000Z",
  },
];

// Mock Subreddits
export const subreddits: Subreddit[] = [
  {
    id: "1",
    name: "programming",
    description: "Computer programming discussions and news",
    icon: "https://styles.redditmedia.com/t5_2fwo/styles/communityIcon_1bqa1ibfp8q11.png",
    banner:
      "https://styles.redditmedia.com/t5_2fwo/styles/bannerBackgroundImage_qwefy8uvtwr11.jpg",
    memberCount: 5234567,
    createdAt: "2008-01-25T00:00:00.000Z",
    isUserSubscribed: true,
  },
  {
    id: "2",
    name: "gaming",
    description: "A place for (almost) anything gaming related.",
    icon: "https://styles.redditmedia.com/t5_2qh03/styles/communityIcon_fy1oz9ntx8y61.png",
    banner:
      "https://styles.redditmedia.com/t5_2qh03/styles/bannerBackgroundImage_ur4fc4j47qj61.png",
    memberCount: 34567123,
    createdAt: "2008-03-18T00:00:00.000Z",
    isUserSubscribed: true,
  },
  {
    id: "3",
    name: "movies",
    description:
      "The goal of /r/Movies is to provide an inclusive place for discussions and news about films with major releases.",
    icon: "https://styles.redditmedia.com/t5_2qh3s/styles/communityIcon_fumwoty24tk71.png",
    banner:
      "https://styles.redditmedia.com/t5_2qh3s/styles/bannerBackgroundImage_c2xb9iyblh5a1.jpg",
    memberCount: 28765432,
    createdAt: "2008-01-25T00:00:00.000Z",
    isUserSubscribed: false,
  },
  {
    id: "4",
    name: "reactjs",
    description:
      "A community for learning and developing web applications using React.",
    icon: "https://styles.redditmedia.com/t5_2zldd/styles/communityIcon_fbblpo38vy941.png",
    banner:
      "https://styles.redditmedia.com/t5_2zldd/styles/bannerBackgroundImage_j5k81wdjv3d41.png",
    memberCount: 345678,
    createdAt: "2012-05-15T00:00:00.000Z",
    isUserSubscribed: true,
  },
  {
    id: "5",
    name: "AskReddit",
    description: "Ask Reddit: the front page of the internet.",
    icon: "https://styles.redditmedia.com/t5_2qh1i/styles/communityIcon_p6kb2m6b185b1.png",
    banner:
      "https://styles.redditmedia.com/t5_2qh1i/styles/bannerBackgroundImage_qwefy8uvtwr11.jpg",
    memberCount: 40832345,
    createdAt: "2008-01-25T00:00:00.000Z",
    isUserSubscribed: false,
  },
  {
    id: "6",
    name: "webdev",
    description: "A community dedicated to all things web development.",
    icon: "https://styles.redditmedia.com/t5_2qs0q/styles/communityIcon_kxcmyz9j96f21.png",
    banner:
      "https://styles.redditmedia.com/t5_2qs0q/styles/bannerBackgroundImage_7glcgg5ymxf21.jpg",
    memberCount: 987654,
    createdAt: "2008-08-13T00:00:00.000Z",
    isUserSubscribed: true,
  },
  {
    id: "7",
    name: "news",
    description: "The place for news articles about current events.",
    icon: "https://styles.redditmedia.com/t5_2qh3l/styles/communityIcon_a0obtjybm4b91.png",
    banner:
      "https://styles.redditmedia.com/t5_2qh3l/styles/bannerBackgroundImage_j5gmwy5ghdo51.jpg",
    memberCount: 25678123,
    createdAt: "2008-01-25T00:00:00.000Z",
    isUserSubscribed: false,
  },
];

// Mock Posts
export const posts: Post[] = [
  {
    id: "1",
    title: "React 18 has been released!",
    content:
      "The React team has announced the release of React 18, which includes out-of-the-box improvements like automatic batching, new APIs like startTransition, and streaming server-side rendering with support for Suspense.",
    authorId: "1",
    author: users[0],
    subredditId: "4",
    subreddit: "reactjs",
    upvotes: 5432,
    downvotes: 123,
    userVote: 1,
    commentCount: 345,
    createdAt: "2023-05-15T14:23:45.000Z",
    updatedAt: "2023-05-15T14:23:45.000Z",
    type: "text",
  },
  {
    id: "2",
    title: "Cyberpunk 2077 gets a new update with major improvements",
    content:
      "CD Projekt Red has released a new update for Cyberpunk 2077 that addresses many of the game's issues and adds new features.",
    authorId: "2",
    author: users[1],
    subredditId: "2",
    subreddit: "gaming",
    upvotes: 9876,
    downvotes: 234,
    commentCount: 789,
    createdAt: "2023-05-14T10:15:20.000Z",
    updatedAt: "2023-05-14T10:15:20.000Z",
    type: "image",
    url: "https://i.redd.it/zv5z1kzx1vf61.jpg",
    thumbnail: "https://i.redd.it/zv5z1kzx1vf61.jpg",
  },
  {
    id: "3",
    title: "What's the most underrated movie you've ever seen?",
    content:
      "Looking for some hidden gems to watch this weekend. What are some of the most underrated movies you've seen that deserve more attention?",
    authorId: "3",
    author: users[2],
    subredditId: "3",
    subreddit: "movies",
    upvotes: 4321,
    downvotes: 98,
    userVote: -1,
    commentCount: 567,
    createdAt: "2023-05-13T18:45:30.000Z",
    updatedAt: "2023-05-13T18:45:30.000Z",
    type: "text",
  },
  {
    id: "4",
    title: "How to implement authentication in a React app with Firebase",
    content:
      "I've created a tutorial on implementing user authentication in a React application using Firebase. It covers sign up, login, logout, and password reset functionality.",
    authorId: "4",
    author: users[3],
    subredditId: "4",
    subreddit: "reactjs",
    upvotes: 765,
    downvotes: 32,
    commentCount: 89,
    createdAt: "2023-05-12T08:30:15.000Z",
    updatedAt: "2023-05-12T08:30:15.000Z",
    type: "link",
    url: "https://example.com/react-firebase-auth-tutorial",
    thumbnail: "https://i.redd.it/react-thumbnail.jpg",
  },
  {
    id: "5",
    title: "If you could have one superpower, what would it be and why?",
    content:
      "Just a fun question for everyone. If you could have any superpower, what would you choose and why?",
    authorId: "5",
    author: users[4],
    subredditId: "5",
    subreddit: "AskReddit",
    upvotes: 12543,
    downvotes: 432,
    userVote: 1,
    commentCount: 1543,
    createdAt: "2023-05-11T15:20:45.000Z",
    updatedAt: "2023-05-11T15:20:45.000Z",
    type: "text",
  },
  {
    id: "6",
    title: "Global chip shortage expected to ease by end of 2023",
    content:
      "Industry analysts are predicting that the global semiconductor shortage, which has affected everything from cars to gaming consoles, is expected to ease by the end of 2023.",
    authorId: "1",
    author: users[0],
    subredditId: "7",
    subreddit: "news",
    upvotes: 7654,
    downvotes: 321,
    commentCount: 543,
    createdAt: "2023-05-10T12:10:35.000Z",
    updatedAt: "2023-05-10T12:10:35.000Z",
    type: "link",
    url: "https://example.com/chip-shortage-news",
    thumbnail: "https://i.redd.it/chip-shortage-thumbnail.jpg",
  },
  {
    id: "7",
    title: "Web development roadmap for 2023",
    content:
      "I've put together a comprehensive roadmap for web developers in 2023, covering frontend, backend, and DevOps skills that are in high demand.",
    authorId: "2",
    author: users[1],
    subredditId: "6",
    subreddit: "webdev",
    upvotes: 3456,
    downvotes: 98,
    userVote: 1,
    commentCount: 234,
    createdAt: "2023-05-09T09:05:25.000Z",
    updatedAt: "2023-05-09T09:05:25.000Z",
    type: "image",
    url: "https://i.redd.it/webdev-roadmap.png",
    thumbnail: "https://i.redd.it/webdev-roadmap-thumbnail.png",
  },
];

// Mock Comments
export const comments: Comment[] = [
  {
    id: "1",
    postId: "1",
    content:
      "This is great news! I've been waiting for these improvements in React.",
    authorId: "2",
    author: users[1],
    upvotes: 321,
    downvotes: 12,
    userVote: 1,
    createdAt: "2023-05-15T14:30:15.000Z",
    updatedAt: "2023-05-15T14:30:15.000Z",
    replies: [
      {
        id: "2",
        postId: "1",
        content:
          "Me too! The automatic batching feature sounds especially useful.",
        authorId: "3",
        author: users[2],
        parentId: "1",
        upvotes: 123,
        downvotes: 5,
        createdAt: "2023-05-15T14:45:30.000Z",
        updatedAt: "2023-05-15T14:45:30.000Z",
        replies: [
          {
            id: "3",
            postId: "1",
            content:
              "Absolutely! It's going to make a lot of our code more efficient without any changes.",
            authorId: "4",
            author: users[3],
            parentId: "2",
            upvotes: 76,
            downvotes: 2,
            userVote: 1,
            createdAt: "2023-05-15T15:00:45.000Z",
            updatedAt: "2023-05-15T15:00:45.000Z",
          },
        ],
      },
    ],
  },
  {
    id: "4",
    postId: "1",
    content:
      "Has anyone tried the new streaming SSR with Suspense? How's the performance?",
    authorId: "5",
    author: users[4],
    upvotes: 198,
    downvotes: 8,
    createdAt: "2023-05-15T15:15:00.000Z",
    updatedAt: "2023-05-15T15:15:00.000Z",
    replies: [
      {
        id: "5",
        postId: "1",
        content:
          "I've implemented it in a project and the initial page load feels much faster. The ability to progressively render components is really powerful.",
        authorId: "1",
        author: users[0],
        parentId: "4",
        upvotes: 154,
        downvotes: 3,
        userVote: 1,
        createdAt: "2023-05-15T15:30:15.000Z",
        updatedAt: "2023-05-15T15:30:15.000Z",
      },
    ],
  },
  {
    id: "6",
    postId: "2",
    content: "Finally! Been waiting for this update for so long.",
    authorId: "3",
    author: users[2],
    upvotes: 432,
    downvotes: 21,
    createdAt: "2023-05-14T10:30:00.000Z",
    updatedAt: "2023-05-14T10:30:00.000Z",
  },
  {
    id: "7",
    postId: "3",
    content:
      "Moon (2009) directed by Duncan Jones. It's a brilliant sci-fi film with an amazing performance by Sam Rockwell.",
    authorId: "1",
    author: users[0],
    upvotes: 321,
    downvotes: 9,
    userVote: 1,
    createdAt: "2023-05-13T19:00:45.000Z",
    updatedAt: "2023-05-13T19:00:45.000Z",
    replies: [
      {
        id: "8",
        postId: "3",
        content:
          "I second this! It's an incredible film that didn't get the attention it deserved when it was released.",
        authorId: "2",
        author: users[1],
        parentId: "7",
        upvotes: 198,
        downvotes: 4,
        createdAt: "2023-05-13T19:15:30.000Z",
        updatedAt: "2023-05-13T19:15:30.000Z",
      },
    ],
  },
];

// Helper functions for simulating API responses
export const getPostsWithFilters = (
  sort: string = "hot",
  limit: number = 25
) => {
  let sortedPosts = [...posts];

  switch (sort) {
    case "new":
      sortedPosts.sort(
        (a, b) =>
          new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      );
      break;
    case "top":
      sortedPosts.sort(
        (a, b) => b.upvotes - b.downvotes - (a.upvotes - a.downvotes)
      );
      break;
    case "controversial":
      sortedPosts.sort(
        (a, b) => b.upvotes + b.downvotes - (a.upvotes + a.downvotes)
      );
      break;
    case "hot":
    default:
      // A simple "hot" algorithm that factors in both votes and recency
      sortedPosts.sort((a, b) => {
        const aScore = getHotScore(a);
        const bScore = getHotScore(b);
        return bScore - aScore;
      });
  }

  return sortedPosts.slice(0, limit);
};

export const getSubredditPosts = (
  subredditName: string,
  sort: string = "hot",
  limit: number = 25
) => {
  const subredditPosts = posts.filter(
    (post) => post.subreddit.toLowerCase() === subredditName.toLowerCase()
  );
  const sortedPosts = sortPosts(subredditPosts, sort);
  return sortedPosts.slice(0, limit);
};

export const getPostWithComments = (postId: string) => {
  const post = posts.find((post) => post.id === postId);
  if (!post) return null;

  const postComments = comments.filter(
    (comment) => comment.postId === postId && !comment.parentId
  );

  // Build the comment tree
  const commentTree = postComments.map((comment) => {
    return buildCommentTree(comment);
  });

  return { post, comments: commentTree };
};

export const searchContent = (query: string) => {
  const searchQuery = query.toLowerCase();

  const matchedPosts = posts.filter(
    (post) =>
      post.title.toLowerCase().includes(searchQuery) ||
      post.content.toLowerCase().includes(searchQuery)
  );

  const matchedSubreddits = subreddits.filter(
    (subreddit) =>
      subreddit.name.toLowerCase().includes(searchQuery) ||
      subreddit.description.toLowerCase().includes(searchQuery)
  );

  return { posts: matchedPosts, subreddits: matchedSubreddits };
};

// Helper functions for sorting and building the comment tree
const sortPosts = (postsToSort: Post[], sort: string) => {
  const sortedPosts = [...postsToSort];

  switch (sort) {
    case "new":
      return sortedPosts.sort(
        (a, b) =>
          new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      );
    case "top":
      return sortedPosts.sort(
        (a, b) => b.upvotes - b.downvotes - (a.upvotes - a.downvotes)
      );
    case "controversial":
      return sortedPosts.sort(
        (a, b) => b.upvotes + b.downvotes - (a.upvotes + a.downvotes)
      );
    case "hot":
    default:
      return sortedPosts.sort((a, b) => {
        const aScore = getHotScore(a);
        const bScore = getHotScore(b);
        return bScore - aScore;
      });
  }
};

const getHotScore = (post: Post) => {
  const epochSeconds = new Date(post.createdAt).getTime() / 1000;
  const secondsAgo = Date.now() / 1000 - epochSeconds;
  const score = post.upvotes - post.downvotes;

  // Reddit's hot sorting algorithm (simplified)
  const order = Math.log10(Math.max(Math.abs(score), 1));
  const sign = score > 0 ? 1 : score < 0 ? -1 : 0;
  const seconds = secondsAgo - 1661990400; // Some epoch reference

  return sign * order + seconds / 45000;
};

const buildCommentTree = (comment: Comment): Comment => {
  const childComments = comments.filter((c) => c.parentId === comment.id);

  // Base case: no child comments
  if (childComments.length === 0) {
    return comment;
  }

  // Recursive case: build the tree for each child
  const replies = childComments.map((childComment) =>
    buildCommentTree(childComment)
  );

  // Return the comment with its replies
  return {
    ...comment,
    replies,
  };
};
