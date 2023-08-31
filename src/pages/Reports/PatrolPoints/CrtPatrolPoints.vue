<script>
import Common from '../../../common/Common.vue'
import Services from '../../../common/Services.vue'
import moment from 'moment'

export default {
    init: async payload => {
        setTimeout(async () => {
            payload.isSuperAdminMaster = await Common.isSuperAdminMaster(payload)
            const role = await Common.getSubtype(payload)

            await payload.initTable()
            await payload.initRangeDate()

            if (role === 'SUPER_ADMIN_MASTER') {
                payload.accounts = await Services.getAccounts(payload)
            } else if (role === 'ADMIN' || role === 'MANAGER') {
                payload.clients = await Services.getClients(payload)
            } else if (role === 'MANAGER' || role === 'OPERATOR' || role === 'AUDITOR') {
                const client = await Common.getClientId(payload)
                payload.filters.client = client
                payload.sites = await Services.getSites(payload)
            }

            payload.jsonFields = payload.JSON_FIELDS_CSV.patrolPoint[payload.$i18n.locale].json_fields
            payload.jsonData = [payload.JSON_FIELDS_CSV.patrolPoint[payload.$i18n.locale].json_data]
            payload.jsonMeta = [payload.JSON_FIELDS_CSV.patrolPoint[payload.$i18n.locale].json_meta]
            payload.filename = payload.JSON_FIELDS_CSV.patrolPoint[payload.$i18n.locale].filename
            payload.jsonTitle = payload.JSON_FIELDS_CSV.patrolPoint[payload.$i18n.locale].title
            payload.pdfHeader = payload.PDF_HEADER[payload.$i18n.locale]

            payload.role = role
            payload.isLoading = false
        }, 700)
    },
    methods: {
        async filter() {
            this.isSearchLoading = true
            this.items = []

            const results = await Services.getPatrolPoints(this, this.filters)

            const patrolPoints = results.map(item => {
                return {
                    _id: item?._id,
                    patrolPointCode: item?.patrolPointCode,
                    name: item?.name,
                }
            })

            this.items = patrolPoints
            this.reportItems = patrolPoints

            this.isSearchLoading = false
        },
        async initTable() {
            this.columns = [
                {
                    label: this.$t('str.table.reports.column.code'),
                    field: 'patrolPointCode',
                    width: '15%',
                    sortable: true,
                    firstSortType: 'desc',
                    thClass: 'text-nowrap',
                    tdClass: 'text-nowrap',
                },
                {
                    label: this.$t('str.table.reports.column.name'),
                    field: 'name',
                    width: '85%',
                    sortable: true,
                    firstSortType: 'desc',
                    thClass: 'text-nowrap',
                    tdClass: 'text-nowrap',
                },
            ]

            this.paginationOptions = {
                enabled: true,
                mode: 'records',
                perPage: 15,
                position: 'bottom',
                perPageDropdown: [15, 50, 100, 200, 500, 1000, 5000, 10000],
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
        updateRangeDate: function (start, end) {
            const startDate = moment(start).utc(true).subtract(0, 'days')
            const endDate = moment(end).utc(true)

            this.dateRange.range = {
                startDate: startDate,
                endDate: endDate,
            }
        },
        clearFilters: async function () {
            this.errors = []
            this.isLoading = false
            this.filters = {
                account: '',
                client: '',
                site: '',
                status: 'ACTIVE',
            }
            this.items = []
            this.initRangeDate()
            this.filters.account = Common.getAccountId(this)
        },
        initRangeDate: async function () {
            const startDate = moment().utc(true).subtract(0, 'days')
            const endDate = moment().utc(true)
            const today = moment().utc(true)
            const yesterday = moment().utc(true).subtract(1, 'days')
            const thisMonthStart = moment().utc(true).startOf('month')

            this.dateRange = {
                opens: 'right',
                singleDatePicker: false,
                timePicker: false,
                timePicker24Hour: false,
                showWeekNumbers: false,
                showDropdowns: true,
                autoApply: true,
                linkedCalendars: true,
                closeOnEsc: true,
                range: {
                    startDate: startDate,
                    endDate: endDate,
                },
                maxDate: moment().utc(true).format(),
                sampleLocaleData: {
                    direction: 'ltr',
                    format: 'dd/mm/yyyy',
                    separator: ' - ',
                    applyLabel: this.$t('str.apply'),
                    cancelLabel: this.$t('str.cancel'),
                    weekLabel: 'W',
                    ranges: {
                        [this.$t('str.today')]: [today, today],
                        [this.$t('str.yesterday')]: [yesterday, yesterday],
                        [this.$t('str.this_month')]: [thisMonthStart, today], // alterado para hoje
                        [this.$t('str.this_year')]: [moment().utc(true).startOf('year'), today], // alterado para hoje
                        [this.$t('str.last_month')]: [moment().utc(true).subtract(1, 'month').startOf('month'), moment().utc(true).subtract(1, 'month').endOf('month')],
                    },
                    daysOfWeek: [
                        this.$t('str.abbreviation.sunday'),
                        this.$t('str.abbreviation.monday'),
                        this.$t('str.abbreviation.tuesday'),
                        this.$t('str.abbreviation.wednesday'),
                        this.$t('str.abbreviation.thursday'),
                        this.$t('str.abbreviation.friday'),
                        this.$t('str.abbreviation.saturday'),
                    ],
                    monthNames: [
                        this.$t('str.abbreviation.january'),
                        this.$t('str.abbreviation.february'),
                        this.$t('str.abbreviation.march'),
                        this.$t('str.abbreviation.april'),
                        this.$t('str.abbreviation.may'),
                        this.$t('str.abbreviation.june'),
                        this.$t('str.abbreviation.july'),
                        this.$t('str.abbreviation.august'),
                        this.$t('str.abbreviation.september'),
                        this.$t('str.abbreviation.october'),
                        this.$t('str.abbreviation.november'),
                        this.$t('str.abbreviation.december'),
                    ],
                    firstDay: 0,
                },
            }
        },
        selectItem(params) {
            const data = JSON.parse(JSON.stringify(params.row))

            delete data.vgt_id
            delete data.originalIndex

            this.selectedItem = data
            this.$bvModal.show('infoItemModal')
        },
        changeAccount: async function () {
            const account = this.filters.account

            if (account === '') {
                this.filters.client = ''
                this.filters.site = ''
            }
            this.clients = await Services.getClientsByAccount(this, account)
        },
        changeClient: async function () {
            const client = this.filters.client

            if (this.filters.site && this.filters.site !== '') {
                this.filters.site = ''
            }

            this.sites = await Services.getSitesByClient(this, client)
            this.vigilants = await Services.getVigilantsByClient(this, client)
        },
        changeSite: async function () {
            if (this.filters.vigilant && this.filters.vigilant !== '') {
                this.filters.vigilant = ''
            }
            this.vigilants = await Services.getVigilantsBySite(this, this.filters.site)
        },
        updateValues(d) {
            this.filters.startDate = new Date(d.startDate)
            this.filters.endDate = new Date(d.endDate)
        },
        getStatusName: Common.getEventStatusName,
        formatDate: Common.formatDateAndTime,
    },
}
</script>
