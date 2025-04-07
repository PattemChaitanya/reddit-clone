import {
  Card,
  CardContent,
  Typography,
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
  Avatar,
  Button,
  Divider,
  Skeleton,
} from "@mui/material";
import React from "react";
import { Link } from "react-router-dom";

import { Subreddit } from "../types";

interface PopularCommunitiesSidebarProps {
  subreddits: Subreddit[] | null;
  isLoading: boolean;
}

const PopularCommunitiesSidebar: React.FC<PopularCommunitiesSidebarProps> = ({
  subreddits,
  isLoading,
}) => {
  // Loading state
  if (isLoading) {
    return (
      <Card>
        <CardContent>
          <Skeleton variant="text" height={32} width="80%" />
          <List>
            {[...Array(5)].map((_, index) => (
              <ListItem key={index} disablePadding className="mb-2">
                <ListItemAvatar>
                  <Skeleton variant="circular" width={40} height={40} />
                </ListItemAvatar>
                <ListItemText
                  primary={<Skeleton variant="text" width="60%" />}
                  secondary={<Skeleton variant="text" width="40%" />}
                />
              </ListItem>
            ))}
          </List>
          <Skeleton variant="rectangular" height={36} width="100%" />
        </CardContent>
      </Card>
    );
  }

  // No subreddits data
  if (!subreddits || subreddits.length === 0) {
    return null;
  }

  // Sort subreddits by member count (most popular first)
  const sortedSubreddits = [...subreddits]
    .sort((a, b) => b.memberCount - a.memberCount)
    .slice(0, 5);

  return (
    <Card className="mb-4">
      <CardContent>
        <Typography variant="h6" component="h2" className="font-medium mb-2">
          Popular Communities
        </Typography>

        <Divider className="mb-2" />

        <List disablePadding>
          {sortedSubreddits.map((subreddit) => (
            <ListItem
              key={subreddit.id}
              component={Link}
              to={`/r/${subreddit.name}`}
              disablePadding
              className="mb-2 hover:bg-gray-50 dark:hover:bg-gray-800 rounded-md transition-colors"
              sx={{ textDecoration: "none", color: "inherit" }}
            >
              <ListItemAvatar>
                <Avatar src={subreddit.icon} alt={subreddit.name}>
                  {subreddit.name.charAt(0).toUpperCase()}
                </Avatar>
              </ListItemAvatar>
              <ListItemText
                primary={`r/${subreddit.name}`}
                secondary={`${subreddit.memberCount.toLocaleString()} members`}
              />
            </ListItem>
          ))}
        </List>

        <Button
          variant="outlined"
          fullWidth
          component={Link}
          to="/subreddits"
          className="mt-2"
        >
          View All Communities
        </Button>
      </CardContent>
    </Card>
  );
};

export default PopularCommunitiesSidebar;
