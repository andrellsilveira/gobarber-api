import nodemailer, { Transporter } from 'nodemailer';
import aws from 'aws-sdk';
import { injectable, inject } from 'tsyringe';
import mailConfig from '@config/mail';

import IMailProvider from '@shared/container/providers/MailProvider/models/IMailProvider';
import IMailTemplateProvider from '@shared/container/providers/MailTemplateProvider/models/IMailTemplateProvider';
import ISendMailDTO from '@shared/container/providers/MailProvider/dtos/ISendMailDTO';

@injectable()
class SESMailProvider implements IMailProvider {
    private client: Transporter;

    private mailTemplateProvider: IMailTemplateProvider;

    constructor(
        @inject('MailTemplateProvider') provider: IMailTemplateProvider,
    ) {
        this.mailTemplateProvider = provider;

        this.client = nodemailer.createTransport({
            SES: new aws.SES({
                apiVersion: '2010-12-01',
                region: process.env.AWS_DEFAULT_REGION,
            }),
        });
    }

    public async sendMail({
        to,
        from,
        subject,
        templateData,
    }: ISendMailDTO): Promise<void> {
        const { name, email } = mailConfig.defaults.from;

        await this.client.sendMail({
            from: {
                name: from?.name || name,
                address: from?.email || email,
            },
            to: {
                name: to.name,
                address: to.email,
            },
            subject,
            html: await this.mailTemplateProvider.parse(templateData),
        });
    }
}

export default SESMailProvider;
