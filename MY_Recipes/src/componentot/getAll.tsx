"use client"

import type React from "react"
import { useState, useEffect, useRef } from "react"
import { useNavigate } from "react-router-dom"
import axios from "axios"
import {
  Box,
  Container,
  Typography,
  Button,
  Grid,
  TextField,
  InputAdornment,
  Tabs,
  Tab,
  Card,
  CircularProgress,
  MenuItem,
  Select,
  FormControl,
  InputLabel,
} from "@mui/material"
import { Search as SearchIcon, Add as AddIcon, FilterList as FilterListIcon, RestaurantMenu as RestaurantMenuIcon } from "@mui/icons-material"
import { useUser } from "../componentot/Context/useContext"
import { RecipeCard } from "../componentot/RecipeCard"

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
  // מאפיין חדש שנוסיף בצד הלקוח
  clientCategoryid?: number | null
}

interface Category {
  Id: number
  Name: string
}

const RecipesPage: React.FC = () => {
  const [recipes, setRecipes] = useState<Recipe[]>([])
  const [loading, setLoading] = useState<boolean>(true)
  const [error, setError] = useState<string>("")
  const [searchTerm, setSearchTerm] = useState<string>("")
  const [difficulty, setDifficulty] = useState<string>("all")
  const [categories, setCategories] = useState<Category[]>([])
  const [selectedCategory, setSelectedCategory] = useState<number | "all">("all")
  const [selectedUserId, setSelectedUserId] = useState<number | "all">("all")

  // מאגר זיכרון מקומי למיפוי מתכונים לקטגוריות
  const recipeCategoriesMapRef = useRef<Map<number, number>>(new Map())

  const navigate = useNavigate()
  const { user } = useUser()

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [recipesRes, categoriesRes] = await Promise.all([
          axios.get("http://localhost:8080/api/recipe"),
          axios.get("http://localhost:8080/api/category"),
        ])

        // הוסף קטגוריה מקומית למתכונים אם אין להם קטגוריה בשרת
        const recipesWithClientCategories = recipesRes.data.map((recipe: Recipe) => {
          // אם יש למתכון קטגוריה בשרת, השתמש בה
          if (recipe.Categoryid !== null) {
            recipeCategoriesMapRef.current.set(recipe.Id, recipe.Categoryid)
            return recipe
          }

          // אם לא, בדוק אם יש מיפוי מקומי שמרנו קודם
          const savedCategoryid = recipeCategoriesMapRef.current.get(recipe.Id)
          return {
            ...recipe,
            clientCategoryid: savedCategoryid || null
          }
        })

        setRecipes(recipesWithClientCategories)
        setCategories(categoriesRes.data)
      } catch (error) {
        console.error("Failed to fetch data:", error)
        setError("אירעה שגיאה בטעינת הנתונים.")
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [])

  // פונקציה לשמירת קטגוריה מקומית למתכון
  const saveRecipeCategory = (recipeId: number, categoryId: number) => {
    recipeCategoriesMapRef.current.set(recipeId, categoryId)

    // עדכון המתכונים בממשק
    setRecipes(prevRecipes =>
      prevRecipes.map(recipe =>
        recipe.Id === recipeId
          ? { ...recipe, clientCategoryid: categoryId }
          : recipe
      )
    )
  }

  const handleDifficultyChange = (_event: React.SyntheticEvent, newValue: string) => {
    setDifficulty(newValue)
  }

  const filteredRecipes = recipes.filter(
    (recipe) => {
      // פילטור לפי שם
      const nameMatch = recipe.Name.toLowerCase().includes(searchTerm.toLowerCase())

      // פילטור לפי רמת קושי
      const difficultyMatch = difficulty === "all" || recipe.Difficulty === difficulty

      // פילטור לפי קטגוריה, בדיקה גם לקטגוריה בשרת וגם לקטגוריה מקומית
      const categoryMatch =
        selectedCategory === "all" ||
        recipe.Categoryid === selectedCategory ||
        recipe.clientCategoryid === selectedCategory

      // פילטור לפי userId
      const userIdMatch = selectedUserId === "all" || recipe.UserId === selectedUserId

      return nameMatch && difficultyMatch && categoryMatch && userIdMatch
    }
  )

  return (
    <Box sx={{ bgcolor: "#f5f5f5", minHeight: "100vh", direction: "rtl" }}>
      <Container maxWidth="lg" sx={{ py: 4 }}>
        <Box
          sx={{
            display: "flex",
            flexDirection: { xs: "column", md: "row" },
            justifyContent: "space-between",
            alignItems: { xs: "stretch", md: "center" },
            mb: 4,
            gap: 2,
          }}
        >
          <Box>
            <Typography variant="h4" component="h1" sx={{ fontWeight: "bold" }}>
              מתכונים
            </Typography>
            <Typography variant="body1" color="text.secondary">
              גלו מגוון רחב של מתכונים טעימים
            </Typography>
          </Box>

          <Box sx={{ display: "flex", gap: 2, flexDirection: { xs: "column", sm: "row" } }}>
            <TextField
              placeholder="חיפוש מתכונים..."
              variant="outlined"
              size="small"
              fullWidth
              sx={{ maxWidth: { sm: 300 } }}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <SearchIcon />
                  </InputAdornment>
                ),
              }}
            />

            <Button
              variant="contained"
              startIcon={<AddIcon />}
              onClick={() => navigate("/addRecipe")}
              sx={{
                bgcolor: "#FFB74D",
                "&:hover": { bgcolor: "#FFA726" },
                whiteSpace: "nowrap",
              }}
            >
              מתכון חדש
            </Button>
          </Box>
        </Box>

        <Box sx={{ mb: 4 }}>
          <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
            <FilterListIcon sx={{ ml: 1, color: "text.secondary" }} />
            <Typography variant="body1" sx={{ fontWeight: "medium" }}>
              סינון לפי רמת קושי:
            </Typography>
          </Box>
          <Tabs
            value={difficulty}
            onChange={handleDifficultyChange}
            indicatorColor="primary"
            textColor="primary"
            sx={{
              "& .MuiTab-root": {
                minWidth: 80,
                fontWeight: "medium",
              },
              bgcolor: "background.paper",
              borderRadius: 1,
            }}
          >
            <Tab label="הכל" value="all" />
            <Tab label="קל" value="קל" />
            <Tab label="בינוני" value="בינוני" />
            <Tab label="קשה" value="קשה" />
          </Tabs>
        </Box>

        <Box sx={{ mb: 4, display: 'flex', gap: 2, flexWrap: 'wrap' }}>
          <FormControl sx={{ minWidth: 200 }}>
            <InputLabel id="category-select-label">סינון לפי קטגוריה</InputLabel>
            <Select
              labelId="category-select-label"
              value={selectedCategory}
              onChange={(e) =>
                setSelectedCategory(e.target.value === "all" ? "all" : Number(e.target.value))
              }
              label="סינון לפי קטגוריה"
            >
              <MenuItem value="all">כל הקטגוריות</MenuItem>
              {categories.map((cat) => (
                <MenuItem key={cat.Id} value={cat.Id}>{cat.Name}</MenuItem>
              ))}
            </Select>
          </FormControl>

          <FormControl sx={{ minWidth: 200 }}>
            <InputLabel id="user-select-label">סינון לפי משתמש</InputLabel>
            <Select
              labelId="user-select-label"
              value={selectedUserId}
              onChange={(e) =>
                setSelectedUserId(e.target.value === "all" ? "all" : Number(e.target.value))
              }
              label="סינון לפי משתמש"
            >
              <MenuItem value="all">כל המשתמשים</MenuItem>
              {[...new Set(recipes.map(recipe => recipe.UserId))].map((userId) => (
                <MenuItem key={userId} value={userId}>משתמש {userId}</MenuItem>
              ))}
            </Select>
          </FormControl>
        </Box>

        {loading ? (
          <Box sx={{ display: "flex", justifyContent: "center", alignItems: "center", height: 300 }}>
            <CircularProgress sx={{ color: "#FFB74D" }} />
          </Box>
        ) : error ? (
          <Box sx={{ textAlign: "center", p: 4, bgcolor: "background.paper", borderRadius: 2 }}>
            <Typography color="error" variant="h6">
              {error}
            </Typography>
          </Box>
        ) : filteredRecipes.length === 0 ? (
          <Card sx={{ textAlign: "center", p: 4 }}>
            <RestaurantMenuIcon sx={{ fontSize: 60, color: "text.disabled", mb: 2 }} />
            <Typography variant="h5" gutterBottom>
              לא נמצאו מתכונים
            </Typography>
            <Typography variant="body1" color="text.secondary" paragraph>
              {searchTerm ? "נסו לחפש מונח אחר" : "הוסיפו את המתכון הראשון שלכם"}
            </Typography>
            <Button
              variant="contained"
              startIcon={<AddIcon />}
              onClick={() => navigate("/addRecipe")}
              sx={{
                bgcolor: "#FFB74D",
                "&:hover": { bgcolor: "#FFA726" },
              }}
            >
              הוסף מתכון חדש
            </Button>
          </Card>
        ) : (
          <Grid container spacing={3}>
            {filteredRecipes.map((recipe) => (
              <Grid item xs={12} sm={6} md={4} key={recipe.Id.toString()}>
                {categories && categories.length > 0 ? (
                  <RecipeCard
                    recipe={recipe}
                    categories={categories}
                    onCategoryChange={saveRecipeCategory}
                  />
                ) : (
                  <RecipeCard recipe={recipe} />
                )}
              </Grid>
            ))}
          </Grid>
        )}
      </Container>
    </Box>
  )
}

export default RecipesPage