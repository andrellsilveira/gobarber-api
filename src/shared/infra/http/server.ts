import 'reflect-metadata';

import express from 'express';
import cors from 'cors';
/** A importação desse complemento deve ser realizada logo após a importação do Express */
import 'express-async-errors';

import '@shared/infra/typeorm';
import uploadConfig from '@config/upload';
import handlerErrors from '@shared/infra/http/middlewares/handlerErrors';
import routes from '@shared/infra/http/routes';

const porta = 3333;

const app = express();

app.use(cors());
app.use(express.json());
/** Define uma rota para visulização dos arquivos de forma estática */
app.use('/files', express.static(uploadConfig.directory));
app.use(routes);

/** O middleware para tratamento dos erros deve ser executado após o middleware das rotas */
app.use(handlerErrors);

app.listen(porta, () => {
    console.log(`✅ Servidor iniciado na porta ${porta}`);
});
