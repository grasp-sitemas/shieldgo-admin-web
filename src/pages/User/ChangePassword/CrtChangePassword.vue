<script>
import Endpoints from '../../../common/Endpoints.vue'
import Request from '../../../common/Request.vue'
import Common from '../../../common/Common.vue'

export default {
    init: async payload => {
        payload.domain = Endpoints.domain

        payload.getMe()
    },
    methods: {
        getMe() {
            Request.do(
                this,
                'get',
                Request.getDefaultHeader(this),
                {},
                `${Endpoints.systemUsers.getMe}`,
                response => {
                    if (response) {
                        this.data = response.result
                    }
                },
                error => {
                    console.log(error)
                },
            )
        },
        checkEnableButton: function () {
            if (this.data.password && this.newPassword && this.confirmNewPassword) {
                return false
            } else {
                return true
            }
        },
        save() {
            this.isLoading = true
            try {
                Request.do(
                    this,
                    'POST',
                    Request.getDefaultHeader(this),
                    this.data,
                    `${Endpoints.systemUsers.login}`,
                    async responseLogin => {
                        if (responseLogin.status === 200) {
                            this.data.password = this.newPassword
                            Request.do(
                                this,
                                'POST',
                                Request.getDefaultHeader(this),
                                this.data,
                                `${Endpoints.systemUsers.resetPass}`,
                                userResponse => {
                                    if (userResponse.status === 200) {
                                        this.isLoading = false
                                        Common.show(this, 'bottom-right', 'success', this.$t('str.change.password.success'))
                                        this.clearForm()
                                    }
                                },
                                error => {
                                    this.isLoading = false
                                    Common.show(this, 'bottom-right', 'warn', this.$t('str.change.password.error'))
                                    console.log(error)
                                },
                            )
                        }
                    },
                    error => {
                        this.isLoading = false
                        let res = error.response
                        if (res && res.status == 500) {
                            if (res.data.messageId === 'response.user.password.incorrect') {
                                Common.show(this, 'bottom-right', 'warn', this.$t('response.user.password.incorrect'))
                                return
                            }
                        }

                        Common.show(this, 'bottom-right', 'warn', this.$t('str.change.password.error'))
                        console.log(error)
                    },
                )
            } catch (error) {
                this.isLoading = false
                Common.show(this, 'bottom-right', 'warn', this.$t('str.change.password.error'))
                console.log(error)
            }
        },
        checkRequiredField(field) {
            return this.errors.includes(field)
        },
        removeRequiredField(field) {
            this.errors = this.errors.filter(item => item !== field)
        },
        clearForm() {
            this.errors = []
            this.data.password = ''
            this.newPassword = ''
            this.confirmNewPassword = ''
        },
        checkForm: function () {
            this.errors = []

            if (!this.data.password || this.data.password === '') {
                this.errors.push('password')
            }
            if (!this.newPassword || this.newPassword === '') {
                this.errors.push('newPassword')
            }
            if (!this.confirmNewPassword || this.confirmNewPassword === '') {
                this.errors.push('confirmNewPassword')
            }

            if (this.newPassword.length < 6) {
                Common.show(this, 'bottom-right', 'warn', this.$t('str.min.password.length'))
                return
            }

            if (this.newPassword !== this.confirmNewPassword) {
                Common.show(this, 'bottom-right', 'warn', this.$t('string.msg.change.password.password.not.match'))
                return
            }

            if (!this.errors || this.errors.length === 0) {
                this.save()
            }
        },
        hasShowErrors() {
            const itemsToNotShow = ['password', 'newPassword', 'confirmNewPassword']
            return this.errors && this.errors.length > 0 && !this.errors.some(item => itemsToNotShow.includes(item))
        },
    },
}
</script>
