<script>
import Endpoints from '../../../common/Endpoints.vue'
import Request from '../../../common/Request.vue'
import Common from '../../../common/Common.vue'
import Services from '../../../common/Services.vue'
export default {
    init: async payload => {
        payload.initTable()

        payload.isSuperAdminMaster = await Common.isSuperAdminMaster(payload)
        payload.accounts = await Services.getAccounts(payload)

        const account = await Common.getAccountId(payload)

        payload.filters.account = account

        if (account) {
            payload.clients = await Services.getClients(payload)
        }

        if (!payload.isSuperAdminMaster) {
            payload.columns.splice(2, 1)
        }
    },
    methods: {
        filter: async function () {
            this.isLoading = true
            this.items = []

            Request.do(
                this,
                'POST',
                Request.getDefaultHeader(this),
                this.filters,
                `${Endpoints.guardGroups.filter}`,
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
            const data = params && params?.row ? JSON.parse(JSON.stringify(params.row)) : { ...this.guardGroupObj }

            delete data.vgt_id
            delete data.originalIndex
            delete data.password

            data.account = data?.account?._id || ''
            data.client = data?.client?._id || ''
            data.site = data?.site?._id || ''

            if (!data?.address?._id) {
                data.address = {}
            }

            this.data = data

            this.$bvModal.show('createGuardGroupModal')
        },
        async initTable() {
            this.columns = [
                {
                    label: this.$t('str.table.guard.groups.column.name'),
                    field: 'name',
                    width: '20%',
                    thClass: 'text-nowrap',
                    tdClass: 'text-nowrap',
                    sortable: true,
                    filterable: true,
                },
                {
                    label: this.$t('str.table.guard.groups.column.assigned.guards'),
                    field: 'vigilants',
                    width: '15%',
                    thClass: 'text-nowrap',
                    tdClass: 'text-nowrap',
                    sortable: true,
                    filterable: true,
                },
                {
                    label: this.$t('str.table.guard.groups.column.account'),
                    field: 'account.name',
                    width: '15%',
                    thClass: 'text-nowrap',
                    tdClass: 'text-nowrap',
                    sortable: true,
                    filterable: true,
                },
                {
                    label: this.$t('str.table.guard.groups.column.client'),
                    field: 'client.name',
                    width: '15%',
                    thClass: 'text-nowrap',
                    tdClass: 'text-nowrap',
                    sortable: true,
                    filterable: true,
                },
                {
                    label: this.$t('str.table.guard.groups.column.site'),
                    field: 'site.name',
                    width: '15%',
                    thClass: 'text-nowrap',
                    tdClass: 'text-nowrap',
                    sortable: true,
                    filterable: true,
                },
                {
                    label: this.$t('str.table.guard.groups.column.creat.at'),
                    field: 'createDate',
                    width: '10%',
                    tdClass: 'text-nowrap',
                    thClass: 'text-nowrap',
                    sortable: true,
                    filterable: true,
                },
                {
                    label: this.$t('str.table.guard.groups.column.status'),
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
            this.isLoadingClients = true
            const account = this.filters.account

            this.sites = []
            this.filters.client = ''
            this.filters.site = ''

            this.filter()

            this.clients = await Services.getClientsByAccount(this, account)

            this.isLoadingClients = false
        },
        changeClient: async function () {
            this.isLoadingSites = true
            const client = this.filters.client

            if (client === '') {
                this.filters.site = ''
            }

            this.filter()
            this.sites = await Services.getSitesByClient(this, client)

            this.isLoadingSites = false
        },
        changeSite: function () {
            this.filter()
        },
        formatDate: Common.formatDateAndTime,
    },
}
</script>
