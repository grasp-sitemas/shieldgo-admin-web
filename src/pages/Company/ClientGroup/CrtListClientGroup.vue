<script>
import Endpoints from '../../../common/Endpoints.vue'
import Request from '../../../common/Request.vue'
import Common from '../../../common/Common.vue'
import Services from '../../../common/Services.vue'
export default {
    init: async payload => {
        payload.filters.account = await Common.getAccountId(payload)
        payload.isSuperAdminMaster = await Common.isSuperAdminMaster(payload)

        await payload.initTable()
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
                `${Endpoints.clientGroups.filter}`,
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
            const data = params && params?.row ? JSON.parse(JSON.stringify(params.row)) : { ...this.clientGroupObj }

            delete data.vgt_id
            delete data.originalIndex
            delete data.password

            data.account = data?.account?._id || ''

            if (!data?.address?._id) {
                data.address = {}
            }

            this.data = data

            this.$bvModal.show('createClientGroupModal')
        },
        async initTable() {
            this.columns = [
                {
                    label: this.$t('str.table.client.groups.column.name'),
                    field: 'name',
                    width: '20%',
                    thClass: 'text-nowrap',
                    tdClass: 'text-nowrap',
                    sortable: true,
                    filterable: true,
                },
                {
                    label: this.$t('str.table.client.groups.column.assigned.clients'),
                    field: 'clients',
                    width: '20%',
                    thClass: 'text-nowrap',
                    tdClass: 'text-nowrap',
                    sortable: true,
                    filterable: true,
                },
                {
                    label: this.$t('str.table.client.groups.column.account'),
                    field: 'account.name',
                    width: '20%',
                    thClass: 'text-nowrap',
                    tdClass: 'text-nowrap',
                    sortable: true,
                    filterable: true,
                },
                {
                    label: this.$t('str.table.client.groups.column.creat.at'),
                    field: 'createDate',
                    width: '20%',
                    tdClass: 'text-nowrap',
                    thClass: 'text-nowrap',
                    sortable: true,
                    filterable: true,
                },
                {
                    label: this.$t('str.table.client.groups.column.status'),
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

            this.filters.client = ''
            this.filter()

            this.clients = await Services.getClientsByAccount(this, account)
        },
        formatDate: Common.formatDateAndTime,
    },
}
</script>
