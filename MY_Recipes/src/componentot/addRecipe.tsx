import React, { useState, useEffect, useContext } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { useForm, useFieldArray, Controller, SubmitHandler } from "react-hook-form";
import { Container, TextField, Button, Typography, CircularProgress, Box, Paper, MenuItem } from '@mui/material';
import { CatContext } from "../componentot/Context/Context";
import { useUser } from "../componentot/Context/useContext";

interface Ingredient {
  Name: string;
  Count: string;
  Type: string;
}

interface Instruction {
  Name: string;
}

interface FormValues {
  Name: string;
  Difficulty: string;
  Duration: number;
  Description: string;
  Categoryid: number | null;
  Img: string;
  Ingridents: Ingredient[];
  Instructions: Instruction[];
}

const AddRecipe: React.FC = () => {
  const { user } = useUser();
  const { categories } = useContext(CatContext);
  const navigate = useNavigate();

  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>("");
  const [instructionsText, setInstructionsText] = useState("");

  const { control, handleSubmit, formState: { errors } } = useForm<FormValues>({
    defaultValues: {
      Name: "",
      Categoryid: null,
      Img: "",
      Duration: 30,
      Difficulty: "קל",
      Description: "",
      Ingridents: [{ Name: "", Count: "", Type: "" }],
      Instructions: [{ Name: "" }]
    }
  });

  const { fields: ingredientFields, append: appendIngredient } = useFieldArray({
    control,
    name: "Ingridents"
  });

  useFieldArray({
    control,
    name: "Instructions"
  });

  // בדיקה שהמשתמש מחובר לפני הוספת מתכון
  useEffect(() => {
    if (!user) {
      setError("עליך להתחבר כדי להוסיף מתכון");
      // אפשר גם להוסיף ניווט לדף התחברות
      // navigate("/login");
    }
  }, [user, navigate]);

  const onsubmit: SubmitHandler<FormValues> = async (data) => {
    try {
      // בדיקה שהמשתמש מחובר
      if (!user || !user.Id) {
        setError("עליך להתחבר כדי להוסיף מתכון");
        return;
      }

      setLoading(true);
      setError("");
      
      // עיבוד ההוראות מהטקסט לפורמט שהשרת מצפה לו
      const instructionsArray = instructionsText
        .split('\n')
        .filter(line => line.trim() !== '')
        .map(line => ({ Name: line.trim() }));
      
      // הכנת אובייקט המתכון לשליחה בפורמט המתאים לשרת
      const recipeData = {
        ...data,
        UserId: user.Id,  // חשוב: הוספת מזהה המשתמש
        Categoryid: data.Categoryid || null,
        Img: data.Img || "https://via.placeholder.com/400x300?text=Recipe+Image",
        Duration: Number(data.Duration) || 30,
        Difficulty: data.Difficulty || "קל",
        Instructions: instructionsArray.length > 0 ? instructionsArray : [{ Name: "" }]
      };
   
      const response = await axios.post("http://localhost:8080/api/recipe", recipeData);
      // ניווט לדף המתכונים או לדף המתכון החדש
      if (response.data && response.data.Id) {
        navigate(`/DetailRecipe/${response.data.Id}`);
      } else {
        navigate("/recipes");
      }
    } catch (err) {
      console.error("Error adding recipe:", err);
      
      // טיפול מפורט יותר בשגיאות
      if (axios.isAxiosError(err) && err.response) {
        // שגיאה מהשרת עם קוד שגיאה
        const statusCode = err.response.status;
        const errorData = err.response.data;
        
        if (statusCode === 400) {
          setError(`שגיאה בנתוני המתכון: ${errorData || 'פרטי המתכון אינם תקינים'}`);
        } else if (statusCode === 401) {
          setError("אינך מורשה להוסיף מתכון. אנא התחבר מחדש.");
        } else {
          setError(`שגיאה בהוספת המתכון (${statusCode}). נסה שוב.`);
        }
      } else {
        setError("שגיאה בהוספת המתכון. נסה שוב מאוחר יותר.");
      }
    } finally {
      setLoading(false);
    }
  };

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
          <Typography variant="h4" gutterBottom>הוספת מתכון חדש</Typography>
          <Paper elevation={3} style={{ padding: '2rem', textAlign: 'center', backgroundColor: 'rgba(255, 255, 255, 0.9)' }}>
            {!user ? (
              // הודעה למשתמש לא מחובר
              <Box my={4} textAlign="center">
                <Typography variant="h6" color="error" gutterBottom>
                  עליך להתחבר כדי להוסיף מתכון
                </Typography>
                <Button 
                  variant="contained" 
                  color="primary" 
                  onClick={() => navigate("/login")}
                  sx={{ mt: 2 }}
                >
                  לדף התחברות
                </Button>
              </Box>
            ) : (
              // טופס הוספת מתכון
              <form onSubmit={handleSubmit(onsubmit)}>
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
                  name="Categoryid"
                  control={control}
                  render={({ field }) => (
                    <TextField
                      label="קטגוריה"
                      fullWidth
                      select
                      size="small"
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
                  rules={{ required: true }}
                  render={({ field }) => (
                    <TextField
                      label="רמת קושי"
                      select
                      fullWidth
                      margin="normal"
                      error={!!errors.Difficulty}
                      helperText={errors.Difficulty ? "חובה לבחור רמת קושי" : ""}
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
                  id="instructions"
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
                  {loading ? (
                    <CircularProgress />
                  ) : (
                    <Button variant="contained" color="primary" type="submit">הוספת מתכון</Button>
                  )}
                  {error && <Typography color="error" mt={2}>{error}</Typography>}
                </Box>
              </form>
            )}
          </Paper>
        </Box>
      </Container>
    </Box>
  );
};

export default AddRecipe;