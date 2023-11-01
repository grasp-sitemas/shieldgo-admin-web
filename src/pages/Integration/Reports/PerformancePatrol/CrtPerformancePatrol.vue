<script>
import Common from '../../../../common/Common.vue'
import Services from '../../../../common/Services.vue'
import moment from 'moment'

export default {
    init: async payload => {
        payload.isSuperAdminMaster = Common.isSuperAdminMaster(payload)

        if (payload.isSuperAdminMaster) {
            payload.companies = await Services.getExternalCompanies(payload)
        }

        payload.initRangeDate()
        payload.isLoading = false
    },
    methods: {
        async filter() {
            if (!this.isSearchLoading) {
                this.isSearchLoading = true

                this.items = []
                this.dailyItems = []

                const filters = this.filters

                filters.report = 'EXTERNAL_PERFORMANCE_PATROLS'
                this.items = await Services.externalAnalysisPatrol(this, filters)

                filters.report = 'EXTERNAL_DAILY_PERFORMANCE_PATROLS'
                this.dailyItems = Services.externalAnalysisPatrol(this, filters)

                this.isSearchLoading = false
            }
        },
        showMap(data) {
            this.selectedItem = data
            this.$bvModal.show('mapModal')
        },
        clearFilters: async function () {
            this.errors = []
            this.isLoading = false
            this.selectedCompany = {
                _id: '',
            }
            this.filters = {
                report: 'EXTERNAL_DAILY_PERFORMANCE_PATROLS',
                startDate: moment().utc(true),
                endDate: moment().utc(true),
                sqlLegacyBase: '',
                companyLegacyId: '',
            }
            this.items = []
            this.csvItems = []
            this.initRangeDate()
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
        changeCompany: async function () {
            const uniqueID = this.selectedCompany?._id

            const company = this?.companies?.find(item => item?._id === uniqueID)

            this.filters.companyLegacyId = company?.deptID
            this.filters.sqlLegacyBase = company?.database
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
