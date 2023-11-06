<template>
    <div>
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
                    <tr class="form-body" v-for="(point, index) in sortedPatrolPoints" :key="point + index" :style="{ backgroundColor: point.Status === 'READ' ? '#d4edda' : '#f8d7da' }">
                        <td class="form-td-label">{{ point?.BeginTime ? moment(point.BeginTime).format('DD/MM/YYYY HH:mm') : 'N/A' }}</td>
                        <td class="form-td-label">{{ point?.SiteName }}</td>
                        <td class="form-td-label">{{ point?.PatrolTime ? moment(point?.PatrolTime).format('DD/MM/YYYY HH:mm:ss') : 'N/A' }}</td>
                        <td class="form-td-label">{{ point?.DeptName }}</td>
                        <td class="form-td-label">{{ $t(point?.Status) }}</td>
                    </tr>
                </tbody>
            </table>
        </div>
    </div>
</template>

<script>
import moment from 'moment'
export default {
    props: ['items'],
    data() {
        return {
            moment: moment,
        }
    },
    computed: {
        sortedPatrolPoints() {
            if (!this.items) return
            return [...this.items].sort((a, b) => {
                return new Date(a.BeginTime) - new Date(b.BeginTime) || a.SiteName.localeCompare(b.SiteName)
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
