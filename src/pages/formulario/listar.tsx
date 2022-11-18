/* eslint-disable jsx-a11y/alt-text */
import * as React from 'react';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
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
import ViewListIcon from '@mui/icons-material/ViewList';
import EditIcon from '@mui/icons-material/Edit';
import Stack from '@mui/material/Stack';
import Snackbar from '@mui/material/Snackbar';
import MuiAlert, { AlertProps } from '@mui/material/Alert';
import { MenuHeader } from '../../componentes/menu';
import { DeleteButton } from '../../componentes/button/delete';
import { SendButton } from '../../componentes/button/send';
import { FormularioProps } from "../../types/formulario"
import { api } from "../../services/api";

export function ListarFormulario() {
    const [formularios, setFormularios] = React.useState<FormularioProps[]>([]);
    const [message, setMessage] = React.useState('');
    const [open, setOpen] = React.useState(false);
    const [openSucess, setOpenSucess] = React.useState(false);

    const vertical = 'bottom';
    const horizontal = 'right';

    const fetchFormularios = async () => {
        const url = localStorage.getItem('nivel') === 'instituicao' ? "formulario" : `professor/${localStorage.getItem('cpfCnpj')}/formulario`;
        const response = await api.get<FormularioProps[]>(url);
        if (response.status === 200) {
            setFormularios(response.data)
        }     
    };

    React.useEffect(() => {
        if (formularios.length === 0) {
            fetchFormularios();
        }
    });

    interface Column {
        id: 'curso' | 'disciplina' | 'semestre' | 'data' | 'status' | 'actions';
        label: string;
        minWidth?: number;
        align: 'right' | 'left';
        format?: string;
    }

    const columns: readonly Column[] = [
        { id: 'curso', label: 'Curso', minWidth: 180, align: 'left' },
        { id: 'disciplina', label: 'Disciplina', minWidth: 200, align: 'left' },
        { id: 'semestre', label: 'Semestre', minWidth: 100, align: 'left' },
        { id: 'data', label: 'Data', minWidth: 120, align: 'left' },
        { id: 'status', label: 'Status', minWidth: 100, align: 'left' },
        { id: 'actions', label: '', minWidth: 10, align: 'right' },
    ];

    interface Data {
        curso: string;
        disciplina: string;
        semestre: string;
        data: string;
        status: string;
        actions: string;
    }
      
    function createData(
        curso: string,
        disciplina: string,
        semestre: string,
        data: string,
        status: string
      ): Data {
        return { curso, disciplina, semestre, data, status, actions: "" };
    }

    const handleDelete = async (id: string) => {
        try {
            const response = await api.delete(`formulario/${id}`);
            if (response.status === 200) {
                setMessage("Exclusão de Formulário realizada com sucesso!")
                setOpenSucess(true);
                setTimeout(
                    () => {
                        fetchFormularios();
                    },
                    3000,
                );
            }
        } catch (error: any) {
            setMessage(error.response.data.error)
            handleClick()
        }
    };

    const handleUpdate = async (formulario: FormularioProps) => {
        try {
            const response = await api.put(`formulario/${formulario.id}`, {
                id: formulario.id,
                idTurma: formulario.Turma.id,
                status: 'enviado'
            });
            if (response.status === 200) {
                setMessage("Envio do Formulário realizada com sucesso!")
                setOpenSucess(true);
                setTimeout(
                    () => {
                        fetchFormularios();
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
                    <ViewListIcon /> Gerenciamento de Formulários
                </Typography>
                <hr/>
                <Button href="/formulario/cadastrar" variant="contained" sx={{ float: 'right' }} >
                    Cadastrar
                </Button>
                <Button href="/alerta/cadastrar" variant="contained" sx={{ float: 'right', marginRight: 1 }} >
                    Configurar Alertas
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
                    {formularios.map((formulario) => {
                        const row = createData(
                            formulario.Turma.Disciplina.curso, 
                            formulario.Turma.Disciplina.nome, 
                            String(formulario.Turma.semestre).substring(4) + "/" + String(formulario.Turma.semestre).substring(0,4), 
                            formulario.dataCriacao.substring(8, 10) + "/" + formulario.dataCriacao.substring(5, 7) + "/" + formulario.dataCriacao.substring(0, 4), 
                            formulario.status === 'criado' ? 'Criado' : 'Enviado'
                        );
                        return (
                        <TableRow hover role="checkbox" tabIndex={-1} key={formulario.id}>
                            {columns.map((column) => {
                            const value = row[column.id];
                            return (
                                <TableCell key={column.id} align={column.align}>
                                    {column.id !== 'actions' ? value : 
                                        (<div>
                                            <Button href={`/formulario/${formulario.id}`} sx={{ mb: 0 }} >
                                                <ViewListIcon />
                                            </Button>
                                            <Button href={`alterar/${formulario.id}`} sx={{ mb: 0 }} disabled={formulario.status === 'enviado'} >
                                                <EditIcon />
                                            </Button>
                                            <SendButton handleSend={handleUpdate} formulario={formulario}/>
                                            <DeleteButton handleDelete={handleDelete} id={formulario.id} title={'Formulário'}/>
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