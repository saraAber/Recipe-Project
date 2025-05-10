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
import { AccessTime as AccessTimeIcon, Edit as EditIcon, Delete as DeleteIcon, Category as CategoryIcon, Person as PersonIcon } from "@mui/icons-material"

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
      const response = await axios.post(`http://localhost:8080/api/recipe/delete/${recipe.Id}`, { Id: recipe.Id });
      console.log("תגובת השרת למחיקה:", response.data);
      alert("המתכון נמחק בהצלחה");
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

  const categoryToShow = recipe.Categoryid || recipe.clientCategoryid
  const categoryName = categoryToShow && categories.length > 0
    ? categories.find(cat => cat.Id === categoryToShow)?.Name || "ללא קטגוריה"
    : "ללא קטגוריה"

  return (
    <Card
      sx={{
        height: "100%",
        display: "flex",
        flexDirection: "column",
        transition: "all 0.3s ease",
        "&:hover": {
          transform: "translateY(-6px)",
          boxShadow: 6,
        },
        borderRadius: 3,
        overflow: "hidden",
        position: "relative",
      }}
    >
      <Box sx={{ position: "relative", paddingTop: "60%" }}>
        <CardMedia
          component="img"
          image={recipe.Img || "https://via.placeholder.com/400x300?text=Recipe+Image"}
          alt={recipe.Name}
          sx={{ 
            position: "absolute",
            top: 0,
            left: 0,
            width: "100%",
            height: "100%",
            objectFit: "cover" 
          }}
        />
        <Chip
          label={recipe.Difficulty}
          size="small"
          sx={{
            position: "absolute",
            top: 12,
            right: 12,
            bgcolor: "rgba(255, 255, 255, 0.95)",
            fontWeight: "bold",
            borderRadius: 2,
          }}
        />
      </Box>

      <CardContent sx={{ flexGrow: 1, p: 2.5 }}>
        <Typography
          variant="h6"
          component="h3"
          sx={{
            fontWeight: "bold",
            mb: 1,
            fontSize: "1.1rem",
            lineHeight: 1.3,
            minHeight: "40px",
            overflow: "hidden",
            textOverflow: "ellipsis",
            display: "-webkit-box",
            WebkitLineClamp: 2,
            WebkitBoxOrient: "vertical",
            cursor: "pointer"
          }}
          onClick={() => navigate(`/DetailRecipe/${recipe.Id}`)}
        >
          {recipe.Name}
        </Typography>

        <Box sx={{ display: "flex", gap: 2, mb: 1.5, flexWrap: "wrap" }}>
          <Box sx={{ display: "flex", alignItems: "center", gap: 0.5 }}>
            <PersonIcon sx={{ fontSize: 16, color: "text.secondary" }} />
            <Typography variant="caption" color="text.secondary">
              משתמש {recipe.UserId}
            </Typography>
          </Box>
          
          <Box sx={{ display: "flex", alignItems: "center", gap: 0.5 }}>
            <AccessTimeIcon sx={{ fontSize: 16, color: "text.secondary" }} />
            <Typography variant="caption" color="text.secondary">
              {recipe.Duration} דקות
            </Typography>
          </Box>
        </Box>

        {categories && categories.length > 0 && (
          <Box sx={{ display: "flex", alignItems: "center", gap: 0.5, mb: 1.5 }}>
            <CategoryIcon sx={{ fontSize: 16, color: "text.secondary" }} />
            <Typography variant="caption" color="text.secondary">
              {categoryName}
            </Typography>
            {isOwner && onCategoryChange && (
              <IconButton
                size="small"
                onClick={handleCategoryDialogOpen}
                sx={{ p: 0.5, ml: 0.5 }}
              >
                <EditIcon sx={{ fontSize: 14 }} />
              </IconButton>
            )}
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
            minHeight: "40px",
            lineHeight: 1.5,
          }}
        >
          {recipe.Description}
        </Typography>

        <Box>
          <Typography variant="caption" sx={{ fontWeight: "medium", mb: 0.5, display: "block" }}>
            מרכיבים:
          </Typography>
          <Box sx={{ display: "flex", flexWrap: "wrap", gap: 0.5 }}>
            {recipe.Ingridents && recipe.Ingridents.slice(0, 3).map((ingredient) => (
              <Chip
                key={ingredient.Id}
                label={ingredient.Name}
                size="small"
                variant="outlined"
                sx={{ 
                  bgcolor: "background.paper",
                  height: "24px",
                  fontSize: "0.75rem" 
                }}
              />
            ))}
            {recipe.Ingridents && recipe.Ingridents.length > 3 && (
              <Chip
                label={`+${recipe.Ingridents.length - 3}`}
                size="small"
                variant="outlined"
                sx={{ 
                  bgcolor: "#FFF3E0",
                  height: "24px",
                  fontSize: "0.75rem" 
                }}
              />
            )}
          </Box>
        </Box>
      </CardContent>

      <CardActions sx={{ 
        justifyContent: "space-between", 
        px: 2.5, 
        pb: 2,
        pt: 0 
      }}>
        <Button 
          size="small" 
          onClick={() => navigate(`/DetailRecipe/${recipe.Id}`)} 
          sx={{ 
            color: "#FFB74D",
            fontWeight: "medium",
            "&:hover": {
              bgcolor: "#FFF3E0",
            }
          }}
        >
          צפייה במתכון
        </Button>

        {isOwner && (
          <Box>
            <IconButton 
              size="small" 
              onClick={() => navigate(`/editRecipe/${recipe.Id}`)} 
              sx={{ 
                mr: 0.5,
                "&:hover": {
                  bgcolor: "#E8F5E9",
                }
              }}
            >
              <EditIcon fontSize="small" />
            </IconButton>

            <IconButton 
              size="small" 
              onClick={() => setDeleteDialogOpen(true)} 
              sx={{ 
                color: "error.main",
                "&:hover": {
                  bgcolor: "#FFEBEE",
                }
              }}
            >
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