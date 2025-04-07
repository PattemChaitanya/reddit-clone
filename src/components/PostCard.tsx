import {
  ArrowUpward as UpvoteIcon,
  ArrowDownward as DownvoteIcon,
  Comment as CommentIcon,
  Share as ShareIcon,
  Bookmark as BookmarkIcon,
} from "@mui/icons-material";
import {
  Card,
  CardContent,
  CardMedia,
  Typography,
  Box,
  IconButton,
  Avatar,
  Chip,
} from "@mui/material";
import { formatDistanceToNow } from "date-fns";
import React from "react";
import { Link } from "react-router-dom";

import { Post } from "../types";

interface PostCardProps {
  post: Post;
  onVote: (postId: string, direction: 1 | 0 | -1) => void;
}

const PostCard: React.FC<PostCardProps> = ({ post, onVote }) => {
  const {
    id,
    title,
    content,
    author,
    subreddit,
    upvotes,
    downvotes,
    userVote,
    commentCount,
    createdAt,
    type,
    url,
    thumbnail,
  } = post;

  const score = upvotes - downvotes;
  const postUrl = `/r/${subreddit}/comments/${id}/${title
    .replace(/\s+/g, "-")
    .toLowerCase()}`;
  const timeAgo = formatDistanceToNow(new Date(createdAt), { addSuffix: true });

  const handleVote = (direction: 1 | 0 | -1) => {
    onVote(id, direction);
  };

  const renderMediaContent = () => {
    if (type === "image" && thumbnail) {
      return (
        <CardMedia
          component="img"
          image={thumbnail}
          alt={title}
          sx={{ maxHeight: 400, objectFit: "contain" }}
        />
      );
    } else if (type === "link" && thumbnail) {
      return (
        <Box sx={{ display: "flex", alignItems: "center", my: 1 }}>
          <CardMedia
            component="img"
            image={thumbnail}
            alt={title}
            sx={{ width: 100, height: 60, objectFit: "cover", borderRadius: 1 }}
          />
          <Typography variant="body2" color="text.secondary" sx={{ ml: 1 }}>
            {url}
          </Typography>
        </Box>
      );
    }

    return null;
  };

  return (
    <Card className="mb-4 hover:shadow-md transition-shadow">
      {/* Vote sidebar */}
      <Box className="flex">
        <Box className="bg-gray-50 dark:bg-gray-800 p-2 flex flex-col items-center">
          <IconButton
            size="small"
            onClick={() => handleVote(1)}
            color={userVote === 1 ? "primary" : "default"}
            aria-label="upvote"
          >
            <UpvoteIcon />
          </IconButton>

          <Typography
            variant="body2"
            className="font-bold my-1"
            color={
              userVote === 1
                ? "primary"
                : userVote === -1
                ? "error"
                : "textPrimary"
            }
          >
            {score}
          </Typography>

          <IconButton
            size="small"
            onClick={() => handleVote(-1)}
            color={userVote === -1 ? "error" : "default"}
            aria-label="downvote"
          >
            <DownvoteIcon />
          </IconButton>
        </Box>

        {/* Post content */}
        <CardContent className="flex-1 px-3 py-2">
          {/* Post metadata */}
          <Box
            sx={{
              display: "flex",
              flexWrap: "wrap",
              alignItems: "center",
              fontSize: "0.75rem",
              color: "text.secondary",
              mb: 1.5,
              gap: "4px",
            }}
          >
            <Link
              to={`/r/${subreddit}`}
              className="no-underline hover:underline"
            >
              <Box sx={{ display: "flex", alignItems: "center" }}>
                <Avatar
                  alt={`r/${subreddit}`}
                  src={`https://styles.redditmedia.com/t5_${subreddit}/styles/communityIcon.png`}
                  sx={{ width: 20, height: 20, mr: 0.5 }}
                />
                <Typography component="span" variant="caption">
                  r/{subreddit}
                </Typography>
              </Box>
            </Link>

            <Typography component="span" variant="caption" sx={{ mx: 0.5 }}>
              •
            </Typography>

            <Typography component="span" variant="caption">
              Posted by
            </Typography>

            <Link
              to={`/user/${author.username}`}
              className="no-underline hover:underline"
            >
              <Typography component="span" variant="caption">
                u/{author.username}
              </Typography>
            </Link>

            <Typography component="span" variant="caption" sx={{ mx: 0.5 }}>
              •
            </Typography>

            <Typography component="span" variant="caption">
              {timeAgo}
            </Typography>
          </Box>

          {/* Post title */}
          <Link to={postUrl}>
            <Typography variant="h6" className="mb-2 hover:underline">
              {title}
            </Typography>
          </Link>

          {/* Post media content */}
          {renderMediaContent()}

          {/* Post text content (only show first 3 lines) */}
          {type === "text" && (
            <Typography
              variant="body2"
              className="mb-3 overflow-hidden line-clamp-3"
              style={{
                display: "-webkit-box",
                WebkitLineClamp: 3,
                WebkitBoxOrient: "vertical",
              }}
            >
              {content}
            </Typography>
          )}

          {/* Post actions */}
          <Box className="flex items-center mt-2">
            <IconButton
              size="small"
              component={Link}
              to={postUrl}
              aria-label="comments"
            >
              <CommentIcon fontSize="small" />
              <Typography variant="body2" className="ml-1">
                {commentCount} Comments
              </Typography>
            </IconButton>

            <IconButton size="small" className="ml-2" aria-label="share">
              <ShareIcon fontSize="small" />
              <Typography variant="body2" className="ml-1">
                Share
              </Typography>
            </IconButton>

            <IconButton size="small" className="ml-2" aria-label="save">
              <BookmarkIcon fontSize="small" />
              <Typography variant="body2" className="ml-1">
                Save
              </Typography>
            </IconButton>

            {type === "link" && url && (
              <Chip
                size="small"
                label={new URL(url).hostname.replace("www.", "")}
                className="ml-auto"
                variant="outlined"
                component="a"
                href={url}
                target="_blank"
                rel="noopener noreferrer"
                clickable
              />
            )}
          </Box>
        </CardContent>
      </Box>
    </Card>
  );
};

export default PostCard;
