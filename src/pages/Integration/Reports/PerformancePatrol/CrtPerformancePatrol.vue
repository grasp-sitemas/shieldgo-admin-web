<script>
import Common from '../../../../common/Common.vue'
import Services from '../../../../common/Services.vue'
import moment from 'moment'

export default {
    init: async payload => {
        payload.isSuperAdminMaster = Common.isSuperAdminMaster(payload)
        payload.initRangeDate()

        payload.userLocale = payload.$i18n.locale === 'pt' ? 'pt-br' : 'en'

        if (payload.isSuperAdminMaster) {
            try {
                payload.companies = await Services.getExternalCompanies(payload)
            } catch (error) {
                console.log(error)
                payload.companies = await Services.getGatewayExternalCompanies(payload)
            }
        } else {
            const companyLegacy = await Common.getLegacyAccount(payload)
            if (companyLegacy?.companyLegacyId) {
                payload.selectedSite = {
                    _id: '',
                }

                payload.sites = await Services.getExternalSites(payload, {
                    companyLegacyId: companyLegacy?.companyLegacyId,
                    sqlLegacyBase: companyLegacy?.sqlLegacyBase,
                })
            } else {
                Common.show(payload, 'top-right', 'error', payload.$t('str.contact.admin.to.assign.account'))
            }
        }

        payload.isLoading = false
    },
    methods: {
        async filter() {
            if (!this.isSuperAdminMaster && !this.filters.companyLegacyId) {
                Common.show(this, 'top-right', 'error', this.$t('str.contact.admin.to.assign.account'))
                return
            }

            if (!this.filters.companyLegacyId) {
                Common.show(this, 'top-right', 'error', this.$t('str.select.account'))
                return
            }

            if (!this.isSearchLoading) {
                this.isSearchLoading = true

                this.items = null
                this.dailyItems = null

                const result = await Services.externalAnalysisPatrol(this, this.filters)

                if (result) {
                    this.summary = result?.summary
                    this.dailyItems = result?.daily
                    this.items = result?.items
                }

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
            this.isSearchLoading = false
            this.selectedCompany = {
                _id: '',
            }

            this.selectedSite = {
                _id: '',
            }
            this.sites = []
            this.filters = {
                report: 'EXTERNAL_DAILY_PERFORMANCE_PATROLS',
                searchAllPatrolPerform: true,
                startDate: moment().utc(true),
                endDate: moment().utc(true),
            }
            this.items = null
            this.dailyItems = null
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

            const deptID = company?.deptID
            const database = company?.database

            this.selectedSite = {
                _id: '',
            }

            this.sites = await Services.getExternalSites(this, {
                companyLegacyId: deptID,
                sqlLegacyBase: database,
            })
        },
        changeLocal: async function () {
            const uniqueID = this.selectedSite?._id

            const site = this?.sites?.find(item => item?._id === uniqueID)

            this.filters.companyLegacyId = site?.deptID
            this.filters.sqlLegacyBase = site?.database
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
