"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { useParams, useNavigate } from "react-router-dom"
import { useUser } from "./Context/useContext"
import axios from "axios"
import {
  Box,
  Container,
  Typography,
  Button,
  Grid,
  Paper,
  Chip,
  Breadcrumbs,
  Link,
  CircularProgress,
  Card,
  CardMedia,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  useTheme,
  useMediaQuery,
} from "@mui/material"
import {
  ArrowBack as ArrowBackIcon,
  AccessTime as AccessTimeIcon,
  FavoriteBorder as FavoriteBorderIcon,
  Favorite as FavoriteIcon,
  Share as ShareIcon,
  Print as PrintIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  RestaurantMenu as RestaurantMenuIcon,
  FiberManualRecord as FiberManualRecordIcon,
} from "@mui/icons-material"

interface Ingredient {
  Id: number
  Name: string
  Count: string
  Type: string
}

interface Instruction {
  Id: number
  Name: string
}

interface Recipe {
  Id: number
  Name: string
  UserId: number
  Categoryid: number | null
  Img: string
  Duration: number
  Difficulty: string
  Description: string
  Ingridents: Ingredient[]
  Instructions: Instruction[]
}

const RecipeDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const { user } = useUser()

  const [recipe, setRecipe] = useState<Recipe | null>(null)
  const [loading, setLoading] = useState<boolean>(true)
  const [error, setError] = useState<string>("")
  const [isDeleting, setIsDeleting] = useState<boolean>(false)
  const [isFavorite, setIsFavorite] = useState<boolean>(false)
  const [deleteDialogOpen, setDeleteDialogOpen] = useState<boolean>(false)

  const theme = useTheme()
  const isMobile = useMediaQuery(theme.breakpoints.down("md"))

  useEffect(() => {
    const fetchRecipe = async () => {
      try {
        const response = await axios.get(`http://localhost:8080/api/recipe/${id}`)
        setRecipe(response.data)

        // בדיקה אם המתכון במועדפים (לדוגמה)
        const favorites = JSON.parse(localStorage.getItem("favorites") || "[]")
        setIsFavorite(favorites.includes(Number(id)))
      } catch (error) {
        console.error("Failed to fetch recipe:", error)
        setError("לא ניתן לטעון את המתכון. אנא נסו שוב מאוחר יותר.")
      } finally {
        setLoading(false)
      }
    }

    if (id) {
      fetchRecipe()
    }
  }, [id])
  
  const handleDelete = async () => {
    setIsDeleting(true);
    try {
      // חשוב: שליחת אובייקט עם שדה Id במבנה הנכון
      const response = await axios.post(`http://localhost:8080/api/recipe/delete/${id}`, { Id: Number(id) });
      console.log("תגובת השרת למחיקה:", response.data);
      
      // הודעת הצלחה
      alert("המתכון נמחק בהצלחה");
      
      // ניווט לדף המתכונים
      navigate("/recipes");
    } catch (error) {
      console.error("Error deleting recipe:", error);
      alert("מחיקת המתכון נכשלה");
    } finally {
      setIsDeleting(false);
      setDeleteDialogOpen(false);
    }
  };

  const toggleFavorite = () => {
    const favorites = JSON.parse(localStorage.getItem("favorites") || "[]")
    const recipeIdNum = Number(id)

    if (isFavorite) {
      const updatedFavorites = favorites.filter((id: number) => id !== recipeIdNum)
      localStorage.setItem("favorites", JSON.stringify(updatedFavorites))
      setIsFavorite(false)
      alert("המתכון הוסר מהמועדפים")
    } else {
      favorites.push(recipeIdNum)
      localStorage.setItem("favorites", JSON.stringify(favorites))
      setIsFavorite(true)
      alert("המתכון נוסף למועדפים")
    }
  }

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: recipe?.Name || "מתכון מעולה",
          text: recipe?.Description || "בדקו את המתכון המדהים הזה!",
          url: window.location.href,
        })
      } catch (error) {
        console.error("Error sharing:", error)
      }
    } else {
      // העתקה ללוח אם Web Share API לא נתמך
      navigator.clipboard.writeText(window.location.href)
      alert("הקישור הועתק ללוח")
    }
  }

  const handlePrint = () => {
    window.print()
  }

  if (loading) {
    return (
      <Box
        sx={{
          minHeight: "80vh",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          bgcolor: "background.default",
        }}
      >
        <CircularProgress sx={{ color: "#FFB74D" }} />
        <Typography variant="h6" sx={{ ml: 2 }}>
          טוען את המתכון...
        </Typography>
      </Box>
    )
  }

  if (error || !recipe) {
    return (
      <Container maxWidth="md" sx={{ py: 8, textAlign: "center" }}>
        <RestaurantMenuIcon sx={{ fontSize: 60, color: "text.disabled", mb: 2 }} />
        <Typography variant="h4" gutterBottom>
          המתכון לא נמצא
        </Typography>
        <Typography variant="body1" color="text.secondary" paragraph>
          {error || "לא הצלחנו למצוא את המתכון המבוקש. ייתכן שהוא הוסר או שהקישור שגוי."}
        </Typography>
        <Button
          variant="contained"
          onClick={() => navigate("/recipes")}
          sx={{
            bgcolor: "#FFB74D",
            "&:hover": { bgcolor: "#FFA726" },
          }}
        >
          חזרה לכל המתכונים
        </Button>
      </Container>
    )
  }

  const isOwner = user?.Id === recipe.UserId

  return (
    <Box
      sx={{
        bgcolor: "#f5f5f5",
        minHeight: "100vh",
        py: 4,
        "@media print": {
          bgcolor: "#fff",
          py: 2,
        },
      }}
    >
      <Container maxWidth="lg">
        {/* פירורי לחם */}
        <Box
          sx={{
            mb: 4,
            "@media print": { display: "none" },
          }}
        >
          <Breadcrumbs aria-label="breadcrumb">
            <Link
              color="inherit"
              href="/"
              onClick={(e) => {
                e.preventDefault()
                navigate("/")
              }}
            >
              ראשי
            </Link>
            <Link
              color="inherit"
              href="/recipes"
              onClick={(e) => {
                e.preventDefault()
                navigate("/recipes")
              }}
            >
              מתכונים
            </Link>
            <Typography color="text.primary">{recipe.Name}</Typography>
          </Breadcrumbs>
        </Box>

        {/* @ts-ignore - מתעלם משגיאת Grid */}
        <Grid container spacing={4}>
          {/* תמונה ראשית */}
          {/* @ts-ignore - מתעלם משגיאת Grid */}
          <Grid item xs={12} md={7} lg={8}>
            <Card
              sx={{
                borderRadius: 2,
                overflow: "hidden",
                position: "relative",
                boxShadow: 2,
              }}
            >
              <CardMedia
                component="img"
                height={isMobile ? "300" : "400"}
                image={recipe.Img || "https://via.placeholder.com/800x600?text=Recipe+Image"}
                alt={recipe.Name}
                sx={{ objectFit: "cover" }}
              />
              <Chip
                label={recipe.Difficulty}
                color="default"
                sx={{
                  position: "absolute",
                  top: 16,
                  right: 16,
                  bgcolor: "rgba(255, 255, 255, 0.9)",
                  fontWeight: "medium",
                }}
              />
            </Card>
          </Grid>

          {/* פרטי מתכון */}
          {/* @ts-ignore - מתעלם משגיאת Grid */}
          <Grid item xs={12} md={5} lg={4}>
            <Paper
              sx={{
                p: 3,
                height: "100%",
                borderRadius: 2,
                display: "flex",
                flexDirection: "column",
                boxShadow: 2,
              }}
            >
              <Typography variant="h4" component="h1" gutterBottom sx={{ fontWeight: "bold" }}>
                {recipe.Name}
              </Typography>

              <Box sx={{ display: "flex", alignItems: "center", mb: 2, color: "text.secondary" }}>
                <AccessTimeIcon sx={{ mr: 1 }} />
                <Typography variant="body1" sx={{ mr: 2 }}>
                  {recipe.Duration} דקות
                </Typography>
                <Typography variant="body1">• {recipe.Difficulty}</Typography>
              </Box>

              <Typography variant="body1" paragraph sx={{ mb: 3 }}>
                {recipe.Description}
              </Typography>

              <Box
                sx={{
                  display: "flex",
                  flexWrap: "wrap",
                  gap: 1,
                  mb: 3,
                  "@media print": { display: "none" },
                }}
              >
                <Button
                  variant="outlined"
                  size="small"
                  startIcon={isFavorite ? <FavoriteIcon color="error" /> : <FavoriteBorderIcon />}
                  onClick={toggleFavorite}
                >
                  {isFavorite ? "הסר מהמועדפים" : "הוסף למועדפים"}
                </Button>

                <Button variant="outlined" size="small" startIcon={<ShareIcon />} onClick={handleShare}>
                  שתף
                </Button>

                <Button variant="outlined" size="small" startIcon={<PrintIcon />} onClick={handlePrint}>
                  הדפס
                </Button>

                {isOwner && (
                  <>
                    <Button
                      variant="outlined"
                      size="small"
                      startIcon={<EditIcon />}
                      onClick={() => navigate(`/editRecipe/${recipe.Id}`)}
                    >
                      ערוך
                    </Button>

                    <Button
                      variant="outlined"
                      size="small"
                      startIcon={<DeleteIcon />}
                      color="error"
                      onClick={() => setDeleteDialogOpen(true)}
                    >
                      מחק
                    </Button>
                  </>
                )}
              </Box>
            </Paper>
          </Grid>
        </Grid>

        {/* @ts-ignore - מתעלם משגיאת Grid */}
        <Grid container spacing={4} sx={{ mt: 2 }}>
          {/* מרכיבים */}
          {/* @ts-ignore - מתעלם משגיאת Grid */}
          <Grid item xs={12} md={4}>
            <Paper sx={{ p: 3, borderRadius: 2, boxShadow: 2 }}>
              <Box sx={{ display: "flex", alignItems: "center", mb: 3 }}>
                <Box
                  sx={{
                    bgcolor: "#FFF3E0",
                    p: 1,
                    borderRadius: 1,
                    mr: 2,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  <RestaurantMenuIcon sx={{ color: "#FFB74D" }} />
                </Box>
                <Typography variant="h5" component="h2" sx={{ fontWeight: "bold" }}>
                  מרכיבים
                </Typography>
              </Box>

              <List disablePadding>
                {recipe.Ingridents.map((ingredient) => (
                  <ListItem key={ingredient.Id} disableGutters sx={{ py: 1 }}>
                    <ListItemIcon sx={{ minWidth: 24 }}>
                      <FiberManualRecordIcon sx={{ fontSize: 10, color: "#FFB74D" }} />
                    </ListItemIcon>
                    <ListItemText
                      primary={
                        <Typography variant="body1">
                          <Box component="span" sx={{ fontWeight: "medium" }}>
                            {ingredient.Name}
                          </Box>
                          <Box component="span" sx={{ color: "text.secondary" }}>
                            {" - "}
                            {ingredient.Count} {ingredient.Type}
                          </Box>
                        </Typography>
                      }
                    />
                  </ListItem>
                ))}
              </List>
            </Paper>
          </Grid>

          {/* הוראות הכנה */}
          {/* @ts-ignore - מתעלם משגיאת Grid */}
          <Grid item xs={12} md={8}>
            <Paper sx={{ p: 3, borderRadius: 2, boxShadow: 2 }}>
              <Typography variant="h5" component="h2" sx={{ fontWeight: "bold", mb: 3 }}>
                הוראות הכנה
              </Typography>

              <List>
                {recipe.Instructions.map((instruction, index) => (
                  <ListItem key={instruction.Id} alignItems="flex-start" sx={{ py: 1.5 }}>
                    <ListItemIcon sx={{ mt: 0.5 }}>
                      <Box
                        sx={{
                          width: 28,
                          height: 28,
                          borderRadius: "50%",
                          bgcolor: "#FFF3E0",
                          color: "#FFB74D",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          fontWeight: "bold",
                        }}
                      >
                        {index + 1}
                      </Box>
                    </ListItemIcon>
                    <ListItemText
                      primary={instruction.Name}
                      primaryTypographyProps={{
                        variant: "body1",
                        color: "text.primary",
                      }}
                    />
                  </ListItem>
                ))}
              </List>
            </Paper>
          </Grid>
        </Grid>

        <Box
          sx={{
            mt: 4,
            textAlign: "center",
            "@media print": { display: "none" },
          }}
        >
          <Button
            variant="text"
            startIcon={<ArrowBackIcon />}
            onClick={() => navigate("/recipes")}
            sx={{ color: "#FFB74D" }}
          >
            חזרה לכל המתכונים
          </Button>
        </Box>
      </Container>

      {/* דיאלוג מחיקה */}
      <Dialog open={deleteDialogOpen} onClose={() => setDeleteDialogOpen(false)}>
        <DialogTitle>האם אתה בטוח?</DialogTitle>
        <DialogContent>
          <DialogContentText>פעולה זו תמחק את המתכון לצמיתות ולא ניתן יהיה לשחזר אותו.</DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDeleteDialogOpen(false)}>ביטול</Button>
          <Button onClick={handleDelete} color="error" disabled={isDeleting} variant="contained">
            {isDeleting ? "מוחק..." : "מחק"}
          </Button>
        </DialogActions>
      </Dialog>

      {/* סגנונות להדפסה (גישה מתוקנת) */}
      <style>
        {`
        @media print {
          @page {
            size: A4;
            margin: 1cm;
          }
          body {
            font-size: 12pt;
          }
        }
      `}
      </style>
    </Box>
  )
}

export default RecipeDetail