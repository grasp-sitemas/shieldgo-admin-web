<script>
import moment from 'moment'
import Common from '../../common/Common.vue'
import Services from '../../common/Services.vue'
import Endpoints from '../../common/Endpoints.vue'

export default {
    init: async payload => {
        const initState = async function () {
            try {
                payload.domain = Endpoints.domain

                setTimeout(async () => {
                    payload.user = await payload.$session.get('user')

                    payload.isSuperAdminMaster = await Common.isSuperAdminMaster(payload)
                    payload.attendancesTypes = await Services.getAttendancesOptionsTypes(payload)

                    if (payload.isSuperAdminMaster) {
                        payload.accounts = await Services.getAccounts(payload)
                    } else {
                        payload.clients = await Services.getClients(payload)
                        payload.filters.account = await Common.getAccountId(payload)
                    }

                    await payload.selectAllTypes()
                    await payload.filter()

                    if (payload?.events?.length > 0) {
                        const event = JSON.parse(JSON.stringify(payload.events[0]))
                        payload.selectedEvent = event

                        const filters = {
                            patrolAction: payload.selectedEvent?._id,
                            status: 'ACTIVE',
                        }

                        payload.isLoadingAttendanceList = true
                        payload.attendances = await Services.getEventAttendances(payload, filters)
                        payload.isLoadingAttendanceList = false
                    }
                }, 1000)
            } catch (error) {
                console.log(error)
                payload.isLoading = false
                payload.isLoadingAttendanceList = false
            }
        }

        await initState()
        payload.isLoading = false
    },
    methods: {
        getOperatorId: async function () {
            return this.$session.get('user')?._id
        },
        async filter() {
            this.isLoadingEvents = true
            this.items = []

            try {
                this.items = await Services.getPatrolActions(this, this.filters)
                const events = await this.formatPatrolActions(this.items)
                this.events = events
            } catch (error) {
                this.isLoadingEvents = false
                console.log(error)
            }

            this.isLoadingEvents = false
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
                const { _id, status, account, client, site, event, type, date, vigilant, patrol, soundURL, photoURL, signatureURL, incidents, deviceInfo, geolocation, notes, attendance } = item

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

                const vigilant = dataItem?.vigilant?.firstName + ' ' + dataItem?.vigilant?.lastName + ' '
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
                    default:
                        break
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

                const dateTimezone = moment(dataItem?.date).utc(false)
                const formattedDate = dateTimezone.format('DD/MM/YYYY')
                const formattedTime = dateTimezone.format('HH:mm')

                dataItem.formattedDate = formattedDate
                dataItem.formattedTime = formattedTime
                dataItem.description += ' ' + this.$t('str.event.on') + ' ' + formattedDate + ' - ' + formattedTime

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
