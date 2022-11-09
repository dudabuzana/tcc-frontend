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
import { DeleteButton } from '../../componentes/button/delete';
import { MenuHeader } from '../../componentes/menu';
import { PessoaProps } from "../../types/pessoa"
import { api } from "../../services/api";

export function ListarAluno() {
    const [alunos, setAlunos] = React.useState<PessoaProps[]>([]);
    const [message, setMessage] = React.useState('');
    const [open, setOpen] = React.useState(false);
    const [openSucess, setOpenSucess] = React.useState(false);

    const vertical = 'bottom';
    const horizontal = 'right';

    const fetchAlunos = async () => {
        const response = await api.get<PessoaProps[]>(`aluno`);
        if (response.status === 200) {
            setAlunos(response.data)
        }     
    };

    React.useEffect(() => {
        if (alunos.length === 0) {
            fetchAlunos();
        }
    });

    interface Column {
        id: 'cpfCnpj' | 'nome' | 'matricula' | 'actions';
        label: string;
        minWidth?: number;
        align: 'right' | 'left';
        format?: string;
    }

    const columns: readonly Column[] = [
        { id: 'cpfCnpj', label: 'CPF', minWidth: 150, align: 'left' },
        { id: 'nome', label: 'Nome', minWidth: 300, align: 'left' },
        { id: 'matricula', label: 'Matrícula', minWidth: 100, align: 'left' },
        { id: 'actions', label: '', minWidth: 10, align: 'right' },
    ];

    interface Data {
        cpfCnpj: string;
        nome: string;
        matricula: string;
        actions: string;
    }
      
    function createData(
        cpfCnpj: string,
        nome: string,
        matricula: string,
      ): Data {
        return { cpfCnpj, nome, matricula, actions: "" };
    }

    const handleDelete = async (cpfCnpj: string) => {
        try {
            const response = await api.delete(`aluno/${cpfCnpj}`);
            if (response.status === 200) {
                setMessage("Exclusão de Aluno realizada com sucesso!")
                setOpenSucess(true);
                setTimeout(
                    () => {
                        fetchAlunos();
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
                    <Person /> Gerenciamento de Alunos
                </Typography>
                <hr/>
                <Button href="/aluno/cadastrar" variant="contained" sx={{ float: 'right' }} >
                    Cadastrar
                </Button>
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
                    {alunos.map((aluno) => {
                        const row = createData(aluno.cpfCnpj, aluno.pessoa.nome, aluno.pessoa.matricula);
                        return (
                        <TableRow hover role="checkbox" tabIndex={-1} key={row.cpfCnpj}>
                            {columns.map((column) => {
                            const value = row[column.id];
                            return (
                                <TableCell key={column.id} align={column.align}>
                                    {column.id !== 'actions' ? value : 
                                        (<div>
                                            <Button href={`alterar/${aluno.cpfCnpj}`} sx={{ mb: 0 }} >
                                                <EditIcon />
                                            </Button>
                                            <DeleteButton handleDelete={handleDelete} id={aluno.cpfCnpj} title={'Aluno'}/>
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