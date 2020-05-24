import path from 'path';
import crypto from 'crypto';
import multer from 'multer';

/**
 * Define variável com o caminho do diretório temporário
 */
const tmpDir = path.resolve(__dirname, '..', '..', 'tmp');

/**
 * Configurações para upload de arquivos
 */
export default {
    /**
     * Define atributo para recuperação do diretório nos módulos do sistema
     */
    directory: tmpDir,
    /**
     * Define armazenamento local
     */
    storage: multer.diskStorage({
        /**
         * Define o diretório de destino dos arquivos como "tmp"
         * Os textos "..", signoficam a quantidade de retornos até o diretório "tmp"
         */
        destination: tmpDir,
        /**
         * Definição do nome do arquivo
         * - request: Requisição da rota
         * - file: Arquivo enviado para a aplicação
         * - callback: Retorno da função
         */
        filename(request, file, callback) {
            /**
             * Gera um hash para utilização no nome do arquivo
             */
            const fileHash = crypto.randomBytes(10).toString('HEX');
            const fileName = `${fileHash}-${file.originalname}`;

            /**
             * Retorna o callback onde o primeiro parâmetro é um erro e o segundo o nome do
             * arquivo
             */
            return callback(null, fileName);
        },
    }),
};
