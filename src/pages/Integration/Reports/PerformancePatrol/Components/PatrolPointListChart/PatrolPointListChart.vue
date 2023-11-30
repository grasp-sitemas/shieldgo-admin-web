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
        <div class="table-container">
            <table class="table">
                <thead class="thead-dark border-1">
                    <tr class="form-header">
                        <th class="form-label">{{ $t('str.patrol.point.performance.begin.time') }}</th>
                        <th class="form-label">{{ $t('str.patrol.point.performance.site.name') }}</th>
                        <th class="form-label">{{ $t('str.patrol.point.performance.patrol.time') }}</th>
                        <th class="form-label">{{ $t('str.patrol.point.performance.dept.name') }}</th>
                        <th class="form-label">{{ $t('str.patrol.point.performance.status') }}</th>
                    </tr>
                </thead>
                <tbody class="tbody">
                    <tr class="form-body" v-for="(item, index) in sortedPatrolPoints" :key="index" :style="{ backgroundColor: item?.Status == 'Não visitado' ? '#f8d7da' : '#d4edda' }">
                        <td class="form-td-label">{{ item?.BeginTime }}</td>
                        <td class="form-td-label">{{ item?.SiteName }}</td>
                        <td class="form-td-label">{{ item?.PatrolTime }}</td>
                        <td class="form-td-label">{{ item?.DeptName }}</td>
                        <td class="form-td-label">{{ item?.Status }}</td>
                    </tr>
                </tbody>
            </table>
        </div>
    </div>
</template>

<script>
import moment from 'moment'
import { JSON_FIELDS_CSV } from '../../Utils/jsonFieldsCsv'

export default {
    props: ['items'],
    watch: {
        items() {},
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
        }
    },
    components: {},
    async created() {
        const state = this
        state.$registerEvent.$on('changeLanguage', function () {
            state.jsonFields = JSON_FIELDS_CSV.events[state.$i18n.locale].json_fields
            state.jsonData = [JSON_FIELDS_CSV.events[state.$i18n.locale].json_data]
            state.jsonMeta = [JSON_FIELDS_CSV.events[state.$i18n.locale].json_meta]
            state.filename = JSON_FIELDS_CSV.events[state.$i18n.locale].filename
            state.jsonTitle = JSON_FIELDS_CSV.events[state.$i18n.locale].title
        })
    },
    methods: {
        fetchData() {
            return this.sortedPatrolPoints
        },
    },
    computed: {
        sortedPatrolPoints() {
            if (!this.items) return

            return [...this.items].map(item => {
                return {
                    BeginTime: item.BeginTime ? moment(item?.BeginTime).utc(false).format('DD/MM/YYYY HH:mm:ss') : 'N/A',
                    SiteName: item.SiteName,
                    PatrolTime: item.PatrolTime ? moment(item?.PatrolTime).utc(false).format('DD/MM/YYYY HH:mm:ss') : 'N/A',
                    DeptName: item.DeptName,
                    Status: this.$t(item.Status),
                }
            })
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
