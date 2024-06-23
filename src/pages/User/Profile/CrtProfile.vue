<script>
import Endpoints from '../../../common/Endpoints.vue'
import Request from '../../../common/Request.vue'
import Common from '../../../common/Common.vue'
import Cropper from 'cropperjs'
import 'cropperjs/dist/cropper.css'

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

        payload.getMe()
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
                    if (response) {
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
        getMe() {
            Request.do(
                this,
                'get',
                Request.getDefaultHeader(this),
                {},
                `${Endpoints.systemUsers.getMe}`,
                response => {
                    if (response?.status === 200) {
                        this.data = response.result

                        const address = response.result?.address
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
            if (this.previewImage) {
                const file = this.dataURLtoFile(this.previewImage, 'photo.png')
                formData.append('file', file)
            }
            formData.append('jsonData', JSON.stringify(this.data))

            try {
                Request.do(
                    this,
                    'put',
                    Request.getDefaultHeader(this),
                    formData,
                    `${Endpoints.systemUsers.formData}${this.data._id}`,
                    response => {
                        if (response.status === 200) {
                            const result = response?.result
                            this.data.photoURL = result?.photoURL
                            this.$registerEvent.$emit('updateHeader')
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
            if (!this.data.firstName || this.data.firstName === '') {
                this.errors.push('firstName')
            }
            if (!this.data.lastName || this.data.lastName === '') {
                this.errors.push('lastName')
            }
            if (!this.data.email || this.data.email === '') {
                this.errors.push('email')
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
        onFileChange(e) {
            const file = e.target.files[0]
            if (file && (file.type === 'image/png' || file.type === 'image/jpeg')) {
                const reader = new FileReader()
                reader.onload = event => {
                    this.cropperImage = event.target.result
                    this.showCropper = true
                    this.$nextTick(() => {
                        const image = this.$refs.image
                        this.cropper = new Cropper(image, {
                            aspectRatio: 1 / 2,
                            viewMode: 1,
                            autoCropArea: 1,
                            responsive: true,
                            scalable: true,
                            zoomable: true,
                            movable: true,
                            minContainerWidth: 300,
                            minContainerHeight: 600,
                            minCanvasWidth: 300,
                            minCanvasHeight: 600,
                        })
                    })
                }
                reader.readAsDataURL(file)
            } else {
                e.target.value = null
            }
        },
        cropImage() {
            if (this.cropper) {
                const canvas = this.cropper.getCroppedCanvas({
                    width: 100,
                    height: 200,
                })
                this.previewImage = canvas.toDataURL()
                this.showCropper = false
                this.cropper.destroy()
                this.cropper = null
            }
        },
        closeCropper() {
            if (this.cropper) {
                this.cropper.destroy()
                this.cropper = null
            }
            this.showCropper = false
        },
        dataURLtoFile(dataurl, filename) {
            const arr = dataurl.split(',')
            const mime = arr[0].match(/:(.*?);/)[1]
            const bstr = atob(arr[1])
            let n = bstr.length
            const u8arr = new Uint8Array(n)
            while (n--) {
                u8arr[n] = bstr.charCodeAt(n)
            }
            return new File([u8arr], filename, { type: mime })
        },
    },
}
</script>
