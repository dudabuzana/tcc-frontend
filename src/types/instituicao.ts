export type InstituicaoProps = {
    cpfCnpj: string;
    token: string;
    senha: string;
    nivel: string;
    instituicao: {
        cpfCnpj: string;
        nome: string;
        endereco: string;
        contato: string;
    }
};