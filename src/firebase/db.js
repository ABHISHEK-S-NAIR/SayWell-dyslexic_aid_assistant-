import { db } from "./firebaseauth";
import { doc, setDoc, getDoc } from 'firebase/firestore';

export const addToDB = async (userId, nickname, struggleSyllables, prefTeachStyle, age) => {
    if (!userId) {
        console.error("User ID is undefined!");
        return;
    }
    console.log('userId:', userId);

    try {
        console.log('Adding to DB...');
        const userData = {
            nickname,
            struggleSyllables,
            prefTeachStyle,
            age
        };

        // Add user data to Firestore (merge to keep existing fields)
        await setDoc(doc(db, "users", userId), userData, { merge: true });
        console.log('Firestore data added');

    } catch (error) {
        console.error('Error adding to Firestore:', error);
    }
};
