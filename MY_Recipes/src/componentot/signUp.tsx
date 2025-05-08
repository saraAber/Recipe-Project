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
  Grid,
} from "@mui/material"
import { RestaurantMenu as RestaurantMenuIcon, PersonAdd as PersonAddIcon } from "@mui/icons-material"

interface SignupForm {
  UserName: string
  Password: string
  Name: string
  Phone: string
  Email: string
  Tz: string
}

const SignupPage: React.FC = () => {
  const [formData, setFormData] = useState<SignupForm>({
    UserName: "",
    Password: "",
    Name: "",
    Phone: "",
    Email: "",
    Tz: "",
  })
  const [errors, setErrors] = useState<Partial<SignupForm>>({})
  const [loading, setLoading] = useState(false)
  const [serverError, setServerError] = useState("")
  const [showAlert, setShowAlert] = useState(false)
  const navigate = useNavigate()
  const { login } = useUser()

  const validateForm = (): boolean => {
    const newErrors: Partial<SignupForm> = {}

    if (!formData.UserName) newErrors.UserName = "שם משתמש הוא שדה חובה"
    else if (formData.UserName.length < 3) newErrors.UserName = "שם משתמש חייב להכיל לפחות 3 תווים"

    if (!formData.Password) newErrors.Password = "סיסמה היא שדה חובה"
    else if (formData.Password.length < 6) newErrors.Password = "סיסמה חייבת להכיל לפחות 6 תווים"

    if (!formData.Name) newErrors.Name = "שם מלא הוא שדה חובה"

    if (!formData.Phone) newErrors.Phone = "מספר טלפון הוא שדה חובה"
    else if (!/^\d{9,10}$/.test(formData.Phone)) newErrors.Phone = "מספר טלפון לא תקין"

    if (!formData.Email) newErrors.Email = "אימייל הוא שדה חובה"
    else if (!/\S+@\S+\.\S+/.test(formData.Email)) newErrors.Email = "כתובת אימייל לא תקינה"

    if (!formData.Tz) newErrors.Tz = "תעודת זהות היא שדה חובה"
    else if (!/^\d{9}$/.test(formData.Tz)) newErrors.Tz = "תעודת זהות חייבת להכיל 9 ספרות"

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))

    // ניקוי שגיאה ספציפית בעת שינוי שדה
    if (errors[name as keyof SignupForm]) {
      setErrors((prev) => ({ ...prev, [name]: undefined }))
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!validateForm()) return

    setLoading(true)
    setServerError("")

    try {
      const res = await axios.post("http://localhost:8080/api/user/sighin", formData, {
        headers: { "Content-Type": "application/json" },
      })

      if (res.data && res.data.Id) {
        setShowAlert(true)

        // ניווט לאחר הצגת ההודעה
        setTimeout(() => {
          navigate("/login")
        }, 2000)
      } else {
        setServerError("שגיאה בהרשמה. נסה שוב.")
      }
    } catch (error) {
      if (axios.isAxiosError(error) && error.response) {
        setServerError("משתמש זה כבר קיים במערכת. נסה להתחבר.")
      } else {
        setServerError("שגיאה בחיבור לשרת. נסה שוב מאוחר יותר.")
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
        py: 4,
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
          maxWidth: 600,
          width: "100%",
          bgcolor: "rgba(255, 255, 255, 0.95)",
          backdropFilter: "blur(10px)",
          borderRadius: 2,
          boxShadow: 3,
          my: 4,
        }}
      >
        <CardHeader
          title={
            <Box sx={{ textAlign: "center" }}>
              <RestaurantMenuIcon sx={{ fontSize: 48, color: "#FFB74D", mb: 1 }} />
              <Typography variant="h4" component="h1" sx={{ fontWeight: "bold" }}>
                הרשמה
              </Typography>
              <Typography variant="body1" color="text.secondary" sx={{ mt: 1 }}>
                צרו חשבון חדש כדי להתחיל לשתף ולגלות מתכונים
              </Typography>
            </Box>
          }
        />
        <CardContent>
          <Box component="form" onSubmit={handleSubmit} sx={{ mt: 1 }}>
            <Grid container spacing={2}>
              <Grid item xs={12} sm={6}>
                <TextField
                  margin="normal"
                  required
                  fullWidth
                  id="UserName"
                  label="שם משתמש"
                  name="UserName"
                  autoComplete="username"
                  value={formData.UserName}
                  onChange={handleChange}
                  error={!!errors.UserName}
                  helperText={errors.UserName}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  margin="normal"
                  required
                  fullWidth
                  name="Password"
                  label="סיסמה"
                  type="password"
                  id="Password"
                  autoComplete="new-password"
                  value={formData.Password}
                  onChange={handleChange}
                  error={!!errors.Password}
                  helperText={errors.Password}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  margin="normal"
                  required
                  fullWidth
                  id="Name"
                  label="שם מלא"
                  name="Name"
                  autoComplete="name"
                  value={formData.Name}
                  onChange={handleChange}
                  error={!!errors.Name}
                  helperText={errors.Name}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  margin="normal"
                  required
                  fullWidth
                  id="Phone"
                  label="טלפון"
                  name="Phone"
                  autoComplete="tel"
                  value={formData.Phone}
                  onChange={handleChange}
                  error={!!errors.Phone}
                  helperText={errors.Phone}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  margin="normal"
                  required
                  fullWidth
                  id="Email"
                  label="אימייל"
                  name="Email"
                  autoComplete="email"
                  value={formData.Email}
                  onChange={handleChange}
                  error={!!errors.Email}
                  helperText={errors.Email}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  margin="normal"
                  required
                  fullWidth
                  id="Tz"
                  label="תעודת זהות"
                  name="Tz"
                  value={formData.Tz}
                  onChange={handleChange}
                  error={!!errors.Tz}
                  helperText={errors.Tz}
                />
              </Grid>
            </Grid>

            {serverError && (
              <Alert severity="error" sx={{ mt: 2 }}>
                {serverError}
              </Alert>
            )}

            <Button
              type="submit"
              fullWidth
              variant="contained"
              disabled={loading}
              sx={{
                mt: 3,
                py: 1.5,
                bgcolor: "#FFB74D",
                "&:hover": { bgcolor: "#FFA726" },
              }}
            >
              {loading ? (
                <CircularProgress size={24} color="inherit" />
              ) : (
                <>
                  <PersonAddIcon sx={{ mr: 1 }} />
                  הרשמה
                </>
              )}
            </Button>

            <Box sx={{ textAlign: "center", mt: 2 }}>
              <Link
                href="#"
                variant="body2"
                onClick={(e) => {
                  e.preventDefault()
                  navigate("/login")
                }}
                sx={{ color: "#FFB74D" }}
              >
                כבר יש לך חשבון? לחץ כאן להתחברות
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
          ההרשמה בוצעה בהצלחה! מעביר אותך לדף ההתחברות...
        </Alert>
      </Snackbar>
    </Box>
  )
}

export default SignupPage
