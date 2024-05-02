<script>
import Endpoints from '../../../common/Endpoints.vue'
import Request from '../../../common/Request.vue'
import Common from '../../../common/Common.vue'
import moment from 'moment'

export default {
    init: async payload => {
        payload.initRangeDate()
        payload.initTable()

        payload.isSuperAdminMaster = await Common.isSuperAdminMaster(payload)
    },
    methods: {
        filter: async function () {
            this.isLoading = true
            this.items = []

            const filtersWithPagination = {
                ...this.filters,
                skip: this.currentPage,
                limit: this.paginationOptions.perPage,
            }

            Request.do(
                this,
                'POST',
                Request.getDefaultHeader(this),
                filtersWithPagination,
                `${Endpoints.integrationLogs.filter}`,
                response => {
                    this.items = response?.results[0]?.paginatedResults

                    // Calculate totalPages based on totalCount
                    this.totalItems = response?.results[0]?.totalCount[0]?.count
                    this.totalPages = Math.ceil(response?.results[0]?.totalCount[0]?.count / this.paginationOptions.perPage)
                    this.isLoading = false
                },
                error => {
                    this.isLoading = false
                    console.log(error)
                },
            )
        },
        onPageChange(pageNumber) {
            this.currentPage = pageNumber?.currentPage - 1
            this.filter()
        },
        initTable() {
            this.columns = [
                {
                    label: this.$t('str.table.actions.log.column.substatus'),
                    field: 'substatus',
                    width: '8%',
                    sortable: true,
                    firstSortType: 'desc',
                    thClass: 'text-nowrap',
                    tdClass: 'text-nowrap',
                },
                {
                    label: this.$t('str.table.actions.log.column.creat.at'),
                    field: 'createDate',
                    width: '10%',
                    tdClass: 'text-nowrap',
                    thClass: 'text-nowrap',
                },
                {
                    label: this.$t('str.table.actions.log.column.message'),
                    field: 'message',
                    width: '82%',
                    sortable: true,
                    thClass: 'text-nowrap',
                    tdClass: 'text-nowrap',
                },
            ]
            this.paginationOptions = {
                enabled: true,
                mode: 'records',
                perPage: 25,
                position: 'bottom',
                perPageDropdown: [25, 50, 100, 1000],
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
            const startDate = moment().utc(false).subtract(0, 'days')
            const endDate = moment().utc(false)
            const today = moment().utc(false)
            const yesterday = moment().utc(false).subtract(1, 'days')
            const thisMonthStart = moment().utc(false).startOf('month')

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
                maxDate: moment().utcOffset(-3),
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
        updateRangeDate: function (start, end) {
            const startDate = moment(start).utc(true).subtract(0, 'days')
            const endDate = moment(end).utc(true)

            this.dateRange.range = {
                startDate: startDate,
                endDate: endDate,
            }
        },
        async updateValues(d) {
            this.filters.startDate = moment(d.startDate).utc(true)
            this.filters.endDate = moment(d.endDate).utc(true)
            await this.filter()
        },
        formatDate: Common.formatDateAndTime,
    },
}
</script>
