"use client"

import type React from "react"
import { useState } from "react"
import { useNavigate } from "react-router-dom"
import axios from "axios"
import { useUser } from "./Context/useContext"
import {
  Card,
  CardMedia,
  CardContent,
  CardActions,
  Typography,
  Button,
  Chip,
  Box,
  IconButton,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
} from "@mui/material"
import { AccessTime as AccessTimeIcon, Edit as EditIcon, Delete as DeleteIcon, Category as CategoryIcon } from "@mui/icons-material"

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
  clientCategoryid?: number | null
}

interface Category {
  Id: number
  Name: string
}

export interface RecipeCardProps {
  recipe: Recipe
  categories?: Category[]
  onCategoryChange?: (recipeId: number, categoryid: number) => void
}

export const RecipeCard: React.FC<RecipeCardProps> = ({ recipe, categories = [], onCategoryChange }) => {
  const [isDeleting, setIsDeleting] = useState<boolean>(false)
  const [deleteDialogOpen, setDeleteDialogOpen] = useState<boolean>(false)
  const [categoryDialogOpen, setCategoryDialogOpen] = useState<boolean>(false)
  const [selectedCategoryid, setSelectedCategoryid] = useState<number | "">(() => {
    return recipe.Categoryid || recipe.clientCategoryid || ""
  })
  
  const navigate = useNavigate()
  const { user } = useUser()

  const handleDelete = async () => {
    setIsDeleting(true);
    try {
      // חשוב - שליחת אובייקט עם שדה Id במבנה הנכון
      const response = await axios.post(`http://localhost:8080/api/recipe/delete/${recipe.Id}`, { Id: recipe.Id });
      console.log("תגובת השרת למחיקה:", response.data);
      
      // הודעת הצלחה
      alert("המתכון נמחק בהצלחה");
      
      // רענון הדף (עם reload) כדי להציג את הרשימה המעודכנת
      window.location.reload();
    } catch (error) {
      console.error("Error deleting recipe:", error);
      alert("מחיקת המתכון נכשלה");
    } finally {
      setIsDeleting(false);
      setDeleteDialogOpen(false);
    }
  };
  
  const handleCategoryDialogOpen = () => {
    setSelectedCategoryid(recipe.Categoryid || recipe.clientCategoryid || "")
    setCategoryDialogOpen(true)
  }
  
  const handleCategoryChange = () => {
    if (selectedCategoryid !== "" && onCategoryChange) {
      onCategoryChange(recipe.Id, Number(selectedCategoryid))
    }
    setCategoryDialogOpen(false)
  }

  const isOwner = user?.Id === recipe.UserId
  
  // בחירת קטגוריה להצגה במתכון
  const categoryToShow = recipe.Categoryid || recipe.clientCategoryid
  const categoryName = categoryToShow && categories.length > 0
    ? categories.find(cat => cat.Id === categoryToShow)?.Name || "קטגוריה לא מוגדרת"
    : "ללא קטגוריה"

  return (
    <Card
      sx={{
        height: "100%",
        display: "flex",
        flexDirection: "column",
        transition: "all 0.3s",
        "&:hover": {
          transform: "translateY(-4px)",
          boxShadow: 3,
        },
        borderRadius: 2,
        overflow: "hidden",
      }}
    >
      <Box sx={{ position: "relative" }}>
        <CardMedia
          component="img"
          height="180"
          image={recipe.Img || "https://via.placeholder.com/400x300?text=Recipe+Image"}
          alt={recipe.Name}
          sx={{ objectFit: "cover" }}
        />
        <Chip
          label={recipe.Difficulty}
          size="small"
          sx={{
            position: "absolute",
            top: 8,
            right: 8,
            bgcolor: "rgba(255, 255, 255, 0.9)",
            fontWeight: "medium",
          }}
        />
      </Box>

      <CardContent sx={{ flexGrow: 1, pb: 1 }}>
        <Typography
          variant="h6"
          component="h3"
          gutterBottom
          sx={{
            fontWeight: "bold",
            overflow: "hidden",
            textOverflow: "ellipsis",
            display: "-webkit-box",
            WebkitLineClamp: 1,
            WebkitBoxOrient: "vertical",
            cursor: "pointer"
          }}
          onClick={() => navigate(`/DetailRecipe/${recipe.Id}`)}
        >
          {recipe.Name}
        </Typography>

        <Box sx={{ display: "flex", alignItems: "center", color: "text.secondary", mb: 1 }}>
          <AccessTimeIcon sx={{ fontSize: 18, mr: 0.5 }} />
          <Typography variant="body2">{recipe.Duration} דקות</Typography>
        </Box>
        
        {categories && categories.length > 0 && (
          <Box sx={{ display: "flex", alignItems: "center", color: "text.secondary", mb: 1 }}>
            <CategoryIcon sx={{ fontSize: 18, mr: 0.5 }} />
            <Typography variant="body2">
              {categoryName}
              {isOwner && onCategoryChange && (
                <IconButton 
                  size="small" 
                  onClick={handleCategoryDialogOpen}
                  sx={{ ml: 1, p: 0 }}
                >
                  <EditIcon fontSize="inherit" />
                </IconButton>
              )}
            </Typography>
          </Box>
        )}

        <Typography
          variant="body2"
          color="text.secondary"
          sx={{
            mb: 2,
            overflow: "hidden",
            textOverflow: "ellipsis",
            display: "-webkit-box",
            WebkitLineClamp: 2,
            WebkitBoxOrient: "vertical",
          }}
        >
          {recipe.Description}
        </Typography>

        <Box sx={{ mb: 1 }}>
          <Typography variant="body2" sx={{ fontWeight: "medium", mb: 0.5 }}>
            מרכיבים:
          </Typography>
          <Box sx={{ display: "flex", flexWrap: "wrap", gap: 0.5 }}>
            {recipe.Ingridents && recipe.Ingridents.slice(0, 3).map((ingredient) => (
              <Chip
                key={ingredient.Id}
                label={ingredient.Name}
                size="small"
                variant="outlined"
                sx={{ bgcolor: "background.paper" }}
              />
            ))}
            {recipe.Ingridents && recipe.Ingridents.length > 3 && (
              <Chip
                label={`+${recipe.Ingridents.length - 3}`}
                size="small"
                variant="outlined"
                sx={{ bgcolor: "background.paper" }}
              />
            )}
          </Box>
        </Box>
      </CardContent>

      <CardActions sx={{ justifyContent: "space-between", px: 2, pb: 2 }}>
        <Button size="small" onClick={() => navigate(`/DetailRecipe/${recipe.Id}`)} sx={{ color: "#FFB74D" }}>
          צפייה במתכון
        </Button>

        {isOwner && (
          <Box>
            <IconButton size="small" onClick={() => navigate(`/editRecipe/${recipe.Id}`)} sx={{ mr: 1 }}>
              <EditIcon fontSize="small" />
            </IconButton>

            <IconButton size="small" onClick={() => setDeleteDialogOpen(true)} sx={{ color: "error.main" }}>
              <DeleteIcon fontSize="small" />
            </IconButton>
          </Box>
        )}
      </CardActions>

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
      
      {/* דיאלוג עריכת קטגוריה */}
      {onCategoryChange && (
        <Dialog open={categoryDialogOpen} onClose={() => setCategoryDialogOpen(false)}>
          <DialogTitle>בחירת קטגוריה</DialogTitle>
          <DialogContent>
            <DialogContentText>
              בחרו קטגוריה למתכון זה. שימו לב שהקטגוריה תישמר רק בדפדפן שלכם ולא בשרת.
            </DialogContentText>
            <FormControl fullWidth sx={{ mt: 2, minWidth: 200 }}>
              <InputLabel id="category-select-label">קטגוריה</InputLabel>
              <Select
                labelId="category-select-label"
                id="category-select"
                value={selectedCategoryid}
                label="קטגוריה"
                onChange={(e) => setSelectedCategoryid(e.target.value as number)}
              >
                {categories.map((category) => (
                  <MenuItem key={category.Id} value={category.Id}>
                    {category.Name}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setCategoryDialogOpen(false)}>ביטול</Button>
            <Button onClick={handleCategoryChange} variant="contained" color="primary">
              אישור
            </Button>
          </DialogActions>
        </Dialog>
      )}
    </Card>
  )
}