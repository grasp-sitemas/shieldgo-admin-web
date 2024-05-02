<script>
import Endpoints from '../../../common/Endpoints.vue'
import Request from '../../../common/Request.vue'
import Common from '../../../common/Common.vue'
import Services from '../../../common/Services.vue'

export default {
    init: async payload => {
        await payload.initTable()

        const role = await Common.getSubtype(payload)
        payload.role = role

        payload.isSuperAdminMaster = await Common.isSuperAdminMaster(payload)
        payload.accounts = await Services.getAccounts(payload)
        const account = await Common.getAccountId(payload)

        payload.filters.account = account
        if (account) {
            payload.clients = await Services.getClients(payload)
        }

        if (!payload.isSuperAdminMaster) {
            payload.columns.splice(1, 1)
        }

        if (payload.role === 'AUDITOR') {
            payload.columns.splice(1, 1)
        }
    },
    methods: {
        changeAccount: async function () {
            const state = this
            state.filter()

            if (state.filters.account === '') {
                state.filters.client = ''
            }

            const account = state.filters.account
            state.clients = await Services.getClientsByAccount(state, account)
        },
        filter: function () {
            this.isLoading = true
            this.items = []
            Request.do(
                this,
                'POST',
                Request.getDefaultHeader(this),
                this.filters,
                `${Endpoints.companies.filter}`,
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
        async selectItem(params) {
            if (this.role === 'AUDITOR') return

            const data = params && params?.row ? JSON.parse(JSON.stringify(params.row)) : { ...this.siteObj }
            if (!data.account) {
                data.account = await Common.getAccountId(this)
            } else {
                data.account = data.account._id
            }

            if (!data.client) {
                data.client = await Common.getClientId(this)
            } else {
                data.client = data.client._id
            }

            if (!data?.address?._id) {
                data.address = {}
            }

            delete data.vgt_id
            delete data.originalIndex

            this.data = data

            this.$bvModal.show('createSiteModal')
        },

        initTable() {
            this.columns = [
                {
                    label: this.$t('str.table.site.column.name'),
                    field: 'name',
                    width: '15%',
                    thClass: 'text-nowrap',
                    tdClass: 'text-nowrap',
                    sortable: true,
                    filterable: true,
                },
                {
                    label: this.$t('str.table.site.column.account'),
                    field: 'account',
                    width: '15%',
                    thClass: 'text-nowrap',
                    tdClass: 'text-nowrap',
                    sortable: true,
                    filterable: true,
                    sortFn: Common.sortAccountFn,
                },
                {
                    label: this.$t('str.table.site.column.client'),
                    field: 'client',
                    width: '15%',
                    thClass: 'text-nowrap',
                    tdClass: 'text-nowrap',
                    sortable: true,
                    filterable: true,
                    sortFn: Common.sortClientFn,
                },

                {
                    label: this.$t('str.table.site.column.address'),
                    field: 'address',
                    type: 'address',
                    width: '20%',
                    tdClass: 'text-nowrap',
                    thClass: 'text-nowrap',
                    sortable: true,
                    filterable: true,
                    sortFn: Common.sortAddressFn,
                },
                {
                    label: this.$t('str.table.site.column.enable.free.patrol'),
                    field: 'enableFreePatrol',
                    width: '10%',
                    thClass: 'text-nowrap',
                    tdClass: 'text-nowrap',
                    sortable: true,
                    filterable: true,
                },
                {
                    label: this.$t('str.table.site.column.owner'),
                    field: 'owner',
                    width: '15%',
                    thClass: 'text-nowrap',
                    tdClass: 'text-nowrap',
                    sortable: true,
                    filterable: true,
                },
                {
                    label: this.$t('str.table.site.column.creat.at'),
                    field: 'createDate',
                    width: '10%',
                    tdClass: 'text-nowrap',
                    thClass: 'text-nowrap',
                    sortable: true,
                    filterable: true,
                },
                {
                    label: this.$t('str.table.site.column.status'),
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
        formatDate: Common.formatDateAndTime,
    },
}
</script>
