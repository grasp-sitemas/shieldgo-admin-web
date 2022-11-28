<script>
import Endpoints from '../../../common/Endpoints.vue'
import Request from '../../../common/Request.vue'
import Common from '../../../common/Common.vue'
import Services from '../../../common/Services.vue'

export default {
    init: async payload => {
        payload.data.account = Common.getAccountId(payload)

        payload.isSuperAdminMaster = await Common.isSuperAdminMaster(payload)
        if (payload.isSuperAdminMaster) {
            payload.accounts = await Services.getAccounts(payload)
        } else {
            payload.clients = await Services.getClients(payload)
        }
    },
    methods: {
        clearForm() {
            this.errors = []
            this.data = {
                name: '',
                notes: '',
                type: '',
                account: '',
                client: '',
                site: '',
                geolocation: {
                    latitude: '',
                    longitude: '',
                },
                radius: null,
                address: {},
                status: 'ACTIVE',
            }
            this.data.account = Common.getAccountId(this)
            this.isLoading = false
        },
        save() {
            this.isLoading = true
            this.data.geolocation.latitude = this.data?.geolocation?.latitude.toString()
            this.data.geolocation.longitude = this.data?.geolocation?.longitude.toString()

            if (this.data.radius) this.data.radius = Number(this.data.radius)

            try {
                Request.do(
                    this,
                    this.data._id ? 'put' : 'post',
                    Request.getDefaultHeader(this),
                    this.data,
                    `${Endpoints.patrolPoints.patrolPoint}${this.data._id ? this.data._id : ''}`,
                    response => {
                        if (response.status === 200) {
                            Common.show(this, 'bottom-right', 'success', this.data._id ? this.$t('str.form.update.success') : this.$t('str.form.create.success'))
                            this.data = response?.result
                            this.isLoading = false
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
                    `${Endpoints.patrolPoints.patrolPoint}${this.data._id}`,
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
        checkRangeValue: function () {
            if (this.data.radius < 0) {
                this.data.radius = 0
            }
            if (this.data.radius > 25000) {
                this.data.radius = 25000
            }
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

        openCheckPointModal() {
            this.clearForm()
            this.$bvModal.show('checkPointModal')
        },
    },
}
</script>
