/**
 * Arquivo de configurações de segurança
 */
export default {
    jwt: {
        secret: process.env.APP_SECRET,
        expiresIn: '2h',
    },
};
