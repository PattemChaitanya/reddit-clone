import {
  Search as SearchIcon,
  // Brightness4 as DarkModeIcon,
  // Brightness7 as LightModeIcon,
  Menu as MenuIcon,
  ArrowDropDown as ArrowDropDownIcon,
} from "@mui/icons-material";
import {
  AppBar,
  Toolbar,
  // IconButton,
  Typography,
  InputBase,
  Button,
  Avatar,
  Menu,
  MenuItem,
  Divider,
  Box,
  useTheme,
} from "@mui/material";
import React, { useState } from "react";
// import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";

// import { RootState } from "../store";
import { useGetSubredditsQuery } from "../store/api";
// import { toggleTheme } from "../store/slices/themeSlice";

const Header: React.FC = () => {
  const theme = useTheme();
  const navigate = useNavigate();
  // const dispatch = useDispatch();
  // const { darkMode } = useSelector((state: RootState) => state.theme);
  const [searchQuery, setSearchQuery] = useState("");
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [communityAnchorEl, setCommunityAnchorEl] =
    useState<null | HTMLElement>(null);

  const { data: subreddits } = useGetSubredditsQuery();

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/search?q=${encodeURIComponent(searchQuery)}`);
      setSearchQuery("");
    }
  };

  const handleUserMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleUserMenuClose = () => {
    setAnchorEl(null);
  };

  const handleCommunityMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
    setCommunityAnchorEl(event.currentTarget);
  };

  const handleCommunityMenuClose = () => {
    setCommunityAnchorEl(null);
  };

  // const handleThemeToggle = () => {
  //   dispatch(toggleTheme());
  // };

  return (
    <AppBar
      position="sticky"
      color="inherit"
      elevation={1}
      className="border-b border-reddit-border dark:border-reddit-border-dark"
    >
      <Toolbar className="container mx-auto px-2">
        {/* Logo */}
        <Link to="/" className="flex items-center mr-4">
          <Typography
            variant="h6"
            className="font-bold tracking-tight flex items-center"
            sx={{ color: theme.palette.secondary.main }}
          >
            <span className="text-reddit-orange">Reddit</span>
            <span className="text-reddit-blue">Clone</span>
          </Typography>
        </Link>

        {/* Communities Dropdown */}
        <Button
          aria-controls="community-menu"
          aria-haspopup="true"
          onClick={handleCommunityMenuOpen}
          className="text-left mr-4 hidden md:flex"
          startIcon={<MenuIcon />}
          endIcon={<ArrowDropDownIcon />}
        >
          Communities
        </Button>
        <Menu
          id="community-menu"
          anchorEl={communityAnchorEl}
          keepMounted
          open={Boolean(communityAnchorEl)}
          onClose={handleCommunityMenuClose}
        >
          {subreddits?.slice(0, 10).map((subreddit) => (
            <MenuItem
              key={subreddit.id}
              component={Link}
              to={`/r/${subreddit.name}`}
              onClick={handleCommunityMenuClose}
            >
              <Avatar
                src={subreddit.icon}
                alt={subreddit.name}
                className="mr-2"
                sx={{ width: 24, height: 24 }}
              />
              r/{subreddit.name}
            </MenuItem>
          ))}
          <Divider />
          <MenuItem
            component={Link}
            to="/subreddits"
            onClick={handleCommunityMenuClose}
          >
            View All Communities
          </MenuItem>
        </Menu>

        {/* Search Bar */}
        <Box className="flex-grow mx-4">
          <form onSubmit={handleSearch} className="relative w-full">
            <Box className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <SearchIcon className="text-gray-400" />
            </Box>
            <InputBase
              placeholder="Search Reddit"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-3 py-2 rounded-full bg-gray-100 dark:bg-gray-800"
              inputProps={{ "aria-label": "search" }}
            />
          </form>
        </Box>

        {/* Theme Toggle */}
        {/* <IconButton
          onClick={handleThemeToggle}
          color="inherit"
          aria-label="toggle theme"
        >
          {darkMode ? <LightModeIcon /> : <DarkModeIcon />}
        </IconButton> */}

        {/* User Menu */}
        <Button
          aria-controls="user-menu"
          aria-haspopup="true"
          onClick={handleUserMenuOpen}
          className="ml-2"
          startIcon={
            <Avatar
              sx={{ width: 32, height: 32 }}
              src="https://www.redditstatic.com/avatars/defaults/v2/avatar_default_1.png"
            />
          }
          endIcon={<ArrowDropDownIcon />}
        >
          <span className="hidden md:inline">User</span>
        </Button>
        <Menu
          id="user-menu"
          anchorEl={anchorEl}
          keepMounted
          open={Boolean(anchorEl)}
          onClose={handleUserMenuClose}
        >
          <MenuItem
            component={Link}
            to="/user/profile"
            onClick={handleUserMenuClose}
          >
            Profile
          </MenuItem>
          <MenuItem
            component={Link}
            to="/settings"
            onClick={handleUserMenuClose}
          >
            Settings
          </MenuItem>
          <Divider />
          <MenuItem onClick={handleUserMenuClose}>Sign Out</MenuItem>
        </Menu>
      </Toolbar>
    </AppBar>
  );
};

export default Header;
