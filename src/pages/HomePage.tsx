import {
  Grid,
  Box,
  Typography,
  Skeleton,
  Card,
  CardContent,
  Alert,
} from "@mui/material";
import React, { useState, useEffect } from "react";

import PopularCommunitiesSidebar from "../components/PopularCommunitiesSidebar";
import PostCard from "../components/PostCard";
import SortBar from "../components/SortBar";
import { api } from "../services/api";
import { Post, SortOption } from "../types";
// These imports are commented out since they're not currently used
// Uncomment them when switching to RTK Query implementation
// import {
//   useGetPostsQuery,
//   useGetSubredditsQuery,
//   useVotePostMutation,
// } from "../store/api";

const HomePage: React.FC = () => {
  const [sortOption, setSortOption] = useState<SortOption>("hot");
  const [posts, setPosts] = useState<Post[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // In a real application, we would use these RTK Query hooks instead of the useState hooks above
  // const { data: posts, isLoading, error } = useGetPostsQuery({ sort: sortOption, limit: 25 });
  // const { data: subreddits, isLoading: isLoadingSubreddits } = useGetSubredditsQuery();
  // const [votePost] = useVotePostMutation();

  // Fetch posts based on sort option
  useEffect(() => {
    const fetchPosts = async () => {
      setIsLoading(true);
      setError(null);

      try {
        const fetchedPosts = await api.getPosts(sortOption);
        setPosts(fetchedPosts);
      } catch (err) {
        console.error("Error fetching posts:", err);
        setError("Failed to load posts. Please try again later.");
      } finally {
        setIsLoading(false);
      }
    };

    fetchPosts();
  }, [sortOption]);

  // Handle post voting
  const handleVote = async (postId: string, direction: 1 | 0 | -1) => {
    // In a real application with RTK Query, we would use the hook instead:
    // votePost({ postId, direction });

    try {
      await api.votePost(postId, direction);

      // Update local state to reflect the vote
      setPosts((prevPosts) =>
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
      setError("Failed to register your vote. Please try again.");
    }
  };

  const renderPosts = () => {
    if (isLoading) {
      return [...Array(5)].map((_, index) => (
        <Card className="mb-4" key={index}>
          <Box className="flex">
            <Box
              className="bg-gray-50 dark:bg-gray-800 p-2 flex flex-col items-center"
              sx={{ width: 50 }}
            >
              <Skeleton variant="circular" width={20} height={20} />
              <Skeleton variant="text" width={30} height={20} />
              <Skeleton variant="circular" width={20} height={20} />
            </Box>
            <CardContent className="flex-1">
              <Skeleton variant="text" width="60%" height={20} />
              <Skeleton variant="text" width="40%" height={15} />
              <Skeleton variant="rectangular" height={120} className="my-2" />
              <Skeleton variant="text" width="80%" />
              <Skeleton variant="text" width="70%" />
            </CardContent>
          </Box>
        </Card>
      ));
    }

    if (error) {
      return (
        <Alert severity="error" className="mb-4">
          {error}
        </Alert>
      );
    }

    if (posts.length === 0) {
      return (
        <Card className="mb-4">
          <CardContent>
            <Typography align="center">
              No posts found. Try changing the sort option or come back later.
            </Typography>
          </CardContent>
        </Card>
      );
    }

    return posts.map((post) => (
      <PostCard key={post.id} post={post} onVote={handleVote} />
    ));
  };

  // Fetch subreddits for sidebar
  const [subreddits, setSubreddits] = useState<any[] | null>(null);
  const [isLoadingSubreddits, setIsLoadingSubreddits] = useState(true);

  useEffect(() => {
    const fetchSubreddits = async () => {
      try {
        const data = await api.getSubreddits();
        setSubreddits(data);
      } catch (err) {
        console.error("Error fetching subreddits:", err);
      } finally {
        setIsLoadingSubreddits(false);
      }
    };

    fetchSubreddits();
  }, []);

  return (
    <Grid container spacing={3}>
      {/* Main content */}
      <Grid item xs={12} md={8}>
        <SortBar
          currentSort={sortOption}
          onSortChange={(sort) => setSortOption(sort)}
        />
        {renderPosts()}
      </Grid>

      {/* Sidebar */}
      <Grid item xs={12} md={4}>
        <Box className="sticky top-20">
          <PopularCommunitiesSidebar
            subreddits={subreddits}
            isLoading={isLoadingSubreddits}
          />

          <Card>
            <CardContent>
              <Typography
                variant="h6"
                component="h2"
                className="font-medium mb-2"
              >
                About Reddit Clone
              </Typography>
              <Typography variant="body2">
                This is a Reddit clone created with React, TypeScript,
                Material-UI, and Tailwind CSS. It simulates the core features of
                Reddit, including posts, comments, subreddits, and voting.
              </Typography>
            </CardContent>
          </Card>
        </Box>
      </Grid>
    </Grid>
  );
};

export default HomePage;
