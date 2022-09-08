<script>
import Endpoints from '../../common/Endpoints.vue'
import Request from '../../common/Request.vue'

export default {
    init: payload => {
        window.location.href = '?#'
        const browserLanguage = navigator.language === 'en-US' ? 'en' : navigator.language === 'pt-BR' ? 'pt' : 'pt'
        payload.$i18n.locale = payload.$session.get('user')?.language || payload.$session.get('language') || browserLanguage || 'pt'
    },
    methods: {
        signIn: function () {
            this.errors = []
            this.messageIdToast = null
            Request.do(
                this,
                'post',
                Request.getDefaultHeader(this),
                this.data,
                `${Endpoints.systemUsers.login}`,
                (userResponse, fullResponse) => {
                    if (userResponse.status === 200 && userResponse.result.status === 'ACTIVE') {
                        this.$session.destroy()
                        this.$session.start()
                        this.$session.set('user', userResponse.result)
                        this.$session.set('token', userResponse.token)
                        this.$session.set('correlationId', fullResponse.headers['x-correlation-id'])

                        const subtype = userResponse.result?.companyUser?.subtype
                        const company = userResponse.result?.company

                        if (company && company.status === 'ACTIVE') {
                            if (subtype === 'SUPER_ADMIN_MASTER' || 'ADMIN_MASTER' || subtype === 'ADMIN' || subtype === 'MANAGER' || subtype === 'OPERATOR') {
                                this.$session.set('company', company)
                                this.$i18n.locale = userResponse.result.language
                                this.$router.push({ path: '/dashboard' })

                                window.location.href = '?#/dashboard'
                                location.reload()
                            } else {
                                this.$router.push({ path: '/' })
                                window.location.href = '?#/'
                                location.reload()
                            }
                        }
                    }
                },
                error => {
                    let res = error.response
                    if (res && res.status == 500) {
                        this.titleToast = 'Aviso'

                        if (res.data.messageId === 'response.user.password.incorrect') {
                            this.messageToast = this.$t(res.data.messageId)
                        } else {
                            this.messageIdToast = this.$t(res.data.messageId)
                        }
                    }
                },
            )
        },
        hasType: function (type) {
            if (this.user) {
                return this.user.companyUser.company.typeService.findIndex(x => x == type) > -1
            } else {
                return false
            }
        },
        isAdminMaster: function () {
            if (this.user) {
                return this.user.companyUser && this.user.companyUser.subtype === 'ADMIN_MASTER'
            }
            return false
        },
        register: function () {
            this.$router.push({ path: '/register-company' })
        },
        submitForgotPassword: function () {
            this.errors = []
            this.messageIdToast = null
            Request.do(
                this,
                'POST',
                Request.getDefaultHeader(this),
                this.data,
                `${Endpoints.systemUsers.gencode}`,
                userResponse => {
                    this.data.systemUser = userResponse.result.systemUser
                },
                error => {
                    let res = error.response
                    console.log(!res.status == 200)
                    if (res && res.status != 200) {
                        this.titleToast = 'Aviso'

                        this.messageToast = this.$t('string.msg.change.password.email.invalid')
                    }
                    console.log(JSON.stringify(res))
                },
            )
        },
        checkForgotPassword: function () {
            this.errors = []
            this.messageIdToast = null
            if (!this.data.email) {
                this.titleToast = 'Aviso'
                this.messageToast = this.$t('string.msg.change.password.label.email.required')

                return
            } else {
                this.submitForgotPassword()
            }
        },
        checkCode: function () {
            this.errors = []
            this.messageIdToast = null
            if (!this.data.code) {
                this.errors.push(this.$t('string.login.forgot.password.id.required'))
            } else {
                Request.do(
                    this,
                    'POST',
                    Request.getDefaultHeader(this),
                    this.data,
                    `${Endpoints.systemUsers.checkCode}`,
                    userResponse => {
                        if (userResponse.status === 200) {
                            this.$session.destroy()
                            this.$session.start()
                            this.$session.set('code', this.data.code)
                        }
                    },
                    error => {
                        let res = error.response
                        if (res && res.status == 500) {
                            this.errors = []
                            if (res.data.messageId === 'string.user.code.incorrect') {
                                this.errors.push(this.$t(res.data.messageId))
                            } else {
                                this.errors.push(this.$t('string.user.code.incorrect'))
                            }
                        }
                    },
                )
            }
        },
        resetPass: function () {
            this.errors = []
            this.messageIdToast = null
            if (!this.data.password || this.data.password != this.data.passwordConfirm || this.data.password.length < 7) {
                this.errors.push(this.$t('string.company.admin.register.password.required'))
            } else {
                let params = {
                    code: this.$session.get('code'),
                    systemUser: this.data.systemUser,
                    password: this.data.password,
                }
                Request.do(
                    this,
                    'POST',
                    Request.getDefaultHeader(this),
                    params,
                    `${Endpoints.systemUsers.resetPassNotLog}`,
                    userResponse => {
                        if (userResponse.status === 200) {
                            this.titleToast = 'Aviso'
                            this.messageToast = this.$t('string.login.reset.password.success')
                        }
                    },
                    error => {
                        let res = error.response
                        if (res && res.status == 500) {
                            this.errors = []
                            if (res.data.messageId === 'string.user.code.incorrect') {
                                this.errors.push(this.$t(res.data.messageId))
                            } else {
                                this.errors.push(this.$t('string.msg.error.generic'))
                            }
                        }
                    },
                )
            }
        },
        checkForm: function (e) {
            e.preventDefault()
            this.$router.push({ path: '/login' })
        },
    },
}
</script>
