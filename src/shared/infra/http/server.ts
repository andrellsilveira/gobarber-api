import 'reflect-metadata';
import 'dotenv/config';

import express from 'express';
/** A importação desse complemento deve ser realizada logo após a importação do Express */
import 'express-async-errors';
import cors from 'cors';
import { errors } from 'celebrate';

import '@shared/infra/typeorm';
import '@shared/container';
import uploadConfig from '@config/upload';
import handlerErrors from '@shared/infra/http/middlewares/handlerErrors';
import routes from '@shared/infra/http/routes';

const porta = 3333;

const app = express();

app.use(cors());
app.use(express.json());
/** Define uma rota para visualização dos arquivos de forma estática */
app.use('/files', express.static(uploadConfig.uploadsFolder));
app.use(routes);

app.use(errors());

/** O middleware para tratamento dos erros deve ser executado após o middleware das rotas */
app.use(handlerErrors);

app.listen(porta, () => {
    console.log(`✅ Servidor iniciado na porta ${porta}`);
});
