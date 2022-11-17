<script>
import Endpoints from '../../../common/Endpoints.vue'
import Request from '../../../common/Request.vue'
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
        await payload.getMe()
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
                    if (response) {
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
            this.$refs.file.value = null
            this.data = {
                name: '',
                fantasyName: '',
                personType: '',
                document: '',
                email: '',
                primaryPhone: '',
                secondaryPhone: '',
                logoURL: '',
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
                type: 'ACCOUNT',
                status: 'ACTIVE',
            }
            this.isProcessing = false
        },
        getMe() {
            Request.do(
                this,
                'get',
                Request.getDefaultHeader(this),
                {},
                `${Endpoints.systemUsers.getMe}`,
                response => {
                    if (response) {
                        const result = response?.result
                        const role = result?.companyUser?.subtype
                        if (role === 'SUPER_ADMIN_MASTER' || role === 'SUPER_ADMIN') {
                            this.data = result?.company
                        } else if (role === 'ADMIN') {
                            this.data = result?.account
                        } else if (role === 'MANAGER') {
                            this.data = result?.client
                        } else if (role === 'OPERATOR') {
                            this.data = result?.site
                        }

                        const address = this.data?.address
                        if (!address?.cep) {
                            this.data.address = {
                                cep: '',
                                address: '',
                                number: '',
                                complement: '',
                                neighborhood: '',
                                city: '',
                                state: '',
                                ibge: '',
                                gia: '',
                            }
                        }

                        this.isLoading = false
                    }
                },
                error => {
                    this.isLoading = false
                    console.log(error)
                },
            )
        },
        save() {
            let formData = new FormData()

            formData.append('file', this.file)
            formData.append('jsonData', JSON.stringify(this.data))
            try {
                Request.do(
                    this,
                    'put',
                    Request.getDefaultHeader(this),
                    formData,
                    `${Endpoints.companies.formData}${this.data._id}`,
                    response => {
                        if (response.status === 200) {
                            const result = response?.result
                            this.data.logoURL = result?.logoURL
                            this.$registerEvent.$emit('updateMenu')
                            Common.show(this, 'bottom-right', 'success', this.$t('str.form.update.success'))
                        }
                    },
                    error => {
                        this.isProcessing = false
                        Common.show(this, 'bottom-right', 'warn', this.$t('str.form.update.generic.error'))
                        console.log(error)
                    },
                )
            } catch (error) {
                this.isProcessing = false
                Common.show(this, 'bottom-right', 'warn', this.$t('str.form.update.generic.error'))
                console.log(error)
            }
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
                this.isProcessing = true

                this.loadGeolocation(
                    async data => {
                        await this.save(data)
                        this.isProcessing = false
                    },
                    error => {
                        this.isProcessing = false
                        console.log(error)
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
        handleFileUpload() {
            this.file = this.$refs.file.files[0]
        },
    },
}
</script>
