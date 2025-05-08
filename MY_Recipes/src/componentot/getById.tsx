import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import { Container, Typography, CircularProgress, Paper } from '@mui/material';

interface Recipe {
  id: number;
  title: string;
  description: string;
  imageUrl: string;
  ingredients: string[];
  instructions: string[];
}

const GetRecipeById: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [recipe, setRecipe] = useState<Recipe | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError]  = useState<string>("");

  useEffect(() => {
    const fetchRecipe = async () => {
      try {
        const response = await axios.get(`http://localhost:8080/api/recipe/${id}`);
        setRecipe(response.data);
      } catch (error) {
        setError("Failed to fetch recipe. Please try again later.");
      } finally {
        setLoading(false);
      }
    };
 
    fetchRecipe();
  }, [id]);

  if (loading) {
    return <CircularProgress />;
  }

  if (error) {
    return <Typography color="error">{error}</Typography>;
  }

  if (!recipe) {
    return <Typography>No recipe found</Typography>;
  }

  return (
    <Container>
      <Paper elevation={3} style={{ padding: '2rem' }}>
        <Typography variant="h4" gutterBottom>{recipe.title}</Typography>
        <img src={recipe.imageUrl} alt={recipe.title} style={{ width: '100%', height: 'auto' }} />
        <Typography variant="h6">Ingredients:</Typography>
        <ul>
          {recipe.ingredients.map((ingredient, index) => (
            <li key={index}>{ingredient}</li>
          ))}
        </ul>
        <Typography variant="h6">Instructions:</Typography>
        <ol>
          {recipe.instructions.map((instruction, index) => (
            <li key={index}>{instruction}</li>
          ))}
        </ol>
      </Paper>
    </Container>
  );
};

export default GetRecipeById;