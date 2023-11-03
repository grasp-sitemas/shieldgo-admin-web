<template>
    <div>
        <canvas ref="patrolPointDataChart"></canvas>
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
            if (!this.item) return

            const ctx = this.$refs.patrolPointDataChart.getContext('2d')

            const data = {
                labels: ['Leituras', 'Não Leituras'],
                datasets: [
                    {
                        data: [this.item.ArrivedCount, this.item.NotArrivedCount],
                        backgroundColor: [
                            'rgba(75, 192, 192, 0.9)', // Cor para "Leituras"
                            'rgba(255, 99, 132, 0.9)', // Cor para "Não Leituras"
                        ],
                        borderColor: ['rgba(75, 192, 192, 1)', 'rgba(255, 99, 132, 1)'],
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
                        text: `Total de Pontos de Ronda: ${this.item.TotalSites}`,
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
