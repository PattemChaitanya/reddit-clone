import {
  LocalFireDepartment as HotIcon,
  NewReleases as NewIcon,
  TrendingUp as TopIcon,
  ShowChart as ControversialIcon,
} from "@mui/icons-material";
import {
  Box,
  Button,
  ButtonGroup,
  Typography,
  useMediaQuery,
  useTheme,
  Menu,
  MenuItem,
} from "@mui/material";
import React from "react";

import { SortOption } from "../types";

interface SortBarProps {
  currentSort: SortOption;
  onSortChange: (sort: SortOption) => void;
}

const SortBar: React.FC<SortBarProps> = ({ currentSort, onSortChange }) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);

  const handleClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleSortChange = (sort: SortOption) => {
    onSortChange(sort);
    handleClose();
  };

  const sortOptions = [
    { value: "hot", label: "Hot", icon: <HotIcon fontSize="small" /> },
    { value: "new", label: "New", icon: <NewIcon fontSize="small" /> },
    { value: "top", label: "Top", icon: <TopIcon fontSize="small" /> },
    {
      value: "controversial",
      label: "Controversial",
      icon: <ControversialIcon fontSize="small" />,
    },
  ];

  if (isMobile) {
    return (
      <Box className="bg-white dark:bg-gray-800 rounded p-2 mb-4 flex items-center justify-between shadow-sm">
        <Typography variant="subtitle2" color="textSecondary">
          Sort by:
        </Typography>
        <Box className="flex items-center">
          <Button
            startIcon={
              sortOptions.find((opt) => opt.value === currentSort)?.icon
            }
            onClick={handleClick}
            size="small"
            color="inherit"
          >
            {sortOptions.find((opt) => opt.value === currentSort)?.label}
          </Button>
          <Menu
            anchorEl={anchorEl}
            open={Boolean(anchorEl)}
            onClose={handleClose}
          >
            {sortOptions.map((option) => (
              <MenuItem
                key={option.value}
                selected={currentSort === option.value}
                onClick={() => handleSortChange(option.value as SortOption)}
              >
                <Box className="flex items-center">
                  {option.icon}
                  <Typography variant="body2" className="ml-2">
                    {option.label}
                  </Typography>
                </Box>
              </MenuItem>
            ))}
          </Menu>
        </Box>
      </Box>
    );
  }

  return (
    <Box className="bg-white dark:bg-gray-800 rounded p-2 mb-4 flex items-center justify-between shadow-sm">
      <Typography variant="subtitle2" color="textSecondary" className="mr-4">
        Sort by:
      </Typography>
      <ButtonGroup variant="text" size="small">
        {sortOptions.map((option) => (
          <Button
            key={option.value}
            startIcon={option.icon}
            color={currentSort === option.value ? "primary" : "inherit"}
            onClick={() => onSortChange(option.value as SortOption)}
            className="px-3"
          >
            {option.label}
          </Button>
        ))}
      </ButtonGroup>
    </Box>
  );
};

export default SortBar;
