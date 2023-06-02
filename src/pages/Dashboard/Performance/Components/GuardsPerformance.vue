<template>
    <div class="card border-0 bg-gray-800 text-white">
        <div class="card-body">
            <div class="mb-1 text-gray-500">
                <b>{{ title?.toUpperCase() }}</b>
            </div>
            <div class="chart-container">
                <apexchart type="bar" :options="chartOptions" :series="series"></apexchart>
            </div>
        </div>
    </div>
</template>

<script>
import VueApexCharts from 'vue-apexcharts'
export default {
    components: {
        apexchart: VueApexCharts,
    },
    props: {
        data: {
            type: Array,
            required: true,
        },
        title: {
            type: String,
            required: true,
        },
        locale: {
            type: String,
        },
    },
    computed: {
        preparedData() {
            return this.data.map(item => ({
                name: item.name,
                total: item.total,
                read: item.read,
                readPercent: item.readPercent,
                unreadPercent: item.unreadPercent,
            }))
        },
        chartOptions() {
            const totalString = this.$t('str.total')
            const ofString = this.$t('str.of')
            return {
                chart: {
                    type: 'bar',
                    stacked: true,
                    stackType: '100%',
                    height: 30 * this.preparedData.length,
                },
                plotOptions: {
                    bar: {
                        horizontal: true,
                        barHeight: '70%',
                    },
                },
                stroke: {
                    width: 0,
                    colors: ['#fff'],
                },
                yaxis: {
                    labels: {
                        style: {
                            colors: '#fff',
                        },
                    },
                },
                xaxis: {
                    categories: this.preparedData.map(item => item.name),
                    labels: {
                        trim: true,
                        hideOverlappingLabels: true,
                        style: {
                            colors: '#fff',
                        },
                    },
                },
                tooltip: {
                    y: {
                        formatter: function (val, { seriesIndex, dataPointIndex, w }) {
                            const data = w.config.series[seriesIndex].data[dataPointIndex]
                            return `${val}% (${totalString}: ${data.totalReadOrUnread} ${ofString} ${data.total})`
                        },
                    },
                },
                fill: {
                    opacity: 1,
                    colors: ['#32a931', '#db0006'],
                },
                legend: {
                    show: false,
                },
            }
        },
        series() {
            return [
                {
                    name: this.$t('str.chart.patrol.points.performance.read'),
                    data: this.preparedData.map(item => ({
                        x: item.name,
                        y: item.readPercent ? item.readPercent.toFixed(2) : 0,
                        total: item.total,
                        totalReadOrUnread: item.read,
                    })),
                },
                {
                    name: this.$t('str.chart.patrol.points.performance.unread'),
                    data: this.preparedData.map(item => ({
                        x: item.name,
                        y: item.unreadPercent ? item.unreadPercent.toFixed(2) : 0,
                        total: item.total,
                        totalReadOrUnread: item.total - item.read,
                    })),
                },
            ]
        },
    },
}
</script>

<style scoped>
.apexcharts-yaxis-label {
    fill: #fff !important;
}

text {
    fill: #fff !important;
}

.chart-container {
    max-height: 450px; /* Ajuste essa altura de acordo com suas necessidades */
    overflow-y: auto;
}
</style>
