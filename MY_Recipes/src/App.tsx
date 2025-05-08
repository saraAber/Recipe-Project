"use client"

import type React from "react"
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom"
import { UserProvider, useUser } from "./componentot/Context/useContext"
import CatContextProvider from "./componentot/Context/Context"
import LoginPage from "./componentot/login"
import SignupPage from "./componentot/signUp"
import GetRecipes from "./componentot/getAll"
import GetRecipeById from "./componentot/getById"
import AddRecipe from "./componentot/addRecipe"
import EditRecipe from "./componentot/editRecipe"
import HomePage from "./componentot/home"
import AppLayout from "./componentot/appLayot"
import RecipeDetail from "./componentot/RecipeDetail"

// שינוי ה-ProtectedRoute כדי לנתב לדף התחברות במקום לדף הבית
const ProtectedRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user } = useUser()
  return user ? <>{children}</> : <Navigate to="/login" />
}

const App: React.FC = () => {
  return (
    <UserProvider>
      <CatContextProvider>
        <Router>
          <AppLayout>
            <Routes>
              <Route path="/" element={<HomePage />} />
              <Route path="/login" element={<LoginPage />} />
              <Route path="/signup" element={<SignupPage />} />
              <Route
                path="/recipes"
                element={
                  <ProtectedRoute>
                    <GetRecipes />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/getById/:id"
                element={
                  <ProtectedRoute>
                    <GetRecipeById />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/addRecipe"
                element={
                  <ProtectedRoute>
                    <AddRecipe />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/editRecipe/:id"
                element={
                  <ProtectedRoute>
                    <EditRecipe />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/DetailRecipe/:id"
                element={
                  <ProtectedRoute>
                    <RecipeDetail />
                  </ProtectedRoute>
                }
              />
              <Route path="*" element={<Navigate to="/" />} /> {/* ברירת מחדל לדף הבית */}
            </Routes>
          </AppLayout>
        </Router>
      </CatContextProvider>
    </UserProvider>
  )
}

export default App