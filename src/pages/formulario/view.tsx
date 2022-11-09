/* eslint-disable jsx-a11y/alt-text */
import * as React from 'react';
import Typography from '@mui/material/Typography';
import CssBaseline from '@mui/material/CssBaseline';
import GlobalStyles from '@mui/material/GlobalStyles';
import Paper from '@mui/material/Paper';
import styles from "../../styles/styles.module.scss";
import ViewListIcon from '@mui/icons-material/ViewList';
import Alert from '@mui/material/Alert';
import { Chart } from "react-google-charts";
import { useParams } from "react-router-dom";
import { MenuHeader } from '../../componentes/menu';
import { PerguntaProps, RespostaProps } from "../../types/formulario"
import { api } from "../../services/api";

export function ViewFormulario() {
    const [formularios, setFormularios] = React.useState<PerguntaProps[]>([]); 
    const [respostas, setRespostas] = React.useState<RespostaProps[]>([]);
    const { id } = useParams();

    const fetchFormularios = async () => {
        const response = await api.get<PerguntaProps[]>(`formulario/${id}/pergunta`);
        if (response.status === 200) {
            setFormularios(response.data)
        }     
    };

    const fetchRespostas = async () => {
        const response = await api.get<RespostaProps[]>(`formulario/${id}/resposta`);
        if (response.status === 200) {
            setRespostas(response.data)
        }     
    };

    React.useEffect(() => {
        if (formularios.length === 0) {
            fetchFormularios();
        }
        if (respostas.length === 0) {
            fetchRespostas();
        }
    });

    const renderRowsFormulario = () => {
        if (respostas.length > 0) {
            return formularios.map((formulario) => renderRowFormulario(formulario));
        } else {
            return (
                <div>
                    <Alert severity="info">Este formulário ainda não possui nenhuma resposta registrada!</Alert>
                    {formularios.map((formulario) =>  renderPerguntas(formulario))}
                </div>
            );
        }
    }
    
    const renderRowFormulario = (formulario: PerguntaProps) => {
        return (
            <div>
                {formulario.tipo === 'descritivo' ? renderRespostas(formulario) : renderRespostasLikert(formulario)}
                <hr style={{borderColor: "#FDFDFD"}}/>
            </div>
        );
    }
    
    const renderPerguntas = (formulario: PerguntaProps) => {
        return(
            <div>
                <Typography sx={{ mt: 4, mb: 4 }}>
                        <b>Pergunta {formulario.id}: {formulario.titulo}</b>
                        <br/>
                        {formulario.descricao}
                </Typography>
                <hr style={{borderColor: "#FDFDFD"}}/>
            </div>
        )
    }

    const renderRespostas = (formulario: PerguntaProps) => {
        return(
            <div>
                <Typography sx={{ mt: 4, mb: 4 }}>
                        <b>{formulario.titulo}</b>
                        <br/>
                        {formulario.descricao}
                </Typography>
                <Typography sx={{ mt: 4, mb: 4 }}>
                    <b>Respostas:</b><br/>
                {respostas.map((resposta) => (
                    (resposta.idPergunta === formulario.id) && renderRowResposta(resposta)
                ))}
                </Typography>
            </div>
        )
    }

    const renderRowResposta = (resposta: RespostaProps) => {
        return (
            <div>
                - {resposta.resposta}<br/>
            </div>
        )
    }

    const renderRespostasLikert = (pergunta: PerguntaProps) => {
        let cont01 = 0;
        let cont02 = 0;
        let cont03 = 0;
        let cont04 = 0;
        let cont05 = 0;
        // eslint-disable-next-line array-callback-return
        respostas.map((resposta) => {
            if (resposta.idPergunta === pergunta.id) {
                switch(resposta.resposta) {
                    case '01': {
                        cont01++;
                        break;
                    }
                    case '02': {
                        cont02++
                        break;
                    }
                    case '03': {
                        cont03++
                        break;
                    }
                    case '04': {
                        cont04++
                        break;
                    }
                    case '05': {
                        cont05++
                        break;
                    }
                }
            }
        })

        const data = [
            ["", "Discordo Totalmente", "Discordo", "Neutro", "Concordo", "Concordo Totalmente"],
            [" ", cont01, cont02, cont03, cont04, cont05],
        ];

        return (
            <div>
                <Typography sx={{ mt: 4, mb: 4 }}>
                    <b>{pergunta.titulo}</b>
                    <br/>
                    {pergunta.descricao}
                </Typography>
                <Chart
                    chartType="Bar"
                    width="80%"
                    height="400px"
                    data={data}
                />
                <br/>
            </div>
        );
    }

    return (
        <React.Fragment>
        <GlobalStyles styles={{ ul: { margin: 0, padding: 0, listStyle: 'none' } }} />
        <CssBaseline />
        <MenuHeader/>
        <div className={styles.container} >
            <Paper sx={{ width: '100%' }} elevation={0}>
                <Typography component="h1" variant="h4" sx={{ mt: 4, mb: 4 }}>
                    <ViewListIcon /> Detalhes do Formulário
                </Typography>
                {formularios.length > 0 && (
                    <div>
                        <div>
                            <Typography sx={{ mt: 4, mb: 4 }}>
                                Disciplina: {formularios[0].Formulario.Turma.Disciplina.nome} - {String(formularios[0].Formulario.Turma.semestre).substring(4) + "/" + String(formularios[0].Formulario.Turma.semestre).substring(0,4)}
                                <br/>
                                Data de Criação: {formularios[0].Formulario.dataCriacao.substring(8, 10) + "/" + formularios[0].Formulario.dataCriacao.substring(5, 7) + "/" + formularios[0].Formulario.dataCriacao.substring(0, 4)}
                            </Typography>
                        </div>
                        <hr/>
                        <div>
                            {renderRowsFormulario()}
                        </div>
                    </div>
                )}
            </Paper>
        </div>
        </React.Fragment>
    );
}