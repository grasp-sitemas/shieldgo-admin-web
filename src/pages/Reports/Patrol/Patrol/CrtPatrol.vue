<script>
import Common from '../../../../common/Common.vue'
import Services from '../../../../common/Services.vue'
import moment from 'moment'

export default {
    init: async payload => {
        await Promise.all([payload.initRangeDate()])

        payload.columns = payload.columns || []

        const [isSuperAdminMaster, role] = await Promise.all([Common.isSuperAdminMaster(payload), Common.getSubtype(payload)])

        payload.isSuperAdminMaster = isSuperAdminMaster
        payload.role = role
        payload.filters.startDate = moment().utc(false)

        if (role === 'SUPER_ADMIN_MASTER') {
            payload.accounts = await Services.getAccounts(payload)
        } else if (role === 'ADMIN' || role === 'MANAGER') {
            const [clients, logoURL] = await Promise.all([Services.getClients(payload), Common.getAccountLogoURL(payload)])
            payload.clients = clients
            payload.logoURL = logoURL
            payload.filters.account = Common.getAccountId(payload)
        } else if (['MANAGER', 'OPERATOR', 'AUDITOR'].includes(role)) {
            const client = await Common.getClientId(payload)
            payload.filters.client = client
            payload.sites = await Services.getSites(payload)
        }
    },
    methods: {
        async filter() {
            if (this.isSearchLoading) return

            if (this.role === 'SUPER_ADMIN_MASTER' && !this.filters.account) {
                Common.show(this, 'top-right', 'warn', this.$t('str.charts.select.account.required'))
                return
            }

            this.isSearchLoading = true
            this.items = []

            try {
                const results = await Services.filterReports(this, this.filters)

                this.items = results?.tableItems
                this.reportItems = results?.reportItems

                this.isSearchLoading = false
            } catch (error) {
                this.isSearchLoading = false
                this.errors = []
                this.items = []
            }
        },
        changeReportType: function () {
            this.errors = []
            this.isSearchLoading = false
            this.items = []
            this.reportItems = []
        },
        async checkFilters() {
            this.errors = []

            if (this.filters?.account === '' || !this.filters?.account) {
                this.errors.push('account')
            }

            if (this.errors.length === 0) {
                await this.filter()
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
            this.isSearchLoading = false

            this.$router.push({ path: '/reports/patrols' })

            this.filters = {
                account: '',
                client: '',
                site: '',
                vigilant: '',
                startDate: moment().utc(true).format('YYYY-MM-DD'),
                endDate: moment().utc(true).format('YYYY-MM-DD'),
                report: '',
            }
            this.filters.account = Common.getAccountId(this)
        },
        checkRequiredField(field) {
            return this.errors.includes(field)
        },
        removeRequiredField(field) {
            this.errors = this.errors.filter(item => item !== field)
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
        changeAccount: async function () {
            const account = this.filters.account

            if (account === '') {
                this.filters.client = ''
                this.filters.site = ''
            }
            this.logoURL = await Common.getAccountLogoURL(this, account)
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
            this.filters.startDate = moment(d.startDate).utc(true)
            this.filters.endDate = moment(d.endDate).utc(true)
        },
        formatDate: Common.formatDate,
        getStatusName: Common.getEventStatusName,
    },
}
</script>
