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

        payload.role = await Common.getSubtype(payload)

        if (payload.role === 'ADMIN' || payload.role === 'MANAGER') {
            payload.clients = await Services.getClients(payload)
            payload.siteGroups = await Services.getSiteGroupsByAccount(payload, payload.data.account)
            payload.clientGroups = await Services.getClientGroupsByAccount(payload, payload.data.account)
        }

        if (payload.role !== 'ADMIN' && payload.role !== 'SUPER_ADMIN_MASTER') {
            payload.roles = payload.roles.filter(role => role.value !== 'ADMIN')
        }
    },
    methods: {
        inputCep() {
            if (this.data.address.cep.length === 9) this.loadInfosByCEP()
        },
        changeAssignmentTypeByLocal() {
            this.data.site = ''
            this.data.siteGroup = ''
        },
        changeAssignmentTypeByClient() {
            this.data.client = ''
            this.data.clientGroup = ''
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
        closeModal() {
            this.clearFields()
            this.$bvModal.hide('createUserModal')
        },
        clearFields() {
            this.errors = []
            this.file = null
            this.$refs.file.value = null
            this.isLoading = false
            this.data = this.userObj
            this.archived = false
            this.unarchive = false

            if (!this.isSuperAdminMaster) {
                this.data.account = Common.getAccountId(this)
            }
        },
        async save() {
            if (this.archived && this.data.status === 'ACTIVE') {
                this.data.unarchive = true
            }

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
                            const { _id, status, photoURL, email } = response?.result
                            this.data._id = _id
                            this.data.status = status
                            this.data.photoURL = photoURL
                            this.data.email = email
                            this.data.oldEmail = email
                            this.data.password = ''
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
        click() {
            alert('click')
        },
        async checkForm() {
            if (this.isLoading) return

            if (!this.data?.companyUser?.subtype || this.data?.companyUser?.subtype === '') {
                this.errors.push('role')
            }

            if (!this.data.account || this.data.account === '') {
                this.errors.push('account')
            }

            if (this.data?.companyUser?.subtype === 'AUDITOR' || this.data?.companyUser?.subtype === 'OPERATOR') {
                if (!this.data.client || this.data.client === '') {
                    this.errors.push('client')
                }
            }

            if (this.data?.companyUser?.subtype === 'AUDITOR' || this.data?.companyUser?.subtype === 'OPERATOR') {
                if (!this.assignmentType || this.assignmentType === '') {
                    this.errors.push('assignmentType')
                }

                if (this.assignmentType === 'LOCAL_GROUP' && (!this.data.siteGroup || this.data.siteGroup === '')) {
                    this.errors.push('siteGroup')
                }

                if (!this.data.client || this.data.client === '') {
                    this.errors.push('client')
                }

                if (this.assignmentType === 'LOCAL' && (!this.data.site || this.data.site === '')) {
                    this.errors.push('site')
                }
            }

            if (this.data?.companyUser?.subtype === 'MANAGER') {
                if (this.assignmentType === 'CLIENT' && (!this.data.client || this.data.client === '')) {
                    this.errors.push('client')
                }

                if (!this.assignmentType || this.assignmentType === '') {
                    this.errors.push('assignmentType')
                }

                if (this.assignmentType === 'CLIENT_GROUP' && (!this.data.clientGroup || this.data.clientGroup === '')) {
                    this.errors.push('clientGroup')
                }
            }

            if (!this.data.firstName || this.data.firstName === '') {
                this.errors.push('firstName')
            }

            if (!this.data.lastName || this.data.lastName === '') {
                this.errors.push('lastName')
            }

            if (!this.data.email || this.data.email === '') {
                this.errors.push(this.$t('email'))
            }

            if (!this.data._id && (!this.data.password || this.data.password === '')) {
                this.errors.push(this.$t('password'))
            }

            if (!this.data.password || this.data.password === '') {
                delete this.data.password
            }

            if (!this.errors || this.errors.length === 0) {
                this.isLoading = true

                const resEmail = await Services.emailAlreadyExists(this, this.data.email)
                if ((resEmail.alreadyExist && !this.data._id) || (resEmail.alreadyExist && this.data._id && resEmail._id !== this.data._id)) {
                    Common.show(this, 'bottom-right', 'warn', this.$t('str.email.already.in.use'))
                    this.errors.push(this.$t('email'))
                    this.isLoading = false

                    return
                }

                if (!this.data.client || this.data.client === '') {
                    delete this.data.client
                }

                if (!this.data.site || this.data.site === '') {
                    delete this.data.site
                }

                if (!this.data.clientGroup || this.data.clientGroup === '') {
                    delete this.data.clientGroup
                }

                if (!this.data.siteGroup || this.data.siteGroup === '') {
                    delete this.data.siteGroup
                }

                this.loadGeolocation(
                    async data => {
                        await this.save(data)
                        console.log(data)
                    },
                    async error => {
                        this.data.address.name = 'MAIN'
                        console.log(error)
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
                    this.isLoading = false
                },
            )
        },
        changeAccount: async function () {
            const account = this?.data?.account

            this.sites = []
            this.siteGroups = []
            this.clientGroup
            this.data.client = ''
            this.data.site = ''

            this.clients = await Services.getClientsByAccount(this, account)
        },
        changeClient: async function () {
            const client = this?.data?.client
            this.data.site = ''
            this.data.siteGroup = ''

            if (!client === '') {
                this.sites = []
                this.siteGroups = []
            } else {
                this.sites = await Services.getSitesByClient(this, client)
                this.siteGroups = await Services.getSiteGroupsByClient(this, client)
            }
        },
        changeRole: async function () {
            const role = this?.data?.companyUser?.subtype
            if (role === 'ADMIN') {
                this.data.client = ''
                this.data.site = ''
                this.data.siteGroup = ''
                this.data.clientGroup = ''
                this.removeRequiredField('client')
                this.removeRequiredField('site')
                this.removeRequiredField('siteGroup')
                this.removeRequiredField('clientGroup')
            } else if (role === 'MANAGER' || role === 'OPERATOR' || role === 'AUDITOR') {
                this.data.site = ''
                this.data.siteGroup = ''
                this.removeRequiredField('siteGroup')
                this.removeRequiredField('site')
            }

            if (this?.data?.account) {
                if (role === 'MANAGER') {
                    this.clientGroups = await Services.getClientGroupsByAccount(this, this.data.account)
                }
            }
        },
        async changeClientGroup() {
            const clientGroup = this?.data?.clientGroup

            if (clientGroup === '') {
                this.data.site = ''
            }

            this.sites = await Services.getSitesByClientGroup(this, clientGroup)
        },

        handleFileUpload() {
            this.file = this.$refs.file.files[0]
        },
    },
}
</script>
