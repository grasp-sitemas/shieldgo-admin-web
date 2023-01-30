<script>
import Common from '../../common/Common.vue'
import Services from '../../common/Services.vue'
import moment from 'moment'

export default {
    init: async payload => {
        payload.initRangeDate()

        payload.isSuperAdminMaster = await Common.isSuperAdminMaster(payload)

        await payload.initTable()

        if (!payload.isSuperAdminMaster) {
            payload.columns.splice(5, 1)
        }

        const role = await Common.getSubtype(payload)
        if (role === 'SUPER_ADMIN_MASTER') {
            payload.accounts = await Services.getAccounts(payload)
        } else if (role === 'ADMIN') {
            payload.clients = await Services.getClients(payload)
        } else if (role === 'MANAGER' || role === 'OPERATOR') {
            const client = await Common.getClientId(payload)
            payload.filters.client = client
            payload.sites = await Services.getSites(payload)
        }
        payload.role = role
        payload.filter()
    },
    methods: {
        async filter() {
            this.isLoading = true
            this.items = []

            // if status is expired the set isDescSortByStartDate to true
            if (this.filters.status === 'EXPIRED' || this.filters.status === 'DONE') {
                this.filters.isDescSortByStartDate = true
                this.filters.isSortByStartDate = false
            } else {
                this.filters.isSortByStartDate = true
                this.filters.isDescSortByStartDate = false
            }

            this.items = await Services.getEventsByDate(this, this.filters)
            this.isLoading = false
        },
        async initTable() {
            this.columns = [
                {
                    label: this.$t('str.table.timeline.column.name'),
                    field: 'name',
                    width: '10%',
                    sortable: true,
                    firstSortType: 'desc',
                    thClass: 'text-nowrap',
                    tdClass: 'text-nowrap',
                },
                {
                    label: this.$t('str.table.timeline.column.vigilant'),
                    field: 'vigilant',
                    width: '10%',
                    sortable: true,
                    firstSortType: 'desc',
                    thClass: 'text-nowrap',
                    tdClass: 'text-nowrap',
                },
                {
                    label: this.$t('str.table.timeline.column.starts.in'),
                    field: 'startDate',
                    width: '10%',
                    sortable: true,
                    tdClass: 'text-nowrap',
                    thClass: 'text-nowrap',
                },
                {
                    label: this.$t('str.table.timeline.column.ends.in'),
                    field: 'endDate',
                    width: '10%',
                    sortable: true,
                    tdClass: 'text-nowrap',
                    thClass: 'text-nowrap',
                },
                // {
                //     label: this.$t('str.table.timeline.column.patrol.points'),
                //     field: 'patrolPoints',
                //     width: '20%',
                //     sortable: true,
                //     thClass: 'text-nowrap',
                //     tdClass: 'text-nowrap',
                // },
                {
                    label: this.$t('str.table.timeline.column.status'),
                    field: 'status',
                    width: '10%',
                    sortable: true,
                    thClass: 'text-nowrap',
                    tdClass: 'text-nowrap',
                },
                {
                    label: this.$t('str.table.timeline.column.account'),
                    field: 'account',
                    width: '10%',
                    sortable: true,
                    thClass: 'text-nowrap',
                    tdClass: 'text-nowrap',
                },
                {
                    label: this.$t('str.table.timeline.column.client'),
                    field: 'client',
                    width: '10%',
                    sortable: true,
                    thClass: 'text-nowrap',
                    tdClass: 'text-nowrap',
                },
                {
                    label: this.$t('str.table.timeline.column.site'),
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
                perPageDropdown: [15, 50, 100],
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
            this.filter()
            this.clients = await Services.getClientsByAccount(this, account)
        },
        changeClient: async function () {
            const client = this.filters.client

            if (client === '') {
                this.filters.site = ''
            }

            this.filter()
            this.sites = await Services.getSitesByClient(this, client)
        },
        changeSite: async function () {
            this.filter()
        },
        updateValues(d) {
            this.filters.startDate = new Date(d.startDate)
            this.filters.endDate = new Date(d.endDate)
            this.filter()
        },
        getStatusName: Common.getEventStatusName,
        formatDate: Common.formatDateAndTime,
    },
}
</script>
