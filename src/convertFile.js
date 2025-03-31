import React, { useState } from "react";
import { Paper, Button, Typography } from "@mui/material";

const ConvertFile = () => {
  const [selectedFile, setSelectedFile] = useState(null);

  const handleFileChange = (event) => {
    setSelectedFile(event.target.files[0]);
  };

  const handleDrop = (event) => {
    event.preventDefault();
    setSelectedFile(event.dataTransfer.files[0]);
  };

  const handleUpload = () => {
    if (!selectedFile) return;
    console.log("Uploading:", selectedFile);
    // Replace with actual API call
  };

  return (
    <Paper
      elevation={3}
      sx={{
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        height: "80vh",
        padding: 4,
      }}
    >
      <div
        onDragOver={(e) => e.preventDefault()}
        onDrop={handleDrop}
        style={{
          width: "80%",
          height: "50%",
          border: "2px dashed #aaa",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          textAlign: "center",
          cursor: "pointer",
        }}
      >
        {selectedFile ? (
          <Typography>{selectedFile.name}</Typography>
        ) : (
          <Typography>Drag & Drop a file here or click to select</Typography>
        )}
      </div>
      <input
        type="file"
        onChange={handleFileChange}
        style={{ display: "none" }}
        id="fileInput"
      />
      <label htmlFor="fileInput">
        <Button variant="contained" color="primary" component="span" sx={{ mt: 2 }}>
          Select File
        </Button>
      </label>
      <Button
        variant="contained"
        color="secondary"
        onClick={handleUpload}
        disabled={!selectedFile}
        sx={{ mt: 2 }}
      >
        Upload File
      </Button>
    </Paper>
  );
};

export default ConvertFile;
