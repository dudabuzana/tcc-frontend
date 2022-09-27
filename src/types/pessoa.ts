export type PessoaProps = {
    cpfCnpj: string;
    token: string;
    senha: string;
    nivel: string;
    pessoa: {
        cpfCnpj: string;
        nome: string;
        matricula: string;
        cpfCnpjInstituicao: string;
    }
};