import fs from 'fs';
import path from 'path';
import mime from 'mime';
import aws, { S3 } from 'aws-sdk';
import uploadConfig from '@config/upload';
import IStorageProvider from '@shared/container/providers/StorageProvider/models/IStorageProvider';

class S3StorageProvider implements IStorageProvider {
    private client: S3;

    constructor() {
        this.client = new aws.S3({
            region: process.env.AWS_DEFAULT_REGION,
        });
    }

    public async saveFile(file: string): Promise<string> {
        const originalPath = path.resolve(uploadConfig.tmpFolder, file);

        const contentType = mime.getType(originalPath);

        if (!contentType) {
            throw new Error('Arquivo não encontrado');
        }

        const fileContent = await fs.promises.readFile(originalPath);

        await this.client
            .putObject({
                /** Nome da pasta no AWS S3 */
                Bucket: uploadConfig.config.aws.bucket,
                /** Nome do arquivo */
                Key: file,
                /** Tipo de permissões */
                ACL: 'public-read',
                /** Conteúdo do arquivo */
                Body: fileContent,
                /** Define o tipo do arquivo */
                ContentType: contentType,
            })
            .promise();

        await fs.promises.unlink(originalPath);

        return file;
    }

    public async deleteFile(file: string): Promise<void> {
        await this.client
            .deleteObject({
                /** Nome da pasta no AWS S3 */
                Bucket: uploadConfig.config.aws.bucket,
                /** Nome do arquivo */
                Key: file,
            })
            .promise();
    }
}

export default S3StorageProvider;
