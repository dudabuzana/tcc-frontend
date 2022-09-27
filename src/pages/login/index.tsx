/* eslint-disable jsx-a11y/alt-text */
import * as React from 'react';
import Stack from '@mui/material/Stack';
import Snackbar from '@mui/material/Snackbar';
import Button from '@mui/material/Button';
import CssBaseline from '@mui/material/CssBaseline';
import TextField from '@mui/material/TextField';
import FormControlLabel from '@mui/material/FormControlLabel';
import Checkbox from '@mui/material/Checkbox';
import Link from '@mui/material/Link';
import Paper from '@mui/material/Paper';
import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';
import Magnolia from '../../componentes/img/magnolia.jpeg';
import MuiAlert, { AlertProps } from '@mui/material/Alert';
import { useState } from 'react';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import { mask } from "../../utils/mask";
import { useForm } from "react-hook-form";
import { api } from "../../services/api";

const theme = createTheme();

export function Login() {
  const [valor, setValor] = useState('')
  const [message, setMessage] = useState('')
  const [open, setOpen] = React.useState(false);

  const vertical = 'bottom';
  const horizontal = 'right';

  const { register, handleSubmit } = useForm();

  const handleLogin = async (data: any) => {
    try {
      const response = await api.post("login", {
        login: data.cpfCnpj,
        senha: data.senha,
      });
      if (response.status === 200) {
        localStorage.setItem("token", response.data.token);
        localStorage.setItem("nivel", response.data.nivel);
        localStorage.setItem("cpfCnpj", response.data.cpfCnpj);
        window.location.href = "/home";
      }
    } catch (error: any) {
      setMessage(error.response.data.error)
      handleClick()
    }
  };

  function handleChangeMask(event: { target: { value: any; }; }) {
      const { value } = event.target

      setValor(mask(value))
  }

  const Alert = React.forwardRef<HTMLDivElement, AlertProps>(function Alert(
    props,
    ref,
  ) {
    return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
  });

  const handleClick = () => {
    setOpen(true);
  };

  const handleClose = (event?: React.SyntheticEvent | Event, reason?: string) => {
    if (reason === 'clickaway') {
      return;
    }
    setOpen(false);
  };

  return (
    <ThemeProvider theme={theme}>
      <Grid container component="main" sx={{ height: '100vh' }}>
        <CssBaseline />
        <Grid
          item
          xs={false}
          sm={4}
          md={6}
          sx={{
            backgroundImage: 'url(https://media.istockphoto.com/photos/white-background-abstract-picture-id1354045696?b=1&k=20&m=1354045696&s=170667a&w=0&h=NTwbMQSTpr1OsNTPkeprRzqdXBQpF9zNmjwEL69y21c=)',
            backgroundRepeat: 'no-repeat',
            backgroundColor: (t) =>
              t.palette.mode === 'light' ? t.palette.grey[50] : t.palette.grey[900],
            backgroundSize: 'cover',
            backgroundPosition: 'center',
          }}
        />
        <Grid item xs={12} sm={8} md={6} component={Paper} elevation={6} square>
          <Box
            sx={{
              my: 15,
              mx: 4,
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
            }}
          >
            <img src={Magnolia} />
            <Box component="form" noValidate onSubmit={handleSubmit(handleLogin)} sx={{ mt: 4 }}>
              <TextField
                margin="normal"
                required
                fullWidth
                id="cpfCnpj"
                label="CPF/CNPJ"
                autoComplete="email"
                autoFocus
                value={valor}
                {...register("cpfCnpj", { required: true, onChange: handleChangeMask })}
              />
              <TextField
                margin="normal"
                required
                fullWidth
                label="Senha"
                type="password"
                id="senha"
                autoComplete="current-password"
                {...register("senha", { required: "A senha precisa ter no mínimo 8 caracteres.", min: 8 })}
              />
              <FormControlLabel
                control={<Checkbox value="remember" color="primary" />}
                label="Lembre-me"
              />
              <Button
                type="submit"
                fullWidth
                variant="contained"
                sx={{ mt: 3, mb: 2 }}
              >
                Login
              </Button>
              <Button
                fullWidth
                variant="outlined"
                sx={{ mt: 0, mb: 2 }}
                href="/usuario/cadastrar"
              >
                Cadastre-se
              </Button>
              <Grid container>
                <Grid item xs>
                  <Link href="#" variant="body2">
                    Esqueceu a Senha?
                  </Link>
                </Grid>
              </Grid>
            </Box>
          </Box>
        </Grid>
      </Grid>
      <Stack spacing={4} sx={{ width: '100%' }}>
        <Snackbar open={open} autoHideDuration={6000} onClose={handleClose} anchorOrigin={{ vertical, horizontal }} >
          <Alert onClose={handleClose} severity="error" sx={{ width: '100%' }}>
            {message}
          </Alert>
        </Snackbar>
      </Stack>
    </ThemeProvider>
  );
}