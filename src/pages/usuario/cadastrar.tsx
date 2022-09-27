/* eslint-disable jsx-a11y/alt-text */
import * as React from 'react';
import Avatar from '@mui/material/Avatar';
import Stack from '@mui/material/Stack';
import Snackbar from '@mui/material/Snackbar';
import Button from '@mui/material/Button';
import CssBaseline from '@mui/material/CssBaseline';
import TextField from '@mui/material/TextField';
import Paper from '@mui/material/Paper';
import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import Typography from '@mui/material/Typography';
import MenuItem from '@mui/material/MenuItem';
import MuiAlert, { AlertProps } from '@mui/material/Alert';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import { mask } from "../../utils/mask";
import { useForm } from "react-hook-form";
import { api } from "../../services/api";
import { InstituicaoProps } from "../../types/instituicao"

const theme = createTheme();

export function CadastrarUsuario() {
    const [instituicoesData, setInstituicoesData] = React.useState<InstituicaoProps[]>([]);
    const [instituicao, setInstituicao] = React.useState('');
    const [valor, setValor] = React.useState('')
    const [message, setMessage] = React.useState('')
    const [open, setOpen] = React.useState(false);
    const [openSucess, setOpenSucess] = React.useState(false);
    
    const vertical = 'bottom';
    const horizontal = 'right';

    const { register, handleSubmit } = useForm();

    React.useEffect(() => {
        fetchInstituicoes();
    });

    const fetchInstituicoes = async () => {
        const response = await api.get<InstituicaoProps[]>(`instituicao`);
        if (response.status === 200) {
            setInstituicoesData(response.data);
        } else {
            setMessage("Erro ao buscar as informações das instituições")
            handleClick()
        }     
    };

    const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setInstituicao(event.target.value);
    };

    const handleCadastro = async (data: any) => {
        if (data.senha !== data.confirmarSenha) {
            setMessage("A confirmação de senha não confere")
            handleClick()
        } else {
            try {
                const response = await api.post("professor", {
                    cpfCnpj: data.cpfCnpj,
                    senha: data.senha,
                    nome: data.nome,
                    cpfCnpjInstituicao: instituicao,
                    matricula: data.matricula,
                });
                if (response.status === 200) {
                    setMessage("Cadastro de Professor realizado com sucesso!")
                    setOpenSucess(true);
                    setTimeout(
                        () => {
                            window.location.href = "/login";
                        },
                        3000,
                    );
                }
            } catch (error: any) {
                setMessage(error.response.data.error)
                handleClick()
            }
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

    const handleCloseSucess = (event?: React.SyntheticEvent | Event, reason?: string) => {
        if (reason === 'clickaway') {
        return;
        }
        setOpenSucess(false);
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
                <Button href="/login" sx={{ mt: 2, mb: 0 }} >
                    <ArrowBackIcon color="primary"  />
                </Button>
            <Box
                sx={{
                my: 9,
                mx: 7,
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                }}
            >
                <Avatar sx={{ m: 1, bgcolor: 'secondary.main' }}>
                    <LockOutlinedIcon />
                </Avatar>
                <Typography component="h1" variant="h5">
                    Cadastro de Professor
                </Typography>
                <Box component="form" onSubmit={handleSubmit(handleCadastro)} sx={{ mt: 4 }}>
                <TextField
                    margin="normal"
                    required
                    fullWidth
                    select
                    id="instituicao"
                    label="Instituição"
                    autoFocus
                    value={instituicao}
                    onChange={handleChange}
                >   
                    {instituicoesData.map((option) => (
                    <MenuItem key={option.cpfCnpj} value={option.cpfCnpj}>
                        {option.instituicao.nome}
                    </MenuItem>
                ))}
                </TextField>
                <TextField
                    margin="normal"
                    required
                    fullWidth
                    id="nome"
                    label="Nome"
                    autoFocus
                    {...register("nome", { required: true })}
                />
                <TextField
                    margin="normal"
                    required
                    fullWidth
                    id="cpfCnpj"
                    label="CPF/CNPJ"
                    autoFocus
                    value={valor}
                    {...register("cpfCnpj", { required: true, onChange: handleChangeMask })}
                />
                <TextField
                    margin="normal"
                    required
                    fullWidth
                    id="matricula"
                    label="Matrícula"
                    autoFocus
                    {...register("matricula", { required: true })}
                />
                <TextField
                    margin="normal"
                    required
                    fullWidth
                    label="Senha"
                    type="password"
                    id="senha"
                    {...register("senha", { required: "A senha precisa ter no mínimo 8 caracteres.", min: 8 })}
                />
                <TextField
                    margin="normal"
                    required
                    fullWidth
                    label="Confirmar Senha"
                    type="password"
                    id="confirmarSenha"
                    {...register("confirmarSenha", { required: "A senha precisa ter no mínimo 8 caracteres.", min: 8 })}
                />
                <Button
                    type="submit"
                    fullWidth
                    variant="contained"
                    sx={{ mt: 3, mb: 2 }}
                >
                    Cadastrar
                </Button>
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
            <Snackbar open={openSucess} autoHideDuration={6000} onClose={handleCloseSucess} anchorOrigin={{ vertical, horizontal }} >
            <Alert onClose={handleCloseSucess} sx={{ width: '100%' }}>
                {message}
            </Alert>
            </Snackbar>
        </Stack>
        </ThemeProvider>
    );
}