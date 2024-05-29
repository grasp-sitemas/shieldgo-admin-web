<script>
import Endpoints from '../../../common/Endpoints.vue'
import Request from '../../../common/Request.vue'
import Common from '../../../common/Common.vue'
import Services from '../../../common/Services.vue'
export default {
    init: async payload => {
        payload.reportNames = Services.getReportNamesTypes(payload)
        payload.role = Common.getSubtype(payload)
        payload.initTable()

        payload.isSuperAdminMaster = await Common.isSuperAdminMaster(payload)
        if (!payload.isSuperAdminMaster) {
            payload.columns.splice(5, 1)

            const account = await Common.getAccountId(payload)
            payload.filters.account = account
        } else {
            payload.accounts = await Services.getAccounts(payload)
        }
    },
    methods: {
        filter: function () {
            if (this.isLoading) return

            if (this.role === 'SUPER_ADMIN_MASTER' && !this.filters.account) {
                Common.show(this, 'top-right', 'warn', this.$t('str.charts.select.account.required'))
                return
            }

            this.isLoading = true
            this.items = []

            Request.do(
                this,
                'POST',
                Request.getDefaultHeader(this),
                this.filters,
                `${Endpoints.reportSettings.filter}`,
                response => {
                    this.items = response.results
                    this.isLoading = false
                },
                error => {
                    this.isLoading = false
                    console.log(error)
                },
            )
        },
        selectItem(params) {
            const data = params && params?.row ? JSON.parse(JSON.stringify(params.row)) : { ...this.reportConfigObj }

            delete data.vgt_id
            delete data.originalIndex
            delete data.password

            data.account = data?.account?._id || ''

            this.data = data

            this.$bvModal.show('createReportSettingsModal')
        },
        async initTable() {
            this.columns = [
                {
                    label: this.$t('str.table.report.column.report.name'),
                    field: 'reportName',
                    width: '20%',
                    thClass: 'text-nowrap',
                    tdClass: 'text-nowrap',
                    sortable: true,
                    filterable: true,
                },
                {
                    label: this.$t('str.table.report.column.period'),
                    field: 'period',
                    width: '10%',
                    thClass: 'text-nowrap',
                    tdClass: 'text-nowrap',
                    sortable: true,
                    filterable: true,
                },
                {
                    label: this.$t('str.table.report.column.next.dispatch.date'),
                    field: 'nextDispatchDate',
                    width: '10%',
                    thClass: 'text-nowrap',
                    tdClass: 'text-nowrap',
                    sortable: true,
                    filterable: true,
                },
                {
                    label: this.$t('str.table.report.column.emails'),
                    field: 'emails',
                    width: '30%',
                    thClass: 'text-nowrap',
                    tdClass: 'text-nowrap',
                    sortable: true,
                    filterable: true,
                },
                {
                    label: this.$t('str.table.report.column.email.language'),
                    field: 'emailLanguage',
                    width: '10%',
                    thClass: 'text-nowrap',
                    tdClass: 'text-nowrap',
                    sortable: true,
                    filterable: true,
                },
                {
                    label: this.$t('str.table.report.column.account'),
                    field: 'account.name',
                    width: '20%',
                    thClass: 'text-nowrap',
                    tdClass: 'text-nowrap',
                    sortable: true,
                    filterable: true,
                },
                {
                    label: this.$t('str.table.site.groups.column.creat.at'),
                    field: 'createDate',
                    width: '20%',
                    tdClass: 'text-nowrap',
                    thClass: 'text-nowrap',
                    sortable: true,
                    filterable: true,
                },
            ]
            this.paginationOptions = {
                enabled: true,
                mode: 'records',
                perPage: 10,
                position: 'bottom',
                perPageDropdown: [10, 20, 50, 100],
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
        changeAccount: async function () {
            this.filter()
        },
        changeReportName: async function () {
            this.filter()
        },
        formatDate: Common.formatDateAndTime,
    },
}
</script>
