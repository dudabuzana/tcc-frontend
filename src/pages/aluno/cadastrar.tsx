/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable jsx-a11y/alt-text */
import * as React from 'react';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import Person from '@mui/icons-material/Person';
import CssBaseline from '@mui/material/CssBaseline';
import GlobalStyles from '@mui/material/GlobalStyles';
import Paper from '@mui/material/Paper';
import TextField from '@mui/material/TextField';
import styles from "../../styles/styles.module.scss";
import Stack from '@mui/material/Stack';
import Box from '@mui/material/Box';
import Snackbar from '@mui/material/Snackbar';
import MuiAlert, { AlertProps } from '@mui/material/Alert';
import { useParams } from "react-router-dom";
import { PessoaProps } from "../../types/pessoa"
import { MenuHeader } from '../../componentes/menu';
import { useForm } from "react-hook-form";
import { api } from "../../services/api";
import { mask } from "../../utils/mask";

export function CadastrarAluno() {
    const [valor, setValor] = React.useState('');
    const [message, setMessage] = React.useState('')
    const [open, setOpen] = React.useState(false);
    const [openSucess, setOpenSucess] = React.useState(false);
    const [initialData, setInitialData] = React.useState<PessoaProps | null>(null);
    const { cpfCnpj } = useParams();
    
    const vertical = 'bottom';
    const horizontal = 'right';

    const { register, handleSubmit, reset } = useForm();

    function handleChangeMask(event: { target: { value: any; }; }) {
        const { value } = event.target
        setValor(mask(value))
    }

    const boolInsert = cpfCnpj === undefined;

    const fetch = async () => {
        const response = await api.get<PessoaProps>(`aluno/${cpfCnpj}`);
        if (response.status === 200) {
            setInitialData(response.data);
        } else {
            alert("Erro ao buscar as informações do Aluno");
        }
    };

    React.useEffect(() => {
        if (!boolInsert) {
          fetch();
        }
    }, [cpfCnpj, boolInsert]);

    React.useEffect(() => {
        if(initialData) {
          reset(initialData);
        }
    }, [initialData, reset]);

    const handleCadastro = async (data: any) => {
        if (data.senha !== data.confirmarSenha) {
            setMessage("A confirmação de senha não confere")
            handleClick()
        } else {
            try {
                const body = {
                    cpfCnpj: data.cpfCnpj,
                    senha: data.senha,
                    nome: data.nome,
                    matricula: data.matricula,
                    cpfCnpjInstituicao: localStorage.getItem('cpfCnpj'),
                }
                const response = boolInsert ? await api.post("aluno", body) : await api.put(`aluno/${cpfCnpj}`, body);
                if (response.status === 200) {
                    setMessage(boolInsert ? "Cadastro de Aluno realizado com sucesso!" : "Alteração de Aluno realizada com sucesso!")
                    setOpenSucess(true);
                    setTimeout(
                        () => {
                            window.location.href = "/aluno/list";
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
        <React.Fragment>
        <GlobalStyles styles={{ ul: { margin: 0, padding: 0, listStyle: 'none' } }} />
        <CssBaseline />
        <MenuHeader/>
        <div className={styles.containerForm} >
            <Paper sx={{ width: '100%', float: 'right' }} elevation={0}>
                <Typography component="h1" variant="h4" sx={{ mt: 4, mb: 4 }}>
                    <Person /> {(boolInsert) ? "Cadastro " : "Alteração " }de Aluno
                </Typography>
                <hr/>
                <Box component="form" onSubmit={handleSubmit(handleCadastro)} sx={{ mt: 4 }}>
                <TextField
                    margin="normal"
                    required
                    fullWidth
                    id="nome"
                    label="Nome"
                    autoFocus
                    defaultValue={initialData?.pessoa.nome}
                    {...register("nome", { required: true })}
                />
                <TextField
                    margin="normal"
                    required
                    fullWidth
                    id="cpfCnpj"
                    label="CPF/CNPJ"
                    autoFocus
                    defaultValue={initialData?.cpfCnpj}
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
                    value={initialData?.pessoa.matricula}
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
                    {(boolInsert) ? "Cadastrar" : "Alterar" }
                </Button>
                </Box>
            </Paper>
            <Stack spacing={4} >
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
        </div>
        </React.Fragment>
    );
}