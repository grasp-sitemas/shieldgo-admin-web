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
        payload.domain = Endpoints.domain
        payload.isSuperAdminMaster = await Common.isSuperAdminMaster(payload)

        const role = await Common.getSubtype(payload)
        if (role === 'SUPER_ADMIN_MASTER') {
            payload.accounts = await Services.getAccounts(payload)
            payload.clients = await Services.getClients(payload)
        } else if (role === 'ADMIN' || role === 'MANAGER') {
            payload.clients = await Services.getClients(payload)
            payload.data.account = Common.getAccountId(payload)
        } else if (role === 'OPERATOR') {
            payload.data.account = Common.getAccountId(payload)
            payload.sites = await Services.getSites(payload)
        }
    },
    methods: {
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
        clearForm() {
            this.errors = []
            this.file = null
            this.$refs.file.value = null
            this.data = this.vigilantObj
            this.isLoading = false
        },
        async save() {
            let formData = new FormData()

            formData.append('file', this.file)
            formData.append('jsonData', JSON.stringify(this.data))

            try {
                Request.do(
                    this,
                    this.data._id ? 'put' : 'post',
                    Request.getDefaultHeader(this),
                    formData,
                    `${Endpoints.systemUsers.formData}${this.data._id ? this.data._id : ''}`,
                    response => {
                        if (response.status === 200) {
                            Common.show(this, 'bottom-right', 'success', this.data._id ? this.$t('str.form.update.success') : this.$t('str.form.create.success'))
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
                    `${Endpoints.systemUsers.systemUser}${this.data.email}`,
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
        async checkForm() {
            if (this.isLoading) return

            if (!this.data.customerUser?.subtype || this.data.customerUser?.subtype === '') {
                alert('subtype')
                this.errors.push('subtype')
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
            if (!this.data.firstName || this.data.firstName === '') {
                this.errors.push('firstName')
            }
            if (!this.data.lastName || this.data.lastName === '') {
                this.errors.push('lastName')
            }
            if (!this.data.username || this.data.username === '') {
                this.errors.push(this.$t('username'))
            }
            if (!this.data.email || this.data.email === '') {
                this.errors.push(this.$t('email'))
            }
            if (!this.data._id && (!this.data.password || this.data.password === '')) {
                this.errors.push(this.$t('password'))
            }

            if (!this.data.client || this.data.client === '') {
                this.data.client === ''
            }

            if (!this.data.site || this.data.site === '') {
                this.data.site === ''
            }

            if (!this.errors || this.errors.length === 0) {
                this.isLoading = true
                const resEmail = await Services.emailAlreadyExists(this, this.data.email)
                if ((resEmail.alreadyExist && !this.data._id) || (resEmail.alreadyExist && this.data._id && resEmail._id !== this.data._id)) {
                    Common.show(this, 'bottom-right', 'warn', this.$t('str.email.already.in.use'))
                    this.isLoading = false
                    this.errors.push(this.$t('email'))

                    return
                }

                const resUsername = await Services.usernameAlreadyExists(this, this.data.username)

                if ((resUsername.alreadyExist && !this.data._id) || (resUsername.alreadyExist && this.data._id && resUsername._id !== this.data._id)) {
                    Common.show(this, 'bottom-right', 'warn', this.$t('str.username.already.in.use'))
                    this.isLoading = false
                    this.errors.push(this.$t('username'))

                    return
                }

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
                async error => {
                    this.data.address.name = 'MAIN'
                    await this.save(error)
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
        async closeModal() {
            this.clearForm()
            this.$bvModal.hide('createGuardModal')
        },
        handleFileUpload() {
            this.file = this.$refs.file.files[0]
        },
        isValidEmail: Common.isValidEmail,
    },
}
</script>
