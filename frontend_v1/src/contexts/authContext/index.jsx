import React,{ useState,useEffect, useContext } from "react";
import {auth} from "../../firebase/firebase";
import { onAuthStateChanged } from "firebase/auth";

// Create context for Authentication
const AuthContext=React.createContext();

// Custom Hook to use the context 
export function useAuth(){
  return useContext(AuthContext)
}

// Function handles setting the state of users
export function AuthProvider({children}){
  const [currentUser,setCurrentUser]=useState(null);
  const [userLoggedIn,setUserLoggedIn]=useState(false);
  const [loading,setLoading]=useState(true);

  useEffect(()=>{
    const unsubscribe=onAuthStateChanged(auth,initializeUser);
    return unsubscribe;
  },[]);

  async function initializeUser(user) {
    if(user){
      setCurrentUser({...user});
      setUserLoggedIn(true)
    }
    else{
      setCurrentUser(null);
      setUserLoggedIn(false);
    }
    setLoading(false);
  }

  const value={
    currentUser,
    userLoggedIn,
    loading
  }

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  )

}