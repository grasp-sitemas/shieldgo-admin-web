<script>
import Endpoints from '../../../common/Endpoints.vue'
import Request from '../../../common/Request.vue'
import Common from '../../../common/Common.vue'
import Services from '../../../common/Services.vue'
export default {
    init: async payload => {
        payload.isSuperAdminMaster = await Common.isSuperAdminMaster(payload)
        payload.accounts = await Services.getAccounts(payload)
        const account = await Common.getAccountId(payload)
        payload.initTable()
        payload.filters.account = account
        if (account) {
            payload.clients = await Services.getClients(payload)
        }

        if (!payload.isSuperAdminMaster) {
            payload.columns.splice(2, 1)
        }

        payload.filter()
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
                `${Endpoints.siteGroups.filter}`,
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
            const data =
                params && params?.row
                    ? JSON.parse(JSON.stringify(params.row))
                    : {
                          ...this.siteGroupObj,
                      }

            delete data.vgt_id
            delete data.originalIndex

            if (!data.account && !this.isSuperAdminMaster) {
                data.account = await Common.getAccountId(this)
            } else {
                data.account = data.account._id
            }

            if (data.client) {
                data.client = data.client._id
            }

            this.data = data

            this.$bvModal.show('createSiteGroupModal')
        },
        async initTable() {
            this.columns = [
                {
                    label: this.$t('str.table.site.groups.column.name'),
                    field: 'name',
                    width: '20%',
                    thClass: 'text-nowrap',
                    tdClass: 'text-nowrap',
                    sortable: true,
                    filterable: true,
                },
                {
                    label: this.$t('str.table.site.groups.column.assigned.sites'),
                    field: 'sites',
                    width: '20%',
                    thClass: 'text-nowrap',
                    tdClass: 'text-nowrap',
                    sortable: true,
                    filterable: true,
                },
                {
                    label: this.$t('str.table.site.groups.column.account'),
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
                {
                    label: this.$t('str.table.site.groups.column.status'),
                    field: 'status',
                    width: '20%',
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

            this.filter()

            this.clients = await Services.getClientsByAccount(this, account)
        },
        changeClient: async function () {
            const client = this.filters.client

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
