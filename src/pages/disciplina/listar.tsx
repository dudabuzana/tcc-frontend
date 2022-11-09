/* eslint-disable jsx-a11y/alt-text */
import * as React from 'react';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import Person from '@mui/icons-material/Person';
import CssBaseline from '@mui/material/CssBaseline';
import GlobalStyles from '@mui/material/GlobalStyles';
import Paper from '@mui/material/Paper';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import styles from "../../styles/styles.module.scss";
import EditIcon from '@mui/icons-material/Edit';
import Stack from '@mui/material/Stack';
import Snackbar from '@mui/material/Snackbar';
import MuiAlert, { AlertProps } from '@mui/material/Alert';
import { MenuHeader } from '../../componentes/menu';
import { DisciplinaProps } from "../../types/disciplina";
import { DeleteButton } from '../../componentes/button/delete';
import { api } from "../../services/api";

export function ListarDisciplina() {
    const [disciplinas, setDisciplinas] = React.useState<DisciplinaProps[]>([]);
    const [message, setMessage] = React.useState('');
    const [open, setOpen] = React.useState(false);
    const [openSucess, setOpenSucess] = React.useState(false);

    const vertical = 'bottom';
    const horizontal = 'right';

    const fetchDisciplinas = async () => {
        const response = await api.get<DisciplinaProps[]>("/disciplina");
        if (response.status === 200) {
            setDisciplinas(response.data)
        }     
    };

    React.useEffect(() => {
        if (disciplinas.length === 0) {
            fetchDisciplinas();
        }
    });

    interface Column {
        id: 'nome' | 'curso' | 'actions';
        label: string;
        minWidth?: number;
        align: 'right' | 'left';
        format?: string;
    }

    const columns: readonly Column[] = [
        { id: 'nome', label: 'Nome', minWidth: 300, align: 'left' },
        { id: 'curso', label: 'Curso', minWidth: 100, align: 'left' },
        { id: 'actions', label: '', minWidth: 10, align: 'right' },
    ];

    interface Data {
        nome: string;
        curso: string;
        actions: string;
    }
      
    function createData(
        nome: string,
        curso: string,
      ): Data {
        return { nome, curso, actions: "" };
    }

    const handleDelete = async (id: string) => {
        try {
            const response = await api.delete(`disciplina/${id}`);
            if (response.status === 200) {
                setMessage("Exclusão de Disciplina realizada com sucesso!")
                setOpenSucess(true);
                setTimeout(
                    () => {
                        fetchDisciplinas();
                    },
                    3000,
                );
            }
        } catch (error: any) {
            setMessage(error.response.data.error)
            handleClick()
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
        <div className={styles.container} >
            <Paper sx={{ width: '100%' }} elevation={0}>
                <Typography component="h1" variant="h4" sx={{ mt: 4, mb: 4 }}>
                    <Person /> Gerenciamento de Disciplinas
                </Typography>
                <hr/>
                {(localStorage.getItem('nivel') === 'instituicao') && <Button href="/disciplina/cadastrar" variant="contained" sx={{ float: 'right' }} >Cadastrar</Button>}
            <TableContainer sx={{ mt: 2 }}>
                <Table stickyHeader aria-label="sticky table" >
                <TableHead>
                    <TableRow>
                    {columns.map((column) => (
                        <TableCell
                            key={column.id}
                            align={column.align}
                            style={{ minWidth: column.minWidth, fontWeight: "bold" }}
                        >
                        {column.label}
                        </TableCell>
                    ))}
                    </TableRow>
                </TableHead>
                <TableBody>
                    {disciplinas.map((disciplina) => {
                        const row = createData(disciplina.nome, disciplina.curso);
                        return (
                        <TableRow hover role="checkbox" tabIndex={-1} key={disciplina.id}>
                            {columns.map((column) => {
                            const value = row[column.id];
                            return (
                                <TableCell key={column.id} align={column.align}>
                                    {column.id !== 'actions' ? value : 
                                        (<div>
                                            <Button href="/login" sx={{ mb: 0 }} >
                                                <EditIcon />
                                            </Button>
                                            <DeleteButton handleDelete={handleDelete} id={disciplina.id} title={'Disciplina'}/>
                                        </div>)
                                    }
                                </TableCell>
                            );
                            })}
                        </TableRow>
                        );
                    })}
                </TableBody>
                </Table>
            </TableContainer>
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