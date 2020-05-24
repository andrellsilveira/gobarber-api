/**
 * Arquivo de definição de tipos para override de funções da biblioteca Express
 */
declare namespace Express {
    /**
     * Essa definição anexa os novos atributos ao Request já existente na bilbioteca Express
     */
    export interface Request {
        user: {
            id: string;
        };
    }
}
