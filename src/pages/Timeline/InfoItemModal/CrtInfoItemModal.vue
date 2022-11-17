<script>
import Common from '../../../common/Common.vue'
import Endpoints from '../../../common/Endpoints.vue'
import Request from '../../../common/Request.vue'
import Vue from 'vue'
Vue.prototype.$registerEvent = new Vue()

export default {
    init: async payload => {
        payload.initTable()
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
    },
}
</script>
