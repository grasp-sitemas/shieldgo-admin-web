<template>
    <div class="col-xl-3 col-md-6">
        <div class="widget widget-stats pt-3 pb-3" :style="{ backgroundColor: background }">
            <div class="stats-icon">
                <i :class="icon"></i>
            </div>
            <div class="stats-info">
                <h4>{{ title }}</h4>
                <p>{{ value }}</p>
            </div>
            <div class="stats-link">
                <a v-if="subtitle && subtitle?.length > 0" href="javascript:void(0)" @click="navigate">{{ subtitle }} <i class="fa fa-arrow-alt-circle-right"></i></a>
            </div>
        </div>
    </div>
</template>

<script>
export default {
    name: 'Card',
    props: {
        title: {
            type: String,
            required: true,
        },
        value: {
            type: [String, Number],
            required: true,
        },
        subtitle: {
            type: String,
            required: true,
        },
        redirect: {
            type: Object,
            default: () => ({}),
        },
        background: {
            type: String,
            default: '#007bff',
        },
        icon: {
            type: String,
            default: 'fa fa-desktop',
        },
    },
    methods: {
        navigate() {
            if (this.redirect.name) {
                const params = this.redirect.params
                if (!params?.account) delete params.account

                if (!params?.client) delete params.client

                if (!params?.site) delete params.site

                this.$router.push({ path: this.redirect.name + JSON.stringify(params) })
            }
        },
    },
}
</script>

<style scoped>
.widget {
    display: flex;
    flex-direction: column;
    height: 85% !important;
}

.stats-link {
    margin-top: auto;
}
</style>
