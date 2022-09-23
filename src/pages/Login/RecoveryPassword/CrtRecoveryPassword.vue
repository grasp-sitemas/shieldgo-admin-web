<script>
import Common from '../../../common/Common.vue'
import Endpoints from '../../../common/Endpoints.vue'
import Request from '../../../common/Request.vue'

export default {
    methods: {
        checkRequiredField(field) {
            return this.errors.includes(field)
        },
        removeRequiredField(field) {
            this.errors = this.errors.filter(item => item !== field)
        },
        checkForm() {
            if (!this.data.email || this.data.email === '') {
                this.errors.push('email')
            }

            if (!this.errors || this.errors.length === 0) {
                this.save()
            }
        },
        handleGenerateCodePassword: function () {
            this.isLoading = true
            Request.do(
                this,
                'post',
                Request.getDefaultHeader(this),
                this.data,
                `${Endpoints.systemUsers.gencode}`,
                userResponse => {
                    this.data.code = ''
                    this.data.password = ''
                    this.data.passwordConfirm = ''
                    this.step = 2
                    this.data.systemUser = userResponse.result.systemUser
                    this.isLoading = false
                },
                error => {
                    console.log(error)
                    this.isLoading = false
                    Common.show(this, 'bottom-right', 'warn', this.$t('string.msg.change.password.email.invalid'))
                },
            )
        },
        checkForgotPassword: function () {
            if (!this.data.email) {
                Common.show(this, 'bottom-right', 'warn', this.$t('string.msg.change.password.label.email.required'))
                return
            } else {
                this.submitForgotPassword()
            }
        },
        checkEnableButton: function () {
            if (this.data.code && this.data.password && this.data.passwordConfirm) {
                return false
            } else {
                return true
            }
        },
        checkPasswordStep: function () {
            if (this.data.password.length < 6) {
                Common.show(this, 'bottom-right', 'warn', this.$t('str.min.password.length'))
            } else if (this.data.password !== this.data.passwordConfirm) {
                Common.show(this, 'bottom-right', 'warn', this.$t('string.msg.change.password.password.not.match'))
            } else {
                this.handleResetPassword()
            }
        },
        handleResetPassword: function () {
            let params = {
                code: this.data.code,
                systemUser: this.data.systemUser,
                password: this.data.password,
            }

            Request.do(
                this,
                'post',
                Request.getDefaultHeader(this),
                params,
                `${Endpoints.systemUsers.resetPassNotLog}`,
                userResponse => {
                    console.log(userResponse)
                    this.step = 3
                    Common.show(this, 'bottom-right', 'success', this.$t('string.login.reset.password.success'))
                },
                error => {
                    let res = error.response
                    if (res && res.status === 500) {
                        if (res.data.messageId === 'response.user.code.incorrect') {
                            Common.show(this, 'bottom-right', 'warn', this.$t('string.user.code.invalid'))
                        } else {
                            Common.show(this, 'bottom-right', 'warn', this.$t('string.msg.error.generic'))
                        }
                    }
                },
            )
        },
        clearForm() {
            this.data = {
                email: '',
                password: '',
                passwordConfirm: null,
                code: null,
                systemUser: null,
            }
            this.step = 1
            this.isLoading = false
        },
        transformUpperCase: function (event) {
            this.data.code = event.target.value.toUpperCase()
        },
        isValidEmail: Common.isValidEmail,
    },
}
</script>
