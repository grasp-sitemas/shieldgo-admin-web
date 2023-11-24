<template>
    <div>
        <canvas ref="patrolDataChart"></canvas>
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

        createChart() {
            if (!this.item) return

            const ctx = this.$refs.patrolDataChart.getContext('2d')

            const data = {
                labels: [this.$t('str.chart.completed'), this.$t('str.chart.notDone'), this.$t('str.chart.incomplete')],
                datasets: [
                    {
                        data: [this.item.completedPatrols, this.item.notDonePatrols, this.item.incompletePatrols],
                        backgroundColor: [
                            'rgba(75, 192, 192,0.9)', // Cor para "Concluidas"
                            'rgba(255, 99, 132, 0.9)', // Cor para "Não Concluidas"
                            'rgba(255, 206, 86, 0.9)', // Cor para "Incompletas"
                        ],
                        borderColor: ['rgba(75, 192, 192, 1)', 'rgba(255, 99, 132, 1)', 'rgba(255, 206, 86, 1)'],
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
                        text: `${this.$t('str.dashboard.patrol.total')}: ${this.item.totalPatrols}`,
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
