import { useEffect, useState } from "react";
import { AuthContext } from "./AuthContext";
import {
  createUserWithEmailAndPassword,
  GoogleAuthProvider,
  onAuthStateChanged,
  signInWithEmailAndPassword,
  signInWithPopup,
  signOut,
} from "firebase/auth";
import auth from "../firebase/firebase.config";

const googleProvider = new GoogleAuthProvider();

const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  console.log(user);

  // Create user with email and pass
  const createUserEmailAndPass = (email, pass) => {
    return createUserWithEmailAndPassword(auth, email, pass);
  };

  // Signin user with email and pass
  const signInUser = (email, password) => {
    return signInWithEmailAndPassword(auth, email, password);
  };

  // Create user with google
  const googleSignin = () => {
    return signInWithPopup(auth, googleProvider);
  };

  // Signout user
  const signOutUser = () => {
    return signOut(auth);
  };

  // Unsubscribe
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      setLoading(false);
    });
    return () => unsubscribe();
  }, []);

  const authInfo = {
    createUserEmailAndPass,
    googleSignin,
    signInUser,
    user,
    setUser,
    loading,
    setLoading,
    signOutUser,
  };
  return <AuthContext value={authInfo}>{children}</AuthContext>;
};

export default AuthProvider;
