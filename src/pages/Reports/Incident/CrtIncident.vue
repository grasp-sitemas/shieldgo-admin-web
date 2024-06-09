<script>
import Common from '../../../common/Common.vue'
import Services from '../../../common/Services.vue'
import moment from 'moment'
import Endpoints from '../../../common/Endpoints.vue'
const domain = Endpoints.domain

export default {
    init: async payload => {
        await Promise.all([payload.initRangeDate(), payload.initTable()])

        payload.columns = payload.columns || []

        const [isSuperAdminMaster, role] = await Promise.all([Common.isSuperAdminMaster(payload), Common.getSubtype(payload)])

        payload.isSuperAdminMaster = isSuperAdminMaster
        payload.role = role

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

        if (!isSuperAdminMaster || role === 'AUDITOR') {
            if (payload.columns.length > 6) {
                payload.columns.splice(6, 1)
            }
        }

        const localeData = payload.JSON_FIELDS_CSV.incident[payload.$i18n.locale]
        payload.jsonFields = localeData.json_fields
        payload.jsonData = [localeData.json_data]
        payload.jsonMeta = [localeData.json_meta]
        payload.filename = localeData.filename
        payload.jsonTitle = localeData.title
        payload.pdfTitle = localeData.pdfTitle
        payload.pdfHeader = payload.PDF_HEADER[payload.$i18n.locale]

        payload.isLoading = false
    },
    methods: {
        async filter() {
            if (!this.isSearchLoading) {
                if (this.role === 'SUPER_ADMIN_MASTER' && !this.filters.account) {
                    Common.show(this, 'top-right', 'warn', this.$t('str.charts.select.account.required'))
                    return
                }

                this.items = []
                this.csvItems = []

                this.isSearchLoading = true

                const results = await Services.incidents(this, this.filters)

                if (!results) {
                    this.isSearchLoading = false
                    return
                }

                const { tableItems, reportItems } = results

                if (tableItems && tableItems.length > 0 && reportItems && reportItems.length > 0) {
                    const items = tableItems
                    this.items = items
                    this.reportItems = reportItems

                    this.csvItems = items.map(item => {
                        const latitude = item.geolocation?.latitude ? String(item.geolocation.latitude) : ' '
                        const longitude = item.geolocation?.longitude ? String(item.geolocation.longitude) : ' '
                        const brand = item.deviceInfo?.brand ? String(item.deviceInfo.brand) : ' '
                        const model = item.deviceInfo?.model ? String(item.deviceInfo.model) : ' '
                        const isAttendance = item?.attendance?.isAttendance ? this.$t('str.yes') : this.$t('str.no')
                        const attendanceStatus = item?.attendance?.status ? this.$t(item.attendance.status) : ' '
                        const openedDate = item?.attendance?.openedDate && item?.attendance?.openedDate?.length > 0 ? moment(item.attendance.openedDate).format('DD/MM/YYYY HH:mm:ss') : ' '
                        const closedDate = item?.attendance?.closedDate && item?.attendance?.closedDate?.length > 0 ? moment(item.attendance.closedDate).format('DD/MM/YYYY HH:mm:ss') : ' '
                        const photoURL = item?.medias?.photoURL ? `${domain}${item.medias?.photoURL}` : ' '
                        const signatureURL = item?.medias?.signatureURL ? `${domain}${item.medias?.signatureURL}` : ' '
                        const soundURL = item?.medias?.soundURL ? `${domain}${item.medias?.soundURL}` : ' '
                        const event = item?.event ? item.event : ' '
                        const incidents = item?.incidents ? item.incidents.map(incident => incident.name).join(', ') : ' '

                        return {
                            date: item.date,
                            vigilant: item.vigilant,
                            event: event,
                            latitude: latitude,
                            longitude: longitude,
                            deviceInfoBrand: brand,
                            deviceInfoModel: model,
                            isAttendance: isAttendance,
                            attendanceStatus: attendanceStatus,
                            operator: item.attendance?.operator,
                            openedDate: openedDate,
                            closedDate: closedDate,
                            soundURL: soundURL,
                            photoURL: photoURL,
                            signatureURL: signatureURL,
                            incidents: item?.incidents ? item.incidents : ' ',
                            incidentsCsv: incidents,
                            client: item.client,
                            site: item.site,
                        }
                    })
                }
                this.isSearchLoading = false
            }
        },
        async initTable() {
            this.columns = [
                {
                    label: this.$t('str.table.reports.column.date'),
                    field: 'date',
                    width: '10%',
                    sortable: true,
                    thClass: 'text-nowrap',
                    tdClass: 'text-nowrap',
                },
                {
                    label: this.$t('str.table.reports.column.incidents'),
                    field: 'incidents',
                    width: '10%',
                    sortable: false,
                    thClass: 'text-nowrap',
                    tdClass: 'text-nowrap',
                },
                {
                    label: this.$t('str.table.reports.column.gps'),
                    field: 'geolocation',
                    width: '5%',
                    sortable: true,
                    thClass: 'text-nowrap',
                    tdClass: 'text-nowrap',
                },
                {
                    label: this.$t('str.timeline.item.patrol.actions.medias'),
                    field: 'medias',
                    tdClass: 'text-nowrap',
                    thClass: 'text-nowrap',
                    width: '5%',
                },
                {
                    label: this.$t('str.table.reports.column.event'),
                    field: 'event',
                    width: '10%',
                    sortable: true,
                    thClass: 'text-nowrap',
                    tdClass: 'text-nowrap',
                },
                {
                    label: this.$t('str.table.reports.column.attendance'),
                    field: 'attendance',
                    width: '10%',
                    sortable: true,
                    tdClass: 'text-nowrap',
                    thClass: 'text-nowrap',
                },
                {
                    label: this.$t('str.table.reports.column.account'),
                    field: 'account',
                    width: '10%',
                    sortable: true,
                    thClass: 'text-nowrap',
                    tdClass: 'text-nowrap',
                },
                {
                    label: this.$t('str.table.reports.column.client'),
                    field: 'client',
                    width: '10%',
                    sortable: true,
                    thClass: 'text-nowrap',
                    tdClass: 'text-nowrap',
                },
                {
                    label: this.$t('str.table.reports.column.site'),
                    field: 'site',
                    width: '10%',
                    sortable: true,
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
        clearFilters: async function () {
            this.errors = []
            this.isLoading = false
            this.filters = {
                account: '',
                client: '',
                site: '',
                vigilant: '',
                incidentPriority: '',
                startDate: moment().utc(true),
                endDate: moment().utc(true),
                report: 'INCIDENTS',
            }
            this.items = []
            this.csvItems = []
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
        showMap(data) {
            this.selectedItem = data
            this.$bvModal.show('mapModal')
        },
        showPhoto(data) {
            this.selectedItem = data
            this.$bvModal.show('photoModal')
        },
        showSignature(data) {
            this.selectedItem = data
            this.$bvModal.show('signatureModal')
        },
        showSound(data) {
            this.selectedItem = data
            this.$bvModal.show('soundModal')
        },
        getLogoAccount: async function (id, accounts) {
            const account = accounts.find(account => account._id === id)
            return account && account.logoURL ? `${domain}${account.logoURL}` : ''
        },
        changeAccount: async function () {
            const account = this.filters.account

            if (account === '') {
                this.filters.client = ''
                this.filters.site = ''
            }

            this.logoURL = await this.getLogoAccount(account, this.accounts)
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
