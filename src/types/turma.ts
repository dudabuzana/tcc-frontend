export type TurmaProps = {
    id: string;
    idDisciplina: string;
    cpfCnpj: string;
    semestre: string;
    Disciplina: {
        nome: string;
    };
    Pessoa: {
        nome: string;
    }
};

export type AlunosTurmaProps = {
    id: string;
    cpfCnpj: string;
    Pessoa: {
        cpfCnpj: string;
        cpfCnpjInstituicao: string;
        nome: string;
        matricula: string;
    }
}