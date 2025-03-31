import { auth, db } from './firebaseauth';
import { 
    createUserWithEmailAndPassword,
    signInWithEmailAndPassword,
    signOut,
    updateProfile,
    GoogleAuthProvider,
    signInWithPopup
} from 'firebase/auth';
import { doc, setDoc, getDoc } from 'firebase/firestore';
import { useContext } from 'react';
import AllContext from '../AllContext';

const googleProvider = new GoogleAuthProvider();

export const signInWithGoogle = async () => {
    try {
        const result = await signInWithPopup(auth, googleProvider);
        const user = result.user;

        // Check if user data exists in Firestore
        const userDoc = await getDoc(doc(db, "users", user.uid));
        
        if (!userDoc.exists()) {
            // If user doesn't exist in Firestore, create a new document
            const names = user.displayName ? user.displayName.split(' ') : ['', ''];
            const userData = {
                email: user.email,
                firstName: names[0] || '',
                lastName: names.slice(1).join(' ') || '',
                createdAt: new Date().toISOString(),
                provider: 'google'
            };
            await setDoc(doc(db, "users", user.uid), userData);
        }

        localStorage.setItem('loggedInUserId', user.uid);
        return user;
    } catch (error) {
        console.error('Google Sign In Error:', error);
        throw new Error('Could not sign in with Google. Please try again.');
    }
};

export const signUp = async (setUserId, email, password, firstName, lastName) => {
    try {
        console.log('Starting signup process...');
        console.log("Email:", email, "Password:", password);
        const userCredential = await createUserWithEmailAndPassword(auth, email, password);
        console.log('User created:', userCredential);
        
        const user = userCredential.user;
        console.log(user)

        // Update the user profile with first and last name
        await updateProfile(user, {
            displayName: `${firstName} ${lastName}`.trim()
        });
        console.log('Profile updated');

        // Store additional user data in Firestore
        const userData = {
            email: email,
            firstName: firstName,
            lastName: lastName,
            createdAt: new Date().toISOString(),
            provider: 'email'
        };
        setUserId(user.uid)
        // Add user data to Firestore
        await setDoc(doc(db, "users", user.uid), userData);
        console.log('Firestore data added');

        return user;
    } catch (error) {
        console.error('Signup error:', error);
        if (error.code === 'auth/email-already-in-use') {
            throw new Error('Email address already exists!');
        } else {
            throw new Error(`Unable to create user: ${error.message}`);
        }
    }
};

export const signIn = async (setUserId,email, password) => {
    try {
        const userCredential = await signInWithEmailAndPassword(auth, email, password);
        localStorage.setItem('loggedInUserId', userCredential.user.uid);
        setUserId(userCredential.user.uid)
        return userCredential.user;
    } catch (error) {
        console.error('Login error:', error);
        if (error.code === 'auth/invalid-credential') {
            throw new Error('Incorrect email or password');
        } else {
            throw new Error('Account does not exist');
        }
    }
};

export const logout = async () => {
    try {
        await signOut(auth);
        localStorage.removeItem('loggedInUserId');
    } catch (error) {
        console.error('Logout error:', error);
        throw error;
    }
};