import React from "react";
import { Link } from "react-router-dom";
import { Box, Typography, Button, Container } from "@mui/material";

const NotFoundPage: React.FC = () => {
  return (
    <Container maxWidth="sm">
      <Box
        className="py-12 text-center"
        sx={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          minHeight: "60vh",
        }}
      >
        <Typography variant="h1" className="text-reddit-orange font-bold mb-4">
          404
        </Typography>

        <Typography variant="h4" className="mb-2">
          Page Not Found
        </Typography>

        <Typography
          variant="body1"
          className="text-gray-600 dark:text-gray-400 mb-6"
        >
          The page you're looking for doesn't exist or has been moved.
        </Typography>

        <Button
          variant="contained"
          color="primary"
          component={Link}
          to="/"
          size="large"
        >
          Back to Home
        </Button>
      </Box>
    </Container>
  );
};

export default NotFoundPage;
