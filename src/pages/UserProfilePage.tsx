import {
  Grid,
  Box,
  Typography,
  Card,
  CardContent,
  Tabs,
  Tab,
  Avatar,
  Divider,
  Alert,
  Skeleton,
} from "@mui/material";
import { formatDistanceToNow } from "date-fns";
import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";

import PostCard from "../components/PostCard";
import { api } from "../services/api";
import { Post, User } from "../types";
// These imports are commented out since they're not currently used
// Uncomment them when switching to RTK Query implementation
// import { useGetUserQuery, useVotePostMutation } from "../store/api";

const UserProfilePage: React.FC = () => {
  const { username } = useParams<{ username: string }>();
  const [tabValue, setTabValue] = useState(0);
  const [userPosts, setUserPosts] = useState<Post[]>([]);
  const [userInfo, setUserInfo] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isLoadingPosts, setIsLoadingPosts] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // In a real application, we would use this RTK Query hook instead:
  // const { data: userInfo, isLoading, error } = useGetUserQuery(username);
  // const [votePost] = useVotePostMutation();

  // Fetch user info
  useEffect(() => {
    const fetchUserInfo = async () => {
      setIsLoading(true);
      setError(null);

      try {
        const data = await api.getUser(username || "");
        setUserInfo(data);

        if (!data) {
          setError("User not found.");
        }
      } catch (err) {
        console.error("Error fetching user info:", err);
        setError("Failed to load user information. Please try again later.");
      } finally {
        setIsLoading(false);
      }
    };

    if (username) {
      fetchUserInfo();
    }
  }, [username]);

  // Simulate fetching user posts (in a real app, this would be an API call)
  useEffect(() => {
    const fetchUserPosts = async () => {
      setIsLoadingPosts(true);

      try {
        // In a real app, we would have an API endpoint to get user posts
        // For now, we'll filter the mock posts to simulate this
        await new Promise((resolve) => setTimeout(resolve, 500)); // Simulate network delay

        // Filter posts by author username
        const userPosts = api.getPosts().then((posts) => {
          return posts.filter((post) => post.author.username === username);
        });

        userPosts.then((posts) => {
          setUserPosts(posts);
          setIsLoadingPosts(false);
        });
      } catch (err) {
        console.error("Error fetching user posts:", err);
        setIsLoadingPosts(false);
      }
    };

    if (username && !error) {
      fetchUserPosts();
    }
  }, [username, error]);

  // Handle tab change
  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setTabValue(newValue);
  };

  // Handle post voting
  const handleVote = async (postId: string, direction: 1 | 0 | -1) => {
    try {
      await api.votePost(postId, direction);

      // Update local state
      setUserPosts((prevPosts) =>
        prevPosts.map((post) => {
          if (post.id === postId) {
            // Remove previous vote if any
            let upvotes = post.upvotes;
            let downvotes = post.downvotes;

            if (post.userVote === 1) upvotes--;
            if (post.userVote === -1) downvotes--;

            // Add new vote
            if (direction === 1) upvotes++;
            if (direction === -1) downvotes++;

            return {
              ...post,
              upvotes,
              downvotes,
              userVote: direction,
            };
          }
          return post;
        })
      );
    } catch (err) {
      console.error("Error voting on post:", err);
    }
  };

  // Render loading skeleton
  if (isLoading) {
    return (
      <Box>
        <Card className="mb-4">
          <CardContent>
            <Box className="flex items-center">
              <Skeleton variant="circular" width={80} height={80} />
              <Box className="ml-4 flex-1">
                <Skeleton variant="text" width="40%" height={32} />
                <Skeleton variant="text" width="60%" height={20} />
                <Skeleton variant="text" width="30%" height={20} />
              </Box>
            </Box>
          </CardContent>
        </Card>

        <Box sx={{ borderBottom: 1, borderColor: "divider", mb: 2 }}>
          <Skeleton variant="rectangular" height={48} />
        </Box>

        {[...Array(3)].map((_, index) => (
          <Card className="mb-4" key={index}>
            <CardContent>
              <Skeleton variant="text" width="70%" height={24} />
              <Skeleton variant="text" width="40%" height={18} />
              <Skeleton variant="rectangular" height={120} className="my-2" />
            </CardContent>
          </Card>
        ))}
      </Box>
    );
  }

  // Render error message
  if (error || !userInfo) {
    return (
      <Alert severity="error" className="mb-4">
        {error || "User not found."}
      </Alert>
    );
  }

  const createdDate = new Date(userInfo.createdAt);
  const createdAgo = formatDistanceToNow(createdDate, { addSuffix: true });

  return (
    <Grid container spacing={3}>
      {/* Main content */}
      <Grid item xs={12} md={8}>
        <Card className="mb-4">
          {userInfo.banner && (
            <Box
              sx={{
                height: 180,
                backgroundImage: `url(${userInfo.banner})`,
                backgroundSize: "cover",
                backgroundPosition: "center",
              }}
            />
          )}
          <CardContent sx={{ pt: userInfo.banner ? 2 : 3 }}>
            <Box className="flex items-center">
              <Avatar
                src={userInfo.avatar}
                alt={userInfo.username}
                sx={{ width: 80, height: 80 }}
              />
              <Box className="ml-4">
                <Typography variant="h5" component="h1">
                  {userInfo.displayName}
                </Typography>
                <Typography variant="subtitle1" color="textSecondary">
                  u/{userInfo.username}
                </Typography>
                <Typography variant="body2" color="textSecondary">
                  {userInfo.karma.toLocaleString()} karma • Redditor{" "}
                  {createdAgo}
                </Typography>
              </Box>
            </Box>
          </CardContent>
        </Card>

        <Box sx={{ borderBottom: 1, borderColor: "divider", mb: 2 }}>
          <Tabs
            value={tabValue}
            onChange={handleTabChange}
            aria-label="user profile tabs"
          >
            <Tab
              label="Posts"
              id="user-tab-0"
              aria-controls="user-tabpanel-0"
            />
            <Tab
              label="Comments"
              id="user-tab-1"
              aria-controls="user-tabpanel-1"
            />
            <Tab
              label="About"
              id="user-tab-2"
              aria-controls="user-tabpanel-2"
            />
          </Tabs>
        </Box>

        <Box
          role="tabpanel"
          hidden={tabValue !== 0}
          id="user-tabpanel-0"
          aria-labelledby="user-tab-0"
        >
          {tabValue === 0 && (
            <Box>
              {isLoadingPosts ? (
                [...Array(3)].map((_, index) => (
                  <Card className="mb-4" key={index}>
                    <CardContent>
                      <Skeleton variant="text" width="70%" height={24} />
                      <Skeleton variant="text" width="40%" height={18} />
                      <Skeleton
                        variant="rectangular"
                        height={120}
                        className="my-2"
                      />
                    </CardContent>
                  </Card>
                ))
              ) : userPosts.length === 0 ? (
                <Card>
                  <CardContent>
                    <Typography align="center">
                      u/{userInfo.username} hasn't posted anything yet.
                    </Typography>
                  </CardContent>
                </Card>
              ) : (
                userPosts.map((post) => (
                  <PostCard key={post.id} post={post} onVote={handleVote} />
                ))
              )}
            </Box>
          )}
        </Box>

        <Box
          role="tabpanel"
          hidden={tabValue !== 1}
          id="user-tabpanel-1"
          aria-labelledby="user-tab-1"
        >
          {tabValue === 1 && (
            <Card>
              <CardContent>
                <Typography align="center">
                  Comment history not available in this demo.
                </Typography>
              </CardContent>
            </Card>
          )}
        </Box>

        <Box
          role="tabpanel"
          hidden={tabValue !== 2}
          id="user-tabpanel-2"
          aria-labelledby="user-tab-2"
        >
          {tabValue === 2 && (
            <Card>
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  Account Details
                </Typography>

                <Divider className="mb-3" />

                <Box className="mb-3">
                  <Typography variant="subtitle2">Display Name</Typography>
                  <Typography>{userInfo.displayName}</Typography>
                </Box>

                <Box className="mb-3">
                  <Typography variant="subtitle2">Username</Typography>
                  <Typography>u/{userInfo.username}</Typography>
                </Box>

                <Box className="mb-3">
                  <Typography variant="subtitle2">Karma</Typography>
                  <Typography>
                    {userInfo.karma.toLocaleString()} points
                  </Typography>
                </Box>

                <Box className="mb-3">
                  <Typography variant="subtitle2">Account Created</Typography>
                  <Typography>
                    {createdDate.toLocaleDateString()} ({createdAgo})
                  </Typography>
                </Box>
              </CardContent>
            </Card>
          )}
        </Box>
      </Grid>

      {/* Sidebar */}
      <Grid item xs={12} md={4}>
        <Card className="sticky top-20">
          <CardContent>
            <Typography
              variant="h6"
              component="h2"
              className="font-medium mb-2"
            >
              Trophy Case
            </Typography>
            <Divider className="mb-3" />
            <Typography variant="body2" color="textSecondary" align="center">
              This user has no trophies yet.
            </Typography>
          </CardContent>
        </Card>
      </Grid>
    </Grid>
  );
};

export default UserProfilePage;
