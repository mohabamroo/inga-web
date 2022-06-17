import { AppBar, Avatar, Button, Toolbar } from "@mui/material";
import { Box } from "@mui/system";
import { useNavigate } from "react-router-dom";

import logo from "../assets/logo.png"; // relative path to image

export function Header() {
  const navigate = useNavigate();
  function handleClick() {
    localStorage.clear();
    navigate("/register");
    window.location.reload();
  }

  return (
    <AppBar position="relative" sx={{ background: "#323232" }}>
      <Toolbar>
        <Box sx={{ flexGrow: 1 }}>
          <Avatar sx={{ height: 100, width: 200 }} src={logo}></Avatar>
        </Box>

        <Button color="error" onClick={() => handleClick()} variant="contained">
          Log out
        </Button>
      </Toolbar>
    </AppBar>
  );
}
