<script>
import Endpoints from '../../../common/Endpoints.vue'
import Request from '../../../common/Request.vue'
import Services from '../../../common/Services.vue'
import Common from '../../../common/Common.vue'

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
        payload.data.account = Common.getAccountId(payload)

        payload.isSuperAdminMaster = await Common.isSuperAdminMaster(payload)
        if (payload.isSuperAdminMaster) {
            payload.accounts = await Services.getAccounts(payload)
        } else {
            payload.clients = await Services.getClients(payload)
        }
    },
    methods: {
        inputCep() {
            if (this.data.address.cep.length === 9) this.loadInfosByCEP()
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
                    }
                },
                error => {
                    console.log(error)
                },
            )
        },
        clearForm() {
            this.errors = []
            this.file = null
            this.data = {
                name: '',
                logoURL: '',
                client: '',
                account: '',
                address: {
                    cep: '',
                    address: '',
                    number: '',
                    complement: '',
                    neighborhood: '',
                    city: '',
                    state: '',
                    ibge: '',
                    gia: '',
                },
                type: 'SITE',
                status: 'ACTIVE',
            }
            this.isLoading = false
        },
        save() {
            let formData = new FormData()

            formData.append('file', this.file)
            formData.append('jsonData', JSON.stringify(this.data))

            try {
                Request.do(
                    this,
                    this.data._id ? 'put' : 'post',
                    Request.getDefaultHeader(this),
                    formData,
                    `${Endpoints.companies.formData}${this.data._id ? this.data._id : ''}`,
                    response => {
                        if (response.status === 200) {
                            Common.show(this, 'bottom-right', 'success', this.data._id ? this.$t('str.form.update.success') : this.$t('str.form.create.success'))
                            const { _id, status, logoURL } = response?.result
                            this.data._id = _id
                            this.data.status = status
                            this.data.logoURL = logoURL
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
                    `${Endpoints.companies.company}${this.data._id}`,
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
            if (!this.data.address.cep && this.data.address.cep === '') {
                this.errors.push('cep')
            }
            if (!this.data.address.address && this.data.address.address === '') {
                this.errors.push('address')
            }
            if (!this.data.address.number && this.data.address.number === '') {
                this.errors.push('number')
            }
            if (!this.data.address.neighborhood && this.data.address.neighborhood === '') {
                this.errors.push('neighborhood')
            }
            if (!this.data.address.city && this.data.address.city === '') {
                this.errors.push('city')
            }
            if (!this.data.address.state && this.data.address.state === '') {
                this.errors.push('state')
            }

            if (!this.errors || this.errors.length === 0) {
                this.isLoading = true

                this.loadGeolocation(
                    async data => {
                        await this.save(data)
                        this.isLoading = false
                    },
                    async error => {
                        this.data.address.name = 'MAIN'
                        await this.save(error)
                        this.isLoading = false
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
                error => {
                    console.log(error)
                },
            )
        },
        selectItem: async function (item) {
            this.errors = []
            this.file = null
            this.data = item

            if (item.account) {
                this.clients = await Services.getClientsByAccount(this, item.account)
            }

            document.body.scrollTop = 0 // For Safari
            document.documentElement.scrollTop = 0 // For Chrome, Firefox, IE and Opera
        },
        changeAccount: async function () {
            const account = this.data.account

            this.data.client = ''

            this.clients = await Services.getClientsByAccount(this, account)
        },
    },
}
</script>
