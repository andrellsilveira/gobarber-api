class AppError {
    public readonly message: string;

    public readonly statusCode: number;

    /**
     *
     * @param message Mensagem de erro
     * @param statusCode Código de erro HTTP (não é necessário especificar o tipo da variável
     * quando for definido um valor padrão)
     */
    constructor(message: string, statusCode = 400) {
        this.message = message;
        this.statusCode = statusCode;
    }
}

export default AppError;
