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
        getChartInstance() {
            return this.chart
        },
        createChart() {
            if (!this.item) return

            const ctx = this.$refs.alertsChart.getContext('2d')

            const data = {
                labels: [this.$t('str.chart.sos.alert'), this.$t('str.chart.low.battery.alert'), this.$t('str.chart.crash.alert')],
                datasets: [
                    {
                        data: [this.item.sosAlerts, this.item.lowBatteryAlerts, this.item.crashAlerts],
                        backgroundColor: ['rgba(75, 192, 192, 0.9)', 'rgba(255, 99, 132, 0.9)', 'rgba(255, 206, 86, 0.9)'],
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
                        text: `${this.$t('str.total.alerts')}: ${this.item.totalAlerts}`,
                        fontColor: '#FFFFFF',
                    },
                    legend: {
                        labels: {
                            fontColor: '#FFFFFF',
                        },
                    },
                    tooltips: {
                        titleFontColor: '#FFFFFF',
                        bodyFontColor: '#FFFFFF',
                        footerFontColor: '#FFFFFF',
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
