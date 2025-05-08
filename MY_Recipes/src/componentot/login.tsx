"use client"

import type React from "react"
import { useState } from "react"
import { useNavigate } from "react-router-dom"
import axios from "axios"
import { useUser } from "./Context/useContext"
import {
  Box,
  Typography,
  TextField,
  Button,
  Link,
  CircularProgress,
  Card,
  CardContent,
  CardHeader,
  Alert,
  Snackbar,
} from "@mui/material"
import { RestaurantMenu as RestaurantMenuIcon, Login as LoginIcon } from "@mui/icons-material"


const LoginPage: React.FC = () => {
  const [username, setUsername] = useState("")
  const [password, setPassword] = useState("")
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")
  const [showAlert, setShowAlert] = useState(false)
  const navigate = useNavigate()
  const { login } = useUser()

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError("")

    try {
      const res = await axios.post("http://localhost:8080/api/user/login", {
        UserName: username,
        Password: password,
      })

      login(res.data)
      setShowAlert(true)

      // ניווט לאחר הצגת ההודעה
      setTimeout(() => {
        navigate("/recipes")
      }, 1500)
    } catch (error) {
      if (axios.isAxiosError(error) && error.response && error.response.data) {
        setError(error.response.data)
      } else {
        setError("התחברות נכשלה, אנא נסו שוב.")
      }
    } finally {
      setLoading(false)
    }
  }

  return (
    <Box
      sx={{
        position: "relative",
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        p: 2,
      }}
    >
      {/* רקע */}
      <Box
        sx={{
          position: "absolute",
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundImage: "url(https://www.k-tov.com/wp-content/uploads/2022/11/2673995-min.jpg)",
          backgroundSize: "cover",
          backgroundPosition: "center",
          filter: "blur(8px) brightness(0.7)",
          zIndex: -1,
        }}
      />

      <Card
        sx={{
          maxWidth: 450,
          width: "100%",
          bgcolor: "rgba(255, 255, 255, 0.95)",
          backdropFilter: "blur(10px)",
          borderRadius: 2,
          boxShadow: 3,
        }}
      >
        <CardHeader
          title={
            <Box sx={{ textAlign: "center" }}>
              <RestaurantMenuIcon sx={{ fontSize: 48, color: "#FFB74D", mb: 1 }} />
              <Typography variant="h4" component="h1" sx={{ fontWeight: "bold" }}>
                התחברות
              </Typography>
              <Typography variant="body1" color="text.secondary" sx={{ mt: 1 }}>
                הזינו את פרטי ההתחברות שלכם כדי להמשיך
              </Typography>
            </Box>
          }
        />
        <CardContent>
          <Box component="form" onSubmit={handleLogin} sx={{ mt: 1 }}>
            <TextField
              margin="normal"
              required
              fullWidth
              id="username"
              label="שם משתמש"
              name="username"
              autoComplete="username"
              autoFocus
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              sx={{ mb: 2 }}
            />
            <TextField
              margin="normal"
              required
              fullWidth
              name="password"
              label="סיסמה"
              type="password"
              id="password"
              autoComplete="current-password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              sx={{ mb: 3 }}
            />

            {error && (
              <Alert severity="error" sx={{ mb: 2 }}>
                {error}
              </Alert>
            )}

            <Button
              type="submit"
              fullWidth
              variant="contained"
              disabled={loading}
              sx={{
                py: 1.5,
                bgcolor: "#FFB74D",
                "&:hover": { bgcolor: "#FFA726" },
                mb: 2,
              }}
            >
              {loading ? (
                <CircularProgress size={24} color="inherit" />
              ) : (
                <>
                  <LoginIcon sx={{ mr: 1 }} />
                  התחברות
                </>
              )}
            </Button>

            <Box sx={{ display: "flex", justifyContent: "space-between", mt: 1 }}>
              <Link href="#" variant="body2" sx={{ color: "#FFB74D" }}>
                שכחתי סיסמה
              </Link>
              <Link
                href="#"
                variant="body2"
                onClick={(e) => {
                  e.preventDefault()
                  navigate("/signup")
                }}
                sx={{ color: "#FFB74D" }}
              >
                אין לך חשבון? הירשם עכשיו
              </Link>
            </Box>
          </Box>
        </CardContent>
      </Card>

      <Snackbar
        open={showAlert}
        autoHideDuration={2000}
        onClose={() => setShowAlert(false)}
        anchorOrigin={{ vertical: "top", horizontal: "center" }}
      >
        <Alert severity="success" sx={{ width: "100%" }}>
          התחברת בהצלחה! מעביר אותך למתכונים...
        </Alert>
      </Snackbar>
    </Box>
  )
}

export default LoginPage

// import { useContext, useState } from "react";
// import axios from 'axios';
// import { observer } from "mobx-react-lite";
// import { Link } from "react-router-dom";
// import { TextField, Button, Typography, Box, Paper } from '@mui/material';
// import { useNavigate } from 'react-router-dom';
// //import userStore from '../stores/userStore'; // ייבוא ה-UserStore
// import { useUser } from "./useContext";

// const LoginPage = observer(() => {
//   const [username, setUsername] = useState("");
//   const [password, setPassword] = useState("");
//   const [error, setError] = useState(''); // הוספת מצב שגיאה

//   const navigate = useNavigate();
//   const { saveUser } = useUser(); // גישה ל-saveUser מהקונטקסט

//   const reset = () => {
//     setUsername("");
//     setPassword("");
//   };


//   const onSend = async () => {
//     try {
//       const res = await axios.post("http://localhost:8080/api/user/login", {
//         username: username,
//         password: password
//       });
  
//       if (res.data) {
//         const loggedInUser = {
//           Id: res.data.id,
//           UserName: res.data.username,
//           Name: res.data.name,
//           Phone: res.data.phone,
//           Email: res.data.email,
//           Tz: res.data.tz,
//         };
//         saveUser(loggedInUser); // שמירת המשתמש בקונטקסט
//         navigate("/recipes"); // נווט לדף המתכונים אם הכניסה הצליחה
//       }
//     } catch (error) {
//       const errorMessage = (error as Error).message; // Type assertion
//       setError(errorMessage);
//     reset();
//     }
//   };
  
//   return (
//     <>
//     <Box
//       sx={{
//         position: "fixed",
//         top: 0,
//         left: 0,
//         height: "100vh",
//         width: "100vw",
//         display: "flex",
//         justifyContent: "center",
//         alignItems: "center",
//         backgroundColor: "rgba(255, 255, 255, 0.5)",
//         overflow: "hidden",
//       }}
//     >
//       <Paper
//         elevation={3}
//         sx={{
//           padding: 5,
//           borderRadius: "12px",
//           backgroundColor: "rgba(255, 255, 255, 0.8)",
//           width: "400px",
//           textAlign: "center",
//           boxShadow: "0px 4px 10px rgba(0, 0, 0, 0.1)",
//         }}
//       >
//         <Typography variant="h4" fontWeight="600" color="text.primary" gutterBottom>
//           התחברות
//         </Typography>
//         <TextField
//           label="Username"
//           value={username}
//           required
//           onChange={({ target }) => setUsername(target.value)}
//           fullWidth
//           sx={{ marginBottom: 2 }}
//         />
//         <TextField
//           label="Password"
//           type="password"
//           required
//           value={password}
//           onChange={({ target }) => setPassword(target.value)}
//           fullWidth
//           sx={{ marginBottom: 2 }}
//         />
//         <Button variant="contained" size="large" onClick={onSend} sx={{ backgroundColor: "#000000", "&:hover": { backgroundColor: "#333333" } }}>
//           כניסה
//         </Button>
//         {error && <div>{error}</div>} {/* הצגת הודעת שגיאה */},
//         {error === "user not found!" && <Link to={"/logup"}>להרשמה הקליקו כאן👇</Link>}
//       </Paper>
//     </Box>
//     </>
//   );
// });

// export default LoginPage;

