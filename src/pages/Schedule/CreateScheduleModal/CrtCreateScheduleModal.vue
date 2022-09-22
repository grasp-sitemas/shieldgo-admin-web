<script>
import Common from '../../../common/Common.vue'
import Services from '../../../common/Services.vue'
import Endpoints from '../../../common/Endpoints.vue'
import Request from '../../../common/Request.vue'
export default {
    init: async payload => {
        payload.initTable()
        if (!payload.isSuperAdminMaster) {
            payload.data.account = Common.getAccountId(payload)
        }
        payload.data.beginDate = payload.selectedDate ?? ''
    },
    methods: {
        checkRequiredField(field) {
            return this.errors.includes(field)
        },
        removeRequiredField(field) {
            this.errors = this.errors.filter(item => item !== field)
        },
        changeAccount: async function () {
            const account = this.data.account
            if (account === '') {
                this.data.client = ''
                this.data.site = ''
            }

            this.clearFields()

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
                const vigilants = this.data?.guardGroup?.vigilants || []
                this.vigilants = vigilants
                this.data.vigilants = vigilants
            } else {
                this.vigilants = await Services.getVigilantsBySite(this, this.data.site)
                this.data.vigilants = []
            }
        },
        save() {
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
                            Common.show(this, 'bottom-right', 'success', this.$t('str.form.create.success'))
                            // this.clearForm()
                            this.$bvModal.hide('createScheduleModal')
                        }
                    },
                    error => {
                        this.isLoading = false
                        Common.show(this, 'bottom-right', 'warn', this.$t(this.data._id ? 'str.form.update.generic.error' : 'str.form.save.generic.error'))
                        console.log(error)
                    },
                )
            } catch (error) {
                this.isLoading = false
                Common.show(this, 'bottom-right', 'warn', this.$t(this.data._id ? 'str.form.update.generic.error' : 'str.form.save.generic.error'))
                console.log(error)
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
            if (!this.data.frequency || this.data.frequency === '') {
                this.errors.push('frequency')
            }
            if (!this.data.endDate || this.data.endDate === '') {
                this.errors.push('endDate')
            }
            if (!this.data.points || this.data.points.length === 0) {
                this.errors.push('points')
            }

            if (!this.data.guardGroup || this.data.guardGroup === '') {
                delete this.data.guardGroup
            }

            if (!this.errors || this.errors.length === 0) {
                this.save()
            }
        },
        async selectAllVigilants() {
            if (!this.data.guardGroup) this.data.vigilants = this.vigilants ? this.vigilants : await Services.getVigilantsBySite(this, this.data.site)
            else this.data.vigilants = this.data.guardGroup.vigilants
        },
        removeAllVigilants() {
            this.data.vigilants = []
        },
        clearFields() {
            this.data.vigilants = []
            this.data.points = []
            this.guardGroups = []
            this.patrolPoints = []
            this.vigilants = []
        },
        clearForm() {
            this.errors = []
            this.data = {
                guardGroup: '',
                account: '',
                client: '',
                site: '',
                frequency: '',
                points: [],
                vigilants: [],
                weeklyDays: [],
                beginDate: '',
                endDate: '',
                type: 'FREE-PROGRAM',
                status: 'ACTIVE',
            }
            if (this.isSuperAdminMaster) {
                this.clients = []
                this.sites = []
            } else this.data.account = Common.getAccountId(this)

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
            // this.rowSelection = params.selectedRows
        },
        isEnabledBtnSave: function () {
            return this.data.name && this.data.frequency && this.data.vigilants.length > 0 && this.data.points.length > 0 && this.data.beginDate && this.data.endDate && this.data.client && this.data.site
        },
        selectItem() {},
    },
}
</script>
