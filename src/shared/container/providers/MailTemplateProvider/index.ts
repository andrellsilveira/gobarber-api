import { container } from 'tsyringe';

import IMailTemplateProvider from '@shared/container/providers/MailTemplateProvider/models/IMailTemplateProvider';
import HandlebarsMailTemplateProvider from '@shared/container/providers/MailTemplateProvider/implementations/HandlebarsMailTemplateProviders';

const providers = {
    handleBars: HandlebarsMailTemplateProvider,
};

container.registerSingleton<IMailTemplateProvider>(
    'MailTemplateProvider',
    providers.handleBars,
);
