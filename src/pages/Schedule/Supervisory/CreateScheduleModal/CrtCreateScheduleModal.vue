<script>
import Common from '../../../../common/Common.vue'
import Services from '../../../../common/Services.vue'
import Endpoints from '../../../../common/Endpoints.vue'
import Request from '../../../../common/Request.vue'
import moment from 'moment'
import Vue from 'vue'

Vue.prototype.$registerEvent = new Vue()

export default {
    init: async payload => {
        await payload.initTable()
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
            this.site = ''

            this.clearFields()

            const account = this.data.account
            this.clientList = await Services.getClientsByAccount(this, account)
        },
        changeClient: async function () {
            const client = this.data.client

            if (!client || client === '') {
                this.site = ''
            }

            this.clearFields()

            this.siteList = await Services.getSitesByClient(this, client)
        },
        changeSite: async function () {
            this.patrolPoints = await Services.getPatrolPointsBySite(this, this.site)
        },
        async update() {
            if (!this.isSaveLoading) {
                this.isSaveLoading = true
                try {
                    Request.do(
                        this,
                        'post',
                        Request.getDefaultHeader(this),
                        this.data,
                        `${Endpoints.schedules.supervisoryUpdate}`,
                        async response => {
                            if (response.status === 200) {
                                this.isSaveLoading = false
                                this.$registerEvent.$emit('refreshSchedule')
                                await this.closeModal()
                            }
                        },
                        error => {
                            this.isLoading = false
                            this.isSaveLoading = false
                            Common.show(this, 'bottom-right', 'warn', this.data._id ? this.$t('str.form.update.generic.error') : this.$t('str.form.save.generic.error'))
                            console.log(error)
                        },
                    )
                } catch (error) {
                    this.isLoading = false
                    this.isSaveLoading = false
                    Common.show(this, 'bottom-right', 'warn', this.data._id ? this.$t('str.form.update.generic.error') : this.$t('str.form.save.generic.error'))
                    console.log(error)
                }
            }
        },
        async updateOccurrence() {
            if (!this.isSaveLoading) {
                this.isSaveLoading = true
                try {
                    Request.do(
                        this,
                        'post',
                        Request.getDefaultHeader(this),
                        this.data,
                        `${Endpoints.appointments.supervisorUpdateOccurrence}`,
                        async response => {
                            if (response.status === 200) {
                                this.isSaveLoading = false
                                this.$registerEvent.$emit('refreshSchedule')
                                await this.closeModal()
                            }
                        },
                        error => {
                            this.isLoading = false
                            this.isSaveLoading = false
                            Common.show(this, 'bottom-right', 'warn', this.data._id ? this.$t('str.form.update.generic.error') : this.$t('str.form.save.generic.error'))
                            console.log(error)
                        },
                    )
                } catch (error) {
                    this.isLoading = false
                    this.isSaveLoading = false
                    Common.show(this, 'bottom-right', 'warn', this.data._id ? this.$t('str.form.update.generic.error') : this.$t('str.form.save.generic.error'))
                    console.log(error)
                }
            }
        },
        async save() {
            if (!this.isSaveLoading) {
                this.isSaveLoading = true

                try {
                    Request.do(
                        this,
                        this.data._id ? 'put' : 'post',
                        Request.getDefaultHeader(this),
                        this.data,
                        `${Endpoints.schedules.supervisorySchedule}`,
                        async response => {
                            if (response.status === 200) {
                                this.isSaveLoading = false
                                this.$registerEvent.$emit('refreshSchedule')
                                await this.closeModal()
                            }
                        },
                        error => {
                            this.isLoading = false
                            this.isSaveLoading = false
                            Common.show(this, 'bottom-right', 'warn', this.data._id ? this.$t('str.form.update.generic.error') : this.$t('str.form.save.generic.error'))
                            console.log(error)
                        },
                    )
                } catch (error) {
                    this.isLoading = false
                    this.isSaveLoading = false
                    Common.show(this, 'bottom-right', 'warn', this.data._id ? this.$t('str.form.update.generic.error') : this.$t('str.form.save.generic.error'))
                    console.log(error)
                }
            }
        },
        async checkForm() {
            if (!this.data.account || this.data.account === '') {
                this.errors.push('account')
            }
            if (!this.data.client || this.data.client === '') {
                this.errors.push('client')
            }
           
            if (!this.data.name || this.data.name === '') {
                this.errors.push('name')
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

                this.data.beginDate = this.data.beginDate + 'T' + this.data.beginHour + ':00.000Z'
                this.data.endDate = this.data.endDate + 'T' + this.data.endHour + ':00.000Z'

                if (this.updateSchedule) {
                    await this.update()
                }
                if (this.updateAppointment) {
                    await this.updateOccurrence()
                } else {
                    await this.save()
                }
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
        confirmEdit: async function () {
            this.$swal({
                title: this.$t('str.are.you.sure'),
                text: this.$t('str.are.you.sure.edit.schedule'),
                showCancelButton: true,
                showDenyButton: true,
                buttonsStyling: false,
                confirmButtonText: this.$t('str.title.edit.series'),
                cancelButtonClass: 'btn btn-default min-btn-width',
                denyButtonText: this.$t('str.title.edit.occurrence'),
                confirmButtonClass: 'btn me-5px btn-danger min-btn-width',
                cancelButtonText: this.$t('str.btn.exit'),
                denyButtonClass: 'btn me-5px btn-warning min-btn-width',
            }).then(result => {
                if (result.isConfirmed) {
                    this.updateAppointmentSeries()
                } else if (result.isDenied) {
                    this.updateAppointmentOccurrence()
                }
            })
        },
        updateAppointmentSeries: function () {
            const newData = JSON.parse(JSON.stringify(this.data))
            newData.schedule = newData._id
            delete newData._id

            if (!this.isPastDate) {
                newData.beginDate = moment(this.data?.appointment?.startDate).utc(false).format('YYYY-MM-DD')
            }

            this.data = newData
            this.updateSchedule = true
       
        },
        updateAppointmentOccurrence: async function () {
            const newData = JSON.parse(JSON.stringify(this.data))
            newData.schedule = this.data._id

            delete newData._id

            newData.beginDate = moment(this.data?.appointment?.startDate).utc(false).format('YYYY-MM-DD')
            newData.endDate = moment(this.data?.appointment?.endDate).utc(false).format('YYYY-MM-DD')

            newData.beginHour = this.data?.appointment?.startHour
            newData.endHour = this.data?.appointment?.endHour
            newData.timeSlot = this.data?.appointment?.timeSlot
            

            // if (newData.points.length > 0) {
            //     this.patrolPoints.forEach(patrolPoint => {
            //         newData.points.forEach(point => {
            //             if (patrolPoint._id === point) {
            //                 this.$set(patrolPoint, 'vgtSelected', true)
            //             }
            //         })
            //     })
            // }

            this.data = newData
            this.updateAppointment = true
       
        },
        confirmArchive() {
            this.$swal({
                title: this.$t('str.are.you.sure'),
                text: this.$t('str.are.you.sure.delete.schedule'),
                showCancelButton: true,
                showDenyButton: true,
                buttonsStyling: false,
                confirmButtonText: this.$t('str.title.delete.series'),
                cancelButtonClass: 'btn btn-default min-btn-width',
                denyButtonText: this.$t('str.title.delete.occurrence'),
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
                startDate: this?.appointment?.startDate ? this.appointment.startDate : '',
            }

            await Services.cancelAppointmentSeries(this, filters)

            this.$registerEvent.$emit('cancelAppointment')

            this.isLoading = false
        },
        cancelAppointmentOccurrence: async function () {
            const filters = {
                appointment: this.data.appointment,
            }
            await Services.cancelAppointmentOccurrence(this, filters)
            this.isLoading = false
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
            if (!this.data?.guardGroup || this.data.guardGroup === '') this.data.vigilants = this.vigilants ? this.vigilants : await Services.getVigilantsBySite(this, this.site)
            else {
                this.data.vigilants = this.vigilants
            }

            this.removeRequiredField('vigilants')
        },
        async selectAllPatrolPoints() {
            this.selectedPatrolPoints = this.patrolPoints
            this.removeRequiredField('points')
        },
        removeAllPatrolPoints() {
            this.selectedPatrolPoints = []
            this.removeRequiredField('patrolPoints')
        },
        async closeModal() {
            this.data = {
                name: '',
                guardGroup: '',
                account: '',
                client: '',
                frequency: '',
                category: '',
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
                beginDate: moment().utc().format('YYYY-MM-DD'),
                endDate: null,
                beginHour: '',
                endHour: '',
                sendAlert: false,
                notifyVigilants: true,
                timeSlot: 15,
                type: 'FREE-PROGRAM',
                status: 'ACTIVE',
            }

            this.site = null
            this.patrolPoints = []
            this.vigilants = []
            this.errors = []

            if (!this.isSuperAdminMaster) {
                this.data.account = await Common.getAccountId(this)
                this.accountList = []
            } else {
                this.clientList = []
            }

            this.siteList = []
            this.isPastDate = false
            this.updateSchedule = false
            this.updateAppointment = false

            this.$bvModal.hide('createScheduleModal')
        },
        clearFields() {
            this.data.vigilants = []
            this.data.points = []

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
        async initTable() {
            this.columns = [
                {
                    label: this.$t('str.table.check.point.column.actions'),
                    field: 'actions',
                    width: '10%',
                    thClass: 'text-nowrap',
                    tdClass: 'text-nowrap',
                },
                {
                    label: this.$t('str.table.check.point.column.name'),
                    field: 'name',
                    width: '20%',
                    sortable: true,
                    firstSortType: 'desc',
                    thClass: 'text-nowrap',
                    tdClass: 'text-nowrap',
                },
                {
                    label: this.$t('str.table.check.point.column.type'),
                    field: 'type',
                    width: '10%',
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
                    width: '5%',
                    thClass: 'text-nowrap',
                    tdClass: 'text-nowrap',
                },

                {
                    label: this.$t('str.table.check.point.column.note'),
                    field: 'notes',
                    width: '25%',
                    sortable: true,
                    thClass: 'text-nowrap',
                    tdClass: 'text-nowrap',
                },
               
            ]
        },
        showMap() {
            this.$bvModal.show('mapModal')
        },
        selectItem(item) {
            this.patrolPointItem = item
        },
        removeRow(row) {
            if(this.updateAppointment || this.updateSchedule) {

                const index = row?.originalIndex

                if (index !== -1) {
                    this.data.points.splice(index, 1)
                }
            }
            
        },
        clearList() {
            this.data.points = []; // Limpa a lista de pontos
        },
        addPatrolPoints() {
            for (const selectedPoint of this.selectedPatrolPoints) {
                if (!this.data.points.some(point => point === selectedPoint)) {
                    this.data.points.push(selectedPoint);
                }
            }
            this.selectedPatrolPoints = []; // Limpar seleção após adicionar
        },
        isEnabledBtnSave: function () {
            return this.data.name && this.data.frequency && this.data.vigilants.length > 0 && this.data.points.length > 0 && this.data.beginDate && this.data.endDate && this.data.client && this.site
        },
        async initSelectedAppointment() {
            this.isLoading = true

            try {
                this.data.account = this.data?.account?._id
                this.data.client = this.data?.client?._id
                this.appointment = this.data?.appointment

                this.data.beginDate = moment(this.data?.beginDate).format('YYYY-MM-DD')
                this.data.endDate = moment(this.data?.endDate).format('YYYY-MM-DD')

                this.isPastDate = moment(this.appointment?.startDate).utc(false).isBefore(moment().utc(true).startOf('day'))

                if (Common.isSuperAdminMaster(this)) {
                    this.accountList = await Services.getAccounts(this)
                }

                this.clientList = await Services.getClientsByAccount(this, this.data.account)
                this.siteList = await Services.getSitesByClient(this, this.data.client)

                if (this.data.points.length > 0) {
                    this.patrolPoints.forEach(patrolPoint => {
                        this.data.points.forEach(point => {
                            if (patrolPoint._id === point._id) {
                                this.$set(patrolPoint, 'vgtSelected', true)
                            }
                        })
                    })
                }

                this.isLoading = false
            } catch (error) {
                this.isLoading = false
                console.log(error)
            }
        },
    },
    checkEnableInput: function () {
        return this.data._id ? true : false
    },
}
</script>
