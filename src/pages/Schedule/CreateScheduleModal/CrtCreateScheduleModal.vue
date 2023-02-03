<script>
import Common from '../../../common/Common.vue'
import Services from '../../../common/Services.vue'
import Endpoints from '../../../common/Endpoints.vue'
import Request from '../../../common/Request.vue'
import Vue from 'vue'
Vue.prototype.$registerEvent = new Vue()

export default {
    init: async payload => {
        payload.initTable()
        if (!payload.isSuperAdminMaster) {
            payload.data.account = await Common.getAccountId(payload)
        }
    },
    methods: {
        checkRequiredField(field) {
            return this.errors.includes(field)
        },
        removeRequiredField(field) {
            this.errors = this.errors.filter(item => item !== field)
        },
        changeAccount: async function () {
            this.sites = []
            this.data.client = ''
            this.data.site = ''

            this.clearFields()

            const account = this.data.account
            this.clientList = await Services.getClientsByAccount(this, account)
        },
        changeClient: async function () {
            const client = this.data.client

            if (!client || client === '') {
                this.data.site = ''
            }

            this.clearFields()

            this.siteList = await Services.getSitesByClient(this, client)
        },
        changeSite: async function () {
            this.guardGroups = await Services.getGuardGroupsBySite(this, this.data.site)
            this.vigilants = await Services.getVigilantsBySite(this, this.data.site)
            this.patrolPoints = await Services.getPatrolPointsBySite(this, this.data.site)
            this.data.vigilants = []
        },
        changeGuardGroup: async function () {
            if (this.data.guardGroup) {
                const vigilants = await Services.getVigilantsByGuardGroup(this, this.data.guardGroup)
                this.vigilants = vigilants || []
                this.data.vigilants = vigilants || []
            } else {
                this.vigilants = await Services.getVigilantsBySite(this, this.data.site)
                this.data.vigilants = []
            }
        },
        save() {
            if (!this.isLoading) {
                this.isLoading = true

                try {
                    Request.do(
                        this,
                        this.data._id ? 'put' : 'post',
                        Request.getDefaultHeader(this),
                        this.data,
                        `${Endpoints.schedules.schedule}`,
                        response => {
                            if (response.status === 200) {
                                this.isLoading = false
                                this.$registerEvent.$emit('refreshSchedule')
                                this.$bvModal.hide('createScheduleModal')
                            }
                        },
                        error => {
                            this.isLoading = false
                            Common.show(this, 'bottom-right', 'warn', this.data._id ? this.$t('str.form.update.generic.error') : this.$t('str.form.save.generic.error'))
                            console.log(error)
                        },
                    )
                } catch (error) {
                    this.isLoading = false
                    Common.show(this, 'bottom-right', 'warn', this.data._id ? this.$t('str.form.update.generic.error') : this.$t('str.form.save.generic.error'))
                    console.log(error)
                }
            }
        },
        checkForm() {
            if (!this.data.account || this.data.account === '') {
                this.errors.push('account')
            }
            if (!this.data.client || this.data.client === '') {
                this.errors.push('client')
            }
            if (!this.data.site || this.data.site === '') {
                this.errors.push('site')
            }
            if (!this.data.name || this.data.name === '') {
                this.errors.push('name')
            }
            if (!this.data.vigilants || this.data.vigilants.length === 0) {
                this.errors.push('vigilants')
            }
            if (!this.data.beginDate || this.data.beginDate === '') {
                this.errors.push('beginDate')
            }
            if (!this.data.endDate || this.data.endDate === '') {
                this.errors.push('endDate')
            }
            if (!this.data.frequency || this.data.frequency === '') {
                this.errors.push('frequency')
            }
            if (!this.data.beginHour || this.data.beginHour === '') {
                this.errors.push('beginHour')
            }
            if (!this.data.endHour || this.data.endHour === '') {
                this.errors.push('endHour')
            }
            if (!this.data.points || this.data.points.length === 0) {
                this.errors.push('points')
            }

            if (this.data?.frequency === 'YEARLY' && (!this.data?.frequencyYear?.month || this.data?.frequencyYear?.month === '')) {
                this.errors.push('frequencyYearMonth')
            }

            if (this.data?.frequency === 'YEARLY' && (!this.data?.frequencyYear?.day || this.data?.frequencyYear?.day === '')) {
                this.errors.push('frequencyYearDay')
            }

            if (this.data?.frequency === 'MONTHLY' && (!this.data?.frequencyMonth?.day || this.data?.frequencyMonth?.day === '')) {
                this.errors.push('frequencyMonthDay')
            }

            // verify errors and if end date is greater than begin date and if range is smaller than one year
            if (!this.errors || (this.errors.length === 0 && this.checkRangeDate())) {
                if (!this.data.guardGroup || this.data.guardGroup === '') {
                    delete this.data.guardGroup
                }

                if (this.data.frequency === 'DAILY' || this.data.frequency === 'WEEKLY' || this.data.frequency === 'NOT_REPEAT') {
                    delete this.data.frequencyYear
                    delete this.data.frequencyMonth
                }

                this.data.beginDate = this.data.beginDate + 'T' + this.data?.beginHour + ':00.000Z'
                this.data.endDate = this.data.endDate + 'T' + this.data?.endHour + ':00.000Z'

                this.save()
            }
        },
        checkRangeDate: async function () {
            if (this.data.beginDate && this.data.endDate) {
                const beginDate = new Date(this.data.beginDate)
                const endDate = new Date(this.data.endDate)
                const diff = endDate.getTime() - beginDate.getTime()
                const diffDays = Math.ceil(diff / (1000 * 3600 * 24))
                if (diffDays < 0) {
                    // begin date is greater than end date
                    Common.show(this, 'bottom-right', 'warn', this.$t('str.form.schedule.error.begin.date.greater.than.end.date'))
                    return false
                } else if (diffDays > 365) {
                    // range is greater than one year
                    Common.show(this, 'bottom-right', 'warn', this.$t('str.form.schedule.error.range.greater.than.one.year'))
                    return false
                }
                return true
            }
            return false
        },
        confirmArchive() {
            this.$swal({
                title: this.$t('str.are.you.sure'),
                text: this.$t('str.are.you.sure.cancel.schedule'),
                showCancelButton: true,
                showDenyButton: true,
                buttonsStyling: false,
                confirmButtonText: this.$t('str.title.cancel.series'),
                cancelButtonClass: 'btn btn-default min-btn-width',
                denyButtonText: this.$t('str.title.cancel.occurrence'),
                confirmButtonClass: 'btn me-5px btn-danger min-btn-width',
                cancelButtonText: this.$t('str.btn.exit'),
                denyButtonClass: 'btn me-5px btn-warning min-btn-width',
            }).then(result => {
                if (result.isConfirmed) {
                    this.cancelAppointmentSeries()
                } else if (result.isDenied) {
                    this.cancelAppointmentOccurrence()
                }
            })
        },
        cancelAppointmentSeries: async function () {
            const filters = {
                schedule: this.data._id,
            }
            await Services.cancelAppointmentSeries(this, filters)
            this.$registerEvent.$emit('cancelAppointment')
        },
        cancelAppointmentOccurrence: async function () {
            const filters = {
                appointment: this.data.appointment,
            }
            await Services.cancelAppointmentOccurrence(this, filters)
            this.$registerEvent.$emit('cancelAppointment')
        },
        changeFrequency: function () {
            this.data.frequencyYear = {
                month: '',
                day: '',
            }
            this.data.frequencyMonth = {
                day: '',
            }
            this.data.weeklyDays = []
            this.removeRequiredField('frequencyMonthDay')
            this.removeRequiredField('frequencyYearMonth')
            this.removeRequiredField('frequencyYearDay')
        },
        async selectAllVigilants() {
            if (!this.data?.guardGroup || this.data.guardGroup === '') this.data.vigilants = this.vigilants ? this.vigilants : await Services.getVigilantsBySite(this, this.data.site)
            else {
                this.data.vigilants = this.vigilants
            }

            this.removeRequiredField('vigilants')
        },
        removeAllVigilants() {
            this.data.vigilants = []
            this.removeRequiredField('vigilants')
        },
        async closeModal() {
            this.data = {
                name: '',
                guardGroup: '',
                account: '',
                client: '',
                site: '',
                frequency: '',
                frequencyMonth: {
                    day: '',
                },
                frequencyYear: {
                    month: '',
                    day: '',
                },
                points: [],
                vigilants: [],
                weeklyDays: [],
                beginDate: null,
                endDate: null,
                beginHour: '',
                endHour: '',
                sendAlert: false,
                notifyVigilants: false,
                timeSlot: 15,
                type: 'FREE-P(ROGRAM',
                status: 'ACTIVE',
            }

            this.guardGroups = []
            this.patrolPoints = []
            this.vigilants = []

            if (!this.isSuperAdminMaster) {
                this.data.account = await Common.getAccountId(this)
                this.accountList = []
            } else {
                this.clientList = []
            }

            this.siteList = []

            this.$bvModal.hide('createScheduleModal')
        },
        clearFields() {
            this.data.vigilants = []
            this.data.points = []
            this.guardGroups = []
            this.patrolPoints = []
            this.vigilants = []
        },
        verifyDay: function () {
            // check if day of month is valid for selected month
            const month = this.data?.frequencyYear?.month
            const day = this.data?.frequencyYear?.day

            if (month && day) {
                const daysInMonth = new Date(new Date().getFullYear(), month, 0).getDate()
                if (day > daysInMonth) {
                    this.data.frequencyYear.day = daysInMonth
                }
            }
        },
        verifyMonthDay: function () {
            // check if day of month is valid for selected month
            const day = this.data?.frequencyMonth?.day
            if (day > 31) {
                this.data.frequencyMonth.day = 31
            }
        },
        clearForm: async function () {
            this.errors = []

            this.patrolPoints = []
            this.vigilants = []
            this.guardGroups = []

            this.data = this.scheduleObj

            if (this.isSuperAdminMaster) {
                this.clientList = []
                this.siteList = []
            } else this.data.account = await Common.getAccountId(this)
            this.selectOptions.enabled = true
            this.isLoading = false
        },
        initTable() {
            this.columns = [
                {
                    label: this.$t('str.table.check.point.column.name'),
                    field: 'name',
                    width: '30%',
                    sortable: true,
                    firstSortType: 'desc',
                    thClass: 'text-nowrap',
                    tdClass: 'text-nowrap',
                },
                {
                    label: this.$t('str.table.check.point.column.type'),
                    field: 'type',
                    width: '20%',
                    sortable: true,
                    thClass: 'text-nowrap',
                    tdClass: 'text-nowrap',
                },
                {
                    label: this.$t('str.table.check.point.column.geolocation'),
                    field: 'geolocation',
                    width: '10%',
                    thClass: 'text-nowrap',
                    tdClass: 'text-nowrap',
                },
                {
                    label: this.$t('str.table.check.point.column.radius'),
                    field: 'radius',
                    width: '10%',
                    thClass: 'text-nowrap',
                    tdClass: 'text-nowrap',
                },

                {
                    label: this.$t('str.table.check.point.column.note'),
                    field: 'notes',
                    width: '30%',
                    sortable: true,
                    thClass: 'text-nowrap',
                    tdClass: 'text-nowrap',
                },
            ]
            this.paginationOptions = {
                enabled: true,
                mode: 'records',
                perPage: 5,
                position: 'bottom',
                perPageDropdown: [5],
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
            this.selectOptions = {
                enabled: true,
                selectOnCheckboxOnly: false,
                selectionText: this.$t('str.schedule.selected.rows'),
                clearSelectionText: this.$t('str.schedule.selected.rows.clear'),
                disableSelectInfo: false,
                selectAllByGroup: true,
            }

            if (!this.isSuperAdminMaster) {
                this.columns.splice(5, 1)
            }
        },
        selectionChanged(params) {
            this.data.points = params.selectedRows
            if (params.selectedRows.length > 0) this.removeRequiredField('points')
        },
        isEnabledBtnSave: function () {
            return this.data.name && this.data.frequency && this.data.vigilants.length > 0 && this.data.points.length > 0 && this.data.beginDate && this.data.endDate && this.data.client && this.data.site
        },
        async initSelectedAppointment() {
            this.data.account = this.data?.account?._id
            this.data.client = this.data?.client?._id
            this.data.site = this.data?.site?._id

            if (Common.isSuperAdminMaster(this)) {
                this.accountList = await Services.getAccounts(this)
            }

            this.clientList = await Services.getClientsByAccount(this, this.data.account)
            this.siteList = await Services.getSitesByClient(this, this.data.client)
            this.guardGroups = await Services.getGuardGroupsBySite(this, this.data.site)

            if (!this.data._id) {
                this.patrolPoints = await Services.getPatrolPointsBySite(this, this.data.site)
            } else {
                this.patrolPoints = this.data?.points || []
            }

            this.vigilants = await Services.getVigilantsBySite(this, this.data.site)

            const mappedVigilants = this.data.vigilants.map(vigilant => {
                return {
                    _id: vigilant._id,
                    firstName: vigilant.firstName,
                    lastName: vigilant.lastName,
                    fullName: `${vigilant.firstName} ${vigilant.lastName}`,
                }
            })
            this.data.vigilants = mappedVigilants ? mappedVigilants : []
        },
    },
    checkEnableInput: function () {
        return this.data._id ? true : false
    },
}
</script>
