<script>
import moment from 'moment'
import Common from '../../common/Common.vue'
import Services from '../../common/Services.vue'
import Endpoints from '../../common/Endpoints.vue'

export default {
    init: async payload => {
        try {
            payload.domain = Endpoints.domain

            payload.user = await payload.$session.get('user')
            payload.isSuperAdminMaster = await Common.isSuperAdminMaster(payload)
            payload.role = await Common.getSubtype(payload)
            payload.attendancesTypes = await Services.getAttendancesOptionsTypes(payload)

            if (payload.isSuperAdminMaster) {
                payload.accounts = await Services.getAccounts(payload)
            } else if (payload.role === 'ADMIN') {
                payload.clients = await Services.getClients(payload)
                payload.filters.account = await Common.getAccountId(payload)
            } else if (payload.role === 'MANAGER') {
                payload.clients = await Services.getClients(payload)
                payload.filters.account = await Common.getAccountId(payload)
                payload.filters.client = await Common.getClientId(payload)
            } else if (payload.role === 'OPERATOR') {
                payload.sites = await Services.getSites(payload)
                payload.filters.account = await Common.getAccountId(payload)
                payload.filters.client = await Common.getClientId(payload)
                payload.filters.sites = await Common.getSiteGroupId(payload)
            }

            await payload.selectAllTypes()
        } catch (error) {
            console.log(error)
        }
    },
    methods: {
        getOperatorId: async function () {
            return this.$session.get('user')?._id
        },
        async filter() {
            this.isLoadingEvents = true
            this.items = []

            if (this.filters?.types?.length === 0) {
                this.selectedEvent = null
            }

            if (this.selectedEvent && !this.filters.types.includes(this.selectedEvent.type)) {
                this.selectedEvent = null
            }

            try {
                this.items = await Services.getPatrolActions(this, this.filters)
                const events = await this.formatPatrolActions(this.items)
                this.events = events

                this.isLoadingEvents = false
            } catch (error) {
                this.isLoadingEvents = false
                console.log(error)
            }
        },
        checkRequiredField(field) {
            return this.errors.includes(field)
        },
        removeRequiredField(field) {
            this.errors = this.errors.filter(item => item !== field)
        },
        handleAttendanceEvent: async function () {
            if (this.isLoadingAttendanceEventButton || this.attendanceEventEnabled) return

            this.attendanceEventEnabled = true
            this.isLoadingAttendanceEventButton = true

            const patrolActionId = this.selectedEvent?._id
            const userId = await this.getOperatorId()
            const siteGroup = this.$session.get('user')?.siteGroup?._id

            const attendance = {
                isAttendance: true,
                openedDate: moment().utc(true).format(),
                operator: userId,
                status: 'IN_PROGRESS',
            }

            try {
                const result = await Services.attendanceEvent(this, patrolActionId, attendance, siteGroup)
                if (result && this.selectedEvent) {
                    this.selectedEvent.attendance = {
                        isAttendance: result?.attendance?.isAttendance,
                        openedDate: result?.attendance?.openedDate,
                        closedDate: result?.attendance?.closedDate,
                        operator: this.user,
                        status: result?.attendance?.status,
                    }
                }

                this.attendanceEventEnabled = false
                this.isLoadingAttendanceEventButton = false
                this.clearForm()
            } catch (error) {
                this.attendanceEventEnabled = false
                this.isLoadingAttendanceEventButton = false
                this.clearForm()
                console.log(error)
            }
        },
        closeAttendance: async function () {
            this.attendanceEventEnabled = true

            const patrolActionId = this.selectedEvent?._id
            const openedDate = this.selectedEvent.attendance?.openedDate
            const userId = await this.getOperatorId()
            const siteGroup = this.$session.get('user')?.siteGroup?._id

            const attendance = {
                isAttendance: true,
                openedDate: openedDate,
                closedDate: moment().utc(true).format(),
                operator: userId,
                status: 'CLOSED',
            }

            try {
                const result = await Services.attendanceEvent(this, patrolActionId, attendance, siteGroup)
                if (result && this.selectedEvent) {
                    this.selectedEvent.attendance = {
                        isAttendance: result?.attendance?.isAttendance,
                        openedDate: openedDate,
                        closedDate: result?.attendance?.closedDate,
                        operator: this.user,
                        status: result?.attendance?.status,
                    }
                }

                this.attendanceEventEnabled = false
                this.isLoadingAttendanceEventButton = false
                this.clearForm()
            } catch (error) {
                this.attendanceEventEnabled = false
                this.isLoadingAttendanceEventButton = false
                this.clearForm()
                console.log(error)
            }
        },
        confirmCloseAttendance: async function () {
            if (!this.attendances || this.attendances.length === 0) {
                Common.show(this, 'bottom-right', 'error', this.$t('str.monitor.register.message.require'))
                return
            }

            this.$swal({
                title: this.$t('str.are.you.sure'),
                text: this.$t('str.are.you.sure.close'),
                showCancelButton: true,
                buttonsStyling: false,
                confirmButtonText: this.$t('str.title.close.attendance'),
                cancelButtonText: this.$t('str.title.cancel'),
                confirmButtonClass: 'btn me-5px btn-danger',
                cancelButtonClass: 'btn btn-default',
            }).then(result => {
                if (result.isConfirmed && result.value) {
                    this.closeAttendance()
                }
            })
        },
        sendAttendanceEvent: async function () {
            if (!this.isLoadingSendAttendanceButton) {
                this.isLoadingSendAttendanceButton = true

                const attendance = {
                    account: this.selectedEvent?.account?._id,
                    client: this.selectedEvent?.client?._id,
                    site: this.selectedEvent?.site?._id,
                    event: this.selectedEvent?.event?._id,
                    type: this.attendance?.type,
                    notes: this.attendance?.notes,
                    patrolAction: this.selectedEvent?._id,
                    createDate: moment().utc(true).format(),
                    status: 'ACTIVE',
                }

                attendance.siteGroup = await this.$session.get('user')?.siteGroup?._id
                attendance.operator = await this.getOperatorId()

                try {
                    await Services.createAttendance(this, attendance)
                    this.attendanceEventEnabled = false
                    this.isLoadingSendAttendanceButton = false
                    this.clearForm()

                    const filters = {
                        patrolAction: this.selectedEvent?._id,
                        status: 'ACTIVE',
                    }

                    this.isLoadingAttendanceList = true
                    this.attendances = await Services.getEventAttendances(this, filters)
                    this.isLoadingAttendanceList = false
                } catch (error) {
                    console.log(error)
                    this.isLoadingSendAttendanceButton = false
                    this.isLoadingAttendanceList = false
                    Common.show(this, 'bottom-right', 'danger', 'str.error_creating_attendance')
                }
            }
        },
        clearForm: function () {
            this.attendance.type = ''
            this.attendance.notes = ''
        },
        formatPatrolActions: async function (list) {
            const data = list.map(item => {
                const { _id, status, account, client, site, event, type, date, vigilant, patrol, soundURL, photoURL, signatureURL, failurePatrolType, incidents, deviceInfo, geolocation, notes, attendance } =
                    item

                return {
                    _id: _id,
                    vigilant,
                    patrol,
                    soundURL,
                    photoURL,
                    signatureURL,
                    event,
                    title: type,
                    type: type,
                    account,
                    client,
                    site,
                    failurePatrolType,
                    incidents: incidents || [],
                    deviceInfo: deviceInfo || {},
                    geolocation: geolocation || {},
                    notes: notes ? notes : '',
                    date,
                    attendance,
                    status: status,
                }
            })

            const formatData = []
            data.forEach(item => {
                const dataItem = item

                let vigilant = dataItem?.vigilant?.firstName ? dataItem?.vigilant?.firstName : ''
                vigilant += dataItem?.vigilant?.lastName ? ' ' + dataItem?.vigilant?.lastName + ' ' : ''

                dataItem.description = vigilant

                switch (dataItem?.type) {
                    case 'START_PATROL':
                        {
                            dataItem.description += this.$t('str.event.started_a_patrol')
                            dataItem.tag = 'badge bg-gray-300 text-gray-900 me-1'
                            dataItem.icon = 'fa fa-play-circle'
                        }
                        break
                    case 'END_PATROL':
                        {
                            dataItem.description += this.$t('str.event.ended_a_patrol')
                            dataItem.tag = 'badge bg-gray-300 text-gray-900 me-1'
                            dataItem.icon = 'fa fa-stop-circle'
                        }
                        break
                    case 'INCIDENT':
                        {
                            dataItem.description += this.$t('str.event.reported_an_incident')
                            dataItem.tag = 'badge bg-orange text-white me-1'
                            dataItem.icon = 'fa fa-exclamation-circle'
                        }
                        break
                    case 'SOS_ALERT':
                        {
                            dataItem.description += this.$t('str.event.reported_an_alert')
                            dataItem.tag = 'badge bg-danger text-white me-1'
                            dataItem.icon = 'fa fa-bell'
                        }
                        break
                    case 'SCAN':
                        {
                            dataItem.description += this.$t('str.event.scanned_a_qr_code')
                            dataItem.tag = 'badge bg-indigo text-white me-1'
                            dataItem.icon = 'fa fa-qrcode'
                        }
                        break
                    case 'FAILURE_PATROL':
                        {
                            dataItem.description += this.$t('str.event.failure_patrol')

                            if (item?.event?.name) {
                                dataItem.description += ' ' + item?.event?.name + ' '
                            } else {
                                dataItem.description += ' '
                            }

                            dataItem.tag = 'badge dark-orange me-1'
                            dataItem.icon = 'fa fa-exclamation-triangle'
                        }
                        break
                    case 'CANCEL_PATROL':
                        {
                            dataItem.description += this.$t('str.event.cancel_patrol')
                            dataItem.tag = 'badge bg-indigo text-white me-1'
                            dataItem.icon = 'fa fa-ban'
                        }
                        break

                    default:
                        break
                }

                if (dataItem?.failurePatrolType) {
                    const dateTimezone = moment(dataItem?.event?.startDate).utc(false)
                    const formattedDate = dateTimezone.format('DD/MM/YYYY')
                    const formattedTime = dateTimezone.format('HH:mm')

                    switch (dataItem.failurePatrolType) {
                        case 'NOT_STARTED':
                            {
                                dataItem.failureText = this.$t('str.msg.not.started.patrol')
                                dataItem.description += this.$t('str.event.failure_patrol.scheduled.at.description') + ' '

                                dataItem.description += formattedDate + ' - ' + formattedTime + ' ' + this.$t('str.event.failure_patrol.description')
                            }
                            break
                        case 'INCOMPLETE':
                            {
                                dataItem.failureText = this.$t('str.msg.incomplete.patrol')
                                dataItem.description += this.$t('str.event.failure_patrol.scheduled.at.description') + ' '
                                dataItem.description += formattedDate + ' - ' + formattedTime + ' ' + this.$t('str.event.incomplete_patrol.description')
                            }

                            break
                        case 'EXPIRED':
                            {
                                dataItem.failureText = this.$t('str.msg.expired.patrol')
                                dataItem.description += this.$t('str.event.failure_patrol.scheduled.at.description') + ' '
                                dataItem.description += formattedDate + ' - ' + formattedTime + ' ' + this.$t('str.event.expired_patrol.description')
                            }
                            break
                        default:
                            break
                    }
                } else {
                    dataItem.failureText = this.$t(dataItem.type)
                }

                const event = dataItem?.event ? dataItem?.event : null
                if (event) {
                    switch (event?.status) {
                        case 'ACTIVE':
                            event.tag = 'badge bg-info text-white me-1'
                            break
                        case 'ÍN_PROGRESS':
                            event.tag = 'badge bg-success text-white me-1'
                            break
                        case 'FINISHED':
                            event.tag = 'badge bg-success text-white me-1'
                            break
                        case 'CANCELED':
                            event.tag = 'badge bg-danger text-white me-1'
                            break
                        default:
                            event.tag = 'badge bg-gray-300 text-gray-900 me-1'
                            break
                    }
                    dataItem.event = event
                }

                let dateToUse = dataItem.date
                if (dataItem.failurePatrolType === 'NOT_STARTED' && dataItem?.event?.startDate) {
                    dateToUse = dataItem.event.startDate
                }

                const dateTimezone = moment(dateToUse).utc(false)
                const formattedDate = dateTimezone.format('DD/MM/YYYY')
                const formattedTime = dateTimezone.format('HH:mm')

                dataItem.formattedDate = formattedDate
                dataItem.formattedTime = formattedTime

                if (dataItem?.failurePatrolType) {
                    dataItem.description += ' ' + this.$t('str.event.on') + ' ' + formattedDate + ' - ' + formattedTime
                }

                formatData.push(dataItem)
            })

            return formatData
        },
        formatDate: function (date) {
            const dateTimezone = moment(date).utc(false)
            const formattedDate = dateTimezone.format('DD/MM/YYYY')
            const formattedTime = dateTimezone.format('HH:mm')

            return formattedDate + ' - ' + formattedTime
        },
        handleSelectEvent: async function (event) {
            this.selectedEvent = JSON.parse(JSON.stringify(event))
            this.attendanceEventEnabled = false
            this.removeRequiredField('attendanceOptions')

            //get attendances for event
            const filters = {
                patrolAction: event?._id,
                status: 'ACTIVE',
            }

            this.attendances = await Services.getEventAttendances(this, filters)
        },
        changeAccount: async function () {
            const account = this.filters.account

            this.filters.client = ''
            this.filters.site = ''
            this.selectedEvent = null
            this.clients = await Services.getClientsByAccount(this, account)

            await this.filter()
        },
        changeClient: async function () {
            const client = this.filters.client

            this.filters.site = ''
            this.selectedEvent = null
            this.sites = await Services.getSitesByClient(this, client)

            await this.filter()
        },
        checkForm: async function () {
            if (!this.attendance?.type || this.attendance?.type === '') {
                this.errors.push('attendanceOptions')
            }

            if (!this.errors || this.errors.length === 0) {
                await this.sendAttendanceEvent()
            }
        },
        updateSelectedEvent: async function (patrolAction) {
            this.selectedEvent = await Services.getPatrolActionById(this, patrolAction)
        },
        selectAllTypes: function () {
            const types = this.eventTypes.map(type => type.value)
            this.filters.types = types
        },
        showMap() {
            this.$bvModal.show('mapModal')
        },
        showPhoto() {
            this.$bvModal.show('photoModal')
        },
        showSignature() {
            this.$bvModal.show('signatureModal')
        },
        showSound() {
            this.$bvModal.show('soundModal')
        },
        showDeviceInfo() {
            this.$bvModal.show('deviceInfoModal')
        },
        show() {
            Common.show(this, 'bottom-right', 'error', this.$t('response.user.invalid.subtype'))
        },
    },
}
</script>
