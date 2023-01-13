<script>
import Endpoints from '../../common/Endpoints.vue'
import Request from '../../common/Request.vue'
import Common from '../../common/Common.vue'
import Services from '../../common/Services.vue'

export default {
    init: async payload => {
        payload.filters.account = Common.getAccountId(payload)

        payload.isSuperAdminMaster = await Common.isSuperAdminMaster(payload)
        if (payload.isSuperAdminMaster) {
            payload.accounts = await Services.getAccounts(payload)
        } else {
            payload.clients = await Services.getClients(payload)
        }

        await payload.initTable()
        await payload.selectAllDomains()
        await payload.filter()
    },
    methods: {
        handleDomains: async function (value) {
            const selectedDomains = this.filters.domains
            const hasAllDomains = selectedDomains.includes('ALL')

            if (hasAllDomains && value !== 'ALL') {
                this.filters.domains = this.filters.domains.filter(domain => domain !== 'ALL')
                await this.filter()
                return
            }

            if (hasAllDomains && value === 'ALL') {
                this.filters.domains = this.domains.map(domain => domain.value)
            } else if (!hasAllDomains && value === 'ALL') {
                this.filters.domains = []
            }

            await this.filter()
        },
        filter: async function () {
            this.isLoading = true
            this.items = []

            Request.do(
                this,
                'POST',
                Request.getDefaultHeader(this),
                this.filters,
                `${Endpoints.logs.filter}`,
                response => {
                    this.items = response?.results
                    this.isLoading = false
                },
                error => {
                    this.isLoading = false
                    console.log(error)
                },
            )
        },
        selectItem(params) {
            const data = JSON.parse(JSON.stringify(params.row))

            delete data.vgt_id
            delete data.originalIndex

            data.account = data?.account?._id || ''
            data.client = data?.client?._id || ''
            data.site = data?.site?._id || ''

            this.$emit('load-item', data)
        },
        initTable() {
            this.columns = [
                {
                    label: this.$t('str.table.actions.log.column.user'),
                    field: 'systemUser',
                    width: '20%',
                    sortable: true,
                    thClass: 'text-nowrap',
                    tdClass: 'text-nowrap',
                },
                {
                    label: this.$t('str.table.actions.log.column.domain'),
                    field: 'domain',
                    width: '15%',
                    sortable: true,
                    firstSortType: 'desc',
                    thClass: 'text-nowrap',
                    tdClass: 'text-nowrap',
                },
                {
                    label: this.$t('str.table.actions.log.column.operation'),
                    field: 'operation',
                    width: '15%',
                    sortable: true,
                    thClass: 'text-nowrap',
                    tdClass: 'text-nowrap',
                },
                {
                    label: this.$t('str.table.actions.log.column.account'),
                    field: 'account',
                    width: '15%',
                    thClass: 'text-nowrap',
                    tdClass: 'text-nowrap',
                },
                {
                    label: this.$t('str.table.actions.log.column.client'),
                    field: 'client',
                    width: '10%',
                    thClass: 'text-nowrap',
                    tdClass: 'text-nowrap',
                },
                {
                    label: this.$t('str.table.actions.log.column.site'),
                    field: 'site',
                    width: '10%',
                    thClass: 'text-nowrap',
                    tdClass: 'text-nowrap',
                },
                {
                    label: this.$t('str.table.actions.log.column.creat.at'),
                    field: 'createDate',
                    width: '10%',
                    tdClass: 'text-nowrap',
                    thClass: 'text-nowrap',
                },
            ]
            this.paginationOptions = {
                enabled: true,
                mode: 'records',
                perPage: 15,
                position: 'bottom',
                perPageDropdown: [15, 50, 100],
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

            if (!this.isSuperAdminMaster) {
                this.columns.splice(3, 1)
            }
        },
        changeAccount: async function () {
            const account = this.filters.account

            this.filter()

            if (account === '') {
                this.filters.client = ''
                this.filters.site = ''
            }

            this.clients = await Services.getClientsByAccount(this, account)
        },
        changeClient: async function () {
            const client = this.filters.client

            this.filter()

            if (client === '') {
                this.filters.site = ''
            }

            this.sites = await Services.getSitesByClient(this, client)
        },
        selectAllDomains: function () {
            const domains = this.domains.map(domain => domain.value)
            this.filters.domains = domains
        },
        formatDate: Common.formatDateAndTime,
    },
}
</script>
