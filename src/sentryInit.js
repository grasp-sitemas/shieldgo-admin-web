import * as Sentry from '@sentry/vue'
import Vue from 'vue'

function initSentry() {
    Sentry.init({
        Vue,
        dsn: process.env.VUE_APP_SENTRY_DSN,
        integrations: [
            Sentry.browserTracingIntegration(),
            Sentry.replayIntegration({
                maskAllText: false,
                blockAllMedia: false,
            }),
        ],
        tracesSampleRate: 1.0,
        tracePropagationTargets: [process.env.VUE_APP_DOMAIN],
        replaysSessionSampleRate: 0.5,
        replaysOnErrorSampleRate: 1.0,
    })
}

export default initSentry
