export type FormularioProps = {
    id: string;
    idTurma: string;
    status: string;
    dataCriacao: string;
    Turma: {
        id: string;
        semestre: string;
        Disciplina: {
            id: string;
            cpfCnpj: string;
            nome: string;
            curso: string;
        }
    }
};

export type PerguntaProps = {
    id: string;
    idFormulario: string;
    titulo: string;
    descricao: string;
    tipo: string;
    Formulario: FormularioProps;
};

export type RespostaProps = {
    idPergunta: string;
    idFormulario: string;
    cpfCnpj: string;
    resposta: string;
    PerguntaFormulario: PerguntaProps;
};