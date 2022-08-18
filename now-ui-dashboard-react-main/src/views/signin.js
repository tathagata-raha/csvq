import * as React from 'react';
import Button from '@mui/material/Button';
import CssBaseline from '@mui/material/CssBaseline';
import TextField from '@mui/material/TextField';
import Box from '@mui/material/Box';
// import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import Typography from '@mui/material/Typography';
import Container from '@mui/material/Container';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import axios from "axios";
import PanelHeader from "components/PanelHeader/PanelHeader.js";

const theme = createTheme();

function SignIn(props) {
  const handleSubmit = (event) => {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    const details = {
      username: data.get('username').trim(),
      password: data.get('password').trim(),
    };
    axios.get(`http://localhost:5050/meta/login?username=${details.username}&password=${details.password}`)
      .then(res => {
        if(res.status == 200) {
          localStorage.setItem("username", details.username)
          window.dispatchEvent(new Event("authChange"));
        } else {
          alert("Invalid login details");
        }
      })
      .catch(e => {
        console.log(e);
        alert("Invalid login details");
      })
  };

  return (
    <>
    <PanelHeader
        content={
          <div className="header text-center">
            <h2 className="title">Sign In</h2>
          </div>
        }
      />
    <ThemeProvider theme={theme}>
      <Container component="main" maxWidth="xs">
        <CssBaseline />
        <Box
          sx={{
            marginTop: 8,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
          }}
        >
          <Box component="form" onSubmit={handleSubmit} noValidate sx={{ mt: 1 }}>
            <TextField
              margin="normal"
              required
              fullWidth
              id="username"
              label="Username"
              name="username"
              autoComplete="username"
              autoFocus
            />
            <TextField
              margin="normal"
              required
              fullWidth
              name="password"
              label="Password"
              type="password"
              id="password"
              autoComplete="current-password"
            />
            <Button
              type="submit"
              fullWidth
              variant="contained"
              sx={{ mt: 3, mb: 2 }}
            >
              Login
            </Button>

            </Box>
        </Box>
      </Container>
    </ThemeProvider>
    </>
  );
}

export default SignIn;
