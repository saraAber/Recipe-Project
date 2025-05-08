import React from "react";
import axios from "axios";
import { createContext, ReactElement, useEffect, useState } from "react";

// הגדרת סוג של קטגוריות
type catContextType = {
  categories: Array<{ Id: number; Name: string }> | null; 
  setCategories: (categories: Array<{ Id: number; Name: string }>) => void;
};

// יצירת קונטקסט
export const CatContext = createContext<catContextType>({
  categories: null,
  setCategories: () => {},
});

const CatContextProvider = ({ children }: { children: ReactElement }) => {
  const [categories, setCategories] = useState<Array<{ Id: number; Name: string }> | null>(null);

  // פונקציה לעדכון הקטגוריות
  const updateCategories = (cats: Array<{ Id: number; Name: string }>) => {
    setCategories(cats);
  };
  
  const getCategories = async () => {
    try {
      const res = await axios.get("http://localhost:8080/api/category");
      updateCategories(res.data);
    } catch (error) {
      console.error("Error fetching categories", error);
    }
  };

  useEffect(() => {
    getCategories();
  }, [])
  
  return (
    <CatContext.Provider value={{ categories, setCategories: updateCategories }}>
      {children}
    </CatContext.Provider>
  );
};

export default CatContextProvider;