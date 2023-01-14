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
        } else if (role === 'ADMIN') {
            payload.clients = await Services.getClients(payload)
        }
        payload.role = role
    },
    methods: {
        clearForm() {
            this.errors = []
            this.data = {
                name: '',
                sites: [],
                account: '',
                client: '',
                status: 'ACTIVE',
            }
            this.selectedSites = []
            this.clients = []

            this.data.account = Common.getAccountId(this)
            this.isLoading = false
        },
        save() {
            if (this.isLoading) return

            this.isLoading = true

            const formData = this.data
            const sites = this.data.sites

            formData.sites = formData.sites.map(site => site._id)

            try {
                Request.do(
                    this,
                    formData._id ? 'put' : 'post',
                    Request.getDefaultHeader(this),
                    formData,
                    `${Endpoints.siteGroups.siteGroup}${formData._id ? formData._id : ''}`,
                    response => {
                        if (response.status === 200) {
                            Common.show(this, 'bottom-right', 'success', formData._id ? this.$t('str.form.update.success') : this.$t('str.form.create.success'))
                            this.data.status = response?.result?.status
                            this.data._id = response?.result?._id
                            this.data.sites = sites
                            this.$registerEvent.$emit('refreshList')
                            this.isLoading = false
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
                            this.clearForm()
                            this.$registerEvent.$emit('refreshList')
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
            if (!this.data.sites || this.data.sites.length === 0) {
                this.errors.push('sites')
            }

            if (!this.errors || this.errors.length === 0) {
                this.save()
            }
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
        selectItem: async function (item) {
            this.errors = []

            this.data = item

            const client = this.data.client

            this.sites = await Services.getSitesByClient(this, client)

            document.body.scrollTop = 0 // For Safari
            document.documentElement.scrollTop = 0 // For Chrome, Firefox, IE and Opera
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
