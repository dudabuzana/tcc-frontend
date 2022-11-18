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
import TextField from '@mui/material/TextField';
import styles from "../../styles/styles.module.scss";
import Stack from '@mui/material/Stack';
import Box from '@mui/material/Box';
import Snackbar from '@mui/material/Snackbar';
import Radio from '@mui/material/Radio';
import RadioGroup from '@mui/material/RadioGroup';
import FormControlLabel from '@mui/material/FormControlLabel';
import MenuItem from '@mui/material/MenuItem';
import MuiAlert from '@mui/material/Alert';
import { useParams } from "react-router-dom";
import { MenuHeader } from '../../componentes/menu';
import { useForm } from "react-hook-form";
import { api } from "../../services/api";

export function ConfigurarAlerta() {
    const { id } = useParams();
    const isInsert = id === undefined;

    const [turmasData, setTurmasData] = React.useState([]);
    const [turma, setTurma] = React.useState('');
    const [message, setMessage] = React.useState('')
    const [open, setOpen] = React.useState(false);
    const [openSucess, setOpenSucess] = React.useState(false);
    const [perguntas, setPerguntas] = React.useState(
        new Map()
    );
    const [initialData, setInitialData] = React.useState(
        new Map()
    );
    
    const vertical = 'bottom';
    const horizontal = 'right';

    const { register, handleSubmit } = useForm();

    React.useEffect(() => {
        fetchTurmas();
    }, []);

    const fetchTurmas = async () => {
        const url = localStorage.getItem('nivel') === 'instituicao' ? "turma" : `professor/${localStorage.getItem('cpfCnpj')}/turma`;
        const response = await api.get(url);
        if (response.status === 200) {
            setTurmasData(response.data);
            !isInsert ? fetchData() : onAdd();
        } else {
            setMessage("Erro ao buscar as informações das turmas")
            handleClick();
        }     
    };

    const fetchData = async () => {
        const response = await api.get(`formulario/${id}/pergunta`);
        if (response.status === 200) {
            setTurma(response.data[0].Formulario.Turma.id);
            response.data.map((pergunta) => {
                setInitialData(
                    (prev) =>
                      new Map([...prev, [pergunta.id, {
                          titulo: pergunta.titulo, 
                          descricao: pergunta.descricao,
                          tipo: pergunta.tipo
                      }]])
                );
                setPerguntas(
                    (prev) =>
                      new Map([...prev, [pergunta.id, {
                          titulo: '', 
                          descricao: '',
                          tipo: 'likert'
                      }]])
                );
            });
            console.log(response.data);
        } else {
            setMessage("Erro ao buscar as informações do formulário")
            handleClick();
        }     
    };

    const handleCadastro = async (data) => {
        let body = [];

        Array.from(perguntas).map((item) => {
            body = [...body, {
                id: item[0],
                titulo: item[1].titulo,
                descricao: item[1].descricao,
                tipo: item[1].tipo
            }]
        });

        try {
            const response = isInsert ? await api.post("formulario", {
                idTurma: turma,
                status: 'criado',
                perguntas: body,
            }) : await api.put(`formulario/${id}/pergunta`, {
                idTurma: turma,
                status: 'criado',
                perguntas: body,
            });
            if (response.status === 200) {
                setMessage("Cadastro de Formulário realizado com sucesso!")
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

    const onAdd = () => {
        setPerguntas(
          (prev) =>
            new Map([...prev, [perguntas.size + 1, {
                titulo: '', 
                descricao: '',
                tipo: 'likert'
            }]])
        );
    };

    const onRemove = (index) => {
        setPerguntas((prev) => {
          const map = new Map(prev);
          map.delete(index);
          return map;
        });
    };

    function handleOnChangeTipo(e){    
        const i = e.target.name.replace('tipo-', '');
        perguntas.get(Number(i)).tipo = e.target.value;
    } 

    function handleOnChangeDescricao(e){
        const i = e.target.name.replace('descricao-', '');
        perguntas.get(Number(i)).descricao = e.target.value;
    } 

    function handleOnChangeTitulo(e){  
        const i = e.target.name.replace('titulo-', '');
        perguntas.get(Number(i)).titulo = e.target.value;
    } 

    const pergunta = (item) => {
        console.log('INITIAL', perguntas);
        return (
            <div>
                <RadioGroup
                    aria-labelledby="demo-radio-buttons-group-label"
                    defaultValue={isInsert ? perguntas.get(1).tipo : initialData.get(item[0])?.tipo}
                    name="radio-buttons-group"
                    id={`tipo-${item[0]}`}
                    {...register(`tipo-${item[0]}`)}
                    onChange={handleOnChangeTipo}
                >
                    <FormControlLabel value="likert"  control={<Radio />} label="Escala Likert" />
                    <FormControlLabel value="descritivo" control={<Radio />} label="Descritivo" />
                </RadioGroup>
                <TextField
                    margin="normal"
                    required
                    fullWidth
                    id={`titulo-${item[0]}`}
                    label="Título"
                    autoFocus
                    defaultValue={initialData.get(item[0])?.titulo}
                    onChange={handleOnChangeTitulo}
                    {...register(`titulo-${item[0]}`, { required: true, onChange: handleOnChangeTitulo })}
                />
                <TextField
                    margin="normal"
                    required
                    fullWidth
                    id={`descricao-${item[0]}`}
                    defaultValue={initialData.get(item[0])?.descricao}
                    label="Descrição"
                    {...register(`descricao-${item[0]}`, { required: true, onChange: handleOnChangeDescricao })}
                />
                <div style={{display: "flex", width: '100%', justifyContent: 'end'}}>
                    <Button disabled={item[0] === 1} variant="contained" sx={{ mt: 2, mb: 2}} onClick={() => {onRemove(item[0])}}>-</Button>
                    <Button variant="contained" sx={{ mt: 2, mb: 2, ml: 1}} onClick={() => {onAdd()}}>+</Button>
                </div>
            </div>
        );
    }
      
    const handleChange = (event) => {
        setTurma(event.target.value);
    };

    return (
        <React.Fragment>
        <GlobalStyles styles={{ ul: { margin: 0, padding: 0, listStyle: 'none' } }} />
        <CssBaseline />
        <MenuHeader/>
        <div className={styles.containerForm} >
            <Paper sx={{ width: '100%', float: 'right' }} elevation={0}>
                <Typography component="h1" variant="h4" sx={{ mt: 4, mb: 4 }}>
                    <Person /> Cadastro de Formulário
                </Typography>
                <hr/>
                <Box component="form" onSubmit={handleSubmit(handleCadastro)} sx={{ mt: 4 }}>
                <TextField
                    margin="normal"
                    required
                    fullWidth
                    select
                    id="turma"
                    label="Turma"
                    autoFocus
                    value={turma}
                    onChange={handleChange}
                >   
                    {turmasData.map((option) => (
                    <MenuItem key={option.id} value={option.id}>
                        {option.Disciplina.nome + " - " + String(option.semestre).substring(4) + "/" + String(option.semestre).substring(0,4)}
                    </MenuItem>
                ))}
                </TextField>
                {Array.from(perguntas).map((item) => (
                    <div key={item[0]}>
                        <Typography variant="h6" sx={{ mb: 2 }}>
                            <b>Pergunta 0{item[0]}</b>
                        </Typography>
                        {pergunta(item)}
                        <hr/><br/>
                    </div>     
                ))}
                <Button
                    type="submit"
                    fullWidth
                    variant="contained"
                    sx={{ mt: 3, mb: 2 }}
                >
                    Cadastrar
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