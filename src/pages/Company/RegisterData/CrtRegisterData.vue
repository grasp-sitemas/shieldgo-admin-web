<script>
import Endpoints from '../../../common/Endpoints.vue'
import Request from '../../../common/Request.vue'
import Common from '../../../common/Common.vue'
import Cropper from 'cropperjs'

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
                `${Endpoints.systemUsers.companyUser.getMe}`,
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

                        this.$session.set('user', result)

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
                const file = this.dataURLtoFile(this.previewImage, 'logo.png')
                formData.append('file', file)
            }
            formData.append('jsonData', JSON.stringify(this.data))

            // let formData = new FormData()

            // formData.append('file', this.file)
            // formData.append('jsonData', JSON.stringify(this.data))
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
            if (!this.data.address.cep || this.data.address?.cep?.length !== 9) {
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
            const file = this.$refs.file.files[0]
            if (file && (file.type === 'image/png' || file.type === 'image/jpeg')) {
                this.file = file

                const reader = new FileReader()
                reader.onload = event => {
                    const img = new Image()
                    img.src = event.target.result
                    img.onload = () => {
                        const canvas = document.createElement('canvas')
                        const ctx = canvas.getContext('2d')
                        const targetSize = 180 // set target size
                        canvas.width = targetSize
                        canvas.height = targetSize

                        let width = img.width
                        let height = img.height
                        let offsetX = 0
                        let offsetY = 0

                        if (width > height) {
                            height = targetSize
                            width = (img.width / img.height) * targetSize
                            offsetX = (targetSize - width) / 2
                        } else {
                            width = targetSize
                            height = (img.height / img.width) * targetSize
                            offsetY = (targetSize - height) / 2
                        }

                        ctx.fillStyle = '#ffffff'
                        ctx.fillRect(0, 0, targetSize, targetSize)
                        ctx.drawImage(img, offsetX, offsetY, width, height)

                        this.previewImage = canvas.toDataURL(file.type)
                    }
                }
                reader.readAsDataURL(file)
            } else {
                this.$refs.file.value = null
            }
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
                            aspectRatio: 2 / 1,
                            viewMode: 1,
                            autoCropArea: 1,
                            responsive: true,
                            scalable: true,
                            zoomable: true,
                            movable: true,
                            minContainerWidth: 300,
                            minContainerHeight: 150,
                            minCanvasWidth: 300,
                            minCanvasHeight: 150,
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
                    width: 200,
                    height: 100,
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
