import {
  Box,
  Typography,
  Card,
  CardContent,
  Tabs,
  Tab,
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
  Avatar,
  Divider,
  Alert,
  Skeleton,
} from "@mui/material";
import React, { useState, useEffect } from "react";
import { useLocation, Link } from "react-router-dom";

import PostCard from "../components/PostCard";
import { api } from "../services/api";
import { Post, Subreddit } from "../types";
// These imports are commented out since they're not currently used
// Uncomment them when switching to RTK Query implementation
// import { useSearchQuery, useVotePostMutation } from "../store/api";

const SearchResultsPage: React.FC = () => {
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const query = searchParams.get("q") || "";
  const [tabValue, setTabValue] = useState(0);
  const [searchResults, setSearchResults] = useState<{
    posts: Post[];
    subreddits: Subreddit[];
  } | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // In a real application, we would use this RTK Query hook instead:
  // const { data: searchResults, isLoading, error } = useSearchQuery(query);
  // const [votePost] = useVotePostMutation();

  // Fetch search results
  useEffect(() => {
    const fetchSearchResults = async () => {
      if (!query.trim()) {
        setSearchResults({ posts: [], subreddits: [] });
        setIsLoading(false);
        return;
      }

      setIsLoading(true);
      setError(null);

      try {
        const results = await api.search(query);
        setSearchResults(results);
      } catch (err) {
        console.error("Error fetching search results:", err);
        setError("Failed to load search results. Please try again later.");
      } finally {
        setIsLoading(false);
      }
    };

    fetchSearchResults();
  }, [query]);

  // Handle tab change
  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setTabValue(newValue);
  };

  // Handle post voting
  const handleVote = async (postId: string, direction: 1 | 0 | -1) => {
    if (!searchResults) return;

    try {
      await api.votePost(postId, direction);

      // Update local state
      setSearchResults({
        ...searchResults,
        posts: searchResults.posts.map((post) => {
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
        }),
      });
    } catch (err) {
      console.error("Error voting on post:", err);
    }
  };

  // Render loading skeleton
  if (isLoading) {
    return (
      <Box>
        <Typography variant="h5" className="mb-4">
          <Skeleton width={200} />
        </Typography>

        <Box sx={{ borderBottom: 1, borderColor: "divider", mb: 2 }}>
          <Skeleton variant="rectangular" height={48} />
        </Box>

        {[...Array(3)].map((_, index) => (
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
        ))}
      </Box>
    );
  }

  // Render error message
  if (error) {
    return (
      <Alert severity="error" className="mb-4">
        {error}
      </Alert>
    );
  }

  // No search query
  if (!query.trim()) {
    return (
      <Box className="text-center py-8">
        <Typography variant="h5" gutterBottom>
          Enter a search term to find posts and communities
        </Typography>
      </Box>
    );
  }

  // No search results
  if (
    searchResults &&
    searchResults.posts.length === 0 &&
    searchResults.subreddits.length === 0
  ) {
    return (
      <Box>
        <Typography variant="h5" className="mb-4">
          Search results for "{query}"
        </Typography>

        <Alert severity="info" className="mb-4">
          No results found for "{query}". Try different keywords or check your
          spelling.
        </Alert>
      </Box>
    );
  }

  return (
    <Box>
      <Typography variant="h5" className="mb-4">
        Search results for "{query}"
      </Typography>

      <Box sx={{ borderBottom: 1, borderColor: "divider", mb: 2 }}>
        <Tabs
          value={tabValue}
          onChange={handleTabChange}
          aria-label="search results tabs"
        >
          <Tab
            label={`Posts (${searchResults?.posts.length || 0})`}
            id="search-tab-0"
            aria-controls="search-tabpanel-0"
          />
          <Tab
            label={`Communities (${searchResults?.subreddits.length || 0})`}
            id="search-tab-1"
            aria-controls="search-tabpanel-1"
          />
        </Tabs>
      </Box>

      <Box
        role="tabpanel"
        hidden={tabValue !== 0}
        id="search-tabpanel-0"
        aria-labelledby="search-tab-0"
      >
        {tabValue === 0 && (
          <Box>
            {searchResults?.posts.length === 0 ? (
              <Typography className="py-4">
                No posts found for "{query}".
              </Typography>
            ) : (
              searchResults?.posts.map((post) => (
                <PostCard key={post.id} post={post} onVote={handleVote} />
              ))
            )}
          </Box>
        )}
      </Box>

      <Box
        role="tabpanel"
        hidden={tabValue !== 1}
        id="search-tabpanel-1"
        aria-labelledby="search-tab-1"
      >
        {tabValue === 1 && (
          <Box>
            {searchResults?.subreddits.length === 0 ? (
              <Typography className="py-4">
                No communities found for "{query}".
              </Typography>
            ) : (
              <Card>
                <List>
                  {searchResults?.subreddits.map((subreddit) => (
                    <React.Fragment key={subreddit.id}>
                      <ListItem
                        component={Link}
                        to={`/r/${subreddit.name}`}
                        sx={{ textDecoration: "none", color: "inherit" }}
                        className="hover:bg-gray-50 dark:hover:bg-gray-800"
                      >
                        <ListItemAvatar>
                          <Avatar src={subreddit.icon} alt={subreddit.name}>
                            {subreddit.name.charAt(0).toUpperCase()}
                          </Avatar>
                        </ListItemAvatar>
                        <ListItemText
                          primary={`r/${subreddit.name}`}
                          secondary={
                            <>
                              <Typography
                                component="span"
                                variant="body2"
                                color="text.secondary"
                              >
                                {subreddit.memberCount.toLocaleString()} members
                              </Typography>
                              <br />
                              <Typography
                                component="span"
                                variant="body2"
                                color="text.secondary"
                                className="line-clamp-1"
                              >
                                {subreddit.description}
                              </Typography>
                            </>
                          }
                        />
                      </ListItem>
                      <Divider component="li" />
                    </React.Fragment>
                  ))}
                </List>
              </Card>
            )}
          </Box>
        )}
      </Box>
    </Box>
  );
};

export default SearchResultsPage;
