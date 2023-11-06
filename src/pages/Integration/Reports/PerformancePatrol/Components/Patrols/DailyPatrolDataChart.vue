<template>
    <div>
        <canvas ref="dailyPatrolDataChart"></canvas>
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
    data() {
        return {
            chart: null,
        }
    },
    methods: {
        getChartInstance() {
            return this.chart
        },
        processData() {
            const dates = [...new Set(this.item.substatus.flatMap(s => s.data.map(d => d[0])))].sort()

            const datasets = this.item.substatus.map(substatus => {
                const dataForDates = dates.map(date => {
                    const found = substatus.data.find(d => d[0] === date)
                    return found ? found[1] : 0
                })
                return {
                    label: this.$t(substatus.name),
                    data: dataForDates,
                    fill: false,
                    borderColor: this.getStatusColor(substatus.name),
                    borderWidth: 2,
                }
            })

            return { dates, datasets }
        },
        getStatusColor(statusName) {
            switch (statusName) {
                case 'COMPLETE':
                    return 'rgba(75, 192, 192, 1)'
                case 'INCOMPLETE':
                    return 'rgba(255, 206, 86, 1)'
                case 'NOT_STARTED':
                    return 'rgba(255, 99, 132, 1)'
                default:
                    return this.randomColor() // para qualquer outro status
            }
        },
        randomColor() {
            const r = Math.floor(Math.random() * 256)
            const g = Math.floor(Math.random() * 256)
            const b = Math.floor(Math.random() * 256)
            return `rgb(${r}, ${g}, ${b})`
        },
        createChart() {
            if (!this.item) return

            const ctx = this.$refs.dailyPatrolDataChart.getContext('2d')
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
                        text: 'Rondas Diárias',
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
