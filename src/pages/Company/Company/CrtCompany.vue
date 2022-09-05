<script>
import Endpoints from '../../../common/Endpoints.vue'
import Request from '../../../common/Request.vue'

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
    init: payload => {
        payload.domain = Endpoints.domain
    },
    methods: {
        onChangeDocument() {
            this.data.document = ''
        },
        hasUnderline() {
            return this.data.address.cep.indexOf('_') > -1
        },
        inputCep() {
            this.removeRequiredField('cep')
            if (this.data.address.cep.length === 9) this.loadInfosByCEP()
        },
        loadInfosByCEP() {
            if (this.hasUnderline() || this.data.address.cep.length < 9) {
                return
            }

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
            this.data = {
                name: '',
                fantasyName: '',
                DocumentType: '',
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
        },
        save() {
            const data = JSON.parse(JSON.stringify(this.data))
            let formData = new FormData()

            formData.append('file', this.file)
            formData.append('jsonData', JSON.stringify(data))

            try {
                Request.do(
                    this,
                    data._id ? 'put' : 'post',
                    Request.getDefaultHeader(this),
                    formData,
                    `${Endpoints.companies.formData}${data._id ? data._id : ''}`,
                    response => {
                        if (response.status === 200) {
                            this.data = response.result
                            this.valuekey += 1
                            this.$registerEvent.$emit('refreshList')
                            console.log(JSON.stringify(response.result))
                        }
                    },
                    error => {
                        console.log(error)
                    },
                )
            } catch (error) {
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
                        console.log('response', response)
                        if (response.status === 200) {
                            this.clearForm()
                            this.valuekey += 1
                            this.$registerEvent.$emit('refreshList')
                        }
                    },
                    error => {
                        console.log(error)
                    },
                )
            } catch (error) {
                console.log(error)
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
                this.errors = this.errors.filter(item => item !== 'address' && item !== 'number' && item !== 'neighborhood' && item !== 'city' && item !== 'state')
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

            if (!this.errors || this.errors.length === 0)
                this.loadGeolocation(
                    data => {
                        this.save(data)
                    },
                    error => {
                        console.log(error)
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
        selectItem: function (item) {
            this.data = item
            document.body.scrollTop = 0 // For Safari
            document.documentElement.scrollTop = 0 // For Chrome, Firefox, IE and Opera
        },
        handleFileUpload() {
            this.file = this.$refs.file.files[0]
        },
    },
}
</script>
