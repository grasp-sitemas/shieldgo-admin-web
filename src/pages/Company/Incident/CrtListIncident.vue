<script>
import Endpoints from '../../../common/Endpoints.vue'
import Request from '../../../common/Request.vue'
import Common from '../../../common/Common.vue'
import Services from '../../../common/Services.vue'
export default {
    init: async payload => {
        const role = await Common.getSubtype(payload)
        payload.role = role

        payload.initTable()

        payload.isSuperAdminMaster = await Common.isSuperAdminMaster(payload)

        if (!payload.isSuperAdminMaster) {
            payload.columns.splice(2, 1)
        }

        if (role === 'AUDITOR') {
            payload.columns.splice(2, 1)
        }

        payload.accounts = await Services.getAccounts(payload)
        const account = await Common.getAccountId(payload)

        payload.filters.account = account
        if (account) {
            payload.clients = await Services.getClients(payload)
        }

        if (role === 'MANAGER' || role === 'OPERATOR' || role === 'AUDITOR') {
            const client = await Common.getClientId(payload)
            payload.filters.client = client
            payload.sites = await Services.getSites(payload)
        }
    },
    methods: {
        filter: function () {
            this.isLoading = true
            this.items = []
            Request.do(
                this,
                'POST',
                Request.getDefaultHeader(this),
                this.filters,
                `${Endpoints.incidents.filter}`,
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
            if (this.role === 'AUDITOR') return

            const data = params && params?.row ? JSON.parse(JSON.stringify(params.row)) : { ...this.incidentObj }

            delete data.vgt_id
            delete data.originalIndex

            data.account = data?.account?._id || ''
            data.client = data?.client?._id || ''
            data.site = data?.site?._id || ''

            this.data = data

            this.$bvModal.show('createIncidentModal')
        },
        async initTable() {
            this.columns = [
                {
                    label: this.$t('str.table.incident.column.name'),
                    field: 'name',
                    width: '30%',
                    thClass: 'text-nowrap',
                    tdClass: 'text-nowrap',
                    sortable: true,
                    filterable: true,
                },
                {
                    label: this.$t('str.table.incident.column.priority'),
                    field: 'priority',
                    width: '10%',
                    thClass: 'text-nowrap',
                    tdClass: 'text-nowrap',
                    sortable: true,
                    filterable: true,
                },
                {
                    label: this.$t('str.table.incident.column.account'),
                    field: 'account',
                    width: '15%',
                    thClass: 'text-nowrap',
                    tdClass: 'text-nowrap',
                    sortable: true,
                    filterable: true,
                    sortFn: Common.sortAccountFn,
                },
                {
                    label: this.$t('str.table.incident.column.client'),
                    field: 'client',
                    width: '15%',
                    thClass: 'text-nowrap',
                    tdClass: 'text-nowrap',
                    sortable: true,
                    filterable: true,
                    sortFn: Common.sortClientFn,
                },
                {
                    label: this.$t('str.table.incident.column.site'),
                    field: 'site',
                    width: '15%',
                    thClass: 'text-nowrap',
                    tdClass: 'text-nowrap',
                    sortable: true,
                    filterable: true,
                    sortFn: Common.sortSiteFn,
                },
                {
                    label: this.$t('str.table.incident.column.creat.at'),
                    field: 'createDate',
                    width: '15%',
                    tdClass: 'text-nowrap',
                    thClass: 'text-nowrap',
                    sortable: true,
                    filterable: true,
                },
                {
                    label: this.$t('str.table.incident.column.status'),
                    field: 'status',
                    width: '10%',
                    tdClass: 'text-nowrap',
                    thClass: 'text-nowrap',
                    sortable: false,
                    filterable: false,
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
            const account = this.filters.account

            this.sites = []
            this.filters.client = ''
            this.filters.site = ''

            this.filter()

            this.clients = await Services.getClientsByAccount(this, account)
        },
        changeClient: async function () {
            const client = this.filters.client

            if (client === '') {
                this.filters.site = ''
            }

            this.filter()

            this.sites = await Services.getSitesByClient(this, client)
        },
        changeSite: function () {
            this.filter()
        },
        formatDate: Common.formatDateAndTime,
    },
}
</script>
