"use client"

import type React from "react"
import { useNavigate } from "react-router-dom"
import { Box, Typography, Button, Card, CardContent, Grid } from "@mui/material"
import {
  RestaurantMenu as RestaurantMenuIcon,
  AccessTime as AccessTimeIcon,
  EmojiPeople as EmojiPeopleIcon,
} from "@mui/icons-material"

interface FeatureCardProps {
  icon: React.ReactNode
  title: string
  description: string
}

const FeatureCard: React.FC<FeatureCardProps> = ({ icon, title, description }) => (
  <Card
    sx={{
      bgcolor: "rgba(255, 255, 255, 0.1)",
      backdropFilter: "blur(8px)",
      border: "none",
      height: "100%",
    }}
  >
    <CardContent sx={{ p: 3, textAlign: "center" }}>
      <Box
        sx={{
          mx: "auto",
          mb: 2,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          width: 64,
          height: 64,
          borderRadius: "50%",
          bgcolor: "rgba(255, 255, 255, 0.1)",
        }}
      >
        {icon}
      </Box>
      <Typography variant="h6" component="h3" sx={{ color: "white", mb: 1 }}>
        {title}
      </Typography>
      <Typography variant="body2" sx={{ color: "rgba(255, 255, 255, 0.8)" }}>
        {description}
      </Typography>
    </CardContent>
  </Card>
)

const HomePage: React.FC = () => {
  const navigate = useNavigate()

  return (
    <Box
      sx={{
        position: "relative",
        minHeight: "100vh",
        overflow: "hidden",
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
          filter: "brightness(0.7)",
          zIndex: -2,
        }}
      />

      {/* שכבת גרדיאנט */}
      <Box
        sx={{
          position: "absolute",
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: "linear-gradient(to bottom, rgba(0,0,0,0.6), rgba(0,0,0,0.3))",
          zIndex: -1,
        }}
      />

      {/* תוכן */}
      <Box
        sx={{
          position: "relative",
          zIndex: 1,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          minHeight: "100vh",
          px: 2,
          py: 5,
          textAlign: "center",
        }}
      >
        <Box
          sx={{
            mb: 4,
            animation: "fadeInDown 0.6s ease-out",
            "@keyframes fadeInDown": {
              from: {
                opacity: 0,
                transform: "translateY(-20px)",
              },
              to: {
                opacity: 1,
                transform: "translateY(0)",
              },
            },
          }}
        >
          <RestaurantMenuIcon sx={{ fontSize: 80, color: "amber.400", mb: 2 }} />
          <Typography
            variant="h2"
            component="h1"
            sx={{
              mt: 2,
              fontWeight: "bold",
              color: "white",
              fontSize: { xs: "2.5rem", md: "3.5rem" },
            }}
          >
            ברוכים הבאים ל
            <Box component="span" sx={{ color: "#FFB74D" }}>
              טעמים
            </Box>
          </Typography>
          <Typography variant="h5" sx={{ mt: 2, color: "rgba(255, 255, 255, 0.9)" }}>
            המקום המושלם לגלות, לשתף וליצור את המתכונים הטעימים ביותר
          </Typography>
        </Box>

        <Grid container spacing={3} sx={{ maxWidth: "lg", width: "100%", mt: 4 }}>
          <Grid item xs={12} md={4}>
            <FeatureCard
              icon={<RestaurantMenuIcon sx={{ fontSize: 32, color: "#FFB74D" }} />}
              title="מתכונים מגוונים"
              description="מגוון מתכונים , מסורתיים וחדשניים"
            />
          </Grid>
          <Grid item xs={12} md={4}>
            <FeatureCard
              icon={<AccessTimeIcon sx={{ fontSize: 32, color: "#FFB74D" }} />}
              title="מהיר וקל"
              description="מתכונים מהירים לימים עמוסים ומתכוני גורמה לאירוח"
            />
          </Grid>
          <Grid item xs={12} md={4}>
            <FeatureCard
              icon={<EmojiPeopleIcon sx={{ fontSize: 32, color: "#FFB74D" }} />}
              title="קהילה תומכת"
              description="שתפו את היצירות שלכם וקבלו השראה מאחרים"
            />
          </Grid>
        </Grid>

        <Box
          sx={{
            display: "flex",
            flexDirection: { xs: "column", sm: "row" },
            gap: 2,
            mt: 6,
          }}
        >
          <Button
            variant="contained"
            size="large"
            onClick={() => navigate("/login")}
            sx={{ 
              bgcolor: "#FFB74D",
              "&:hover": { bgcolor: "#FFA726" },
              px: 4,
              fontSize: "1.1rem",
            }}
          >
            התחברות
          </Button>
          <Button
            variant="outlined"
            size="large"
            onClick={() => navigate("/signup")}
            sx={{
              borderColor: "white",
              color: "white",
              "&:hover": {
                borderColor: "white",
                bgcolor: "rgba(255, 255, 255, 0.1)",
              },
              px: 4,
              fontSize: "1.1rem",
            }}
          >
            הרשמה
          </Button>
        </Box>
      </Box>
    </Box>
  )
}

export default HomePage
