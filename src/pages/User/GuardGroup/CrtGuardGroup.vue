<script>
import Endpoints from '../../../common/Endpoints.vue'
import Request from '../../../common/Request.vue'
import Common from '../../../common/Common.vue'
import Services from '../../../common/Services.vue'

export default {
    init: async payload => {
        payload.domain = Endpoints.domain
        payload.data.account = Common.getAccountId(payload)

        payload.isSuperAdminMaster = await Common.isSuperAdminMaster(payload)
        if (payload.isSuperAdminMaster) {
            payload.accounts = await Services.getAccounts(payload)
        } else {
            payload.clients = await Services.getClients(payload)
        }
    },
    methods: {
        save() {
            this.isLoading = true
            try {
                Request.do(
                    this,
                    this.data._id ? 'put' : 'post',
                    Request.getDefaultHeader(this),
                    this.data,
                    `${Endpoints.guardGroups.guardGroup}${this.data._id ? this.data._id : ''}`,
                    response => {
                        if (response.status === 200) {
                            this.data.status = response?.result?.status
                            this.data._id = response?.result?._id
                            this.closeModal()
                            Common.show(this, 'bottom-right', 'success', this.data._id ? this.$t('str.form.update.success') : this.$t('str.form.create.success'))
                            this.$registerEvent.$emit('refreshList')
                        }
                    },
                    error => {
                        this.isLoading = false
                        Common.show(this, 'bottom-right', 'warn', this.$t('str.form.update.generic.error'))
                        console.log(error)
                    },
                )
            } catch (error) {
                this.isLoading = false
                Common.show(this, 'bottom-right', 'warn', this.$t('str.form.update.generic.error'))
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
                    `${Endpoints.guardGroups.guardGroup}${this.data._id}`,
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
            if (field === 'allAddress') {
                this.errors = this.errors.filter(item => item !== 'cep' && item !== 'address' && item !== 'number' && item !== 'neighborhood' && item !== 'city' && item !== 'state')
            } else {
                this.errors = this.errors.filter(item => item !== field)
            }
        },
        checkForm() {
            if (!this.data.name || this.data.name === '') {
                this.errors.push('name')
            }
            if (!this.data.account || this.data.account === '') {
                this.errors.push('account')
            }
            if (!this.data.client || this.data.client === '') {
                this.errors.push('client')
            }
            if (!this.data.site || this.data.site === '') {
                this.errors.push('site')
            }

            if (!this.data.client || this.data.client === '') {
                this.data.client === ''
            }

            if (!this.data.site || this.data.site === '') {
                this.data.site === ''
            }

            if (!this.errors || this.errors.length === 0) {
                this.save()
            }
        },
        changeAccount: async function () {
            this.sites = []
            this.data.client = ''
            this.data.site = ''
            this.data.vigilants = []
            this.clients = await Services.getClientsByAccount(this, this.data?.account)
        },
        changeClient: async function () {
            this.data.vigilants = []
            this.data.site = ''
            this.sites = await Services.getSitesByClient(this, this.data?.client)
        },
        changeSite: async function () {
            this.data.vigilants = []
            this.vigilants = await Services.getVigilantsBySite(this, this.data?.site)
        },
        changeRole: async function () {
            this.data.client = ''
            this.data.site = ''
        },
        closeModal: function () {
            const state = this

            Promise.all([(state.errors = []), (state.data = state.guardGroupObj), (state.vigilants = []), (state.isLoading = false)])

            if (!state.isSuperAdminMaster) {
                state.sites = []
            }

            state.$bvModal.hide('createGuardGroupModal')
        },
        async selectAllVigilants() {
            this.data.vigilants = this.vigilants
        },
        removeAllVigilants() {
            this.data.vigilants = []
        },
    },
}
</script>
