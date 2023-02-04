<script>
import Endpoints from '../../../common/Endpoints.vue'
import Request from '../../../common/Request.vue'
import Common from '../../../common/Common.vue'
import Services from '../../../common/Services.vue'
import { INCIDENT_TEMPLATES_PT, INCIDENT_TEMPLATES_EN } from './utils/incidents.js'

export default {
    init: async payload => {
        payload.data.account = await Common.getAccountId(payload)

        payload.isSuperAdminMaster = await Common.isSuperAdminMaster(payload)
        const role = await Common.getSubtype(payload)
        if (role === 'SUPER_ADMIN_MASTER') {
            payload.accounts = await Services.getAccounts(payload)
        } else if (role === 'ADMIN' || role === 'MANAGER') {
            payload.clients = await Services.getClients(payload)
        } else if (role === 'OPERATOR') {
            const client = await Common.getClientId(payload)
            payload.data.client = client
            payload.sites = await Services.getSites(payload)
        }

        const user = payload.$session.get('user')
        payload.templates = user?.language === 'pt' ? INCIDENT_TEMPLATES_PT : INCIDENT_TEMPLATES_EN
    },
    methods: {
        clearForm() {
            this.errors = []
            this.data = this.incidentObj
            this.data.account = Common.getAccountId(this)
            this.isLoading = false
        },
        async save() {
            if (!this.isLoading) {
                this.isLoading = true

                try {
                    Request.do(
                        this,
                        this.data._id ? 'put' : 'post',
                        Request.getDefaultHeader(this),
                        this.data,
                        `${Endpoints.incidents.incident}${this.data._id ? this.data._id : ''}`,
                        response => {
                            if (response.status === 200) {
                                Common.show(this, 'bottom-right', 'success', this.data._id ? this.$t('str.form.update.success') : this.$t('str.form.create.success'))
                                this.data = response?.result
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
            }
        },
        archive() {
            try {
                Request.do(
                    this,
                    'DELETE',
                    Request.getDefaultHeader(this),
                    this.data,
                    `${Endpoints.incidents.incident}${this.data._id}`,
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
        async checkForm() {
            if (!this.data.account || this.data.account === '') {
                this.errors.push('account')
            }

            if (!this.data.client || this.data.client === '') {
                this.errors.push('client')
            }

            if (!this.data.site || this.data.site === '') {
                this.errors.push(this.$t('site'))
            }

            if (!this.data.name || this.data.name === '') {
                this.errors.push(this.$t('name'))
            }

            if (this.data.priority === null || this.data.priority === '') {
                this.errors.push(this.$t('priority'))
            }

            if (!this.errors || this.errors.length === 0) {
                await this.save()
            }
        },
        checkCompanyFields() {
            if (!this.data.account || this.data.account === '') {
                this.errors.push('account')
            }
            if (!this.data.client || this.data.client === '') {
                this.errors.push('client')
            }
            if (!this.data.site || this.data.site === '') {
                this.errors.push(this.$t('site'))
            }
        },
        changeAccount: async function () {
            const account = this.data.account

            this.sites = []
            this.data.client = ''
            this.data.site = ''

            this.clients = await Services.getClientsByAccount(this, account)
        },

        changeClient: async function () {
            const client = this.data.client

            if (client === '') {
                this.data.site = ''
            }

            this.sites = await Services.getSitesByClient(this, client)
        },
        changeRole: async function () {
            this.data.client = ''
            this.data.site = ''
        },
        selectItem: async function (item) {
            this.errors = []
            this.data = item

            if (item.account) {
                this.clients = await Services.getClientsByAccount(this, item.account)
            }

            if (item.client) {
                this.sites = await Services.getSitesByClient(this, item.client)
            }

            document.body.scrollTop = 0 // For Safari
            document.documentElement.scrollTop = 0 // For Chrome, Firefox, IE and Opera
        },
    },
}
</script>
