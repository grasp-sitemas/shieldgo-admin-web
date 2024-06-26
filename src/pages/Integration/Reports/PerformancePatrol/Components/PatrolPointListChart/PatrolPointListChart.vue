<template>
    <div>
        <div v-if="sortedPatrolPoints?.length > 0" class="col-md-12 d-flex justify-content-end">
            <download-excel class="btn btn-primary m-1" :fetch="fetchData" :data="sortedPatrolPoints" :fields="jsonFields" :meta="jsonMeta" :name="filename" :header="jsonTitle" type="csv">
                <label style="cursor: pointer" class="download-csv">CSV</label>
            </download-excel>
            <download-excel class="btn btn-primary m-1" :fetch="fetchData" :data="sortedPatrolPoints" :fields="jsonFields" :meta="jsonMeta" :name="filename" :header="jsonTitle" type="xls">
                <label style="cursor: pointer" class="download-csv">XLS</label>
            </download-excel>
        </div>
        <h6 class="label">{{ $t('str.patrol.point.performance.list') }}</h6>

        <vue-good-table
            :columns="columns"
            :rows="sortedPatrolPoints"
            :totalRows="sortedPatrolPoints?.length"
            :search-options="{ enabled: false, placeholder: $t('str.table.search.in.this.table') }"
            :pagination-options="paginationOptions"
        >
            <div slot="emptystate" class="vgt-center-align vgt-text-disabled">
                <i v-if="isLoading" class="fas fa-spinner fa-spin" />
                <span v-if="!isLoading && sortedPatrolPoints?.length === 0">{{ $t('str.table.subtitle.no.data') }}</span>
            </div>
            <template slot="table-row" slot-scope="props">
                <span>
                    {{ props.formattedRow[props.column.field] }}
                </span>
            </template>
        </vue-good-table>
    </div>
</template>

<script>
import moment from 'moment'
import { JSON_FIELDS_CSV } from '../../Utils/jsonFieldsCsv'

export default {
    props: ['items', 'account', 'periodStart', 'periodEnd'],
    watch: {
        items() {
            this.initTable()
        },
    },
    data() {
        return {
            moment: moment,
            JSON_FIELDS_CSV: JSON_FIELDS_CSV,
            jsonFields: JSON_FIELDS_CSV.events.pt.json_fields,
            jsonData: [JSON_FIELDS_CSV.events.pt.json_data],
            jsonMeta: [JSON_FIELDS_CSV.events.pt.json_meta],
            filename: JSON_FIELDS_CSV.events.pt.filename,
            jsonTitle: JSON_FIELDS_CSV.events.pt.title,
            csvItems: [],
            columns: [],
            isLoading: false,
            paginationOptions: {
                enabled: true,
                mode: 'records',
                perPage: 15,
                position: 'bottom',
                perPageDropdown: [15, 50, 100, 200, 500, 1000, 5000, 10000],
                dropdownAllowAll: false,
                setCurrentPage: 1,
                jumpFirstOrLast: true,
                firstLabel: this.$t('str.table.pagination.first.page'),
                lastLabel: this.$t('str.table.pagination.last.page'),
                nextLabel: this.$t('str.table.pagination.next.page'),
                prevLabel: this.$t('str.table.pagination.prev.page'),
                rowsPerPageLabel: this.$t('str.table.pagination.rows.per.page.lavel'),
                ofLabel: this.$t('str.table.pagination.of.label.page'),
                pageLabel: this.$t('str.table.pagination.page'),
                allLabel: this.$t('str.table.pagination.all.label'),
            },
        }
    },
    async created() {
        this.$root.$on('changeLanguage', this.changeLanguage)
        this.initTable()
    },
    beforeDestroy() {
        this.$root.$off('changeLanguage', this.changeLanguage)
    },
    methods: {
        fetchData() {
            const account = this?.sortedPatrolPoints[0]?.DeptName ? this.sortedPatrolPoints[0].DeptName : ''
            this.jsonTitle = [
                this.jsonTitle,
                ' ',
                `${this.$t('str.company')}: ${account?.toUpperCase()}`,
                `${this.$t('str.period')}:  ${moment(this.periodStart).utc(false).format('DD/MM/YYYY')} - ${moment(this.periodEnd).utc(false).format('DD/MM/YYYY')}`,
                ' ',
            ]
            return this.sortedPatrolPoints
        },
        initTable() {
            this.columns = [
                {
                    label: this.$t('str.patrol.point.performance.begin.time'),
                    field: 'BeginTime',
                    width: '10%',
                    sortable: true,
                    thClass: 'text-nowrap',
                    tdClass: 'text-nowrap',
                },
                {
                    label: this.$t('str.patrol.point.performance.site.name'),
                    field: 'SiteName',
                    width: '10%',
                    sortable: true,
                    thClass: 'text-nowrap',
                    tdClass: 'text-nowrap',
                },
                {
                    label: this.$t('str.patrol.point.performance.patrol.time'),
                    field: 'PatrolTime',
                    width: '10%',
                    sortable: true,
                    thClass: 'text-nowrap',
                    tdClass: 'text-nowrap',
                },
                {
                    label: this.$t('str.patrol.point.performance.dept.name'),
                    field: 'DeptName',
                    width: '10%',
                    sortable: true,
                    thClass: 'text-nowrap',
                    tdClass: 'text-nowrap',
                },
                {
                    label: this.$t('str.patrol.point.performance.status'),
                    field: 'Status',
                    width: '10%',
                    sortable: true,
                    thClass: 'text-nowrap',
                    tdClass: 'text-nowrap',
                },
            ]
        },
        changeLanguage() {
            this.jsonFields = JSON_FIELDS_CSV.events[this.$i18n.locale].json_fields
            this.jsonData = [JSON_FIELDS_CSV.events[this.$i18n.locale].json_data]
            this.jsonMeta = [JSON_FIELDS_CSV.events[this.$i18n.locale].json_meta]
            this.filename = JSON_FIELDS_CSV.events[this.$i18n.locale].filename
            this.jsonTitle = JSON_FIELDS_CSV.events[this.$i18n.locale].title
        },
    },
    computed: {
        sortedPatrolPoints() {
            if (!this.items) return []
            return this.items.map(item => ({
                BeginTime: item.BeginTime ? moment(item.BeginTime).utc(false).format('DD/MM/YYYY HH:mm:ss') : 'N/A',
                SiteName: item.SiteName,
                PatrolTime: item.PatrolTime ? moment(item.PatrolTime).utc(false).format('DD/MM/YYYY HH:mm:ss') : 'N/A',
                DeptName: item.DeptName,
                Status: this.$t(item.Status),
            }))
        },
    },
}
</script>

<style>
.table-container {
    max-height: 400px;
    overflow-y: auto;
}

table {
    width: 100%;
    border-collapse: collapse;
}

.status-read {
    background-color: #d4edda;
}

.status-unread {
    background-color: #f8d7da;
}

.form-td-label {
    color: #000 !important;
}
</style>
