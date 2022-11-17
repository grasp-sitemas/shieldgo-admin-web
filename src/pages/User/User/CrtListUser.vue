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
            this.items = []
            this.isLoading = true
            Request.do(
                this,
                'POST',
                Request.getDefaultHeader(this),
                this.filters,
                `${Endpoints.systemUsers.companyUser.search}`,
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
                    label: this.$t('str.table.user.column.name'),
                    field: 'firstName',
                    width: '30%',
                    thClass: 'text-nowrap',
                    tdClass: 'text-nowrap',
                },
                {
                    label: this.$t('str.table.user.column.account'),
                    field: 'account',
                    width: '10%',
                    thClass: 'text-nowrap',
                    tdClass: 'text-nowrap',
                },
                {
                    label: this.$t('str.table.user.column.client'),
                    field: 'client',
                    width: '10%',
                    thClass: 'text-nowrap',
                    tdClass: 'text-nowrap',
                },
                {
                    label: this.$t('str.table.user.column.site'),
                    field: 'site',
                    width: '10%',
                    thClass: 'text-nowrap',
                    tdClass: 'text-nowrap',
                },
                {
                    label: this.$t('str.table.user.column.role'),
                    field: 'companyUser.subtype',
                    width: '10%',
                    thClass: 'text-nowrap',
                    tdClass: 'text-nowrap',
                },
                {
                    label: this.$t('str.table.user.column.email'),
                    field: 'email',
                    width: '10%',
                    tdClass: 'text-center text-nowrap',
                    thClass: 'text-center text-nowrap',
                },
                {
                    label: this.$t('str.table.user.column.phone'),
                    field: 'primaryPhone',
                    type: 'phone',
                    width: '10%',
                    tdClass: 'text-center text-nowrap',
                    thClass: 'text-center text-nowrap',
                },
                {
                    label: this.$t('str.table.user.column.address'),
                    field: 'address',
                    type: 'address',
                    width: '20%',
                    tdClass: 'text-center text-nowrap',
                    thClass: 'text-center text-nowrap',
                },
                {
                    label: this.$t('str.table.user.column.creat.at'),
                    field: 'createDate',
                    type: 'date',
                    dateInputFormat: "yyyy-MM-dd'T'HH:mm:ss.SSSSSSSxxx",
                    dateOutputFormat: 'dd/MM/yyyy',
                    width: '10%',
                    tdClass: 'text-center text-nowrap',
                    thClass: 'text-center text-nowrap',
                },
                {
                    label: this.$t('str.table.user.column.status'),
                    field: 'status',
                    width: '10%',
                    tdClass: 'text-center text-nowrap',
                    thClass: 'text-center text-nowrap',
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
                this.columns.splice(1, 1)
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
    },
}
</script>
