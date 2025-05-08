"use client"

import type React from "react"
import { Box, CssBaseline, ThemeProvider, createTheme } from "@mui/material"
import { UserProvider } from "../componentot/Context/useContext"
import Header from "./Header"
import rtlPlugin from "stylis-plugin-rtl"
//import { prefixer } from "stylis"
import { CacheProvider } from "@emotion/react"
import createCache from "@emotion/cache"

// קונפיגורציה לתמיכה בכיוון RTL
const cacheRtl = createCache({
  key: "muirtl",
 // stylisPlugins: [prefixer, rtlPlugin],
})

// יצירת ערכת נושא מותאמת אישית
const theme = createTheme({
  direction: "rtl",
  typography: {
    fontFamily: "Rubik, Arial, sans-serif",
  },
  palette: {
    primary: {
      main: "#FFB74D",
      light: "#FFE9CA",
      dark: "#FFA726",
    },
    secondary: {
      main: "#78909C",
    },
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 8,
        },
      },
    },
    MuiPaper: {
      styleOverrides: {
        root: {
          borderRadius: 8,
        },
      },
    },
  },
})

const AppLayout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return (
    <CacheProvider value={cacheRtl}>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <UserProvider>
          <Box sx={{ minHeight: "100vh", display: "flex", flexDirection: "column" }}>
            <Header />
            <Box component="main" sx={{ flexGrow: 1 }}>
              {children}
            </Box>
          </Box>
        </UserProvider>
      </ThemeProvider>
    </CacheProvider>
  )
}

export default AppLayout
