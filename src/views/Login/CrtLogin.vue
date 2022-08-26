<script>
import Endpoints from '../../components/common/Endpoints'
import Common from '../../components/common/Common'
import Request from '../../components/common/Request'
import { mapActions } from 'vuex'

export default {
    init: payload => {
        const el = document.body
        el.removeAttribute('class')
        el.classList.add('authentication-page')
        el.classList.add('authentication-bg')
        el.classList.add('authentication-bg-pattern')
        window.location.href = '?#'
        $('.modal').modal('hide')

        payload.data.email = payload.$route.query.inveted
    },
    methods: {
        submit: function () {
            $('#spinner').modal('toggle')
            this.errors = []
            this.messageIdToast = null
            Request.do(
                this,
                'POST',
                Request.getDefaultHeader(this),
                this.data,
                `${Endpoints.systemUsers.login}`,
                (userResponse, fullResponse) => {
                    //SUCCESS CALLBACK
                    $('#spinner').modal('toggle')
                    if (userResponse.result.status == 'ACTIVE') {
                        this.$session.destroy()
                        this.$session.start()
                        this.$session.set('user', userResponse.result)
                        this.$session.set('token', userResponse.token)
                        this.$session.set('correlationId', fullResponse.headers['x-correlation-id'])

                        if (userResponse.result.companyUser.subtype === 'ADMIN_MASTER' || userResponse.result.companyUser.subtype === 'CLIENT') {
                            this.$router.push({ path: '/dashboard' })
                            window.location.href = '?#/dashboard'
                            location.reload()
                        } else if (userResponse.result.companyUser.subtype === 'ADMIN') {
                            this.$router.push({ path: '/collects-tricycle' })
                            window.location.href = '?#/collects-tricycle'
                            location.reload()
                        }
                    } else {
                        this.titleToast = this.$t('str.msg.alert')
                        this.messageToast = this.$t('str.msg.user.archived.logged')
                        this.messageIdToast = ''
                        $('#toast').modal('show')
                    }
                },
                error => {
                    //ERROR CALLBACK
                    let res = error.response
                    if (res && res.status == 500) {
                        $('#spinner').modal('toggle')
                        this.titleToast = 'Aviso'

                        if (res.data.messageId === 'response.user.password.incorrect') {
                            this.messageToast = this.$t(res.data.messageId)
                        } else {
                            this.messageIdToast = this.$t(res.data.messageId)
                        }
                        $('#toast').modal('show')
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
                    //SUCCESS CALLBACK
                    this.data.systemUser = userResponse.result.systemUser
                    $('#modalEsqueciSenha').modal('show')
                },
                error => {
                    //ERROR CALLBACK
                    let res = error.response
                    console.log(!res.status == 200)
                    if (res && res.status != 200) {
                        this.titleToast = 'Aviso'

                        this.messageToast = this.$t('string.msg.change.password.email.invalid')

                        $('#toast').modal('show')
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

                $('#toast').modal('show')
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
                        //SUCCESS CALLBACK
                        this.$session.destroy()
                        this.$session.start()
                        this.$session.set('code', this.data.code)

                        $('.modal').modal('hide')
                        $('#modalReset').modal('show')
                    },
                    error => {
                        //ERROR CALLBACK
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
                        //SUCCESS CALLBACK
                        $('.modal').modal('hide')

                        this.titleToast = 'Aviso'
                        this.messageToast = this.$t('string.login.reset.password.success')
                        $('#toast').modal('show')
                    },
                    error => {
                        //ERROR CALLBACK
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
    },
}
</script>
