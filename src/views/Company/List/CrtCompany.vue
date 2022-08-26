<script>
import Endpoints from '../../../components/common/Endpoints'
import Common from '../../../components/common/Common'
import Request from '../../../components/common/Request'

export default {
    init: payload => {
        const el = document.body
        el.removeAttribute('class')
        $('.modal').modal('hide')
    },
    methods: {
        save: async function () {
            this.errors = []
            this.messageIdToast = null
            let state = this
            this.dataUser.primaryPhone = this.dataCompany.primaryPhone

            await Request.do(
                this,
                this.dataCompany._id ? 'PUT' : 'POST',
                Request.getDefaultHeader(this),
                this.dataCompany,
                `${Endpoints.companies.company}${this.dataCompany._id ? this.dataCompany._id : ''}`,
                async companyResponse => {
                    //SUCCESS CALLBACK
                    if (!state.dataCompany._id) {
                        state.dataUser.companyUser.company = companyResponse.result._id
                        Request.do(
                            this,
                            'POST',
                            Request.getDefaultHeader(this),
                            this.dataUser,
                            `${Endpoints.systemUsers.systemUser}`,
                            userResponse => {
                                this.$eventHub.$emit('refreshList')
                                this.$fire({
                                    text: this.$t('str.register.company.sucess'),
                                    type: 'success',
                                    timer: 2000,
                                }).then(r => {
                                    this.dataUser._id = userResponse.result._id
                                })
                            },
                            error => {},
                        )
                    } else {
                        this.$eventHub.$emit('refreshList')
                        this.$fire({
                            text: this.$t('str.alteration.company.sucess'),
                            type: 'success',
                            timer: 2000,
                        }).then(r => {})
                    }
                    this.dataCompany = companyResponse.result
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

            if (!this.dataCompany.fantasyName && !this.dataCompany._id) {
                this.errors.push(this.$t('response.company.fantasy.name.required'))
            }

            if (!this.dataUser.firstName && !this.dataCompany._id) {
                this.errors.push(this.$t('response.user.register.name.required'))
            }

            if (!this.dataUser.lastName && !this.dataCompany._id) {
                this.errors.push(this.$t('response.user.register.lastname.required'))
            }

            if (!this.dataCompany._id && !this.dataUser.email) {
                this.errors.push(this.$t('response.user.register.email.required'))
            }

            if (!this.dataCompany._id && !this.dataUser.password) {
                this.errors.push(this.$t('response.user.register.password.required'))
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
                    this.dataCompany,
                    `${Endpoints.companies.delete}${this.dataCompany._id}`,
                    companyResponse => {
                        //SUCCESS CALLBACK
                        this.$eventHub.$emit('refreshList')
                        this.$fire({
                            text: this.$t('str.company.delete.sucess'),
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
            this.clearForm()
            this.dataCompany = item
            document.body.scrollTop = 0 // For Safari
            document.documentElement.scrollTop = 0 // For Chrome, Firefox, IE and Opera
        },
        clearForm: function () {
            this.errors = []
            this.dataUser = {
                status: 'ACTIVE',
                firstName: null,
                lastName: null,
                email: null,
                password: null,
                primaryPhone: null,
                type: 'USER-COMPANY',
                companyUser: {
                    company: null,
                    status: 'ACTIVE',
                    photoURL: 'https://',
                    subtype: 'ADMIN',
                    employedType: null,
                },
            }
            this.dataCompany = {
                fantasyName: null,
                socialName: null,
                primaryPhone: null,
                document: null,
                hasProjectSensor: null,
            }
        },
        camelize: Common.camelize,
        toUpperCase: Common.toUpperCase,
    },
}
</script>
