<template>
    <div class="col-md-12">
        <div class="card border-0 mb-3 bg-gray-800 text-white">
            <div class="card-body">
                <div class="mb-3 text-gray-500">
                    <b>{{ $t('str.msg.analysis.finished.patrol').toUpperCase() }}</b>
                </div>
                <div class="row">
                    <div class="col-xl-3 col-4" v-for="(item, index) in chart?.series" :key="index">
                        <div class="cursor-pointer" @click="handleClick(item)">
                            <h3 class="mb-1">
                                <span data-animation="number">{{ item.total }}</span>
                            </h3>
                            <div>{{ $t(item.name) }}</div>
                        </div>
                    </div>
                </div>
            </div>
            <div class="card-body pe-3 ps-0 py-0">
                <apexchart :key="componentKey" id="chart" ref="chart" type="bar" width="100%" height="210" :options="chart.options" :series="chart.series"></apexchart>
            </div>
        </div>
    </div>
</template>

<script>
var pt = require('apexcharts/dist/locales/pt-br.json')
var en = require('apexcharts/dist/locales/en.json')

export default {
    name: 'PerformanceEventSubstatus',
    props: ['data', 'redirect', 'locale'],
    watch: {
        data(newData) {
            this.updatedData = newData

            if (newData?.substatus && newData.substatus.length > 0) {
                newData.substatus.sort((a, b) => a.name.localeCompare(b.name))
                this.chart.total = newData.total
                this.chart.series = newData.substatus.map(item => {
                    const data = item.data.map(([date, value]) => ({
                        x: date.split('-').reverse().join('-'),
                        y: value,
                    }))
                    return {
                        total: item.total,
                        name: item.name ? this.$t(item.name) : '',
                        data: data || [],
                    }
                })

                this.$refs.chart.updateSeries(this.chart.series)
            }
        },
        locale() {
            this.chart.options.legend.labels.formatter = seriesName => {
                return this.$t(seriesName)
            }

            if (this.updatedData?.substatus && this.updatedData.substatus.length > 0) {
                this.chart.series = this.updatedData.substatus.map(item => {
                    const data = item.data.map(([date, value]) => ({
                        x: date.split('-').reverse().join('-'),
                        y: value,
                    }))
                    return {
                        total: item.total,
                        name: item.name ? this.$t(item.name) : '',
                        data: data || [],
                    }
                })

                // Força a atualização do gráfico
                this.$refs.chart.updateSeries(this.chart.series)
                this.componentKey += 1
            }
        },
    },
    data() {
        return {
            componentKey: 0,
            updatedData: {},
            chart: {
                total: 0,
                series: [],
                options: {
                    colors: ['#32a932', '#e39900'],
                    fill: {
                        type: 'solid',
                    },
                    legend: {
                        position: 'top',
                        horizontalAlign: 'right',
                        offsetY: 15,
                        offsetX: 500,
                        labels: {
                            colors: '#fff',
                        },
                    },
                    xaxis: {
                        type: 'datetime',
                        tickAmount: 6,
                        labels: {
                            style: {
                                colors: '#fff',
                            },
                        },
                    },
                    yaxis: {
                        labels: {
                            style: {
                                colors: '#fff',
                            },
                        },
                    },
                    tooltip: {
                        y: {
                            formatter: function (val) {
                                return val
                            },
                        },
                    },
                    chart: { height: '100%', type: 'area', toolbar: { show: false }, stacked: true, locales: [pt, en], defaultLocale: this.locale || 'pt-br' },
                    plotOptions: { bar: { horizontal: false, columnWidth: '55%', endingShape: 'rounded' } },
                    dataLabels: { enabled: false },
                    grid: {
                        show: true,
                        borderColor: 'rgba(' + '31,8,45' + ', .15)',
                        xaxis: {
                            lines: {
                                show: true,
                            },
                        },
                        yaxis: {
                            lines: {
                                show: true,
                            },
                        },
                        padding: {
                            top: -40,
                            right: 3,
                            bottom: 0,
                            left: 10,
                        },
                    },
                    stroke: {
                        show: false,
                        curve: 'straight',
                    },
                },
            },
        }
    },
    methods: {
        handleClick(item) {
            const params = this.redirect.params

            if (params) {
                if (!params?.account) delete params.account
                if (!params?.client) delete params.client
                if (!params?.site) delete params.site

                switch (item.name) {
                    case 'EVENT_STATUS_COMPLETE':
                        params.report = 'PATROL_POINTS_COMPLETED'
                        this.$router.push({ path: '/reports/patrols/' + JSON.stringify(params) })
                        break
                    case 'EVENT_STATUS_INCOMPLETE':
                        params.report = 'PATROL_POINTS_INCOMPLETED'
                        this.$router.push({ path: '/reports/patrols/' + JSON.stringify(params) })
                        break
                }
            }
        },
    },
}
</script>

<style lang="scss" scoped>
.apexcharts-legend-text tspan:nth-child(1) {
    font-weight: lighter;
    fill: #999;
}

.apexcharts-legend-text tspan:nth-child(3) {
    font-weight: bold;
}
</style>
