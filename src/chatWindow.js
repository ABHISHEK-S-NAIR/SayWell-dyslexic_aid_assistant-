import React, { useState, useEffect } from "react";
import { 
  TextField, 
  Button, 
  Paper, 
  IconButton, 
  Tooltip, 
  Dialog, 
  DialogTitle, 
  DialogContent, 
  DialogActions,
  Typography,
  Snackbar,
  Alert
} from "@mui/material";
import { useTheme } from "@mui/material/styles";
import MicIcon from '@mui/icons-material/Mic';
import VolumeUpIcon from '@mui/icons-material/VolumeUp';
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';
import BookmarkAddIcon from '@mui/icons-material/BookmarkAdd';
import ChatMessage from "./chatMessage";
import { useContext } from "react";
import AllContext from "./AllContext";

function ChatWindow() {
  const {messages, setMessages, input, setInput, prefTeachStyle, age, struggleSyllables, nickname} = useContext(AllContext)
  const theme = useTheme(); // Access theme
  const [isListening, setIsListening] = useState(false);
  const [speechSynthesis, setSpeechSynthesis] = useState(null);
  const [recognition, setRecognition] = useState(null);
  const [openDialog, setOpenDialog] = useState(false);
  const [wordToAdd, setWordToAdd] = useState("");
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [snackbarSeverity, setSnackbarSeverity] = useState("success");
  const [selectedMessageIndex, setSelectedMessageIndex] = useState(null);

  // Initialize speech recognition and synthesis on component mount
  useEffect(() => {
    // Initialize speech synthesis
    if (window.speechSynthesis) {
      setSpeechSynthesis(window.speechSynthesis);
    }

    // Initialize speech recognition
    if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
      const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
      const recognitionInstance = new SpeechRecognition();
      recognitionInstance.continuous = false;
      recognitionInstance.interimResults = false;
      recognitionInstance.lang = 'en-US';

      recognitionInstance.onresult = (event) => {
        const transcript = event.results[0][0].transcript;
        setInput(prev => prev + transcript);
        setIsListening(false);
      };

      recognitionInstance.onerror = (event) => {
        console.error('Speech recognition error', event.error);
        setIsListening(false);
      };

      recognitionInstance.onend = () => {
        setIsListening(false);
      };

      setRecognition(recognitionInstance);
    }

    // Cleanup on component unmount
    return () => {
      if (recognition) {
        recognition.stop();
      }
      if (speechSynthesis) {
        speechSynthesis.cancel();
      }
    };
  }, []);

  const toggleListening = () => {
    if (isListening) {
      recognition.stop();
      setIsListening(false);
    } else {
      try {
        recognition.start();
        setIsListening(true);
      } catch (error) {
        console.error('Speech recognition error:', error);
      }
    }
  };

  const speakText = (text) => {
    if (speechSynthesis) {
      // Cancel any ongoing speech
      speechSynthesis.cancel();
      
      // Create a new utterance
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.rate = 0.9; // Slightly slower for better comprehension
      utterance.pitch = 1;
      
      // Speak the text
      speechSynthesis.speak(utterance);
    }
  };

  const handleAddWordClick = (messageIndex) => {
    setSelectedMessageIndex(messageIndex);
    // For user messages, we'll open the dialog to let them specify the word
    setOpenDialog(true);
  };

  const handleDialogClose = () => {
    setOpenDialog(false);
    setWordToAdd("");
  };

  const handleWordInputChange = (e) => {
    setWordToAdd(e.target.value);
  };

  const handleWordToDatabase = async () => {
    if (!wordToAdd.trim()) {
      showSnackbar("Please enter a word to add", "error");
      return;
    }

    try {
      const response = await fetch('http://localhost:5000/api/add-custom-word', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          word: wordToAdd,
          userId: nickname || 'default',
        }),
      });
      if (!response.ok) throw new Error('Failed to add custom word');
      const data = await response.json();
      
      if (data.success) {
        showSnackbar(`"${wordToAdd}" added to your custom dictionary`, "success");
      } else {
        showSnackbar(data.message || "Failed to add word", "error");
      }
    } catch (error) {
      console.error("Error adding word:", error);
      showSnackbar("Error adding word to dictionary", "error");
    }

    handleDialogClose();
  };

  const showSnackbar = (message, severity = "success") => {
    setSnackbarMessage(message);
    setSnackbarSeverity(severity);
    setSnackbarOpen(true);
  };

  const handleSnackbarClose = () => {
    setSnackbarOpen(false);
  };

  const handleAddWordWithVoice = () => {
    if (!recognition) return;

    try {
      // Start listening for the word to add
      recognition.onresult = (event) => {
        const transcript = event.results[0][0].transcript;
        setWordToAdd(transcript);
        setIsListening(false);
      };
      
      recognition.start();
      setIsListening(true);
    } catch (error) {
      console.error('Speech recognition error:', error);
    }
  };

  const sendMessage = async () => {
    if (!input.trim()) return;
  
    setMessages(prevMessages => [...prevMessages, { text: input, sender: "You" }]);
    const currentInput = input;
    setInput(""); // Clear input field

    try {
      const response = await fetch('http://localhost:5000/api/check-spelling', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          text: currentInput,
          userId: nickname || 'default',
          prefTeachStyle: prefTeachStyle,
          age: age,
          struggleSyllables: struggleSyllables,
          nickname: nickname,
        }),
      });
      if (!response.ok) throw new Error('Failed to check spelling');
      const data = await response.json();
      const botResponse = data.corrected_text;
      setMessages(prevMessages => [...prevMessages, { text: botResponse, sender: "Ai" }]);
    } catch (error) {
      console.error('Error:', error);
      setMessages(prevMessages => [...prevMessages, { 
        text: "Sorry, I couldn't process your message. Please try again.", 
        sender: "Ai" 
      }]);
    }
  };

  return (
    <Paper
      style={{
        flexGrow: 1,
        display: "flex",
        flexDirection: "column",
        padding: "20px",
        height: "80vh",
        backgroundColor: theme.palette.background.paper, // Theme background
        color: theme.palette.text.secondary, // Theme text color
      }}
    >
      {/* Chat Messages */}
      <div style={{ flexGrow: 1, overflowY: "auto", marginBottom: "10px" }}>
        {messages.map((msg, index) => (
          <div 
            key={index} 
            style={{ 
              display: 'flex', 
              alignItems: 'center',
              justifyContent: msg.sender === "You" ? "flex-end" : "flex-start",
              width: "100%"
            }}
          >
            {msg.sender === "Ai" && (
              <>
                <Tooltip title="Read aloud">
                  <IconButton 
                    onClick={() => speakText(msg.text)}
                    size="small"
                    sx={{ mr: 1, color: theme.palette.primary.main }}
                  >
                    <VolumeUpIcon />
                  </IconButton>
                </Tooltip>
              </>
            )}
            <ChatMessage msg={msg} />
            {msg.sender === "You" && (
              <Tooltip title="Read aloud">
                <IconButton 
                  onClick={() => speakText(msg.text)}
                  size="small"
                  sx={{ ml: 1, color: theme.palette.primary.main }}
                >
                  <VolumeUpIcon />
                </IconButton>
              </Tooltip>
            )}
          </div>
        ))}
      </div>

      {/* Input Box */}
      <div style={{ display: "flex", gap: "10px" }}>
        <Tooltip title="Add word to dictionary">
          <IconButton 
            onClick={() => handleAddWordClick(messages.length - 1)}
            sx={{
              backgroundColor: theme.palette.success.light,
              color: 'white',
              '&:hover': {
                backgroundColor: theme.palette.success.main,
              }
            }}
          >
            <BookmarkAddIcon />
          </IconButton>
        </Tooltip>
        <TextField
          fullWidth
          variant="outlined"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Type a message..."
          sx={{
            backgroundColor: theme.palette.secondary.textinput, // Themed input field
            color: theme.palette.text.secondary,
            borderRadius: "5px",
          }}
          onKeyPress={(e) => {
            if (e.key === 'Enter') {
              sendMessage();
            }
          }}
        />
        <Tooltip title={isListening ? "Stop listening" : "Start voice input"}>
          <IconButton 
            onClick={toggleListening}
            sx={{
              backgroundColor: isListening ? theme.palette.error.main : theme.palette.primary.main,
              color: 'white',
              '&:hover': {
                backgroundColor: isListening ? theme.palette.error.dark : theme.palette.primary.dark,
              }
            }}
          >
            <MicIcon />
          </IconButton>
        </Tooltip>
        <Button
          variant="contained"
          onClick={sendMessage}
          sx={{
            backgroundColor: theme.palette.primary.main,
            "&:hover": { backgroundColor: theme.palette.primary.dark },
          }}
        >
          Send
        </Button>
      </div>

      {/* Dialog for adding words to dictionary */}
      <Dialog open={openDialog} onClose={handleDialogClose}>
        <DialogTitle>
          <Typography variant="h6" fontWeight="bold">
            Add Word to Dictionary
          </Typography>
        </DialogTitle>
        <DialogContent>
          <Typography variant="body1" sx={{ mb: 2 }}>
            Enter the word you want to add to your custom dictionary:
          </Typography>
          <TextField
            autoFocus
            margin="dense"
            label="Word"
            type="text"
            fullWidth
            variant="outlined"
            value={wordToAdd}
            onChange={handleWordInputChange}
          />
          <Button 
            startIcon={<MicIcon />}
            onClick={handleAddWordWithVoice}
            variant="outlined"
            color="primary"
            sx={{ mt: 2 }}
          >
            {isListening ? "Listening..." : "Say the word"}
          </Button>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleDialogClose} color="primary">
            Cancel
          </Button>
          <Button onClick={handleWordToDatabase} color="primary" variant="contained">
            Add to Dictionary
          </Button>
        </DialogActions>
      </Dialog>

      {/* Snackbar for notifications */}
      <Snackbar 
        open={snackbarOpen} 
        autoHideDuration={5000} 
        onClose={handleSnackbarClose}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert 
          onClose={handleSnackbarClose} 
          severity={snackbarSeverity} 
          sx={{ width: '100%' }}
        >
          {snackbarMessage}
        </Alert>
      </Snackbar>
    </Paper>
  );
}

export default ChatWindow;
