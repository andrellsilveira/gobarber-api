import path from 'path';
import crypto from 'crypto';
import multer, { StorageEngine } from 'multer';

interface IUploadConfig {
    driver: 'disk' | 's3';
    tmpFolder: string;
    uploadsFolder: string;

    multer: {
        storage: StorageEngine;
    };

    config: {
        disk: {};
        aws: {
            bucket: string;
        };
    };
}

/**
 * Define variável com o caminho do diretório temporário
 */
const tmpFolder = path.resolve(__dirname, '..', '..', 'tmp');

/**
 * Configurações para upload de arquivos
 */
export default {
    /** Define o driver de upload/armazenamento de arquivos */
    driver: process.env.STORAGE_DRIVER,

    /**
     * Define atributo para recuperação do diretório nos módulos do sistema
     */
    tmpFolder,
    uploadsFolder: path.resolve(tmpFolder, 'uploads'),

    /**
     * Define as configurações específicas para o multer
     */
    multer: {
        storage: multer.diskStorage({
            /**
             * Define o diretório de destino dos arquivos como "tmp"
             * Os textos "..", signoficam a quantidade de retornos até o diretório "tmp"
             */
            destination: tmpFolder,
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
    },

    /**
     * Define as configurações para o armazenamento local
     */
    config: {
        disk: {},
        aws: {
            bucket: 'app-gobarber',
        },
    },
} as IUploadConfig;
