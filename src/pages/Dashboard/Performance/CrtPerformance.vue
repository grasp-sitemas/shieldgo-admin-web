<script>
import Common from '../../../common/Common.vue'
import Services from '../../../common/Services.vue'
import moment from 'moment'

export default {
    init: async payload => {
        await payload.initRangeDate()

        payload.filters.account = Common.getAccountId(payload)
        payload.isSuperAdminMaster = await Common.isSuperAdminMaster(payload)

        const role = await Common.getSubtype(payload)
        payload.role = role

        if (role === 'SUPER_ADMIN_MASTER') {
            payload.accounts = await Services.getAccounts(payload)
        } else if (role === 'ADMIN' || role === 'MANAGER') {
            payload.clients = await Services.getClients(payload)
        } else if (role === 'MANAGER' || role === 'OPERATOR' || role === 'AUDITOR') {
            const client = await Common.getClientId(payload)
            payload.filters.client = client
            payload.sites = await Services.getSites(payload)
        }
    },
    methods: {
        async filter() {
            if (this.isLoading) return

            if (this.role === 'SUPER_ADMIN_MASTER' && !this.filters.account) {
                Common.show(this, 'top-right', 'warn', this.$t('str.charts.select.account.required'))
                return
            }

            this.clearCharts()
            this.isLoading = true

            try {
                const [localsPerformance, guardsPerformance] = await Promise.all([Services.localsPerformance(this, this.filters), Services.guardsPerformance(this, this.filters)])

                this.localsPerformance = localsPerformance
                this.guardsPerformance = guardsPerformance
            } catch (error) {
                console.error('Error loading charts data:', error)
            } finally {
                this.isLoading = false
            }
        },
        clearCharts() {
            this.localsPerformance = []
            this.guardsPerformance = []
        },
        async updateValues(d) {
            this.filters.startDate = moment(d.startDate).utc(true)
            this.filters.endDate = moment(d.endDate).utc(true)
            await this.filter()
        },

        initRangeDate: async function () {
            const startDate = moment().subtract(0, 'days')
            const endDate = moment()
            const prevStartDate = moment().subtract(15, 'days').format('D MMMM YYYY')
            const prevEndDate = moment().subtract(8, 'days').format('D MMMM YYYY')
            const today = moment()
            const yesterday = moment().subtract(1, 'days')
            const thisMonthStart = moment().startOf('month')

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
                    prevStartDate: prevStartDate,
                    prevEndDate: prevEndDate,
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
                        [this.$t('str.this_year')]: [moment().startOf('year'), today], // alterado para hoje
                        [this.$t('str.last_month')]: [moment().subtract(1, 'month').startOf('month'), moment().subtract(1, 'month').endOf('month')],
                        // [this.$t('str.today')]: [today, today],
                        // [this.$t('str.yesterday')]: [yesterday, yesterday],
                        // [this.$t('str.this_month')]: [thisMonthStart, thisMonthEnd],
                        // [this.$t('str.this_year')]: [moment().startOf('year'), moment().endOf('year')],
                        // [this.$t('str.last_month')]: [moment().subtract(1, 'month').startOf('month'), moment().subtract(1, 'month').endOf('month')],
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

            this.filters.client = ''
            this.filters.site = ''

            this.filter()
            this.clients = await Services.getClientsByAccount(this, account)
        },
        changeClient: async function () {
            const client = this.filters.client

            this.filters.site = ''

            this.filter()
            this.sites = await Services.getSitesByClient(this, client)
        },
        changeSite: async function () {
            this.filter()
        },
        getStatusName: Common.getEventStatusName,
        formatDate: Common.formatDate,
    },
}
</script>
