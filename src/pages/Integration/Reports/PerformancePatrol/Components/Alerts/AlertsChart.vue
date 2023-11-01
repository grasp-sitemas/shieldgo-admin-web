<template>
    <div>
        <canvas ref="alertsChart"></canvas>
    </div>
</template>

<script>
import { Chart } from 'chart.js'

export default {
    props: ['item'],

    data() {
        return {
            chart: null,
        }
    },

    mounted() {
        this.createChart()
    },

    methods: {
        createChart() {
            const ctx = this.$refs.alertsChart.getContext('2d')

            const data = {
                labels: ['Alertas de SOS', 'Alertas de Bateria Baixa'],
                datasets: [
                    {
                        data: [this.item.SOSAlerts, this.item.LowBatteryAlerts],
                        backgroundColor: [
                            'rgba(255, 99, 132, 0.9)', // Cor para "Alertas de SOS"
                            'rgba(255, 206, 86, 0.9)', // Cor para "Alertas de Bateria Baixa"
                        ],
                        borderColor: ['rgba(255, 99, 132, 1)', 'rgba(255, 206, 86, 1)'],
                        borderWidth: 1,
                    },
                ],
            }

            this.chart = new Chart(ctx, {
                type: 'pie',
                data: data,
                options: {
                    responsive: true,
                    maintainAspectRatio: false,
                    title: {
                        display: true,
                        text: `Total de Alertas: ${this.item.TotalAlerts}`,
                        fontColor: '#FFFFFF', // Cor do título
                    },
                    legend: {
                        labels: {
                            fontColor: '#FFFFFF', // Cor das labels da legenda
                        },
                    },
                    tooltips: {
                        titleFontColor: '#FFFFFF', // Cor do título dos tooltips
                        bodyFontColor: '#FFFFFF', // Cor do corpo dos tooltips
                        footerFontColor: '#FFFFFF', // Cor do rodapé dos tooltips
                    },
                },
            })
        },
    },
}
</script>

<style scoped>
canvas {
    width: 100% !important;
    height: auto !important;
}
</style>
