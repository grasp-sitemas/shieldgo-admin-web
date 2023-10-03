<script>
import Endpoints from '../../../common/Endpoints.vue'
import Request from '../../../common/Request.vue'
import Common from '../../../common/Common.vue'
import Services from '../../../common/Services.vue'
export default {
    init: async payload => {
        payload.filters.account = await Common.getAccountId(payload)
        await payload.initTable()
        if (!payload.isSuperAdminMaster) {
            payload.columns.splice(5, 1)
        }

        if (payload?.role === 'AUDITOR') {
            payload.columns.splice(3, 1)
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
                `${Endpoints.patrolPoints.filter}`,
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
        openCheckPointModal() {
            this.clearForm()
            this.$bvModal.show('checkPointModal')
        },
        selectItem(params) {
            if (this.role === 'AUDITOR') return

            const data = params && params?.row ? JSON.parse(JSON.stringify(params.row)) : { ...this.patrolPointObj }

            delete data.vgt_id
            delete data.originalIndex

            data.account = data?.account?._id || ''
            data.client = data?.client?._id || ''
            data.site = data?.site?._id || ''

            if (!data?.geolocation) {
                data.geolocation = {
                    latitude: '',
                    longitude: '',
                }
            }

            if (!data?.address) {
                data.address = {
                    cep: '',
                    address: '',
                    number: '',
                    complement: '',
                    neighborhood: '',
                    city: '',
                    state: '',
                    ibge: '',
                    gia: '',
                    name: '',
                    lat: '',
                    lng: '',
                }
            }

            if ((!data?.geolocation?.latitude || !data.geolocation?.longitude) && data?.address?.location?.coordinates) {
                const lat = data.address.location.coordinates[1]
                const lng = data.address.location.coordinates[0]

                data.geolocation.latitude = lat
                data.geolocation.longitude = lng
            }

            if (!data?.geolocation?.longitude && data?.address?.lng) {
                data.geolocation.longitude = data.address.lng
            }

            this.data = data

            this.$emit('load-item', data)
        },
        showMap() {
            this.$bvModal.show('mapModal')
        },
        async initTable() {
            this.columns = [
                {
                    label: this.$t('str.table.check.point.column.code'),
                    field: 'patrolPointCode',
                    width: '5%',
                    sortable: true,
                    firstSortType: 'desc',
                    thClass: 'text-nowrap',
                    tdClass: 'text-nowrap',
                },
                {
                    label: this.$t('str.table.check.point.column.name'),
                    field: 'name',
                    width: '25%',
                    sortable: true,
                    firstSortType: 'desc',
                    thClass: 'text-nowrap',
                    tdClass: 'text-nowrap',
                },
                {
                    label: this.$t('str.table.check.point.column.type'),
                    field: 'type',
                    width: '10%',
                    sortable: true,
                    thClass: 'text-nowrap',
                    tdClass: 'text-nowrap',
                },
                // {
                //     label: this.$t('str.table.check.point.column.geolocation'),
                //     field: 'geolocation',
                //     width: '5%',
                //     thClass: 'text-nowrap',
                //     tdClass: 'text-nowrap',
                // },
                // {
                //     label: this.$t('str.table.check.point.column.radius'),
                //     field: 'radius',
                //     width: '5%',
                //     sortable: true,
                //     thClass: 'text-nowrap',
                //     tdClass: 'text-nowrap',
                // },
                {
                    label: this.$t('str.table.check.point.column.account'),
                    field: 'account',
                    width: '10%',
                    thClass: 'text-nowrap',
                    tdClass: 'text-nowrap',
                    sortable: true,
                    filterable: true,
                    sortFn: Common.sortAccountFn,
                },
                {
                    label: this.$t('str.table.check.point.column.client'),
                    field: 'client',
                    width: '10%',
                    thClass: 'text-nowrap',
                    tdClass: 'text-nowrap',
                    sortable: true,
                    filterable: true,
                    sortFn: Common.sortClientFn,
                },
                {
                    label: this.$t('str.table.check.point.column.site'),
                    field: 'site',
                    width: '10%',
                    thClass: 'text-nowrap',
                    tdClass: 'text-nowrap',
                    sortable: true,
                    filterable: true,
                    sortFn: Common.sortSiteFn,
                },
                {
                    label: this.$t('str.table.check.point.column.creat.at'),
                    field: 'createDate',
                    width: '10%',
                    tdClass: 'text-nowrap',
                    thClass: 'text-nowrap',
                },
                {
                    label: this.$t('str.table.check.point.column.status'),
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
                perPageDropdown: [10, 20, 50, 100, 1000, 10000],
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
