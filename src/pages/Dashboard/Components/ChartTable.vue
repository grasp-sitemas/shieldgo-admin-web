<template>
    <div class="col-xl-4">
        <!-- <panel :title="`${title} - ${total ? total : 0}`"> -->
        <!-- painel sem icone de maximizar -->
        <panel :title="`${title}`" :maximize="false">
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
        </panel>
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
                default:
                    return 'gray'
            }
        },
    },
}
</script>
