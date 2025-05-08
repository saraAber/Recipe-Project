// src/context/UserContext.tsx
import React, { createContext, useState, useContext, ReactNode, useEffect } from "react";

interface User {
  Id: number;
  UserName: string;
  Name: string;
  Phone: string;
  Email: string;
  Tz: string;
}

interface UserContextType {
  user: User | null;
  login: (userData: User) => void;
  logout: () => void;
};

export const UserContext = createContext<UserContextType>({
  user: null,
  login: () => {},
  logout: () => {},
});

export const UserProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  // טעינת משתמש מהאחסון המקומי בעת טעינת האפליקציה
  const [user, setUser] = useState<User | null>(() => {
    try {
      const savedUser = localStorage.getItem("user");
      return savedUser ? JSON.parse(savedUser) : null;
    } catch (e) {
      console.error("שגיאה בטעינת נתוני משתמש מאחסון מקומי:", e);
      return null;
    }
  });

  const login = (userData: User) => {
    setUser(userData);
    localStorage.setItem("user", JSON.stringify(userData));
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem("user");
  };

  // בדיקה אם יש משתמש מחובר בעת טעינת הקומפוננטה
  useEffect(() => {
    // כבר מבוצע בהפעלת ה-useState למעלה
  }, []);

  return (
    <UserContext.Provider value={{ user, login, logout }}>
      {children}
    </UserContext.Provider>
  );
};

export const useUser = () => useContext(UserContext);