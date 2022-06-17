import { useState } from "react";
import Avatar from "@mui/material/Avatar";
import Button from "@mui/material/Button";

import TextField from "@mui/material/TextField";

import Link from "@mui/material/Link";

import Box from "@mui/material/Box";
import Grid from "@mui/material/Grid";

import Typography from "@mui/material/Typography";

import { useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import AuthService from "../services/auth.service";
import logo from "../assets/logo.png"; // relative path to image
import { toast } from "react-toastify";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";

const schema = yup
  .object({
    email: yup.string().email().required(),
    password: yup.string().required()
  })
  .required();

export function LoginPage() {
  const navigate = useNavigate();
  const {
    register,
    handleSubmit,
    formState: { errors }
  } = useForm({
    resolver: yupResolver(schema)
  });
  const [loading, setLoading] = useState(0);

  const onSubmit = (data: { email?: string; password?: string }) => {
    setLoading(loading + 1);

    AuthService.login(data.email, data.password)
      .then(() => {
        toast.success("Successfully logged in");
        navigate("/newsfeed");
        window.location.reload();
      })
      .catch((err) => {
        toast.error(err?.response?.data?.message || "Failed to login");
      })
      .finally(() => {
        setLoading(loading - 1);
      });
  };

  return (
    <Box
      sx={{
        my: 8,
        mx: 4,
        display: "flex",
        flexDirection: "column",
        alignItems: "center"
      }}
    >
      <Box sx={{ flexGrow: 1 }}>
        <Avatar sx={{ height: 100, width: 200 }} src={logo}></Avatar>
      </Box>
      <Typography component="h1" sx={{ my: 3 }} variant="h5">
        Sign in
      </Typography>
      <Box
        className="auth-form"
        component="form"
        noValidate
        onSubmit={handleSubmit(onSubmit)}
        sx={{ mt: 1 }}
      >
        <TextField
          margin="normal"
          required
          fullWidth
          error={!!errors?.email}
          id="email"
          label="Email Address"
          autoComplete="email"
          {...register("email", { required: true })}
          autoFocus
        />
        <Typography color="error" variant="caption" display="block">
          {errors?.email?.message}
        </Typography>

        <TextField
          margin="normal"
          required
          error={!!errors?.password}
          fullWidth
          {...register("password", { required: true })}
          label="Password"
          type="password"
          id="password"
          autoComplete="current-password"
        />
        <Typography color="error" variant="caption" display="block">
          {errors?.password?.message}
        </Typography>

        <Button
          type="submit"
          fullWidth
          variant="contained"
          sx={{ mt: 3, mb: 2 }}
        >
          Sign In
        </Button>
        <Grid container>
          <Grid item>
            <Link href="register" variant="body2">
              {"Don't have an account? Sign Up"}
            </Link>
          </Grid>
        </Grid>
      </Box>
    </Box>
  );
}
