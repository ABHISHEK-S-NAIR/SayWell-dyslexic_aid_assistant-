import React, { useState } from 'react';
import { Box, Button, Typography, TextField, FormControl, FormLabel, RadioGroup, FormControlLabel, Radio} from '@mui/material';
import { addToDB } from './firebase/db';
import { useNavigate } from 'react-router-dom';
import { useContext } from 'react';
import AllContext from './AllContext';
import { useTheme } from "@mui/material/styles";

function Questionnaire() {
    const { nickname, setNickname, struggleSyllables, setStruggleSyllables, prefTeachStyle, setPrefTeachStyle, age, setAge, userId } = useContext(AllContext);
    const navigate = useNavigate()
    const theme = useTheme()

    const handleSubmit = async () => {
        await addToDB(userId, nickname, struggleSyllables, prefTeachStyle, age)
        // Save nickname to localStorage for persistence
        localStorage.setItem('saywell_nickname', nickname);
        setTimeout(() => {
            navigate('/app');
          }, 1500);
    };

    return (
        <Box sx={{ maxWidth: 500, mx: 'auto', p: 3, display: 'flex', flexDirection: 'column', gap: 2 , backgroundColor: theme.palette.background.paper }}>
            <Typography variant="h5" fontWeight="bold">User Preferences</Typography>
            
            <TextField 
                label="Nickname" 
                variant="outlined" 
                fullWidth 
                value={nickname} 
                onChange={(e) => setNickname(e.target.value)} 
            />
            
            <TextField 
                label="Sounds/Syllables You Struggle With" 
                variant="outlined" 
                fullWidth 
                value={struggleSyllables} 
                onChange={(e) => setStruggleSyllables(e.target.value)} 
                multiline 
                rows={2} 
            />
            
            <FormControl>
                <FormLabel>Preferred Teaching Style</FormLabel>
                <RadioGroup value={prefTeachStyle} onChange={(e) => setPrefTeachStyle(e.target.value)}>
                    <FormControlLabel value="kind & nurturing" control={<Radio />} label="Kind & Encouraging" />
                    <FormControlLabel value="strict & direct" control={<Radio />} label="Strict & Direct" />
                    <FormControlLabel value="balanced" control={<Radio />} label="Somewhere in Between" />
                </RadioGroup>
            </FormControl>

            <FormControl>
                <FormLabel>Age</FormLabel>
                <TextField
                    type="number"
                    value={age}
                    onChange={(e) => setAge(e.target.value)}
                    variant="outlined"
                />
            </FormControl>

            
            <Button variant="contained" color="primary" onClick={handleSubmit}>Submit</Button>
        </Box>
    );
}

export default Questionnaire;