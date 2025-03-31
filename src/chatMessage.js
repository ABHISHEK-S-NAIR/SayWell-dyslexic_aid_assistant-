import React from "react";
import { useTheme } from "@mui/material/styles";

const ChatMessage = ({ msg, index }) => {
  const theme = useTheme();

  return (
    <div
      key={index}  
      style={{
        marginBottom: "10px",
        display: "flex",
        justifyContent: msg.sender === "You" ? "flex-end" : "flex-start",
        width: "100%",
      }}
    >
      <div
        style={{
          padding: "10px 15px",
          borderRadius: "20px",
          backgroundColor:
            msg.sender === "You"
              ? theme.palette.primary.light
              : theme.palette.secondary.textinput,
          color: 
            msg.sender === "You"
              ? theme.palette.primary.contrastText
              : theme.palette.text.primary,
          maxWidth: "70%",
          wordWrap: "break-word",
        }}
      >
        {msg.text}
      </div>
    </div>
  );
};

export default ChatMessage;
