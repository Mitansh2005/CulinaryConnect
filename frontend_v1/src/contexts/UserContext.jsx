// src/contexts/UserContext.js
import { createContext, useContext, useMemo, useState } from "react";
import { getSafeUserData } from "../utils/localStorage";

const UserContext = createContext(null);
// eslint-disable-next-line react/prop-types
export const UserProvider = ({ children }) => {
  // Lazy init: read from localStorage on first render to avoid UI flicker.
  // App.jsx will overwrite this with server-verified data from /auth/me/.
  const [userData, setUserData] = useState(() => getSafeUserData());


  const value = useMemo(
    () => ({
      userData,
      setUserData,
    }),
    [userData],
  );

  return <UserContext.Provider value={value}>{children}</UserContext.Provider>;
};

export const useUser = () => {
  const context = useContext(UserContext);
  if (!context) {
    throw new Error("useUser must be used within a UserProvider");
  }
  return context;
};
