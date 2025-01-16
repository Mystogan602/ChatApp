// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { createUserWithEmailAndPassword, getAuth, signInWithEmailAndPassword, signOut } from "firebase/auth";
import { doc, getFirestore, serverTimestamp, setDoc } from "firebase/firestore";
import { getStorage } from "firebase/storage";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyC8ELPz71KLUAl8hhGCHH6jFagD6q-h6WA",
  authDomain: "chatapp-7823d.firebaseapp.com",
  projectId: "chatapp-7823d",
  storageBucket: "chatapp-7823d.firebasestorage.app",
  messagingSenderId: "437471147505",
  appId: "1:437471147505:web:2b99859c5b06890a1e8050"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

const auth = getAuth(app);
const db = getFirestore(app);
const storage = getStorage(app);

const signUp = async (username: string, email: string, password: string) => {
  try {
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    const user = userCredential.user;
  await setDoc(doc(db, "users", user.uid), {
    id: user.uid,
    username: username.toLowerCase(),
    email,
    name: "",
    avatar: "",
    bio: "",
    lastSeen: serverTimestamp(),
  });
  await setDoc(doc(db, "userChats", user.uid), {
      chats: [],
    });
  } catch (error) {
    console.error(error);
    throw error;
  }
};

const signIn = async (email: string, password: string) => {
  try {
    await signInWithEmailAndPassword(auth, email, password);
  } catch (error) {
    console.error(error);
    throw error;
  }
};

const signOutUser = async () => {
  try {
    await signOut(auth);
  } catch (error) {
    console.error(error);
    throw error;
  }
};

export { auth, db, storage, signUp, signIn, signOutUser };

export default app;