import { Grid, Box, Typography, Card, CardContent, Alert } from "@mui/material";
import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";

import PostCard from "../components/PostCard";
import SortBar from "../components/SortBar";
import SubredditSidebar from "../components/SubredditSidebar";
import { api } from "../services/api";
import { Post, SortOption, Subreddit } from "../types";
// These imports are commented out since they're not currently used
// Uncomment them when switching to RTK Query implementation
// import {
//   useGetSubredditPostsQuery,
//   useGetSubredditQuery,
//   useVotePostMutation,
// } from "../store/api";

const SubredditPage: React.FC = () => {
  const { subreddit } = useParams<{ subreddit: string }>();
  const [sortOption, setSortOption] = useState<SortOption>("hot");
  const [posts, setPosts] = useState<Post[]>([]);
  const [subredditInfo, setSubredditInfo] = useState<Subreddit | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isLoadingSubreddit, setIsLoadingSubreddit] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [subredditError, setSubredditError] = useState<string | null>(null);

  // In a real application, we would use these RTK Query hooks instead of the useState hooks above
  // const { data: posts, isLoading, error } = useGetSubredditPostsQuery({ subreddit, sort: sortOption });
  // const { data: subredditInfo, isLoading: isLoadingSubreddit, error: subredditError } = useGetSubredditQuery(subreddit);
  // const [votePost] = useVotePostMutation();

  // Fetch subreddit info
  useEffect(() => {
    const fetchSubredditInfo = async () => {
      setIsLoadingSubreddit(true);
      setSubredditError(null);

      try {
        if (!subreddit) {
          setSubredditError("Subreddit not specified.");
          return;
        }

        const data = await api.getSubreddit(subreddit);
        setSubredditInfo(data);
        if (!data) {
          setSubredditError("Subreddit not found.");
        }
      } catch (err) {
        console.error("Error fetching subreddit info:", err);
        setSubredditError("Failed to load subreddit information.");
      } finally {
        setIsLoadingSubreddit(false);
      }
    };

    if (subreddit) {
      fetchSubredditInfo();
    }
  }, [subreddit]);

  // Fetch posts based on subreddit and sort option
  useEffect(() => {
    const fetchPosts = async () => {
      setIsLoading(true);
      setError(null);

      try {
        if (!subreddit) {
          setError("Subreddit not specified.");
          return;
        }

        const fetchedPosts = await api.getSubredditPosts(subreddit, sortOption);
        setPosts(fetchedPosts);
      } catch (err) {
        console.error("Error fetching posts:", err);
        setError("Failed to load posts. Please try again later.");
      } finally {
        setIsLoading(false);
      }
    };

    if (subreddit) {
      fetchPosts();
    }
  }, [subreddit, sortOption]);

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

  // Handle subreddit subscription toggle
  const handleSubscribe = async (subredditId: string) => {
    try {
      const isSubscribed = await api.toggleSubredditSubscription(subredditId);

      setSubredditInfo((prev) => {
        if (!prev) return null;

        return {
          ...prev,
          isUserSubscribed: isSubscribed,
          memberCount: isSubscribed
            ? prev.memberCount + 1
            : prev.memberCount - 1,
        };
      });
    } catch (err) {
      console.error("Error toggling subscription:", err);
    }
  };

  // Render loading skeletons, error, or content
  const renderPosts = () => {
    if (isLoading) {
      return [...Array(5)].map((_, index) => (
        <Card className="mb-4" key={index}>
          <Box className="flex">
            <Box
              className="bg-gray-50 dark:bg-gray-800 p-2 flex flex-col items-center"
              sx={{ width: 50 }}
            >
              <Box className="w-5 h-5 bg-gray-200 dark:bg-gray-700 rounded-full" />
              <Box className="w-8 h-5 my-1 bg-gray-200 dark:bg-gray-700" />
              <Box className="w-5 h-5 bg-gray-200 dark:bg-gray-700 rounded-full" />
            </Box>
            <CardContent className="flex-1">
              <Box className="w-3/5 h-5 bg-gray-200 dark:bg-gray-700 mb-1" />
              <Box className="w-2/5 h-4 bg-gray-200 dark:bg-gray-700 mb-2" />
              <Box className="w-full h-32 bg-gray-200 dark:bg-gray-700 mb-2" />
              <Box className="w-4/5 h-4 bg-gray-200 dark:bg-gray-700 mb-1" />
              <Box className="w-3/5 h-4 bg-gray-200 dark:bg-gray-700" />
            </CardContent>
          </Box>
        </Card>
      ));
    }

    if (error || subredditError) {
      return (
        <Alert severity="error" className="mb-4">
          {error || subredditError}
        </Alert>
      );
    }

    if (posts.length === 0) {
      return (
        <Card className="mb-4">
          <CardContent>
            <Typography align="center">
              No posts found in r/{subreddit}. Be the first to post!
            </Typography>
          </CardContent>
        </Card>
      );
    }

    return posts.map((post) => (
      <PostCard key={post.id} post={post} onVote={handleVote} />
    ));
  };

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
        <SubredditSidebar
          subreddit={subredditInfo}
          isLoading={isLoadingSubreddit}
          onSubscribe={handleSubscribe}
        />
      </Grid>
    </Grid>
  );
};

export default SubredditPage;
