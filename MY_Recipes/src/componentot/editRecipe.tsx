import React, { useEffect, useState, useContext } from "react";
import axios from "axios";
import { useNavigate, useParams } from "react-router-dom";
import { useForm, useFieldArray, Controller } from "react-hook-form";
import { Container, TextField, Button, Typography, CircularProgress, Box, Paper, MenuItem } from '@mui/material';
import { useUser } from "../componentot/Context/useContext";
import { CatContext } from "../componentot/Context/Context";

interface Ingredient {
  Name: string;
  Count: string;
  Type: string;
}

interface FormValues {
  Id: number;
  Name: string;
  UserId: number;
  Categoryid: number | null;
  Img: string;
  Duration: number;
  Difficulty: string;
  Description: string;
  Ingridents: Ingredient[];
  Instructions: { Name: string }[];
}

const EditRecipe: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const { user } = useUser();
  const { categories } = useContext(CatContext);
  
  const { control, handleSubmit, setValue, getValues, formState: { errors } } = useForm<FormValues>({
    defaultValues: {
      Id: 0,
      Name: "",
      UserId: 0,
      Categoryid: null,
      Img: "",
      Duration: 0,
      Difficulty: "",
      Description: "",
      Ingridents: [{ Name: "", Count: "", Type: "" }],
      Instructions: [{ Name: "" }]
    }
  });
  
  const { fields: ingredientFields, append: appendIngredient } = useFieldArray({
    control,
    name: "Ingridents"
  });

  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string>("");
  const [instructionsText, setInstructionsText] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const fetchRecipe = async () => {
      try {
        const response = await axios.get(`http://localhost:8080/api/recipe/${id}`);
        const recipe = response.data;
        
        if (user?.Id !== recipe.UserId) {
          setError("You are not authorized to edit this recipe.");
          return;
        }
        
        setValue("Id", recipe.Id);
        setValue("Name", recipe.Name);
        setValue("UserId", recipe.UserId);
        setValue("Categoryid", recipe.Categoryid);
        setValue("Img", recipe.Img);
        setValue("Duration", recipe.Duration);
        setValue("Difficulty", recipe.Difficulty);
        setValue("Description", recipe.Description);
        setValue("Ingridents", recipe.Ingridents || [{ Name: "", Count: "", Type: "" }]);
        
        // טיפול בהוראות ההכנה
        if (Array.isArray(recipe.Instructions)) {
          setValue("Instructions", recipe.Instructions);
          
          // המרת מערך ההוראות לטקסט עבור תיבת הטקסט
          const text = (recipe.Instructions as { Name: string }[]).map(instruction => instruction.Name).join('\n');
          setInstructionsText(text);
        } else if (typeof recipe.Instructions === 'string') {
          // אם ההוראות הן מחרוזת, נמיר אותן למערך
          const instructionsArray = recipe.Instructions.split('\n')
            .filter((line: string) => line.trim() !== '')
            .map((line: string) => ({ Name: line.trim() }));
          setValue("Instructions", instructionsArray);
          setInstructionsText(recipe.Instructions);
        } else {
          setValue("Instructions", [{ Name: "" }]);
          setInstructionsText("");
        }
        
        // בדיקה אם יש קטגוריה מקומית שמורה
        if (window.localStorage) {
          try {
            const recipeCategories = JSON.parse(localStorage.getItem('recipeCategories') || '{}');
            if (recipeCategories[recipe.Id] && !recipe.Categoryid) {
              setValue("Categoryid", recipeCategories[recipe.Id]);
            }
          } catch (e) {
            console.error("שגיאה בטעינת קטגוריה מקומית:", e);
          }
        }
        
      } catch (error) {
        console.error("Failed to fetch recipe:", error);
        setError("Failed to fetch recipe. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    fetchRecipe();
  }, [id, setValue, user?.Id]);

  const onSubmit = async (data: FormValues) => {
    setLoading(true);
    setError("");
    
    // הכנת הוראות ההכנה
    let instructions = data.Instructions;
    
    // אם המשתמש הזין טקסט בשדה ההוראות
    if (instructionsText) {
      instructions = instructionsText
        .split('\n')
        .filter(line => line.trim() !== '')
        .map(line => ({ Name: line.trim() }));
    }
    
    // בדיקה שיש הוראות
    if (!instructions || instructions.length === 0 || !instructions[0].Name) {
      setError("חובה למלא הוראות למתכון");
      setLoading(false);
      return;
    }
    
    // הכנת נתונים בדיוק בפורמט שהשרת מצפה
    const dataToSend = {
      Id: data.Id,
      Name: data.Name,
      UserId: data.UserId,
      Categoryid: data.Categoryid || 1, // שליחת קטגוריה ברירת מחדל אם לא נבחרה
      Img: data.Img || "https://via.placeholder.com/400x300?text=Recipe+Image",
      Duration: Number(data.Duration) || 30,
      Difficulty: data.Difficulty || "קל",
      Description: data.Description,
      Ingridents: data.Ingridents,
      Instructions: instructions
    };
    
    console.log("נתונים שנשלחים לשרת:", dataToSend);
    
    try {
      const response = await axios.post("http://localhost:8080/api/recipe/edit", dataToSend);
      console.log("תגובת השרת:", response.data);
      
      // שמירת הקטגוריה מקומית לטובת סינון
      if (window.localStorage && data.Categoryid) {
        try {
          const recipeCategories = JSON.parse(localStorage.getItem('recipeCategories') || '{}');
          recipeCategories[data.Id] = data.Categoryid;
          localStorage.setItem('recipeCategories', JSON.stringify(recipeCategories));
        } catch (e) {
          console.error("שגיאה בשמירת קטגוריה מקומית:", e);
        }
      }
      
      navigate(`/recipe/${response.data.Id}`);
    } catch (error) {
      console.error("Error editing recipe:", error);
      if (axios.isAxiosError(error) && error.response) {
        setError(`עריכת המתכון נכשלה: ${error.response.data || error.message}`);
      } else {
        setError("עריכת המתכון נכשלה. נסי שוב מאוחר יותר.");
      }
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="100vh">
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return <Typography color="error">{error}</Typography>;
  }

  return (
    <Box
      sx={{
        backgroundImage: 'url(https://www.k-tov.com/wp-content/uploads/2022/11/2673995-min.jpg)',
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        '&:before': {
          content: '""',
          position: 'absolute',
          top: 0,
          right: 0,
          bottom: 0,
          left: 0,
          background: 'inherit',
          filter: 'blur(10px)',
        },
      }}
    >
      <Container maxWidth="sm" sx={{ position: 'relative', zIndex: 1 }}>
        <Box mt={4} mb={4}>
          <Typography variant="h4" gutterBottom>עריכת מתכון</Typography>
          <Paper elevation={3} style={{ padding: '2rem', backgroundColor: 'rgba(255, 255, 255, 0.9)' }}>
            <form onSubmit={handleSubmit(onSubmit)}>
              <Controller
                name="Id"
                control={control}
                render={({ field }) => (
                  <TextField
                    label="מזהה מתכון"
                    type="number"
                    fullWidth
                    margin="normal"
                    disabled
                    {...field}
                  />
                )}
              />
              <Controller
                name="Name"
                control={control}
                rules={{ required: true }}
                render={({ field }) => (
                  <TextField
                    label="שם המתכון"
                    fullWidth
                    margin="normal"
                    error={!!errors.Name}
                    helperText={errors.Name ? "חובה למלא שם מתכון" : ""}
                    {...field}
                  />
                )}
              />
              <Controller
                name="UserId"
                control={control}
                render={({ field }) => (
                  <TextField
                    label="מזהה משתמש"
                    type="number"
                    fullWidth
                    margin="normal"
                    disabled
                    {...field}
                  />
                )}
              />
              <Controller
                name="Categoryid"
                control={control}
                render={({ field }) => (
                  <TextField
                    label="קטגוריה"
                    fullWidth
                    select
                    margin="normal" 
                    sx={{ mb: 1 }}
                    value={field.value || ""}
                    onChange={(e) => {
                      const value = e.target.value;
                      field.onChange(value === "" ? null : Number(value));
                    }}
                  >
                    <MenuItem value="" disabled>בחר קטגוריה</MenuItem>
                    {categories && categories.length > 0 ? (
                      categories.map((item) => (
                        <MenuItem key={item.Id} value={item.Id}>{item.Name}</MenuItem>
                      ))
                    ) : (
                      <MenuItem disabled value="">
                        אין קטגוריות זמינות
                      </MenuItem>
                    )}
                  </TextField>
                )}
              />
              <Controller
                name="Img"
                control={control}
                render={({ field }) => (
                  <TextField
                    label="קישור לתמונה"
                    fullWidth
                    margin="normal"
                    placeholder="הזינו קישור לתמונה (לא חובה)"
                    {...field}
                  />
                )}
              />
              <Controller
                name="Duration"
                control={control}
                rules={{ required: true }}
                render={({ field }) => (
                  <TextField
                    label="זמן הכנה (בדקות)"
                    type="number"
                    fullWidth
                    margin="normal"
                    error={!!errors.Duration}
                    helperText={errors.Duration ? "חובה למלא זמן הכנה" : ""}
                    {...field}
                  />
                )}
              />
              <Controller
                name="Difficulty"
                control={control}
                render={({ field }) => (
                  <TextField
                    label="רמת קושי"
                    select
                    fullWidth
                    margin="normal"
                    {...field}
                  >
                    <MenuItem value="">בחר רמת קושי</MenuItem>
                    <MenuItem value="קל">קל</MenuItem>
                    <MenuItem value="בינוני">בינוני</MenuItem>
                    <MenuItem value="קשה">קשה</MenuItem>
                  </TextField>
                )}
              />
              <Controller
                name="Description"
                control={control}
                rules={{ required: true }}
                render={({ field }) => (
                  <TextField
                    label="תיאור קצר"
                    fullWidth
                    margin="normal"
                    error={!!errors.Description}
                    helperText={errors.Description ? "חובה להוסיף תיאור קצר" : ""}
                    {...field}
                  />
                )}
              />
              <Typography variant="h6" gutterBottom>מרכיבים</Typography>
              {ingredientFields.map((field, index) => (
                <Box key={field.id} mb={2}>
                  <Controller
                    name={`Ingridents.${index}.Name` as const}
                    control={control}
                    rules={{ required: true }}
                    render={({ field }) => (
                      <TextField
                        label="שם המוצר"
                        fullWidth
                        margin="normal"
                        error={!!errors.Ingridents?.[index]?.Name}
                        helperText={errors.Ingridents?.[index]?.Name ? "חובה למלא שם מוצר" : ""}
                        {...field}
                      />
                    )}
                  />
                  <Controller
                    name={`Ingridents.${index}.Count` as const}
                    control={control}
                    rules={{ required: true }}
                    render={({ field }) => (
                      <TextField
                        label="כמות"
                        fullWidth
                        margin="normal"
                        error={!!errors.Ingridents?.[index]?.Count}
                        helperText={errors.Ingridents?.[index]?.Count ? "חובה למלא כמות" : ""}
                        {...field}
                      />
                    )}
                  />
                  <Controller
                    name={`Ingridents.${index}.Type` as const}
                    control={control}
                    rules={{ required: true }}
                    render={({ field }) => (
                      <TextField
                        label="סוג הכמות"
                        fullWidth
                        margin="normal"
                        error={!!errors.Ingridents?.[index]?.Type}
                        helperText={errors.Ingridents?.[index]?.Type ? "חובה למלא סוג הכמות" : ""}
                        {...field}
                      />
                    )}
                  />
                </Box>
              ))}
              <Button variant="outlined" onClick={() => appendIngredient({ Name: "", Count: "", Type: "" })}>הוסף מרכיב</Button>
              
              <Typography variant="h6" gutterBottom mt={2}>הוראות הכנה</Typography>
              <TextField
                label="הוראות הכנה"
                multiline
                rows={4}
                fullWidth
                margin="normal"
                helperText="רשמו כל הוראה בשורה נפרדת"
                value={instructionsText}
                onChange={(e) => {
                  setInstructionsText(e.target.value);
                }}
              />
              
              <Box mt={4}>
                <Button variant="contained" color="primary" type="submit">
                  שמור שינויים
                </Button>
                {error && <Typography color="error" mt={2}>{error}</Typography>}
              </Box>
            </form>
          </Paper>
        </Box>
      </Container>
    </Box>
  );
};

export default EditRecipe;