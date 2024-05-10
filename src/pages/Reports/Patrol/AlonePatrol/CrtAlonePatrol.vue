<script>
import Common from '../../../../common/Common.vue'

export default {
    init: async payload => {
        await payload.initTable()

        if (!payload.isSuperAdminMaster || payload.role === 'AUDITOR') {
            payload.columns.splice(5, 1)
        }

        payload.jsonFields = payload.JSON_FIELDS_CSV.incompletedPatrolPoints[payload.$i18n.locale].json_fields
        payload.jsonData = [payload.JSON_FIELDS_CSV.incompletedPatrolPoints[payload.$i18n.locale].json_data]
        payload.jsonMeta = [payload.JSON_FIELDS_CSV.incompletedPatrolPoints[payload.$i18n.locale].json_meta]
        payload.filename = payload.JSON_FIELDS_CSV.incompletedPatrolPoints[payload.$i18n.locale].filename
        payload.jsonTitle = payload.JSON_FIELDS_CSV.incompletedPatrolPoints[payload.$i18n.locale].title
        payload.pdfHeader = payload.PDF_HEADER[payload.$i18n.locale]
    },
    methods: {
        async initTable() {
            this.columns = [
                {
                    label: this.$t('str.table.reports.column.patrolPoint'),
                    field: 'patrolPoint',
                    width: '10%',
                    sortable: true,
                    firstSortType: 'desc',
                    thClass: 'text-nowrap',
                    tdClass: 'text-nowrap',
                },
                {
                    label: this.$t('str.table.reports.column.vigilant'),
                    field: 'vigilant',
                    width: '10%',
                    sortable: true,
                    firstSortType: 'desc',
                    thClass: 'text-nowrap',
                    tdClass: 'text-nowrap',
                },

                {
                    label: this.$t('str.table.reports.column.scanned.date'),
                    field: 'scannedDate',
                    width: '10%',
                    sortable: true,
                    tdClass: 'text-nowrap',
                    thClass: 'text-nowrap',
                },
                {
                    label: this.$t('str.table.reports.column.starts.in'),
                    field: 'startDate',
                    width: '10%',
                    sortable: true,
                    tdClass: 'text-nowrap',
                    thClass: 'text-nowrap',
                },
                {
                    label: this.$t('str.table.reports.column.ends.in'),
                    field: 'endDate',
                    width: '10%',
                    sortable: true,
                    tdClass: 'text-nowrap',
                    thClass: 'text-nowrap',
                },
                {
                    label: this.$t('str.table.reports.column.account'),
                    field: 'account',
                    width: '10%',
                    sortable: true,
                    thClass: 'text-nowrap',
                    tdClass: 'text-nowrap',
                },
                {
                    label: this.$t('str.table.reports.column.client'),
                    field: 'client',
                    width: '10%',
                    sortable: true,
                    thClass: 'text-nowrap',
                    tdClass: 'text-nowrap',
                },
                {
                    label: this.$t('str.table.reports.column.site'),
                    field: 'site',
                    width: '10%',
                    sortable: true,
                    thClass: 'text-nowrap',
                    tdClass: 'text-nowrap',
                },
            ]

            this.paginationOptions = {
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
            }
        },
        getStatusName: Common.getEventStatusName,
        formatDate: Common.formatDateAndTime,
    },
}
</script>
