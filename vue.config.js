module.exports = {
    devServer: {
        host: '0.0.0.0',
        https: false,
        port: 8080,
        public: 'http://0.0.0.0:8080',
    },
    pluginOptions: {
        i18n: {
            locale: 'pt',
            fallbackLocale: 'en',
            localeDir: 'locales',
            enableInSFC: false,
            enableBridge: true,
        },
    },
}
