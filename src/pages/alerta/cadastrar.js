/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable array-callback-return */
/* eslint-disable jsx-a11y/alt-text */
import * as React from 'react';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import Person from '@mui/icons-material/Person';
import CssBaseline from '@mui/material/CssBaseline';
import GlobalStyles from '@mui/material/GlobalStyles';
import Paper from '@mui/material/Paper';
import Checkbox from '@mui/material/Checkbox';
import TextField from '@mui/material/TextField';
import styles from "../../styles/styles.module.scss";
import Stack from '@mui/material/Stack';
import Box from '@mui/material/Box';
import Snackbar from '@mui/material/Snackbar';
import FormControlLabel from '@mui/material/FormControlLabel';
import MuiAlert from '@mui/material/Alert';
import { MenuHeader } from '../../componentes/menu';
import { useForm } from "react-hook-form";
import InfoIcon from '@mui/icons-material/Info';
import IconButton from '@mui/material/IconButton';
import Tooltip from '@mui/material/Tooltip';
import { api } from "../../services/api";

export function CadastrarAlerta() {
    const [checked, setChecked] = React.useState([false, false]);
    const [value, setValue] = React.useState(['', '']);
    const [message, setMessage] = React.useState('')
    const [open, setOpen] = React.useState(false);
    const [openSucess, setOpenSucess] = React.useState(false);
    
    const vertical = 'bottom';
    const horizontal = 'right';

    const { handleSubmit } = useForm();

    const handleCadastro = async () => {
        try {
            const response = await api.post("alerta", {
                cpfCnpj: localStorage.getItem('cpfCnpj'),
                response: checked[0],
                responseValue: Number(value[0]),
                negative: checked[1],
                negativeValue: Number(value[1]),
            });
            if (response.status === 200) {
                setMessage("Configuração de Alerta realizado com sucesso!")
                setOpenSucess(true);
                setTimeout(
                    () => {
                        window.location.href = "/formulario/list";
                    },
                    3000,
                );
            }
        } catch (error) {
            setMessage(error.response.data.error)
            handleClick()
        }
    };

    React.useEffect(() => {
        fetchAlerta();
    }, []);

    const fetchAlerta = async () => {
        const response = await api.get(`alerta/${localStorage.getItem('cpfCnpj')}`);
        if (response.status === 200) {
            setValue([response.data.responseValue === 0 ? '' : response.data.responseValue, response.data.negativeValue === 0 ? '' : response.data.negativeValue]);
            setChecked([response.data.response, response.data.negative]);
        } else {
            setMessage("Erro ao buscar as informações de alerta")
            handleClick();
        }     
    };

    const Alert = React.forwardRef(function Alert(
        props,
        ref,
    ) {
        return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
    });

    const handleClick = () => {
        setOpen(true);
    };

    const handleClose = (event, reason) => {
        if (reason === 'clickaway') {
            return;
        }
        setOpen(false);
    };

    const handleCloseSucess = (event, reason) => {
        if (reason === 'clickaway') {
        return;
        }
        setOpenSucess(false);
    };

    const onChangeResponse = (e) => { 
        if(!e.target.checked) {
            setValue(['', value[1]]);
        }
        setChecked([e.target.checked, checked[1]]);
    }

    const onChangeNegative = (e) => { 
        if(!e.target.checked) {
            setValue([value[0], '']);
        }
        setChecked([checked[0], e.target.checked]);
    }

    const onChangeValueResponse = (e) => { 
        if(e.target.value >= 0 && e.target.value <= 100) {
            setValue([e.target.value, value[1]]);
        }   
    }

    const onChangeValueNegative = (e) => { 
        if(e.target.value >= 0 && e.target.value <= 100) {
            setValue([value[0], e.target.value]);
        }   
    }

    return (
        <React.Fragment>
        <GlobalStyles styles={{ ul: { margin: 0, padding: 0, listStyle: 'none' } }} />
        <CssBaseline />
        <MenuHeader/>
        <div className={styles.containerForm} >
            <Paper sx={{ width: '100%', float: 'right' }} elevation={0}>
                <Typography component="h1" variant="h4" sx={{ mt: 4, mb: 4 }}>
                    <Person /> Configuração de Alertas
                </Typography>
                <hr/>
                <Alert severity="info">Aqui é possível você configurar alertas para a sua aplicação, que serão recebidos de acordo com as respostas submetidas nos formulários! <strong>Estes alertas você receberá no e-mail vinculado a sua conta.</strong></Alert>
                <Box component="form" onSubmit={handleSubmit(handleCadastro)} sx={{ mt: 4 }}>
                    <div style={{ marginBottom: 20}}>
                        <FormControlLabel control={<Checkbox onChange={onChangeResponse} checked={checked[0]}/>} label="Respostas Submetidas" sx={{ width: 220}} />
                        <TextField value={value[0]} onChange={onChangeValueResponse} label="Percentual" disabled={!checked[0]} required={checked[0]} type="number"/>
                        <Tooltip title={"Caso selecionado, informe o percentual pelo qual você deseja receber o alerta. Ex: Caso configurado 70, você receberá um alerta quando 70% dos alunos da turma responderem ao formulário"} sx={{marginLeft: 1}}>
                            <IconButton>
                                <InfoIcon />
                            </IconButton>
                        </Tooltip>
                    </div>
                    <br/>
                    <div>
                        <FormControlLabel control={<Checkbox onChange={onChangeNegative} checked={checked[1]}/>} id="negative" label="Respostas Negativas" sx={{ width: 220}} />
                        <TextField value={value[1]} onChange={onChangeValueNegative} label="Percentual" disabled={!checked[1]} required={checked[1]} type="number"/>
                        <Tooltip title={"Caso selecionado, informe o percentual pelo qual você deseja receber o alerta. Ex: Caso configurado 30, você receberá um alerta quando 30% das respostas forem negativas. Importante: Alerta válido apenas para as perguntas do tipo Escala Likert."} sx={{marginLeft: 1}}>
                            <IconButton>
                                <InfoIcon />
                            </IconButton>
                        </Tooltip>
                    </div>
                    
                    
                    <Button
                        type="submit"
                        fullWidth
                        variant="contained"
                        sx={{ mt: 3, mb: 2 }}
                    >
                        Configurar
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