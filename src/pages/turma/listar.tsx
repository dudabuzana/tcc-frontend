/* eslint-disable jsx-a11y/alt-text */
import * as React from 'react';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import Person from '@mui/icons-material/Person';
import CssBaseline from '@mui/material/CssBaseline';
import GlobalStyles from '@mui/material/GlobalStyles';
import Paper from '@mui/material/Paper';
import styles from "../../styles/styles.module.scss";
import Stack from '@mui/material/Stack';
import Snackbar from '@mui/material/Snackbar';
import MuiAlert, { AlertProps } from '@mui/material/Alert';
import { TurmaAlunosTable } from "./row";
import { MenuHeader } from '../../componentes/menu';
import { TurmaProps } from "../../types/turma";
import { api } from "../../services/api";

export function ListarTurma() {
    const [turmas, setTurmas] = React.useState<TurmaProps[]>([]);
    const [message, setMessage] = React.useState('');
    const [open, setOpen] = React.useState(false);
    const [openSucess, setOpenSucess] = React.useState(false);

    const vertical = 'bottom';
    const horizontal = 'right';

    const fetchTurmas = async () => {
        const url = localStorage.getItem('nivel') === 'instituicao' ? "turma" : `professor/${localStorage.getItem('cpfCnpj')}/turma`;
        const response = await api.get<TurmaProps[]>(url);
        if (response.status === 200) {
            setTurmas(response.data)
        }     
    };

    React.useEffect(() => {
        if (turmas.length === 0) {
            fetchTurmas();
        }
    });

    const Alert = React.forwardRef<HTMLDivElement, AlertProps>(function Alert(
        props,
        ref,
    ) {
        return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
    });

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
        <div className={styles.container} >
            <Paper sx={{ width: '100%' }} elevation={0}>
                <Typography component="h1" variant="h4" sx={{ mt: 4, mb: 4 }}>
                    <Person /> Gerenciamento de Turmas
                </Typography>
                <hr/>
                <Button href="/turma/cadastrar" variant="contained" sx={{ float: 'right' }} >
                    Cadastrar
                </Button>
            <TurmaAlunosTable />
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