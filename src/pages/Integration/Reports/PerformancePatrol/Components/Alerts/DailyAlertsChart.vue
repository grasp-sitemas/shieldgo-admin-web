<template>
    <div>
        <canvas ref="dailyAlertsChart"></canvas>
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
        getChartInstance() {
            return this.chart
        },
        processData() {
            const days = this.item.map(alertData => alertData.Day).sort()

            const sosAlertsData = days.map(day => {
                const dayData = this.item.find(alertData => alertData.Day === day)
                return dayData ? dayData.SOSAlerts : 0
            })

            const lowBatteryAlertsData = days.map(day => {
                const dayData = this.item.find(alertData => alertData.Day === day)
                return dayData ? dayData.LowBatteryAlerts : 0
            })

            return {
                days,
                datasets: [
                    {
                        label: 'Alertas de SOS',
                        data: sosAlertsData,
                        fill: false,
                        borderColor: 'rgba(255, 99, 132, 1)',
                        borderWidth: 2,
                    },
                    {
                        label: 'Alertas de Bateria Baixa',
                        data: lowBatteryAlertsData,
                        fill: false,
                        borderColor: 'rgba(255, 206, 86, 1)',
                        borderWidth: 2,
                    },
                ],
            }
        },

        createChart() {
            if (!this.item) return

            const ctx = this.$refs.dailyAlertsChart.getContext('2d')
            const { days, datasets } = this.processData()

            this.chart = new Chart(ctx, {
                type: 'line',
                data: {
                    labels: days,
                    datasets: datasets,
                },
                options: {
                    responsive: true,
                    maintainAspectRatio: false,
                    scales: {
                        xAxes: [
                            {
                                type: 'category',
                                scaleLabel: {
                                    display: true,
                                    labelString: 'Data',
                                    fontColor: '#FFFFFF', // Cor do texto da label do eixo X
                                },
                                ticks: {
                                    fontColor: '#FFFFFF', // Cor dos ticks (marcas) do eixo X
                                },
                                gridLines: {
                                    fontColor: '#DDD9CE',
                                },
                            },
                        ],
                        yAxes: [
                            {
                                type: 'linear',
                                beginAtZero: true,
                                scaleLabel: {
                                    display: true,
                                    labelString: 'Total de Alertas',
                                    fontColor: '#FFFFFF', // Cor do texto da label do eixo Y
                                },
                                ticks: {
                                    fontColor: '#FFFFFF', // Cor das labels dos ticks (marcas) do eixo Y
                                    beginAtZero: true,
                                },
                                gridLines: {
                                    color: '#DDD9CE', // Cor das linhas do grid
                                },
                            },
                        ],
                    },
                    title: {
                        display: true,
                        text: 'Alertas Diários',
                        fontColor: '#FFFFFF', // Cor das labels da legenda
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
