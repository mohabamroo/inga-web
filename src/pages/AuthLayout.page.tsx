import CssBaseline from "@mui/material/CssBaseline";

import Paper from "@mui/material/Paper";

import Grid from "@mui/material/Grid";
import { Route, Routes } from "react-router-dom";

import { createTheme, ThemeProvider } from "@mui/material/styles";
import { RegisterPage } from "./Register.page";
import { LoginPage } from "./Login.page";
import { NotFound } from "./NotFound.page";

const theme = createTheme();

export function AuthLayout() {
  return (
    <ThemeProvider theme={theme}>
      <Grid container component="main" sx={{ height: "100vh" }}>
        <CssBaseline />
        <Grid
          item
          xs={false}
          sm={4}
          md={7}
          sx={{
            backgroundImage: "url(https://source.unsplash.com/random)",
            backgroundRepeat: "no-repeat",
            backgroundColor: (t) =>
              t.palette.mode === "light"
                ? t.palette.grey[50]
                : t.palette.grey[900],
            backgroundSize: "cover",
            backgroundPosition: "center"
          }}
        />
        <Grid item xs={12} sm={8} md={5} component={Paper} elevation={6} square>
          <Routes>
            <Route path="/register" element={RegisterPage()} />
            <Route path="/login" element={LoginPage()} />
            <Route path="*" element={NotFound()} />
          </Routes>
        </Grid>
      </Grid>
    </ThemeProvider>
  );
}
