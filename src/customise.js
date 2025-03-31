import React, { useContext } from "react";
import { FormControl, InputLabel, MenuItem, Select, Slider, TextField, Button, Paper } from "@mui/material";
import AllContext from "./AllContext";

const Customise = () => {
  const { theme, setTheme } = useContext(AllContext);

  const updateTheme = (key, value) => {
    setTheme((prev) => ({
      ...prev,
      typography: {
        ...prev.typography,
        [key]: value,
      },
      palette: {
        ...prev.palette,
      },
    }));
  };

  const handleColorChange = (key, value) => {
    if(key==='background'){
        setTheme((prev) => ({
            ...prev,
            palette: {
              ...prev.palette,
              [key]: { paper: value },
            },
          }));
    } else if(key==='text'){
        setTheme((prev) => ({
            ...prev,
            palette: {
              ...prev.palette,
              [key]: { primary: value },
            },
          }));
    } else {
        console.log(value)
        setTheme((prev) => ({
            ...prev,
            palette: {
              ...prev.palette,
              [key]: { main: value },
            },
          }));
    }
    
  };

  return (
    <Paper style={{ padding: 20, height: "100vh", display: "flex", flexDirection: "column", gap: 20 }}>
      <h2>Customize Theme</h2>

      {/* Pre-made Themes */}
      <FormControl halfWidth>
        <InputLabel>Pre-made Themes</InputLabel>
        <Select
          onChange={(e) => {
            const selectedTheme = e.target.value;
            setTheme(selectedTheme);
          }}
        >
          <MenuItem value={{
        typography: {
          fontFamily: 'Lexend, Arial',
        },
        palette: {
          primary: {
            main: '#000000',
            default:'#000000'
          },
          secondary: {
            main: '#717171',
            textinput:'#FFFFFF',
            default:'#7a7a7a'
          },
          background: {
            paper: '#a5a5a5',
            default: '#000000',
          },
          text:{
            primary: '#000000',
            default:'#000000'
          }
        },
      }}>Default Mode</MenuItem>
          <MenuItem value={{
        typography: {
          fontFamily: 'Lexend, Arial',
        },
        palette: {
          primary: {
            main: '#593e67',
            default:'#000000'
          },
          secondary: {
            main: '#b85b56',
            textinput:'#FFFFFF',
            default:'#7a7a7a'
          },
          background: {
            paper: '#ffc77d',
            default: '#d1d1d1',
          },
          text:{
            primary: '#000000',
            default:'#000000'
          }
        },
      }}>Sunset Mode</MenuItem>
          <MenuItem value={{
        typography: {
          fontFamily: 'Lexend, Arial',
        },
        palette: {
          primary: {
            main: '#3e332c',
            default:'#000000'
          },
          secondary: {
            main: '#72693d',
            textinput:'#ffffff',
            default:'#7a7a7a'
          },
          background: {
            paper: '#c3ce6a',
            default: '#d1d1d1',
          },
          text:{
            primary: '#000000',
            default:'#000000'
          }
        },
      }}>Forest Mode</MenuItem>
        </Select>
      </FormControl>

      {/* Color Pickers */}
      <TextField
        label="Primary Color"
        type="color"
        fullWidth
        value={theme.palette.primary.main}
        onChange={(e) => handleColorChange("primary", e.target.value)}
      />
      <TextField
        label="Secondary Color"
        type="color"
        fullWidth
        value={theme.palette.secondary.main}
        onChange={(e) => handleColorChange("secondary", e.target.value)}
      />
      <TextField
        label="BackGround Color"
        type="color"
        fullWidth
        value={theme.palette.secondary.main}
        onChange={(e) => handleColorChange("background", e.target.value)}
      />
      <TextField
        label="Text Color"
        type="color"
        fullWidth
        value={theme.palette.text.primary}
        onChange={(e) => handleColorChange("text", e.target.value)}
      />

      {/* Font Customization */}
      <FormControl fullWidth>
        <InputLabel>Font Family</InputLabel>
        <Select
          value={theme.typography.fontFamily || "Arial"}
          onChange={(e) => updateTheme("fontFamily", e.target.value)}
        >
          <MenuItem value="Arial">Arial</MenuItem>
          <MenuItem value="Lexend">Lexend</MenuItem>
          <MenuItem value="Roboto">Roboto</MenuItem>
          <MenuItem value="opendyslexic">opendyslexic</MenuItem>
        </Select>
      </FormControl>

      <Slider
        value={theme.typography.fontSize || 16}
        min={12}
        max={24}
        step={1}
        onChange={(e, value) => updateTheme("fontSize", value)}
        valueLabelDisplay="auto"
        aria-labelledby="font-size-slider"
      />
      <Slider
        value={theme.typography.lineHeight || 1.5}
        min={1}
        max={2}
        step={0.1}
        onChange={(e, value) => updateTheme("lineHeight", value)}
        valueLabelDisplay="auto"
        aria-labelledby="line-spacing-slider"
      />
    </Paper>
  );
};

export default Customise;
