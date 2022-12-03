<script>
import Common from '../../../common/Common.vue'
import Endpoints from '../../../common/Endpoints.vue'
import Request from '../../../common/Request.vue'
import Vue from 'vue'
Vue.prototype.$registerEvent = new Vue()

export default {
    init: async payload => {
        await payload.initTable()
        if (!payload.isSuperAdminMaster) {
            payload.data.account = Common.getAccountId(payload)
        }
    },
    methods: {
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
        initTable() {
            const columns = [
                {
                    label: this.$t('str.timeline.item.patrol.actions.date'),
                    field: 'date',
                    tdClass: 'text-nowrap',
                    thClass: 'text-nowrap',
                    sortable: true,
                    width: '20%',
                },
                {
                    label: this.$t('str.timeline.item.patrol.actions.type'),
                    field: 'type',
                    tdClass: 'text-nowrap',
                    thClass: 'text-nowrap',
                    sortable: true,
                    width: '20%',
                },
                {
                    label: this.$t('str.timeline.item.patrol.actions.geolocation'),
                    field: 'geolocation',
                    tdClass: 'text-nowrap',
                    thClass: 'text-nowrap',
                    width: '10%',
                },
                {
                    label: this.$t('str.timeline.item.patrol.actions.deviceInfo'),
                    field: 'deviceInfo',
                    tdClass: 'text-nowrap',
                    thClass: 'text-nowrap',
                    width: '10%',
                },
                {
                    label: this.$t('str.timeline.item.patrol.actions.medias'),
                    field: 'medias',
                    tdClass: 'text-nowrap',
                    thClass: 'text-nowrap',
                    width: '10%',
                },
                {
                    label: this.$t('str.timeline.item.patrol.actions.notes'),
                    field: 'notes',
                },
                {
                    label: this.$t('str.timeline.item.patrol.actions.notes'),
                    field: 'notes',
                    tdClass: 'text-nowrap',
                    thClass: 'text-nowrap',
                    width: '30%',
                },
            ]

            const paginationOptions = {
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

            const selectOptions = {
                enabled: true,
                selectOnCheckboxOnly: false,
                selectionText: this.$t('str.schedule.selected.rows'),
                clearSelectionText: this.$t('str.schedule.selected.rows.clear'),
                disableSelectInfo: false,
                selectAllByGroup: true,
            }

            this.columns = columns
            this.paginationOptions = paginationOptions
            this.selectOptions = selectOptions

            if (!this.isSuperAdminMaster) {
                this.columns.splice(5, 1)
            }
        },
        getDeviceInfo(obj) {
            if (obj) {
                return `${obj?.brand} ${obj?.manufacturer} ${obj?.model} ${obj?.version} ${obj?.bateryLevel} ${obj?.isCharging} ${obj?.ipAddress} ${obj?.deviceId}`
            }
            return ''
        },
        selectItem(item) {
            this.patrolActionItem = item
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
        showPatrolPoints() {
            this.$bvModal.show('patrolPointsModal')
        },
        getStatusName: Common.getEventStatusName,
        formatDate: Common.formatDateAndTime,
    },
}
</script>
