<template>
    <div>
        <canvas ref="dailyPatrolPointDataChart"></canvas>
    </div>
</template>

<script>
import { Chart } from 'chart.js'
import ChartDataLabels from 'chartjs-plugin-datalabels'

Chart.plugins.register(ChartDataLabels)

export default {
    props: ['item'],
    watch: {
        item(newValue, oldValue) {
            if (newValue !== oldValue) {
                this.chart.destroy()
                this.createChart()
            }
        },
    },
    mounted() {
        this.createChart()
    },
    methods: {
        processData() {
            const dates = this.item.map(day => day.Day)

            const readSitesData = this.item.map(day => day.ReadSites)
            const unreadSitesData = this.item.map(day => day.UnreadSites)

            const datasets = [
                {
                    label: 'Lidos',
                    data: readSitesData,
                    fill: false,
                    borderColor: 'rgba(75, 192, 192, 1)', // This can be any color of your choice
                    borderWidth: 2,
                },
                {
                    label: 'Não Lidos',
                    data: unreadSitesData,
                    fill: false,
                    borderColor: 'rgba(255, 99, 132, 1)', // This can be any color of your choice
                    borderWidth: 2,
                },
            ]

            return { dates, datasets }
        },
        createChart() {
            if (!this.item) return

            const ctx = this.$refs.dailyPatrolPointDataChart.getContext('2d')
            const { dates, datasets } = this.processData()

            this.chart = new Chart(ctx, {
                type: 'line',
                data: {
                    labels: dates,
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
                            },
                        ],
                        yAxes: [
                            {
                                type: 'linear',
                                beginAtZero: true,
                                scaleLabel: {
                                    display: true,
                                    labelString: 'Total',
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
                        text: 'Dados Diários de Pontos de Ronda',
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
