<script>
import Endpoints from '../../../common/Endpoints.vue'
import Request from '../../../common/Request.vue'
import Common from '../../../common/Common.vue'
import Services from '../../../common/Services.vue'
export default {
    init: async payload => {
        payload.isSuperAdminMaster = await Common.isSuperAdminMaster(payload)
        payload.accounts = await Services.getAccounts(payload)
        payload.filters.account = await Common.getAccountId(payload)
        payload.initTable()
        payload.filter()
        payload.domain = Endpoints.domain
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
        selectItem(params) {
            const data = params && params?.row ? JSON.parse(JSON.stringify(params.row)) : {}

            data.account = data?.account?._id || ''

            delete data.vgt_id
            delete data.originalIndex

            this.data = data

            this.$bvModal.show('createClientModal')
        },

        initTable() {
            this.columns = [
                {
                    label: this.$t('str.table.client.column.name'),
                    field: 'name',
                    width: '15%',
                    thClass: 'text-nowrap',
                    tdClass: 'text-nowrap',
                    sortable: true,
                    filterable: true,
                },
                {
                    label: this.$t('str.table.client.column.account'),
                    field: 'account',
                    width: '15%',
                    thClass: 'text-nowrap',
                    tdClass: 'text-nowrap',
                    sortable: true,
                    filterable: true,
                },
                {
                    label: this.$t('str.table.client.column.email'),
                    field: 'email',
                    type: 'number',
                    width: '15%',
                    tdClass: 'text-nowrap',
                    thClass: 'text-nowrap',
                    sortable: true,
                    filterable: true,
                },
                {
                    label: this.$t('str.table.client.column.phone'),
                    field: 'primaryPhone',
                    type: 'phone',
                    width: '15%',
                    tdClass: 'text-nowrap',
                    thClass: 'text-nowrap',
                    sortable: true,
                    filterable: true,
                },
                {
                    label: this.$t('str.table.client.column.owner'),
                    field: 'name',
                    width: '15%',
                    thClass: 'text-nowrap',
                    tdClass: 'text-nowrap',
                    sortable: true,
                    filterable: true,
                },
                {
                    label: this.$t('str.table.client.column.creat.at'),
                    field: 'createDate',
                    width: '15%',
                    tdClass: 'text-nowrap',
                    thClass: 'text-nowrap',
                    sortable: true,
                    filterable: true,
                },
                {
                    label: this.$t('str.table.client.column.status'),
                    field: 'status',
                    width: '15%',
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

            //remove account column if not super admin
            if (!this.isSuperAdminMaster) {
                this.columns.splice(1, 1)
            }
        },
        formatDate: Common.formatDateAndTime,
    },
}
</script>
