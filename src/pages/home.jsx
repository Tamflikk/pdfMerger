import React from "react";
import { useNavigate } from "react-router-dom";
import { Button, Box, Typography } from "@mui/material";
import FileUploadIcon from "@mui/icons-material/FileUpload";

const Home = () => {
  const navigate = useNavigate();

  const handleFileInputChange = (event) => {
    const files = event.target.files;
    navigate("/merger", { state: { files: Array.from(files) } });
  };

  const handleDragOver = (event) => {
    event.preventDefault();
  };

  const handleDrop = (event) => {
    event.preventDefault();
    navigate("/merger");
  };

  const handleClick = (event) => {
    event.stopPropagation();
    document.getElementById("fileInput").click();
  };

  return (
    <Box
      sx={{
        width: "100vw",
        height: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: "transparent",
      }}
    >
      <Box
        onClick={handleClick}
        onDragOver={handleDragOver}
        onDrop={handleDrop}
        sx={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          border: "2px dashed white",
          borderRadius: 5,
          py: 7,
          px: 20,
          cursor: "pointer",
          position: "fixed",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          transition: ".22s",
          "&:hover": {
            transition: ".22s",
            px: 25,
          },
        }}
      >
        <Typography variant="h3" color="white" gutterBottom>
          Merge PDF
        </Typography>
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: "20px",
          }}
        >
          <Button
            variant="outlined"
            color="inherit"
            startIcon={<FileUploadIcon />}
            onClick={handleClick}
            size="large"
            sx={{
              color: "white",
              borderColor: "white",
              "&:hover": {
                borderColor: "white",
                backgroundColor: "rgba(255, 255, 255, 0.1)",
              },
            }}
          >
            Choose Files
          </Button>
          <Typography color="white" sx={{ cursor: "pointer" }}>
            or drop files here
          </Typography>
        </Box>
        <input
          id="fileInput"
          type="file"
          accept=".pdf"
          multiple
          onChange={handleFileInputChange}
          style={{ display: "none" }}
        />
      </Box>
    </Box>
  );
};

export default Home;
