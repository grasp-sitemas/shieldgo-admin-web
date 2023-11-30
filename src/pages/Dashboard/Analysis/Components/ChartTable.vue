<template>
    <div class="col-md-12">
        <div class="card border-0 text-truncate mb-3 bg-gray-800 text-white" style="min-height: 20.8rem">
            <div class="card-body">
                <div class="mb-3 text-gray-500">
                    <b class="mb-3">{{ title.toUpperCase() }}</b>
                </div>

                <div class="table-responsive mb-0">
                    <table class="table table-panel align-middle mb-0">
                        <thead>
                            <tr>
                                <th v-for="header in headers" :key="header">{{ header }}</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr v-for="item in items" :key="item.type">
                                <td nowrap>
                                    <label :class="`badge bg-${getColorForEventType(item.type)}`">{{ $t(item?.type) }}</label>
                                </td>
                                <td>{{ item?.count }}</td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
export default {
    name: 'ChartTable',
    props: {
        title: {
            type: String,
            required: true,
        },
        items: {
            type: Array,
            required: true,
        },
        total: {
            type: Number,
            required: true,
        },
        headers: {
            type: Array,
            required: true,
        },
    },
    methods: {
        getColorForEventType(eventType) {
            switch (eventType) {
                case 'SCAN':
                    return 'green'
                case 'SOS_ALERT':
                    return 'red'
                case 'INCIDENT':
                    return 'orange'
                case 'START_PATROL':
                    return 'blue'
                case 'END_PATROL':
                    return 'blue'
                case 'CANCEL_PATROL':
                    return 'indigo'
                default:
                    return 'gray'
            }
        },
    },
}
</script>
<style scoped>
.apexcharts-legend .apexcharts-align-right .apx-legend-position-top {
    right: 0px;
    position: absolute;
    left: 520px;
    top: 0px !important;
    max-height: 105px;
}
</style>
