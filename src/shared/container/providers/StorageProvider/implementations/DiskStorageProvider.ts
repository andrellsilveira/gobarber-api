import fs from 'fs';
import path from 'path';
import uploadConfig from '@config/upload';
import IStorageProvider from '@shared/container/providers/StorageProvider/models/IStorageProvider';

class DiskStorageProvider implements IStorageProvider {
    public async saveFile(file: string): Promise<string> {
        /**
         * Move o arquivo do diretório temporário para o diretório de uploads
         */
        await fs.promises.rename(
            path.resolve(uploadConfig.tmpFolder, file),
            path.resolve(uploadConfig.uploadsFolder, file),
        );

        return file;
    }

    public async deleteFile(file: string): Promise<void> {
        /** Recupera o caminho completo do arquivo */
        const filePath = path.resolve(uploadConfig.uploadsFolder, file);

        try {
            /** Executa verificação da existência do arquivo a ser excluído */
            await fs.promises.stat(filePath);
        } catch {
            return;
        }

        await fs.promises.unlink(filePath);
    }
}

export default DiskStorageProvider;
