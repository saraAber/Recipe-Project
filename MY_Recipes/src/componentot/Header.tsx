"use client"

import type React from "react"
import { useState } from "react"
import { useNavigate, useLocation } from "react-router-dom"
import { useUser } from "../componentot/Context/useContext"
import {
  AppBar,
  Toolbar,
  Typography,
  Button,
  IconButton,
  Box,
  Menu,
  MenuItem,
  Avatar,
  Drawer,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Divider,
  Container,
  useMediaQuery,
  useTheme,
} from "@mui/material"
import {
  Menu as MenuIcon,
  RestaurantMenu as RestaurantMenuIcon,
  Home as HomeIcon,
  Person as PersonIcon,
  ExitToApp as ExitToAppIcon,
  Login as LoginIcon,
  PersonAdd as PersonAddIcon,
  Bookmark as BookmarkIcon,
  Restaurant as RestaurantIcon,
} from "@mui/icons-material"

const Header: React.FC = () => {
  const navigate = useNavigate()
  const location = useLocation()
  const { user, logout } = useUser()
  const theme = useTheme()
  const isMobile = useMediaQuery(theme.breakpoints.down("md"))

  const [mobileMenuOpen, setMobileMenuOpen] = useState<boolean>(false)
  const [userMenuAnchor, setUserMenuAnchor] = useState<null | HTMLElement>(null)

  const handleUserMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
    setUserMenuAnchor(event.currentTarget)
  }

  const handleUserMenuClose = () => {
    setUserMenuAnchor(null)
  }

  const handleLogout = () => {
    logout()
    handleUserMenuClose()
    navigate("/login")
  }

  const toggleMobileMenu = () => {
    setMobileMenuOpen(!mobileMenuOpen)
  }

  const isActive = (path: string) => {
    return location.pathname === path
  }

  return (
    <>
      <AppBar position="sticky" sx={{ bgcolor: "white", color: "text.primary", boxShadow: 1 }}>
        <Container maxWidth="xl">
          <Toolbar disableGutters>
            {/* לוגו ושם האתר */}
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                cursor: "pointer",
              }}
              onClick={() => navigate("/")}
            >
              <RestaurantMenuIcon sx={{ color: "#FFB74D", mr: 1 }} />
              <Typography variant="h6" component="div" sx={{ fontWeight: "bold" }}>
                טעמים
              </Typography>
            </Box>

            {/* כפתור תפריט למובייל */}
            <IconButton
              edge="start"
              color="inherit"
              aria-label="menu"
              sx={{ mr: 2, display: { md: "none" }, ml: "auto" }}
              onClick={toggleMobileMenu}
            >
              <MenuIcon />
            </IconButton>

            {/* תפריט ניווט למסך גדול */}
            <Box sx={{ display: { xs: "none", md: "flex" }, mx: 4 }}>
              <Button
                color="inherit"
                onClick={() => navigate("/")}
                sx={{
                  mx: 1,
                  color: isActive("/") ? "#FFB74D" : "inherit",
                  "&:hover": { color: "#FFB74D" },
                }}
              >
                דף הבית
              </Button>
              <Button
                color="inherit"
                onClick={() => navigate("/recipes")}
                sx={{
                  mx: 1,
                  color: isActive("/recipes") ? "#FFB74D" : "inherit",
                  "&:hover": { color: "#FFB74D" },
                }}
              >
                מתכונים
              </Button>
            </Box>

            <Box sx={{ flexGrow: 1, display: { xs: "none", md: "block" } }} />

            {/* כפתורי התחברות/הרשמה או תפריט משתמש */}
            <Box sx={{ display: { xs: "none", md: "flex" }, alignItems: "center" }}>
              {user ? (
                <>
                  <Button
                    color="inherit"
                    onClick={() => navigate("/profile")}
                    sx={{
                      mx: 1,
                      color: isActive("/profile") ? "#FFB74D" : "inherit",
                      "&:hover": { color: "#FFB74D" },
                    }}
                    startIcon={<PersonIcon />}
                  >
                    פרופיל
                  </Button>
                  <Button
                    color="inherit"
                    onClick={handleLogout}
                    sx={{ mx: 1, "&:hover": { color: "#FFB74D" } }}
                    startIcon={<ExitToAppIcon />}
                  >
                    התנתקות
                  </Button>
                  <Avatar
                    sx={{
                      ml: 2,
                      bgcolor: "#FFB74D",
                      cursor: "pointer",
                      width: 40,
                      height: 40,
                    }}
                    onClick={handleUserMenuOpen}
                  >
                    {user.Name ? user.Name.charAt(0) : "U"}
                  </Avatar>
                  <Menu
                    anchorEl={userMenuAnchor}
                    open={Boolean(userMenuAnchor)}
                    onClose={handleUserMenuClose}
                    anchorOrigin={{
                      vertical: "bottom",
                      horizontal: "right",
                    }}
                    transformOrigin={{
                      vertical: "top",
                      horizontal: "right",
                    }}
                  >
                    <MenuItem
                      onClick={() => {
                        handleUserMenuClose()
                        navigate("/profile")
                      }}
                    >
                      <ListItemIcon>
                        <PersonIcon fontSize="small" />
                      </ListItemIcon>
                      <ListItemText primary="הפרופיל שלי" />
                    </MenuItem>
                    <MenuItem
                      onClick={() => {
                        handleUserMenuClose()
                        navigate("/my-recipes")
                      }}
                    >
                      <ListItemIcon>
                        <RestaurantIcon fontSize="small" />
                      </ListItemIcon>
                      <ListItemText primary="המתכונים שלי" />
                    </MenuItem>
                    <MenuItem
                      onClick={() => {
                        handleUserMenuClose()
                        navigate("/favorites")
                      }}
                    >
                      <ListItemIcon>
                        <BookmarkIcon fontSize="small" />
                      </ListItemIcon>
                      <ListItemText primary="מועדפים" />
                    </MenuItem>
                    <Divider />
                    <MenuItem onClick={handleLogout}>
                      <ListItemIcon>
                        <ExitToAppIcon fontSize="small" />
                      </ListItemIcon>
                      <ListItemText primary="התנתקות" />
                    </MenuItem>
                  </Menu>
                </>
              ) : (
                <>
                  <Button
                    color="inherit"
                    onClick={() => navigate("/login")}
                    sx={{ mx: 1, "&:hover": { color: "#FFB74D" } }}
                    startIcon={<LoginIcon />}
                  >
                    התחברות
                  </Button>
                  <Button
                    variant="contained"
                    onClick={() => navigate("/signup")}
                    sx={{
                      ml: 1,
                      bgcolor: "#FFB74D",
                      "&:hover": { bgcolor: "#FFA726" },
                    }}
                    startIcon={<PersonAddIcon />}
                  >
                    הרשמה
                  </Button>
                </>
              )}
            </Box>
          </Toolbar>
        </Container>
      </AppBar>

      {/* תפריט נייד */}
      <Drawer anchor="right" open={mobileMenuOpen} onClose={toggleMobileMenu}>
        <Box sx={{ width: 250 }} role="presentation">
          <Box sx={{ p: 2, display: "flex", alignItems: "center" }}>
            <RestaurantMenuIcon sx={{ color: "#FFB74D", mr: 1 }} />
            <Typography variant="h6" component="div" sx={{ fontWeight: "bold" }}>
              טעמים
            </Typography>
          </Box>
          <Divider />

          {user && (
            <Box sx={{ p: 2, display: "flex", alignItems: "center" }}>
              <Avatar sx={{ bgcolor: "#FFB74D", mr: 2 }}>{user.Name ? user.Name.charAt(0) : "U"}</Avatar>
              <Box>
                <Typography variant="subtitle1" sx={{ fontWeight: "medium" }}>
                  {user.Name}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  {user.Email}
                </Typography>
              </Box>
            </Box>
          )}

          <List>
            <ListItem
            
              button
              onClick={() => {
                navigate("/")
                toggleMobileMenu()
              }}
              selected={isActive("/")}
            >
              <ListItemIcon>
                <HomeIcon sx={{ color: isActive("/") ? "#FFB74D" : undefined }} />
              </ListItemIcon>
              <ListItemText primary="דף הבית" />
            </ListItem>
            <ListItem
              button
              onClick={() => {
                navigate("/recipes")
                toggleMobileMenu()
              }}
              selected={isActive("/recipes")}
            >
              <ListItemIcon>
                <RestaurantIcon sx={{ color: isActive("/recipes") ? "#FFB74D" : undefined }} />
              </ListItemIcon>
              <ListItemText primary="מתכונים" />
            </ListItem>
          </List>

          <Divider />

          {user ? (
            <List>
              <ListItem
                button
                onClick={() => {
                  navigate("/profile")
                  toggleMobileMenu()
                }}
                selected={isActive("/profile")}
              >
                <ListItemIcon>
                  <PersonIcon sx={{ color: isActive("/profile") ? "#FFB74D" : undefined }} />
                </ListItemIcon>
                <ListItemText primary="הפרופיל שלי" />
              </ListItem>
              <ListItem
                button
                onClick={() => {
                  navigate("/my-recipes")
                  toggleMobileMenu()
                }}
              >
                <ListItemIcon>
                  <RestaurantIcon />
                </ListItemIcon>
                <ListItemText primary="המתכונים שלי" />
              </ListItem>
              <ListItem
                button
                onClick={() => {
                  navigate("/favorites")
                  toggleMobileMenu()
                }}
              >
                <ListItemIcon>
                  <BookmarkIcon />
                </ListItemIcon>
                <ListItemText primary="מועדפים" />
              </ListItem>
              <Divider />
              <ListItem
                button
                onClick={() => {
                  handleLogout()
                  toggleMobileMenu()
                }}
              >
                <ListItemIcon>
                  <ExitToAppIcon />
                </ListItemIcon>
                <ListItemText primary="התנתקות" />
              </ListItem>
            </List>
          ) : (
            <List>
              <ListItem
                button
                onClick={() => {
                  navigate("/login")
                  toggleMobileMenu()
                }}
              >
                <ListItemIcon>
                  <LoginIcon />
                </ListItemIcon>
                <ListItemText primary="התחברות" />
              </ListItem>
              <ListItem
                button
                onClick={() => {
                  navigate("/signup")
                  toggleMobileMenu()
                }}
              >
                <ListItemIcon>
                  <PersonAddIcon />
                </ListItemIcon>
                <ListItemText primary="הרשמה" />
              </ListItem>
            </List>
          )}
        </Box>
      </Drawer>
    </>
  )
}

export default Header
