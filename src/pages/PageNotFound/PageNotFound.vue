<template>
    <div class="error">
        <div class="error-code">{{ $t('str.error.code.404') }}</div>
        <div class="error-content">
            <div class="error-message">{{ $t('str.error.code.404.title') }}</div>
            <div class="error-desc mb-4">
                {{ $t('str.error.code.404.description') }}
            </div>
            <div>
                <router-link to="/dashboard/analysis" class="btn btn-primary px-3" custom v-slot="{ navigate }">
                    <span @click="navigate" @keypress.enter="navigate">{{ $t('str.error.btn.go.home') }}</span>
                </router-link>
            </div>
        </div>
    </div>
</template>
<script>
import AppOptions from '../../config/AppOptions.vue'

export default {
    name: 'PageNotFound',
    created() {
        AppOptions.appEmpty = true
    },
    beforeRouteLeave(to, from, next) {
        AppOptions.appEmpty = false
        next()
    },
}
</script>
