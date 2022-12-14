<script>
import moment from 'moment'
import Common from '../../common/Common.vue'
import Services from '../../common/Services.vue'
import Endpoints from '../../common/Endpoints.vue'
export default {
    init: async payload => {
        payload.domain = Endpoints.domain
        payload.isSuperAdminMaster = await Common.isSuperAdminMaster(payload)
        if (payload.isSuperAdminMaster) {
            payload.accounts = await Services.getAccounts(payload)
        } else {
            payload.clients = await Services.getClients(payload)
            payload.filters.account = payload.$session.get('user')?.account
        }

        await payload.initTable()
        await payload.selectAllTypes()
        await payload.filter()

        payload.isLoading = false
    },
    methods: {
        filter: async function () {
            this.isLoading = true
            this.items = []
            this.selectedEvent = null

            try {
                this.items = await Services.getPatrolActions(this, this.filters)
                this.events = this.formatPatrolActions(this.items)
            } catch (error) {
                console.log(error)
            }

            this.isLoading = false
        },
        handleAnswerEvent: async function () {},
        formatPatrolActions: function (list) {
            const data = list.map(item => {
                const { _id, status, account, client, site, event, type, date, vigilant, patrol, soundURL, photoURL, signatureURL, incidents, deviceInfo, geolocation, notes } = item

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
                    date: Common.formatDate(date),
                    status: status,
                }
            })

            // Thiago Simon reported an incident on 12/12/2022 2:00 PM
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

                let dateTimezone = moment(dataItem?.date).utc(false)
                dataItem.description += ' ' + this.$t('str.event.on') + ' ' + dateTimezone.format('ll') + ' - ' + dateTimezone.format('LT')

                formatData.push(dataItem)
            })

            return formatData
        },
        handleSelectEvent: function (event) {
            this.selectedEvent = event
            console.log(event)
        },
        selectItem(params) {
            const data = JSON.parse(JSON.stringify(params.row))

            delete data.vgt_id
            delete data.originalIndex

            data.account = data?.account?._id || ''
            data.client = data?.client?._id || ''
            data.site = data?.site?._id || ''

            this.$emit('load-item', data)
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
        changeClient: async function () {
            const client = this.filters.client

            this.filter()

            if (client === '') {
                this.filters.site = ''
            }

            this.sites = await Services.getSitesByClient(this, client)
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
        formatDate: Common.formatDateAndTime,
    },
}
</script>
