<script>
import Endpoints from '../../../common/Endpoints.vue'
import Request from '../../../common/Request.vue'
import Common from '../../../common/Common.vue'
import Services from '../../../common/Services.vue'
export default {
    init: async payload => {
        payload.filters.account = await Common.getAccountId(payload)
        payload.initTable()
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
            const data = JSON.parse(JSON.stringify(params.row))

            delete data.vgt_id
            delete data.originalIndex
            delete data.password

            data.account = data?.account?._id || ''
            data.client = data?.client?._id || ''
            data.site = data?.site?._id || ''

            if (!data?.address?._id) {
                data.address = {}
            }

            this.$emit('load-item', data)
        },
        initTable() {
            this.columns = [
                {
                    label: this.$t('str.table.site.groups.column.name'),
                    field: 'name',
                    width: '20%',
                    thClass: 'text-nowrap',
                    tdClass: 'text-nowrap',
                },
                {
                    label: this.$t('str.table.site.groups.column.assigned.sites'),
                    field: 'vigilants',
                    width: '15%',
                    thClass: 'text-nowrap',
                    tdClass: 'text-nowrap',
                },
                {
                    label: this.$t('str.table.site.groups.column.account'),
                    field: 'account',
                    width: '15%',
                    thClass: 'text-nowrap',
                    tdClass: 'text-nowrap',
                },
                {
                    label: this.$t('str.table.site.groups.column.client'),
                    field: 'client',
                    width: '15%',
                    thClass: 'text-nowrap',
                    tdClass: 'text-nowrap',
                },
                {
                    label: this.$t('str.table.site.groups.column.site'),
                    field: 'site',
                    width: '15%',
                    thClass: 'text-nowrap',
                    tdClass: 'text-nowrap',
                },
                {
                    label: this.$t('str.table.site.groups.column.creat.at'),
                    field: 'createDate',
                    width: '10%',
                    tdClass: 'text-nowrap',
                    thClass: 'text-nowrap',
                },
                {
                    label: this.$t('str.table.site.groups.column.status'),
                    field: 'status',
                    width: '10%',
                    tdClass: 'text-nowrap',
                    thClass: 'text-nowrap',
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

            if (!this.isSuperAdminMaster) {
                this.columns.splice(2, 1)
            }
        },
        changeAccount: async function () {
            const account = this.filters.account

            this.sites = []
            this.filters.client = ''
            this.filters.site = ''

            this.filter()

            this.listClients = await Services.getClientsByAccount(this, account)
        },
        changeClient: async function () {
            const client = this.filters.client

            if (client === '') {
                this.filters.site = ''
            }

            this.filter()

            this.listSites = await Services.getSitesByClient(this, client)
        },
        changeSite: function () {
            this.filter()
        },
        formatDate: Common.formatDateAndTime,
    },
}
</script>
