<script>
import Endpoints from '../../../common/Endpoints.vue'
import Request from '../../../common/Request.vue'

export default {
    init: payload => {
        payload.initTable()
        payload.filter()
    },
    methods: {
        filter: function () {
            this.items = []
            Request.do(
                this,
                'POST',
                Request.getDefaultHeader(this),
                this.filters,
                `${Endpoints.companies.filter}`,
                response => {
                    this.items = response.results
                },
                error => {
                    console.log(error)
                },
            )
        },
        selectItem(params) {
            const data = JSON.parse(JSON.stringify(params.row))

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
                    label: this.$t('str.table.company.column.name'),
                    field: 'name',
                    width: '30%',
                    thClass: 'text-nowrap',
                    tdClass: 'text-nowrap',
                },
                {
                    label: this.$t('str.table.company.column.document'),
                    field: 'document',
                    width: '10%',
                    thClass: 'text-nowrap',
                    tdClass: 'text-nowrap',
                },
                {
                    label: this.$t('str.table.company.column.email'),
                    field: 'email',
                    type: 'number',
                    width: '10%',
                    tdClass: 'text-center text-nowrap',
                    thClass: 'text-center text-nowrap',
                },
                {
                    label: this.$t('str.table.company.column.phone'),
                    field: 'primaryPhone',
                    type: 'phone',
                    width: '10%',
                    tdClass: 'text-center text-nowrap',
                    thClass: 'text-center text-nowrap',
                },
                {
                    label: this.$t('str.table.company.column.address'),
                    field: 'address',
                    type: 'address',
                    width: '20%',
                    tdClass: 'text-center text-nowrap',
                    thClass: 'text-center text-nowrap',
                },
                {
                    label: this.$t('str.table.company.column.creat.at'),
                    field: 'createDate',
                    type: 'date',
                    dateInputFormat: "yyyy-MM-dd'T'HH:mm:ss.SSSSSSSxxx",
                    dateOutputFormat: 'dd/MM/yyyy',
                    width: '10%',
                    tdClass: 'text-center text-nowrap',
                    thClass: 'text-center text-nowrap',
                },
                {
                    label: this.$t('str.table.company.column.status'),
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
        },
    },
}
</script>
