<script>
import Endpoints from '../../../common/Endpoints.vue'
import Request from '../../../common/Request.vue'
import Common from '../../../common/Common.vue'
import Services from '../../../common/Services.vue'

export default {
    init: async payload => {
        payload.isSuperAdminMaster = await Common.isSuperAdminMaster(payload)
        payload.initTable()

        const role = await Common.getSubtype(payload)
        payload.role = role

        if (role === 'SUPER_ADMIN_MASTER') {
            payload.accounts = await Services.getAccounts(payload)
            payload.clients = await Services.getClients(payload)
        } else if (role === 'ADMIN' || role === 'MANAGER') {
            payload.clients = await Services.getClients(payload)
            payload.filters.account = Common.getAccountId(payload)
        } else if (role === 'OPERATOR') {
            payload.filters.account = Common.getAccountId(payload)
            payload.sites = await Services.getSites(payload)
        }

        if (!payload.isSuperAdminMaster) {
            payload.columns.splice(3, 1)
        }

        await payload.filter()
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
                `${Endpoints.equipments.filter}`,
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
            const data = params && params?.row ? JSON.parse(JSON.stringify(params.row)) : { ...this.equipmentObj }

            delete data.vgt_id
            delete data.originalIndex

            data.account = data?.account?._id || ''
            data.client = data?.client?._id || ''
            data.site = data?.site?._id || ''

            this.data = data

            this.$bvModal.show('registerModal')
        },

        async initTable() {
            this.columns = [
                {
                    label: this.$t('str.table.equipment.column.code'),
                    field: 'code',
                    width: '10%',
                    thClass: 'text-nowrap',
                    tdClass: 'text-nowrap',
                    sortable: true,
                    filterable: true,
                },
                {
                    label: this.$t('str.table.equipment.column.type'),
                    field: 'type',
                    width: '10%',
                    thClass: 'text-nowrap',
                    tdClass: 'text-nowrap',
                    sortable: true,
                    filterable: true,
                },
                {
                    label: this.$t('str.table.equipment.column.brand'),
                    field: 'brand',
                    width: '10%',
                    thClass: 'text-nowrap',
                    tdClass: 'text-nowrap',
                    sortable: true,
                    filterable: true,
                },
                // {
                //     label: this.$t('str.table.equipment.column.guard'),
                //     field: 'user.fullName',
                //     width: '10%',
                //     thClass: 'text-nowrap',
                //     tdClass: 'text-nowrap',
                //     sortable: true,
                //     filterable: true,
                // },
                {
                    label: this.$t('str.table.equipment.column.account'),
                    field: 'account.name',
                    width: '10%',
                    thClass: 'text-nowrap',
                    tdClass: 'text-nowrap',
                    sortable: true,
                    filterable: true,
                },
                {
                    label: this.$t('str.table.equipment.column.client'),
                    field: 'client.name',
                    width: '10%',
                    thClass: 'text-nowrap',
                    tdClass: 'text-nowrap',
                    sortable: true,
                    filterable: true,
                },
                {
                    label: this.$t('str.table.equipment.column.site'),
                    field: 'site.name',
                    width: '10%',
                    thClass: 'text-nowrap',
                    tdClass: 'text-nowrap',
                    sortable: true,
                    filterable: true,
                },
                {
                    label: this.$t('str.table.equipment.column.creat.at'),
                    field: 'createDate',
                    width: '10%',
                    tdClass: 'text-nowrap',
                    thClass: 'text-nowrap',
                    sortable: true,
                    filterable: true,
                },
                {
                    label: this.$t('str.table.equipment.column.status'),
                    field: 'status',
                    width: '10%',
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
