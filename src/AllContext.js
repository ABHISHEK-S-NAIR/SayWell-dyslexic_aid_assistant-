import React, {useState, useEffect} from "react";
import { createContext } from "react";
const AllContext = createContext()

export const AllProvider = ({children}) =>{
    const [theme,setTheme]= useState({
        typography: {
          fontFamily: 'Lexend',
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
            default: '#d1d1d1',
          },
          text:{
            primary: '#000000',
            default:'#000000'
          }
        },
      })
    
    const [input, setInput] = useState('')
    const [aiResponse, setAiResponse] = useState('')
    const [messages, setMessages] = useState([])
    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    const [email, setEmail] = useState('');
    const [userId,setUserId] = useState('')
    const [nickname, setNickname] = useState(() => {
        // Get nickname from localStorage on initial load
        const savedNickname = localStorage.getItem('saywell_nickname');
        return savedNickname || '';
    });
    const [struggleSyllables, setStruggleSyllables] = useState('');
    const [prefTeachStyle, setPrefTeachStyle] = useState('balanced');
    const [age, setAge] = useState(18);

    // Save nickname to localStorage whenever it changes
    useEffect(() => {
        if (nickname) {
            localStorage.setItem('saywell_nickname', nickname);
        }
    }, [nickname]);

    // Custom function to update nickname that ensures it's saved to localStorage
    const updateNickname = (newNickname) => {
        setNickname(newNickname);
        localStorage.setItem('saywell_nickname', newNickname);
    };

    return (
        <AllContext.Provider value={{ 
            theme, setTheme, 
            input, setInput, 
            messages, setMessages, 
            firstName, setFirstName, 
            lastName, setLastName, 
            email, setEmail, 
            userId, setUserId, 
            nickname, setNickname: updateNickname, 
            struggleSyllables, setStruggleSyllables, 
            prefTeachStyle, setPrefTeachStyle, 
            age, setAge 
        }}>
            {children}
        </AllContext.Provider>
    )

}

    


export default AllContext


// { typography: { fontFamily: 'Lexend, Arial',}, palette: { primary: { main: '#000000',default: '#000000' }, secondary: { main: '#7a7a7a',default: '#7a7a7a' }, background: { paper: '#d1d1d1',default: '#d1d1d1',}, text: { primary: '#000000',default: '#000000' } }, }