import 'reflect-metadata';

import express from 'express';
import routes from './routes';
import uploadConfig from './config/upload';
import './database';

const porta = 3333;
const app = express();

app.use(express.json());
/** Define uma rota para visulização dos arquivos de forma estática */
app.use('/files', express.static(uploadConfig.directory));
app.use(routes);

app.listen(porta, () => {
    console.log(`✅ Servidor iniciado na porta ${porta}`);
});
