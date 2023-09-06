<script>
import Endpoints from '../../../common/Endpoints.vue'
import Request from '../../../common/Request.vue'
import Common from '../../../common/Common.vue'
import Services from '../../../common/Services.vue'

const instanceateAddress = (addressObj, geo) => {
    addressObj.name = 'MAIN'
    if (geo.geometry.lat) {
        addressObj.lat = geo.geometry.lat
    } else return null
    if (geo.geometry.lng) {
        addressObj.lng = geo.geometry.lng
    } else return null

    return addressObj
}

export default {
    init: async payload => {
        payload.data.account = await Common.getAccountId(payload)
        // await payload.getMe()

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
        payload.role = role
    },
    methods: {
        // async getMe() {
        //     Request.do(
        //         this,
        //         'get',
        //         Request.getDefaultHeader(this),
        //         {},
        //         `${Endpoints.systemUsers.getMe}`,
        //         response => {
        //             if (response) {
        //                 this.user = response?.result
        //                 this.$session.set('user', this.user)
        //             }
        //         },
        //         error => {
        //             console.log(error)
        //         },
        //     )
        // },
        async clearForm() {
            this.errors = []
            this.data = this.patrolPointObj
            this.data.account = await Common.getAccountId(this)
            this.isLoading = false
        },
        async save() {
            this.data.geolocation.latitude = this.data?.geolocation?.latitude.toString()
            this.data.geolocation.longitude = this.data?.geolocation?.longitude.toString()

            if (this.data.radius) this.data.radius = Number(this.data.radius)

            if(this.data?.type === 'SUPERVISION'){
                delete this.data.site
            }

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
                            this.$registerEvent.$emit('refreshList')
                            this.closeModal()
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
         openMapModal(row) {
        // You can do any necessary data processing here before opening the map modal
        // For example, you can set the relevant data to your component's data properties
        this.patrolPointItem = row;

        // Then, show the map modal
        this.$bvModal.show('mapModal');
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
        async closeModal() {
            this.clearForm()
            this.$bvModal.hide('createPatrolPointModal')
        },
        checkRequiredField(field) {
            return this.errors.includes(field)
        },
        removeRequiredField(field) {
            this.errors = this.errors.filter(item => item !== field)
        },
        async checkForm() {
            if (this.isLoading) return

            if (!this.data.account || this.data.account === '') {
                this.errors.push('account')
            }
            if (!this.data.client || this.data.client === '') {
                this.errors.push('client')
            }
            if (this.data?.type === 'QRCODE' && (!this.data.site || this.data.site === '')) {
                this.errors.push(this.$t('site'))
            }
            if (!this.data.name || this.data.name === '') {
                this.errors.push(this.$t('name'))
            }
            if (this.data.priority === null || this.data.priority === '') {
                this.errors.push(this.$t('priority'))
            }

            if (!this.errors || this.errors.length === 0) {
                this.isLoading = true

                if(this.data?.address?.cep?.length < 9 || !this.data?.address?.cep){
                    delete this.data.address
                    await this.save()
                }else{
                    this.loadGeolocation(
                        async data => {
                            await this.save(data)
                        },
                        async error => {
                            this.data.address.name = 'MAIN'
                            await this.save(error)
                        },
                    )
                }
            }

        },
        inputCep() {
            if (this.data.address.cep.length === 9) this.loadInfosByCEP()
        },
        clearCep() {
            const cep = this.data?.address?.cep
            const address = {
                cep: cep,
                address: '',
                number: '',
                complement: '',
                neighborhood: '',
                city: '',
                state: '',
                ibge: '',
                gia: '',
            }
            this.data.address = address
        },
        handleCEPDelete(e) {
            if (e.key === 'Backspace' || e.key === 'Delete') {
                this.clearCep()
            }
        },
        clearAddress() {
            const address = {
                cep: this.data?.address?.cep,
                address: '',
                number: '',
                complement: '',
                neighborhood: '',
                city: '',
                state: '',
                ibge: '',
                gia: '',
            }
            this.data.address = address
        },
        loadInfosByCEP() {
            Request.do(
                this,
                'get',
                {},
                {},
                `${Endpoints.cep.find}${this.data.address.cep}/json`,
                response => {
                    if (response && !response.erro) {
                        this.removeRequiredField('allAddress')
                        this.data.address.address = response.logradouro
                        this.data.address.neighborhood = response.bairro
                        this.data.address.city = response.localidade
                        this.data.address.state = response.uf
                        this.data.address.ibge = response.ibge
                        this.data.address.gia = response.gia
                        this.$refs.numberField.focus()
                    } else {
                        this.clearAddress()
                    }
                },
                error => {
                    console.log(error)
                    this.clearAddress()
                },
            )
        },
        loadGeolocation: function (callbackSuccess, callbackError) {
            let state = this
            Request.do(
                this,
                'POST',
                Request.getDefaultHeader(this),
                this.data.address,
                `${Endpoints.addresses.geolocation}`,
                geoResponse => {
                    if (geoResponse.results.length == 0) {
                        return callbackError(this.$t('string.company.register.address.invalid'))
                    } else if (geoResponse.results.length == 1) {
                        let addressObj = instanceateAddress(state.data.address, geoResponse.results[0])
                        if (addressObj) {
                            return callbackSuccess(state.data)
                        } else {
                            return callbackError(state.$t('string.company.register.address.invalid'))
                        }
                    } else if (geoResponse.results.length > 1) {
                        state.addresses = geoResponse.results
                    }
                },
                error => {
                    console.log(error)
                },
            )
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
            this.data = item ? item : this.patrolPointObj

            if (item.account) {
                this.clients = await Services.getClientsByAccount(this, item.account)
            }

            if (item.client) {
                this.sites = await Services.getSitesByClient(this, item.client)
            }

            this.$bvModal.show('createPatrolPointModal')
        },
    },
}
</script>
