<script>
import Common from '../../../common/Common.vue'
import Services from '../../../common/Services.vue'
import moment from 'moment'
import Endpoints from '../../../common/Endpoints.vue'
const domain = Endpoints.domain

export default {
    init: async payload => {
        setTimeout(async () => {
            payload.isSuperAdminMaster = await Common.isSuperAdminMaster(payload)

            await payload.initTable()
            await payload.initRangeDate()

            const role = await Common.getSubtype(payload)
            if (role === 'SUPER_ADMIN_MASTER') {
                payload.accounts = await Services.getAccounts(payload)
            } else if (role === 'ADMIN' || role === 'MANAGER') {
                payload.clients = await Services.getClients(payload)
            } else if (role === 'MANAGER' || role === 'OPERATOR') {
                const client = await Common.getClientId(payload)
                payload.filters.client = client
                payload.sites = await Services.getSites(payload)
            }

            if (!payload.isSuperAdminMaster) {
                payload.columns.splice(4, 1)
            }

            payload.jsonFields = payload.JSON_FIELDS_CSV.incident[payload.$i18n.locale].json_fields
            payload.jsonData = [payload.JSON_FIELDS_CSV.incident[payload.$i18n.locale].json_data]
            payload.jsonMeta = [payload.JSON_FIELDS_CSV.incident[payload.$i18n.locale].json_meta]
            payload.filename = payload.JSON_FIELDS_CSV.incident[payload.$i18n.locale].filename
            payload.jsonTitle = payload.JSON_FIELDS_CSV.incident[payload.$i18n.locale].title
            payload.pdfTitle = payload.JSON_FIELDS_CSV.incident[payload.$i18n.locale].pdfTitle
            payload.pdfHeader = payload.PDF_HEADER[payload.$i18n.locale]

            payload.role = role
            payload.isLoading = false
        }, 1000)
    },
    methods: {
        async filter() {
            this.items = []
            const results = await Services.incidents(this, this.filters)

            const { tableItems, reportItems } = results

            if (tableItems && tableItems.length > 0 && reportItems && reportItems.length > 0) {
                this.isSearchLoading = true

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
                    const photoURL = item?.photoURL ? domain + item.photoURL : ' '
                    const signatureURL = item?.signatureURL ? domain + item.signatureURL : ' '

                    return {
                        date: item.date,
                        vigilant: item.vigilant,
                        latitude: latitude,
                        longitude: longitude,
                        deviceInfoBrand: brand,
                        deviceInfoModel: model,
                        isAttendance: isAttendance,
                        attendanceStatus: attendanceStatus,
                        operator: item.attendance?.operator,
                        openedDate: openedDate,
                        closedDate: closedDate,
                        photoURL: photoURL,
                        signatureURL: signatureURL,
                        client: item.client,
                        site: item.site,
                    }
                })

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
                    label: this.$t('str.table.reports.column.geolocation'),
                    field: 'geolocation',
                    width: '10%',
                    sortable: true,
                    thClass: 'text-nowrap',
                    tdClass: 'text-nowrap',
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
                startDate: moment().utc(true),
                endDate: moment().utc(true),
                report: 'INCIDENTS',
            }
            this.items = []
            this.initRangeDate()
            this.filters.account = Common.getAccountId(this)
        },
        initRangeDate: async function () {
            const startDate = moment().subtract(0, 'days')
            const endDate = moment()
            const prevStartDate = moment().subtract(15, 'days').format('D MMMM YYYY')
            const prevEndDate = moment().subtract(8, 'days').format('D MMMM YYYY')

            this.dateRange = {
                opens: 'right',
                singleDatePicker: false,
                timePicker: false,
                timePicker24Hour: false,
                showWeekNumbers: false,
                showDropdowns: false,
                autoApply: false,
                linkedCalendars: false,
                range: {
                    startDate: startDate,
                    endDate: endDate,
                    prevStartDate: prevStartDate,
                    prevEndDate: prevEndDate,
                },
                sampleLocaleData: {
                    direction: 'ltr',
                    format: 'dd/mm/yyyy',
                    separator: ' - ',
                    applyLabel: this.$t('str.apply'),
                    cancelLabel: this.$t('str.cancel'),
                    weekLabel: 'W',
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
