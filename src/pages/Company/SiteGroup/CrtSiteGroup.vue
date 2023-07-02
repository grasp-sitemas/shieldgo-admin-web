<script>
import Endpoints from '../../../common/Endpoints.vue'
import Request from '../../../common/Request.vue'
import Common from '../../../common/Common.vue'
import Services from '../../../common/Services.vue'

export default {
    init: async payload => {
        payload.data.account = Common.getAccountId(payload)

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
            const formData = this.data

            try {
                Request.do(
                    this,
                    formData._id ? 'put' : 'post',
                    Request.getDefaultHeader(this),
                    formData,
                    `${Endpoints.siteGroups.siteGroup}${formData._id ? formData._id : ''}`,
                    response => {
                        if (response.status === 200) {
                            this.closeModal()

                            Common.show(this, 'bottom-right', 'success', formData._id ? this.$t('str.form.update.success') : this.$t('str.form.create.success'))
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
                    `${Endpoints.siteGroups.siteGroup}${this.data._id}`,
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
            this.errors = this.errors.filter(item => item !== field)
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
                if (!this.data.sites || this.data.sites.length === 0) {
                    this.errors.push('sites')
                }

                if (!this.errors || this.errors.length === 0) {
                    await this.save()
                } else {
                    this.isLoading = false
                }
            }
        },
        closeModal: function () {
            const state = this
            state.errors = []
            state.selectedSites = []
            state.isLoading = false
            state.data = state.siteGroupObj

            state.$bvModal.hide('createSiteGroupModal')
        },
        changeAccount: async function () {
            this.sites = []
            this.data.client = ''
            this.data.sites = []
            this.selectedSites = []

            const account = this.data.account

            this.clients = await Services.getClientsByAccount(this, account)
        },
        changeClient: async function () {
            const client = this.data.client

            this.selectedSites = []

            if (client === '') {
                this.data.sites = []
            }

            this.sites = await Services.getSitesByClient(this, client)
        },
        selectAllSites() {
            this.selectedSites = this.sites
            if (this.clients.length > 0) {
                this.removeRequiredField('sites')
            }
        },
        removeAllSites() {
            this.selectedSites = []
        },
        addSiteGroup: function () {
            // only add sites that are not already in the data.sites
            const sitesToAdd = this.selectedSites.filter(item => {
                return !this.data.sites.some(site => site._id === item._id)
            })

            this.data.sites = this.data.sites.concat(sitesToAdd)
        },
        removeSite: function (site) {
            this.data.sites = this.data.sites.filter(item => item !== site)
        },
    },
}
</script>
