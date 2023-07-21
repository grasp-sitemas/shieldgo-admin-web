<template>
    <download-excel class="btn btn-primary" :fetch="fetchData" :data="data" :fields="fields" :meta="meta" :name="name" :header="title" type="csv" :escapeCsv="true">
        <label style="cursor: pointer" class="download-csv">CSV</label>
    </download-excel>
</template>

<script>
import moment from 'moment'
export default {
    props: {
        jsonData: {
            type: Array,
            default: () => [],
        },
        jsonFields: {
            type: Object,
            default: () => {},
        },
        jsonMeta: {
            type: Array,
            default: () => [],
        },
        jsonTitle: {
            type: String,
            default: '',
        },
        jsonInfo: {
            type: Object,
            default: () => {},
        },
        filename: {
            type: String,
            default: '',
        },
        supervisor: {
            type: String,
            default: '',
        },
        totalVisits: {
            type: Number,
            default: 0,
        },
        periodStart: {
            type: String,
            default: '',
        },
        periodEnd: {
            type: String,
            default: '',
        },
    },
    watch: {
        jsonData() {
            this.data = this.jsonData
            this.title = this.jsonTitle
            this.fields = this.jsonFields
            this.meta = this.jsonMeta
            this.name = this.filename + '.csv'
        },
    },
    data() {
        return {
            data: [],
            title: '',
            fields: {},
            meta: [],
            name: '',
        }
    },
    methods: {
        fetchData() {
            const generateDate = this.$t('str.generated.on') + ': ' + moment().utc(true).format('DD/MM/YYYY HH:mm:ss')
            const account = this.jsonInfo.account
            let address = this.jsonInfo.accountAddress

            address = address?.address + ' ' + address?.number + ' - ' + address?.neighborhood + ' - ' + address?.cep + ' - ' + address?.city + ' - ' + address?.state

            this.title = [
                this.title,
                ' ',
                generateDate,
                account?.toUpperCase(),
                address,
                ' ',
                `${this.$t('str.supervisor')}: ${this.supervisor}`,
                `${this.$t('str.total.visits')}: ${this.totalVisits}/${this.data?.length}`,
                `${this.$t('str.period')}:  ${this.periodStart} - ${this.periodEnd}`,
                ' ',
            ]

            const newData = this.data.map(item => {
                return {
                    ...item,
                    read: item.read === true ? this.$t('str.visited') : this.$t('str.not.visited'),
                }
            })

            return newData
        },
    },
}
</script>
