import {
  Box,
  Card,
  CardMedia,
  CardContent,
  Typography,
  Button,
  Divider,
  Skeleton,
} from "@mui/material";
import { formatDistanceToNow } from "date-fns";
import React from "react";

import { Subreddit } from "../types";

interface SubredditSidebarProps {
  subreddit: Subreddit | null;
  isLoading: boolean;
  onSubscribe: (subredditId: string) => void;
}

const SubredditSidebar: React.FC<SubredditSidebarProps> = ({
  subreddit,
  isLoading,
  onSubscribe,
}) => {
  const handleSubscribe = () => {
    if (subreddit) {
      onSubscribe(subreddit.id);
    }
  };

  // Loading state
  if (isLoading) {
    return (
      <Card className="sticky top-20">
        <Skeleton variant="rectangular" height={80} />
        <CardContent>
          <Skeleton variant="text" height={40} width="80%" />
          <Skeleton variant="text" height={20} width="60%" />
          <Skeleton variant="rectangular" height={100} className="my-2" />
          <Skeleton variant="text" height={30} width="40%" />
          <Skeleton variant="text" height={30} width="60%" />
          <Skeleton variant="rectangular" height={36} className="mt-2" />
        </CardContent>
      </Card>
    );
  }

  // No subreddit data
  if (!subreddit) {
    return null;
  }

  const createdDate = new Date(subreddit.createdAt);
  const createdAgo = formatDistanceToNow(createdDate, { addSuffix: true });
  const formattedMembers = subreddit.memberCount.toLocaleString();

  return (
    <Card className="sticky top-20">
      {/* Banner image or placeholder */}
      {subreddit.banner ? (
        <CardMedia
          component="img"
          height="80"
          image={subreddit.banner}
          alt={`r/${subreddit.name} banner`}
        />
      ) : (
        <Box
          sx={{
            height: 80,
            bgcolor: "rgba(0, 0, 0, 0.1)",
            boxShadow: "inset 0 0 10px rgba(0, 0, 0, 0.15)",
          }}
        />
      )}

      {/* Subreddit icon - positioned to overlap the banner */}
      <Box
        className="absolute"
        sx={{
          top: 40,
          left: 16,
          width: 64,
          height: 64,
          borderRadius: "50%",
          overflow: "hidden",
          border: "4px solid white",
        }}
      >
        <img
          src={subreddit.icon}
          alt={`r/${subreddit.name} icon`}
          className="w-full h-full object-cover"
        />
      </Box>

      <CardContent className="pt-6">
        <Box className="flex items-start justify-between">
          <Box>
            <Typography variant="h6" component="h2">
              r/{subreddit.name}
            </Typography>
            <Typography variant="body2" color="textSecondary">
              {formattedMembers} members
            </Typography>
          </Box>

          <Button
            variant={subreddit.isUserSubscribed ? "outlined" : "contained"}
            color="primary"
            onClick={handleSubscribe}
            size="small"
          >
            {subreddit.isUserSubscribed ? "Joined" : "Join"}
          </Button>
        </Box>

        <Divider className="my-3" />

        <Typography variant="body2" className="mb-3">
          {subreddit.description}
        </Typography>

        <Box className="flex flex-col space-y-2 text-sm">
          <Box>
            <Typography variant="subtitle2">Created</Typography>
            <Typography variant="body2" color="textSecondary">
              {createdDate.toLocaleDateString()} ({createdAgo})
            </Typography>
          </Box>
        </Box>

        <Button
          variant="outlined"
          color="primary"
          fullWidth
          className="mt-3"
          component="a"
          href={`https://www.reddit.com/r/${subreddit.name}`}
          target="_blank"
          rel="noopener noreferrer"
        >
          Visit Original Subreddit
        </Button>
      </CardContent>
    </Card>
  );
};

export default SubredditSidebar;
