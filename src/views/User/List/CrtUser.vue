<script>
import Endpoints from '../../../components/common/Endpoints'
import Common from '../../../components/common/Common'
import Request from '../../../components/common/Request'

export default {
    init: payload => {
        const el = document.body
        el.removeAttribute('class')
        $('.modal').modal('hide')

        payload.listCompanies()
    },
    methods: {
        listCompanies: function () {
            this.companies = []
            Request.do(
                this,
                'GET',
                Request.getDefaultHeader(this),
                null,
                `${Endpoints.companies.company}`,
                response => {
                    //SUCCESS CALLBACK
                    this.companies = response.results
                },
                error => {
                    //ERROR CALLBACK
                },
            )
        },
        customLabelCompany(option) {
            return `${this.toUpperCase(option.fantasyName)}`
        },
        save: function () {
            this.errors = []
            this.messageIdToast = null
            let state = this

            Request.do(
                this,
                this.data._id ? 'PUT' : 'POST',
                Request.getDefaultHeader(this),
                this.data,
                `${Endpoints.systemUsers.systemUser}${this.data._id ? this.data._id : ''}`,
                userResponse => {
                    //SUCCESS CALLBACK
                    this.$eventHub.$emit('refreshList')
                    this.$fire({
                        text: this.$t('str.register.user.sucess'),
                        type: 'success',
                        timer: 2000,
                    }).then(r => {
                        this.data._id = userResponse.result._id
                    })
                },
                error => {
                    //ERROR CALLBACK
                    let res = error.response
                    if (res && res.status) {
                        this.titleToast = this.$t('string.msg.warning')
                        if (res.data.messageId === 'response.msg.error.empty.fields') {
                            let fields = ''
                            res.data.errors.forEach(function (value) {
                                fields += state.$t(value.id) + ';<br/>'
                            })
                            this.titleToast = this.$t(res.data.messageId)
                            this.messageToast = this.$t(fields)
                        } else if (res.data.messageId === 'response.already.exists') {
                            this.messageToast = this.$t('response.company.already.exists')
                        } else {
                            this.messageToast = this.$t(res.data.messageId)
                            this.messageIdToast = res.data.messageId
                        }

                        $('#toast').modal('show')
                    }
                },
            )
        },
        checkForm: function (e) {
            this.errors = []

            if (!this.data.firstName) {
                this.errors.push(this.$t('response.user.register.name.required'))
            }

            if (!this.data.lastName) {
                this.errors.push(this.$t('response.user.register.lastname.required'))
            }

            if (!this.data.primaryPhone) {
                this.errors.push(this.$t('response.user.register.primaryPhone.required'))
            }

            if (!this.data._id && !this.data.password) {
                this.errors.push(this.$t('response.user.register.password.required'))
            }

            if (!this.data.companyUser.subtype) {
                this.errors.push(this.$t('response.user.register.type.required'))
            }

            if (this.data.companyUser.subtype === 'ADMIN' && !this.data.email) {
                this.errors.push(this.$t('response.user.register.email.required'))
            }

            if (this.data.companyUser.subtype == 'EMPLOYEE' && !this.data.companyUser.employedType) {
                this.errors.push(this.$t('response.user.register.employed.type.required'))
            }

            if (this.errors.length > 0) {
                e.preventDefault()
            } else {
                this.save()
            }
        },

        archive: function (response) {
            if (response == 1) {
                this.errors = []
                this.messageIdToast = null
                let state = this

                Request.do(
                    this,
                    'DELETE',
                    Request.getDefaultHeader(this),
                    {},
                    `${Endpoints.systemUsers.systemUser}${this.data._id}`,
                    companyResponse => {
                        //SUCCESS CALLBACK
                        this.$eventHub.$emit('refreshList')
                        this.$fire({
                            text: this.$t('str.user.delete.sucess'),
                            type: 'success',
                            timer: 2000,
                        }).then(r => {})
                    },
                    error => {
                        //ERROR CALLBACK
                        let res = error.response
                        if (res && res.status) {
                            this.titleToast = this.$t('string.msg.warning')
                            if (res.data.messageId === 'response.msg.error.empty.fields') {
                                let fields = ''
                                res.data.errors.forEach(function (value) {
                                    fields += state.$t(value.id) + ';<br/>'
                                })
                                this.titleToast = this.$t(res.data.messageId)
                                this.messageToast = this.$t(fields)
                            } else {
                                this.messageToast = this.$t(res.data.messageId)
                                this.messageIdToast = res.data.messageId
                            }
                            $('#toast').modal('show')
                        }
                    },
                )
            }
        },
        confirmArchive: function (item) {
            this.titleToast = this.$t('string.msg.confirm')
            this.messageToast = this.$t('response.archive.user.confirmation')
            this.cancelText = this.$t('string.msg.cancel')
            this.yesText = this.$t('string.msg.yes')
            $('#confirmationModal').modal('show')
        },
        selectItem: function (item) {
            this.errors = []
            this.data = JSON.parse(JSON.stringify(item))
            if (this.data.password) {
                this.data.password = null
            }

            document.body.scrollTop = 0 // For Safari
            document.documentElement.scrollTop = 0 // For Chrome, Firefox, IE and Opera
        },
        clearForm: function () {
            this.errors = []
            this.data = {
                status: 'ACTIVE',
                firstName: null,
                lastName: null,
                email: null,
                password: null,
                primaryPhone: null,
                type: 'USER-COMPANY',
                date: new Date(),
                companyUser: {
                    status: 'ACTIVE',
                    photoURL: 'https://',
                    subtype: null,
                    employedType: null,
                    company: null,
                },
            }
        },
        camelize: Common.camelize,
        toUpperCase: Common.toUpperCase,
    },
}
</script>
