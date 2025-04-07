import { Home as HomeIcon } from "@mui/icons-material";
import {
  Grid,
  Box,
  Typography,
  Card,
  CardContent,
  Breadcrumbs,
  Link as MuiLink,
  Alert,
  Skeleton,
} from "@mui/material";
import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { Link } from "react-router-dom";

import CommentSection from "../components/CommentSection";
import PostCard from "../components/PostCard";
import SubredditSidebar from "../components/SubredditSidebar";
import { api } from "../services/api";
import { Post, Comment } from "../types";
// These imports are commented out since they're not currently used
// Uncomment them when switching to RTK Query implementation
import // useGetPostQuery,
// useGetSubredditQuery,
// useVotePostMutation,
// useAddCommentMutation,
// useVoteCommentMutation,
"../store/api";

const PostDetailPage: React.FC = () => {
  const { subreddit, postId } = useParams<{
    subreddit: string;
    postId: string;
  }>();
  // const navigate = useNavigate(); // Commented out as it's not used
  const [post, setPost] = useState<Post | null>(null);
  const [comments, setComments] = useState<Comment[]>([]);
  const [subredditInfo, setSubredditInfo] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isLoadingSubreddit, setIsLoadingSubreddit] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // In a real application, we would use these RTK Query hooks instead of the useState hooks above
  // const { data: postData, isLoading, error } = useGetPostQuery({ postId });
  // const { data: subredditInfo, isLoading: isLoadingSubreddit } = useGetSubredditQuery(subreddit);
  // const [votePost] = useVotePostMutation();
  // const [voteComment] = useVoteCommentMutation();
  // const [addComment] = useAddCommentMutation();

  // Fetch post and comments
  useEffect(() => {
    const fetchPostData = async () => {
      setIsLoading(true);
      setError(null);

      try {
        if (!postId) {
          setError("Post ID is missing.");
          return;
        }

        const data = await api.getPost(postId);

        if (!data) {
          setError("Post not found.");
          return;
        }

        setPost(data.post);
        setComments(data.comments);
      } catch (err) {
        console.error("Error fetching post details:", err);
        setError("Failed to load post details. Please try again later.");
      } finally {
        setIsLoading(false);
      }
    };

    if (postId) {
      fetchPostData();
    }
  }, [postId]);

  // Fetch subreddit info
  useEffect(() => {
    const fetchSubredditInfo = async () => {
      setIsLoadingSubreddit(true);

      try {
        if (!subreddit) {
          return;
        }

        const data = await api.getSubreddit(subreddit);
        setSubredditInfo(data);
      } catch (err) {
        console.error("Error fetching subreddit info:", err);
      } finally {
        setIsLoadingSubreddit(false);
      }
    };

    if (subreddit) {
      fetchSubredditInfo();
    }
  }, [subreddit]);

  // Handle post voting
  const handleVote = async (postId: string, direction: 1 | 0 | -1) => {
    try {
      await api.votePost(postId, direction);

      // Update local state
      setPost((prev) => {
        if (!prev) return null;

        // Remove previous vote if any
        let upvotes = prev.upvotes;
        let downvotes = prev.downvotes;

        if (prev.userVote === 1) upvotes--;
        if (prev.userVote === -1) downvotes--;

        // Add new vote
        if (direction === 1) upvotes++;
        if (direction === -1) downvotes++;

        return {
          ...prev,
          upvotes,
          downvotes,
          userVote: direction,
        };
      });
    } catch (err) {
      console.error("Error voting on post:", err);
      setError("Failed to register your vote. Please try again.");
    }
  };

  // Handle comment voting
  const handleCommentVote = async (
    commentId: string,
    direction: 1 | 0 | -1
  ) => {
    try {
      await api.voteComment(commentId, direction);

      // Update local state
      const updateCommentVote = (commentList: Comment[]): Comment[] => {
        return commentList.map((comment) => {
          if (comment.id === commentId) {
            // Remove previous vote if any
            let upvotes = comment.upvotes;
            let downvotes = comment.downvotes;

            if (comment.userVote === 1) upvotes--;
            if (comment.userVote === -1) downvotes--;

            // Add new vote
            if (direction === 1) upvotes++;
            if (direction === -1) downvotes++;

            return {
              ...comment,
              upvotes,
              downvotes,
              userVote: direction,
              replies: comment.replies
                ? updateCommentVote(comment.replies)
                : undefined,
            };
          } else if (comment.replies && comment.replies.length > 0) {
            return {
              ...comment,
              replies: updateCommentVote(comment.replies),
            };
          }
          return comment;
        });
      };

      setComments(updateCommentVote(comments));
    } catch (err) {
      console.error("Error voting on comment:", err);
    }
  };

  // Handle adding a comment
  const handleAddComment = async (content: string, parentId?: string) => {
    try {
      if (!postId) {
        console.error("Post ID is missing");
        return;
      }

      const newComment = await api.addComment(postId, content, parentId);

      if (!parentId) {
        // Add top-level comment
        setComments((prev) => [...prev, newComment]);
        // Update comment count
        setPost((prev) => {
          if (!prev) return null;
          return { ...prev, commentCount: prev.commentCount + 1 };
        });
      } else {
        // Add reply to existing comment
        const addReplyToComment = (commentList: Comment[]): Comment[] => {
          return commentList.map((comment) => {
            if (comment.id === parentId) {
              return {
                ...comment,
                replies: [...(comment.replies || []), newComment],
              };
            } else if (comment.replies && comment.replies.length > 0) {
              return {
                ...comment,
                replies: addReplyToComment(comment.replies),
              };
            }
            return comment;
          });
        };

        setComments(addReplyToComment(comments));
      }
    } catch (err) {
      console.error("Error adding comment:", err);
    }
  };

  // Handle subreddit subscription toggle
  const handleSubscribe = async (subredditId: string) => {
    try {
      const isSubscribed = await api.toggleSubredditSubscription(subredditId);

      setSubredditInfo((prev: any) => {
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

  // Render loading skeleton, error, or content
  const renderContent = () => {
    if (isLoading) {
      return (
        <Box>
          <Card className="mb-4">
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
                <Skeleton variant="rectangular" height={200} className="my-2" />
                <Skeleton variant="text" width="80%" />
                <Skeleton variant="text" width="70%" />
              </CardContent>
            </Box>
          </Card>

          <Card>
            <CardContent>
              <Skeleton variant="text" width="30%" height={24} />
              <Skeleton variant="rectangular" height={100} className="my-2" />
              <Skeleton variant="text" width="100%" />

              <Box className="mt-4">
                <Skeleton variant="text" width="40%" />
                <Box className="ml-6 mt-2">
                  <Skeleton variant="text" width="90%" />
                  <Skeleton variant="text" width="70%" />
                  <Skeleton variant="text" width="80%" />
                </Box>
              </Box>
            </CardContent>
          </Card>
        </Box>
      );
    }

    if (error || !post) {
      return (
        <Alert
          severity="error"
          className="mb-4"
          action={
            <MuiLink
              component={Link}
              to={subreddit ? `/r/${subreddit}` : "/"}
              color="inherit"
              variant="body2"
            >
              Go Back
            </MuiLink>
          }
        >
          {error || "Post not found."}
        </Alert>
      );
    }

    return (
      <Box>
        <PostCard post={post} onVote={handleVote} />
        <CommentSection
          comments={comments}
          onAddComment={handleAddComment}
          onVoteComment={handleCommentVote}
        />
      </Box>
    );
  };

  return (
    <Box>
      {/* Breadcrumbs navigation */}
      <Breadcrumbs className="mb-4">
        <MuiLink
          component={Link}
          to="/"
          color="inherit"
          className="flex items-center"
        >
          <HomeIcon fontSize="small" className="mr-1" />
          Home
        </MuiLink>

        {subreddit && (
          <MuiLink component={Link} to={`/r/${subreddit}`} color="inherit">
            r/{subreddit}
          </MuiLink>
        )}

        <Typography color="text.primary">
          {isLoading ? <Skeleton width={100} /> : post?.title}
        </Typography>
      </Breadcrumbs>

      <Grid container spacing={3}>
        {/* Main content */}
        <Grid item xs={12} md={8}>
          {renderContent()}
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
    </Box>
  );
};

export default PostDetailPage;
