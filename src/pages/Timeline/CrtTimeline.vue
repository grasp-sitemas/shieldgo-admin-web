<script>
import Common from '../../common/Common.vue'
import Services from '../../common/Services.vue'
import moment from 'moment'

export default {
    init: async payload => {
        payload.isSuperAdminMaster = await Common.isSuperAdminMaster(payload)
        if (payload.isSuperAdminMaster) {
            payload.accounts = await Services.getAccounts(payload)
        } else {
            payload.clients = await Services.getClients(payload)
        }
        await payload.initTable()

        payload.filter()
    },
    methods: {
        async filter() {
            this.isLoading = true
            this.items = await Services.getEventsByDate(this, this.filters)
            this.isLoading = false
        },
        initTable() {
            this.columns = [
                {
                    label: this.$t('str.table.timeline.column.vigilant'),
                    field: 'vigilant',
                    width: '15%',
                    sortable: true,
                    firstSortType: 'desc',
                    thClass: 'text-nowrap',
                    tdClass: 'text-nowrap',
                },
                {
                    label: this.$t('str.table.timeline.column.starts.in'),
                    field: 'startDate',
                    type: 'date',
                    dateInputFormat: "yyyy-MM-dd'T'HH:mm:ss.SSSSSSSxxx",
                    dateOutputFormat: 'dd/MM/yyyy HH:mm:ss',
                    width: '10%',
                    tdClass: 'text-center text-nowrap',
                    thClass: 'text-center text-nowrap',
                },
                {
                    label: this.$t('str.table.timeline.column.ends.in'),
                    field: 'endDate',
                    type: 'date',
                    dateInputFormat: "yyyy-MM-dd'T'HH:mm:ss.SSSSSSSxxx",
                    dateOutputFormat: 'dd/MM/yyyy HH:mm:ss',
                    width: '10%',
                    tdClass: 'text-center text-nowrap',
                    thClass: 'text-center text-nowrap',
                },
                {
                    label: this.$t('str.table.timeline.column.patrol.points'),
                    field: 'patrolPoints',
                    width: '20%',
                    sortable: true,
                    thClass: 'text-nowrap',
                    tdClass: 'text-nowrap',
                },
                {
                    label: this.$t('str.table.timeline.column.status'),
                    field: 'status',
                    width: '15%',
                    sortable: true,
                    thClass: 'text-nowrap',
                    tdClass: 'text-nowrap',
                },
                {
                    label: this.$t('str.table.timeline.column.account'),
                    field: 'account',
                    width: '15%',
                    thClass: 'text-nowrap',
                    tdClass: 'text-nowrap',
                },
                {
                    label: this.$t('str.table.timeline.column.client'),
                    field: 'client',
                    width: '10%',
                    thClass: 'text-nowrap',
                    tdClass: 'text-nowrap',
                },
                {
                    label: this.$t('str.table.timeline.column.site'),
                    field: 'site',
                    width: '10%',
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

            if (!this.isSuperAdminMaster) {
                this.columns.splice(5, 1)
            }
        },
        initRangeDate() {
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
                    startDate: moment().subtract(7, 'days'),
                    endDate: moment(),
                    prevStartDate: moment().subtract('days', 15).format('D MMMM'),
                    prevEndDate: moment().subtract('days', 8).format('D MMMM YYYY'),
                },
                sampleLocaleData: {
                    direction: 'ltr',
                    format: 'mm/dd/yyyy',
                    separator: ' - ',
                    applyLabel: this.$t('str.apply'),
                    cancelLabel: this.$t('str.cancel'),
                    weekLabel: 'W',
                    customRangeLabel: this.$t('str.custom.range'),
                    // daysOfWeek: [this.$t('str.sunday'), this.$t('str.monday'), this.$t('str.tuesday'), this.$t('str.wednesday'), this.$t('str.thursday'), this.$t('str.friday'), this.$t('str.saturday')],
                    // monthNames: [
                    //     this.$t('str.january'),
                    //     this.$t('str.february'),
                    //     this.$t('str.march'),
                    //     this.$t('str.april'),
                    //     this.$t('str.may'),
                    //     this.$t('str.june'),
                    //     this.$t('str.july'),
                    //     this.$t('str.august'),
                    //     this.$t('str.september'),
                    //     this.$t('str.october'),
                    //     this.$t('str.november'),
                    //     this.$t('str.december'),
                    // ],
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
    },
}
</script>
