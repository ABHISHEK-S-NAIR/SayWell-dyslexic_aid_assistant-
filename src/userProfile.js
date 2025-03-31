import React, { useState, useEffect } from 'react';
import { 
  Container, 
  Typography, 
  Paper, 
  Box, 
  Tabs, 
  Tab, 
  List, 
  ListItem, 
  ListItemText, 
  IconButton, 
  Divider, 
  TextField, 
  Button,
  Avatar,
  Grid,
  Chip,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Snackbar,
  Alert,
  CircularProgress
} from '@mui/material';
import { useTheme } from '@mui/material/styles';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import PersonIcon from '@mui/icons-material/Person';
import SaveIcon from '@mui/icons-material/Save';
import { useContext } from 'react';
import AllContext from './AllContext';

// TabPanel component for tab content
function TabPanel(props) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`simple-tabpanel-${index}`}
      aria-labelledby={`simple-tab-${index}`}
      {...other}
    >
      {value === index && (
        <Box sx={{ p: 3 }}>
          {children}
        </Box>
      )}
    </div>
  );
}

function UserProfile() {
  const theme = useTheme();
  const { nickname, setNickname } = useContext(AllContext);
  const [tabValue, setTabValue] = useState(0);
  const [customWords, setCustomWords] = useState([]);
  const [loading, setLoading] = useState(true);
  const [openDialog, setOpenDialog] = useState(false);
  const [wordToEdit, setWordToEdit] = useState({ word: '', index: -1 });
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const [snackbarSeverity, setSnackbarSeverity] = useState('success');
  const [newNickname, setNewNickname] = useState(nickname || '');
  const [savingNickname, setSavingNickname] = useState(false);

  // Fetch user's custom dictionary
  useEffect(() => {
    fetchCustomDictionary();
  }, [nickname]);

  const fetchCustomDictionary = async () => {
    try {
      setLoading(true);
      const userId = nickname || 'default';
      const response = await fetch(`http://localhost:5000/api/get-custom-words?userId=${userId}`);
      
      if (response.ok) {
        const data = await response.json();
        if (data.success && data.words) {
          setCustomWords(data.words); // Use the words array directly
        } else {
          console.log("No words found or error:", data);
          setCustomWords([]);
        }
      } else {
        showSnackbar('Failed to load custom dictionary', 'error');
        setCustomWords([]);
      }
    } catch (error) {
      console.error('Error fetching custom dictionary:', error);
      showSnackbar('Error loading custom dictionary', 'error');
      setCustomWords([]);
    } finally {
      setLoading(false);
    }
  };

  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
  };

  const handleDeleteWord = async (word) => {
    try {
      const userId = nickname || 'default';
      const response = await fetch(`http://localhost:5000/api/delete-custom-word?userId=${encodeURIComponent(userId)}&word=${encodeURIComponent(word)}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        }
      });

      if (response.ok) {
        setCustomWords(customWords.filter(w => w !== word));
        showSnackbar(`"${word}" removed from dictionary`, 'success');
      } else {
        showSnackbar('Failed to delete word', 'error');
      }
    } catch (error) {
      console.error('Error deleting word:', error);
      showSnackbar('Error deleting word', 'error');
    }
  };

  const handleEditClick = (word, index) => {
    setWordToEdit({ word, index });
    setOpenDialog(true);
  };

  const handleDialogClose = () => {
    setOpenDialog(false);
    setWordToEdit({ word: '', index: -1 });
  };

  const handleSaveEdit = async () => {
    if (!wordToEdit.word.trim()) {
      showSnackbar('Word cannot be empty', 'error');
      return;
    }

    try {
      const userId = nickname || 'default';
      const oldWord = customWords[wordToEdit.index];
      
      // Delete old word
      await fetch('http://localhost:5000/api/delete-custom-word', {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ word: oldWord, userId }),
      });
      
      // Add new word
      const response = await fetch('http://localhost:5000/api/add-custom-word', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ word: wordToEdit.word, userId }),
      });

      const data = await response.json();
      
      if (response.ok) {
        if (data.duplicate) {
          showSnackbar(`"${wordToEdit.word}" is already in your dictionary`, 'warning');
          // Remove the old word from the list
          setCustomWords(customWords.filter(w => w !== oldWord));
        } else {
          const newWords = [...customWords];
          newWords[wordToEdit.index] = wordToEdit.word;
          setCustomWords(newWords);
          showSnackbar('Word updated successfully', 'success');
        }
      } else {
        showSnackbar('Failed to update word', 'error');
      }
    } catch (error) {
      console.error('Error updating word:', error);
      showSnackbar('Error updating word', 'error');
    }

    handleDialogClose();
  };

  const handleUpdateNickname = async () => {
    if (!newNickname.trim()) {
      showSnackbar('Nickname cannot be empty', 'error');
      return;
    }

    if (newNickname === nickname) {
      showSnackbar('New nickname is the same as current one', 'info');
      return;
    }

    try {
      setSavingNickname(true);
      const response = await fetch('http://localhost:5000/api/update-nickname', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ 
          nickname: newNickname,
          oldNickname: nickname || 'default'
        }),
      });

      if (response.ok) {
        const data = await response.json();
        setNickname(newNickname);
        localStorage.setItem('saywell_nickname', newNickname);
        showSnackbar('Nickname updated successfully', 'success');
        // Fetch dictionary with new nickname
        await fetchCustomDictionary();
      } else {
        showSnackbar('Failed to update nickname', 'error');
      }
    } catch (error) {
      console.error('Error updating nickname:', error);
      showSnackbar('Error updating nickname', 'error');
    } finally {
      setSavingNickname(false);
    }
  };

  const showSnackbar = (message, severity = 'success') => {
    setSnackbarMessage(message);
    setSnackbarSeverity(severity);
    setSnackbarOpen(true);
  };

  const handleSnackbarClose = () => {
    setSnackbarOpen(false);
  };

  return (
    <Container maxWidth="md">
      <Paper 
        elevation={3} 
        sx={{ 
          p: 4, 
          mt: 4, 
          backgroundColor: theme.palette.background.paper,
          borderRadius: '12px'
        }}
      >
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 4 }}>
          <Avatar 
            sx={{ 
              width: 80, 
              height: 80, 
              bgcolor: theme.palette.primary.main,
              mr: 3
            }}
          >
            <PersonIcon fontSize="large" />
          </Avatar>
          <Box>
            <Typography variant="h4" component="h1" gutterBottom>
              {nickname || 'User'}'s Profile
            </Typography>
            <Typography variant="body1" color="text.secondary">
              Manage your personal settings and custom dictionary
            </Typography>
          </Box>
        </Box>

        <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
          <Tabs 
            value={tabValue} 
            onChange={handleTabChange} 
            aria-label="profile tabs"
            textColor="primary"
            indicatorColor="primary"
          >
            <Tab label="Custom Dictionary" />
            <Tab label="Profile Settings" />
          </Tabs>
        </Box>

        <TabPanel value={tabValue} index={0}>
          <Typography variant="h6" gutterBottom>
            Your Custom Dictionary
          </Typography>
          <Typography variant="body2" paragraph>
            These are words you've added to your personal dictionary. SayWell will recognize these as correctly spelled.
          </Typography>

          {loading ? (
            <Box sx={{ display: 'flex', justifyContent: 'center', py: 4 }}>
              <CircularProgress />
            </Box>
          ) : customWords.length === 0 ? (
            <Box sx={{ textAlign: 'center', py: 4 }}>
              <Typography variant="body1" color="text.secondary">
                You haven't added any words to your dictionary yet.
              </Typography>
              <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                Use the "Add word to dictionary" button in the chat to add words.
              </Typography>
            </Box>
          ) : (
            <Grid container spacing={2} sx={{ mt: 2 }}>
              {customWords.map((word, index) => (
                <Grid item xs={12} sm={6} md={4} key={index}>
                  <Chip
                    label={word}
                    onDelete={() => handleDeleteWord(word)}
                    deleteIcon={<DeleteIcon />}
                    sx={{ 
                      width: '100%', 
                      justifyContent: 'space-between',
                      height: 'auto',
                      py: 1,
                      fontSize: '1rem',
                      '& .MuiChip-label': { 
                        whiteSpace: 'normal',
                        overflow: 'visible',
                      }
                    }}
                  />
                </Grid>
              ))}
            </Grid>
          )}
          
          <Box sx={{ mt: 4, textAlign: 'center' }}>
            <Button 
              variant="outlined" 
              color="primary" 
              onClick={fetchCustomDictionary}
              startIcon={loading ? <CircularProgress size={20} /> : null}
              disabled={loading}
            >
              Refresh Dictionary
            </Button>
          </Box>
        </TabPanel>

        <TabPanel value={tabValue} index={1}>
          <Typography variant="h6" gutterBottom>
            Profile Settings
          </Typography>
          <Typography variant="body2" paragraph>
            Manage your profile information and preferences.
          </Typography>
          
          <Box sx={{ mt: 3 }}>
            <TextField
              label="Current Nickname"
              value={nickname || ''}
              fullWidth
              margin="normal"
              disabled
              helperText="This is your current display name in the app"
            />
            
            <Box sx={{ mt: 3, display: 'flex', alignItems: 'flex-start' }}>
              <TextField
                label="New Nickname"
                value={newNickname}
                onChange={(e) => setNewNickname(e.target.value)}
                fullWidth
                margin="normal"
                helperText="Enter a new nickname to update your profile"
              />
              <Button
                variant="contained"
                color="primary"
                startIcon={savingNickname ? <CircularProgress size={20} color="inherit" /> : <SaveIcon />}
                onClick={handleUpdateNickname}
                disabled={savingNickname || !newNickname.trim() || newNickname === nickname}
                sx={{ mt: 3, ml: 2, height: 56 }}
              >
                Save
              </Button>
            </Box>
            
            {/* Additional profile settings can be added here */}
          </Box>
        </TabPanel>
      </Paper>

      {/* Edit Word Dialog */}
      <Dialog open={openDialog} onClose={handleDialogClose}>
        <DialogTitle>Edit Word</DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            label="Word"
            type="text"
            fullWidth
            variant="outlined"
            value={wordToEdit.word}
            onChange={(e) => setWordToEdit({ ...wordToEdit, word: e.target.value })}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleDialogClose}>Cancel</Button>
          <Button onClick={handleSaveEdit} variant="contained">Save</Button>
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
    </Container>
  );
}

export default UserProfile;
