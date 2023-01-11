<script>
import moment from 'moment'
import Common from '../../common/Common.vue'
import Services from '../../common/Services.vue'
import Endpoints from '../../common/Endpoints.vue'

export default {
    init: async payload => {
        payload.selectedEvent = null

        payload.domain = Endpoints.domain
        payload.isSuperAdminMaster = await Common.isSuperAdminMaster(payload)
        payload.attendancesTypes = await Services.getAttendancesOptionsTypes(payload)

        if (payload.isSuperAdminMaster) {
            payload.accounts = await Services.getAccounts(payload)
        } else {
            payload.clients = await Services.getClients(payload)
            payload.filters.account = await payload.$session.get('user')?.account?._id
        }

        payload.user = await payload.$session.get('user')

        await payload.initTable()
        await payload.selectAllTypes()
        await payload.filter()

        payload.isLoading = false
    },
    methods: {
        getOperatorId: async function () {
            return this.$session.get('user')?._id
        },
        filter: async function () {
            this.isLoadingEvents = true
            this.items = []

            try {
                this.items = await Services.getPatrolActions(this, this.filters)
                const events = this.formatPatrolActions(this.items)

                this.events = events
                if (!this.selectedEvent && events?.length > 0) {
                    this.selectedEvent = this.events[0]

                    const filters = {
                        patrolAction: this.selectedEvent?._id,
                        status: 'ACTIVE',
                    }

                    this.attendances = await Services.getEventAttendances(this, filters)
                }
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

            const patrolActionId = this.selectedEvent?._id
            const userId = await this.getOperatorId()
            const attendance = {
                isAttendance: true,
                openedDate: moment().utc(true).format(),
                operator: userId,
                status: 'IN_PROGRESS',
            }

            try {
                const result = await Services.attendanceEvent(this, patrolActionId, attendance)
                if (result && this.selectedEvent) {
                    this.selectedEvent.attendance = {
                        isAttendance: result?.attendance?.isAttendance,
                        openedDate: result?.attendance?.date,
                        closedDate: result?.attendance?.closedDate,
                        operator: this.user,
                        status: result?.attendance?.status,
                    }
                }

                this.attendanceEventEnabled = false
                this.isLoadingAttendanceEventButton = false
                this.clearForm()
            } catch (error) {
                console.log(error)
            }
        },
        closeAttendance: async function () {
            this.attendanceEventEnabled = true

            const patrolActionId = this.selectedEvent?._id
            const userId = await this.getOperatorId()
            const attendance = {
                isAttendance: true,
                closedDate: moment().utc(true).format(),
                operator: userId,
                status: 'CLOSED',
            }

            try {
                const result = await Services.attendanceEvent(this, patrolActionId, attendance)
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
                console.log(error)
            }
        },
        confirmCloseAttendance: async function () {
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

                attendance.operator = await this.getOperatorId()

                try {
                    await Services.createAttendance(this, attendance)
                    this.attendanceEventEnabled = false
                    this.isLoadingSendAttendanceButton = false
                    this.clearForm()

                    Common.show(this, 'bottom-right', 'success', 'str.attendance_created')
                    const filters = {
                        patrolAction: this.selectedEvent?._id,
                        status: 'ACTIVE',
                    }

                    this.attendances = await Services.getEventAttendances(this, filters)
                } catch (error) {
                    console.log(error)
                    this.isLoadingSendAttendanceButton = false
                    Common.show(this, 'bottom-right', 'danger', 'str.error_creating_attendance')
                }
            }
        },
        clearForm: function () {
            this.attendance.type = ''
            this.attendance.notes = ''
        },
        formatPatrolActions: function (list) {
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
            this.selectedEvent = event
            this.attendanceEventEnabled = false
            this.removeRequiredField('attendanceOptions')

            //get attendances for event
            const filters = {
                patrolAction: event?._id,
                status: 'ACTIVE',
            }

            this.attendances = await Services.getEventAttendances(this, filters)
        },
        initTable() {
            this.columns = [
                {
                    label: this.$t('str.table.actions.log.column.user'),
                    field: 'systemUser',
                    width: '20%',
                    sortable: true,
                    thClass: 'text-nowrap',
                    tdClass: 'text-nowrap',
                },
                {
                    label: this.$t('str.table.actions.log.column.domain'),
                    field: 'domain',
                    width: '15%',
                    sortable: true,
                    firstSortType: 'desc',
                    thClass: 'text-nowrap',
                    tdClass: 'text-nowrap',
                },
                {
                    label: this.$t('str.table.actions.log.column.operation'),
                    field: 'operation',
                    width: '15%',
                    sortable: true,
                    thClass: 'text-nowrap',
                    tdClass: 'text-nowrap',
                },
                {
                    label: this.$t('str.table.actions.log.column.account'),
                    field: 'account',
                    width: '15%',
                    thClass: 'text-nowrap',
                    tdClass: 'text-nowrap',
                },
                {
                    label: this.$t('str.table.actions.log.column.client'),
                    field: 'client',
                    width: '10%',
                    thClass: 'text-nowrap',
                    tdClass: 'text-nowrap',
                },
                {
                    label: this.$t('str.table.actions.log.column.site'),
                    field: 'site',
                    width: '10%',
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
                this.columns.splice(3, 1)
            }
        },
        changeAccount: async function () {
            const account = this.filters.account

            this.filter()

            if (account === '') {
                this.filters.client = ''
                this.filters.site = ''
            }

            this.clients = await Services.getClientsByAccount(this, account)
        },
        checkForm: async function () {
            if (!this.attendance?.type || this.attendance?.type === '') {
                this.errors.push('attendanceOptions')
            }

            if (!this.errors || this.errors.length === 0) {
                await this.sendAttendanceEvent()
            }
        },
        changeClient: async function () {
            const client = this.filters.client

            this.filter()

            if (client === '') {
                this.filters.site = ''
            }

            this.sites = await Services.getSitesByClient(this, client)
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
