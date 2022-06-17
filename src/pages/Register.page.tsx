import { useState } from "react";
import Avatar from "@mui/material/Avatar";
import Button from "@mui/material/Button";
import "../styles/auth.styles.css";
import TextField from "@mui/material/TextField";
import logo from "../assets/logo.png"; // relative path to image

import Link from "@mui/material/Link";

import Box from "@mui/material/Box";
import Grid from "@mui/material/Grid";

import Typography from "@mui/material/Typography";

import { useForm } from "react-hook-form";
import AuthService from "../services/auth.service";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { useNavigate } from "react-router-dom";
import { Alert, CircularProgress } from "@mui/material";
const schema = yup
  .object({
    firstName: yup.string().required(),
    lastName: yup.string(),
    email: yup.string().email().required(),
    password: yup.string().required()
  })
  .required();

export function RegisterPage() {
  const [loading, setLoading] = useState(0);
  const [errorMessage, setErrorMessage] = useState<string | undefined>();
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,

    formState: { errors }
  } = useForm({
    resolver: yupResolver(schema)
  });

  const onSubmit = (data: {
    email?: string;
    password?: string;
    lastName?: string;
    firstName?: string;
  }) => {
    setLoading(1);
    setErrorMessage(undefined);

    AuthService.register(data)
      .then(() => {
        navigate("/newsfeed");
        window.location.reload();
      })
      .catch((err) => {
        setErrorMessage(err.response.data.message || "Failed to register");
      })
      .finally(() => {
        setLoading(0);
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
      </Box>{" "}
      <Typography sx={{ my: 3 }} component="h1" variant="h5">
        Register
      </Typography>
      {errorMessage && <Alert severity="error">{errorMessage}</Alert>}
      <Box
        component="form"
        noValidate
        className="auth-form"
        onSubmit={handleSubmit(onSubmit)}
        sx={{ mt: 1 }}
      >
        {/* TODO: refactor into component */}
        <div className="form-field">
          <TextField
            margin="normal"
            fullWidth
            id="firstName"
            required
            error={errors && errors["firstName"] != null}
            {...register("firstName", {
              required: true,
              maxLength: 20
            })}
            label="First Name"
            autoFocus
          />
          <Typography color="error" variant="caption" display="block">
            {errors["firstName"]?.message}
          </Typography>
        </div>

        <div className="form-field">
          <TextField
            margin="normal"
            fullWidth
            id="lastName"
            {...register("lastName", { required: false, maxLength: 20 })}
            name="lastName"
            label="Last Name"
          />
        </div>

        <div className="form-field">
          <TextField
            margin="normal"
            fullWidth
            id="email"
            error={errors["email"] != null}
            placeholder="john@gmail.com"
            label="Email Address"
            autoComplete="email"
            required
            {...register("email", { required: true })}
          />
          <Typography color="error" variant="caption" display="block">
            {errors["email"]?.message}
          </Typography>
        </div>

        <div className="form-field">
          <TextField
            fullWidth
            margin="normal"
            error={errors["password"] != null}
            label="Password"
            type="password"
            id="password"
            required
            autoComplete="current-password"
            placeholder="********"
            {...register("password", { required: true })}
          />
          <Typography color="error" variant="caption" display="block">
            {errors["password"]?.message}
          </Typography>
        </div>

        <Button
          type="submit"
          fullWidth
          style={{ color: "white" }}
          variant="contained"
          sx={{ mt: 3, mb: 2 }}
        >
          {loading == 0 ? (
            <span>Submit</span>
          ) : (
            <CircularProgress size="1rem" color="inherit" />
          )}
        </Button>
        <Grid container>
          <Grid item>
            <Link href="login" variant="body2">
              {"Have an account? Sign In"}
            </Link>
          </Grid>
        </Grid>
      </Box>
    </Box>
  );
}
