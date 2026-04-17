import React, { useContext, useState } from 'react';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import { Routes, Route } from 'react-router-dom';
import MiniDrawer from './miniDrawer';
import Customise from './customise';
import ConvertFile from './convertFile';
import ChatWindow from './chatWindow';
import UserProfile from './userProfile';
import '@fontsource/lexend';
import '@fontsource/opendyslexic';
import './App.css';
import AllContext from './AllContext';
import Signup from './signup';
import Login from './login';
import Questionnaire from './questionnaire';
import { useTheme } from "@mui/material/styles";
import Paper from "@mui/material/Paper";
import { useMemo } from 'react';

function App() {
  const { theme } = useContext(AllContext)
  const [text, setText] = useState('');
  const [feedback, setFeedback] = useState(null);
  const [isRecording, setIsRecording] = useState(false);

  const themeToSet = createTheme(theme);

  const handleSpeechToText = async () => {
    setIsRecording(true);
    try {
      // Here you would typically handle the audio recording
      // For now, we'll just simulate it
      const response = await fetch('http://localhost:5000/api/speech-to-text', {
        method: 'POST',
      });
      if (!response.ok) throw new Error('Failed to convert speech to text');
      const data = await response.json();
      setText(data.text);
    } catch (error) {
      console.error('Error:', error);
    }
    setIsRecording(false);
  };

  const handleTextUpdate = async () => {
    try {
      const response = await fetch('http://localhost:5000/api/process-text', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ text }),
      });
      if (!response.ok) throw new Error('Failed to process text');
      const data = await response.json();
      setText(() => data.updatedText);  // Ensures instant update
    } catch (error) {
      console.error('Error:', error);
    }
  };
  

  const handleTextToSpeech = async () => {
    try {
      const response = await fetch('http://localhost:5000/api/text-to-speech', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ text }),
      });
      if (!response.ok) throw new Error('Failed to convert text to speech');
      // Here you would typically play the audio
    } catch (error) {
      console.error('Error:', error);
    }
  };

  const checkSpelling = async () => {
    try {
      const response = await fetch('http://localhost:5000/api/check-spelling', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ text }),
      });
      if (!response.ok) throw new Error('Failed to check spelling');
      const data = await response.json();
      setFeedback(data.analysis);
    } catch (error) {
      console.error('Error:', error);
    }
  };


  // const renderFeedback = () => {
  //   if (!feedback) return null;

  //   const getTypeColor = (type) => {
  //     switch (type) {
  //       case 'spelling': return '#f44336';  // Red for spelling errors
  //       case 'informal': return '#ff9800';  // Orange for informal words
  //       case 'improper': return '#9c27b0';  // Purple for improper usage
  //       default: return '#000000';
  //     }
  //   };

  //   const getTypeLabel = (type) => {
  //     switch (type) {
  //       case 'spelling': return 'Spelling Error';
  //       case 'informal': return 'Informal Word';
  //       case 'improper': return 'Improper Usage';
  //       default: return 'Unknown';
  //     }
  //   };

    
  // };

  return (
    <ThemeProvider theme={themeToSet}>
      <div className="App" style={{ backgroundColor: themeToSet.palette.secondary.main, minHeight: '100vh' }}>
        <Routes>
          <Route path="/" element={<Signup />} />
          <Route path="/login" element={<Login />} />
          <Route path="/questionnaire" element={<Questionnaire />} />
          <Route path="/app" element={<MiniDrawer />}>
            <Route path="chatWindow" element={<ChatWindow />} />
            <Route path="customise" element={<Customise />} />
            <Route path="convertfile" element={<ConvertFile />} />
            <Route path="profile" element={<UserProfile />} />
          </Route>
        </Routes>
      </div>
    </ThemeProvider>
  );
}

export default App;