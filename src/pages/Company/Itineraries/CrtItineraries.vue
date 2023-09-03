<script>
import Endpoints from '../../../common/Endpoints.vue'
import Request from '../../../common/Request.vue'
import Common from '../../../common/Common.vue'
import Services from '../../../common/Services.vue'

export default {
    init: async payload => {
        payload.data.account = Common.getAccountId(payload)

        payload.initTable()

        payload.isSuperAdminMaster = await Common.isSuperAdminMaster(payload)
        const role = await Common.getSubtype(payload)
        if (role === 'SUPER_ADMIN_MASTER') {
            payload.accounts = await Services.getAccounts(payload)
        } else if (role === 'ADMIN' || role === 'MANAGER') {
            payload.clients = await Services.getClients(payload)
        }
        payload.role = role
    },
    methods: {
        async save() {
           
            try {
                Request.do(
                    this,
                    this.data?._id ? 'put' : 'post',
                    Request.getDefaultHeader(this),
                    this.data,
                    `${Endpoints.itineraries.itinerary}${this.data._id ? this.data._id : ''}`,
                    async response => {
                        if (response.status === 200) {
                            Common.show(this, 'bottom-right', 'success', this.data._id ? this.$t('str.form.update.success') : this.$t('str.form.create.success'))
                            this.isLoading = false
                            this.$registerEvent.$emit('refreshList')
                            await this.closeModal()
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
        },
        archive() {
            try {
                Request.do(
                    this,
                    'DELETE',
                    Request.getDefaultHeader(this),
                    this.data,
                    `${Endpoints.itineraries.itinerary}${this.data._id}`,
                    response => {
                        if (response.status === 200) {
                            Common.show(this, 'bottom-right', 'success', this.$t('str.form.archive.success'))
                            this.$registerEvent.$emit('refreshList')
                            this.closeModal()
                        }
                    },
                    error => {
                        console.log(error)
                        Common.show(this, 'bottom-right', 'warn', this.$t('str.form.archive.generic.error'))
                    },
                )
            } catch (error) {
                console.log(error)
                Common.show(this, 'bottom-right', 'warn', this.$t('str.form.archive.generic.error'))
            }
        },
        async initTable() {
            this.columns = [
                {
                    label: this.$t('str.table.site.groups.column.name'),
                    field: 'name',
                    width: '60%',
                    thClass: 'text-nowrap',
                    tdClass: 'text-nowrap',
                    sortable: true,
                    filterable: true,
                },
                {
                    label: this.$t('str.table.itineraries.column.geolocation'),
                    field: 'geolocation',
                    width: '20%',
                    thClass: 'text-nowrap',
                    tdClass: 'text-nowrap',
                    sortable: true,
                    filterable: true,
                },
                {
                    label: this.$t('str.table.site.groups.column.status'),
                    field: 'actions',
                    width: '20%',
                    tdClass: 'text-nowrap',
                    thClass: 'text-nowrap',
                    sortable: true,
                    filterable: true,
                },
            ]
            this.paginationOptions = {
                enabled: true,
                mode: 'records',
                perPage: 20,
                position: 'bottom',
                perPageDropdown: [10, 20, 50, 100,1000],
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
        confirmArchive() {
            this.$swal({
                title: this.$t('str.are.you.sure'),
                text: this.$t('str.are.you.sure.archive'),
                showCancelButton: true,
                buttonsStyling: false,
                confirmButtonText: this.$t('str.title.archive'),
                cancelButtonText: this.$t('str.btn.cancel'),
                confirmButtonClass: 'btn me-5px btn-warning',
                cancelButtonClass: 'btn btn-default',
            }).then(result => {
                if (result.isConfirmed && result.value) {
                    this.archive()
                }
            })
        },
        checkRequiredField(field) {
            return this.errors.includes(field)
        },
        removeRequiredField(field) {
            this.errors = this.errors.filter(item => item !== field)
        },
        showMap() {
            this.$bvModal.show('mapModal')
        },
        selectItem(item) {
            this.patrolPointItem = item
        },
        async checkForm() {
            if (!this.isLoading) {
                this.isLoading = true

                if (!this.data.name || this.data.name === '') {
                    this.errors.push('name')
                }
                if (!this.data.account || this.data.account === '') {
                    this.errors.push('account')
                }
                if (!this.data.client || this.data.client === '') {
                    this.errors.push('client')
                }
                if (!this.data.patrolPoints || this.data.patrolPoints.length === 0) {
                    this.errors.push('checkpoints')
                }

                if (!this.errors || this.errors.length === 0) {
                    await this.save()
                } else {
                    this.isLoading = false
                }
            }
        },
        closeModal: async function () {
            const state = this
            state.errors = []
            state.selectedCheckpoints = []
            state.isLoading = false
            state.data = state.itineraryObj

            state.$bvModal.hide('createItineraryModal')
        },
        changeAccount: async function () {
            this.data.client = ''
            this.checkpoints = []

            this.selectedCheckpoints = []
            this.data.patrolPoints = []

            const account = this.data.account
            this.clients = await Services.getClientsByAccount(this, account)
        },
        changeClient: async function () {
            this.selectedCheckpoints = []
            const client = this.data.client

            if (client === '') {
                this.data.patrolPoints = []
            }else{
                const filter = {
                    account: this.data?.account,
                    client: this.data?.client,
                    status: 'ACTIVE',
                    type: 'SUPERVISION'
                }

                this.checkpoints = await Services.getSupervisoryPointByClient(this, filter)
            }
        },
        selectAllCheckpoints() {
            this.selectedCheckpoints = this.checkpoints
            if (this.clients.length > 0) {
                this.removeRequiredField('checkpoints')
            }
        },
        removeAllCheckpoints() {
            this.selectedCheckpoints = []
        },
        addCheckpoints: function () {
            // only add checkpoints that are not already in the data.patrolpoints
            const checkpointsToAdd = this.selectedCheckpoints.filter(item => !this.data.patrolPoints.includes(item))
            this.data.patrolPoints = this.data.patrolPoints.concat(checkpointsToAdd)

            if(this.data.patrolPoints.length > 0){
                this.removeRequiredField('checkpoints')
            }

            this.selectedCheckpoints = []
        },
        removeItem: function (item) {
            this.data.patrolPoints = this.data.patrolPoints.filter(itemToRemove => itemToRemove._id !== item._id)
        },
    },
}
</script>
