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
                <a v-if="subtitle && subtitle?.length > 0" href="javascript:void(0)">{{ subtitle }} <i class="fa fa-arrow-alt-circle-right"></i></a>
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
        background: {
            type: String,
            default: '#007bff', // Um valor default caso não seja informada uma cor
        },
        icon: {
            type: String,
            default: 'fa fa-desktop', // Um valor default caso não seja informado um ícone
        },
    },
}
</script>

<style scoped>
/* Coloque aqui qualquer estilo específico para o componente Card */
</style>
