<script>
import Endpoints from '../../../common/Endpoints.vue'
import Request from '../../../common/Request.vue'
import Common from '../../../common/Common.vue'
import Services from '../../../common/Services.vue'

export default {
    init: payload => {
        payload.isSuperAdminMaster = Common.isSuperAdminMaster(payload)
        payload.filters.account = Common.getAccountId(payload)

        payload.initTable()
        payload.filter()
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
        selectItem(params) {
            const data = JSON.parse(JSON.stringify(params.row))

            data.account = data?.account?._id || ''
            data.client = data?.client?._id || ''

            delete data.vgt_id
            delete data.originalIndex

            if (!data?.address?._id) {
                data.address = {}
            }

            this.$emit('load-item', data)
        },
        initTable() {
            this.columns = [
                {
                    label: this.$t('str.table.site.column.name'),
                    field: 'name',
                    width: '25%',
                    thClass: 'text-nowrap',
                    tdClass: 'text-nowrap',
                },
                {
                    label: this.$t('str.table.site.column.account'),
                    field: 'account',
                    width: '15%',
                    thClass: 'text-nowrap',
                    tdClass: 'text-nowrap',
                },
                {
                    label: this.$t('str.table.site.column.client'),
                    field: 'client',
                    width: '15%',
                    thClass: 'text-nowrap',
                    tdClass: 'text-nowrap',
                },
                {
                    label: this.$t('str.table.site.column.address'),
                    field: 'address',
                    type: 'address',
                    width: '25%',
                    tdClass: 'text-nowrap',
                    thClass: 'text-nowrap',
                },
                {
                    label: this.$t('str.table.site.column.creat.at'),
                    field: 'createDate',
                    width: '25%',
                    tdClass: 'text-nowrap',
                    thClass: 'text-nowrap',
                },
                {
                    label: this.$t('str.table.site.column.status'),
                    field: 'status',
                    width: '25%',
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

            //remove account column if not super admin
            if (!this.isSuperAdminMaster) {
                this.columns.splice(1, 1)
            }
        },
        formatDate: Common.formatDateAndTime,
    },
}
</script>
