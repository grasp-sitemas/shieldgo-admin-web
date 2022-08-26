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
        $('.modal').modal('hide')
    },
    methods: {
        save: function () {
            $('#spinner').modal('toggle')
            this.errors = []
            this.messageIdToast = null
            let state = this

            this.data.companyUser.company = this.$session.get('company')._id

            Request.do(
                this,
                'POST',
                Request.getDefaultHeader(this),
                this.data,
                `${Endpoints.systemUsers.systemUser}`,
                response => {
                    //SUCCESS CALLBACK
                    $('#spinner').modal('toggle')

                    Request.do(
                        state,
                        'POST',
                        Request.getDefaultHeader(this),
                        this.data,
                        `${Endpoints.systemUsers.login}`,
                        (loginResponse, fullResponse) => {
                            //SUCCESS CALLBACK
                            this.$session.destroy()
                            this.$session.set('user', loginResponse.result)
                            this.$session.set('token', loginResponse.token)
                            this.$session.set('correlationId', fullResponse.headers['x-correlation-id'])
                            this.$router.push({ path: '/update-company-info' })
                            location.reload()
                        },
                        error => {
                            //ERROR CALLBACK
                            let res = error.response
                            if (res && res.status == 500) {
                                this.titleToast = 'Aviso'
                                this.messageToast = this.$t('shieldgo.msg.error.generic')
                                this.messageIdToast = res.data.messageId
                                $('#toast').modal('show')
                            }
                        },
                    )
                },
                error => {
                    //ERROR CALLBACK
                    $('#spinner').modal('toggle')
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
                            this.messageToast = this.$t('response.user.already.exists')
                        } else {
                            this.messageToast = this.$t(res.data.messageId)
                            this.messageIdToast = ''
                        }

                        $('#toast').modal('show')
                    }
                },
            )
        },
        checkForm: function (e) {
            this.errors = []
            if (!this.data.firstName) {
                this.errors.push(this.$t('response.user.register.firstname.required'))
            }
            if (!this.data.lastName) {
                this.errors.push(this.$t('response.user.register.lastname.required'))
            }
            if (!this.data.email) {
                this.errors.push(this.$t('response.user.register.email.required'))
            }
            if (!this.data.password) {
                this.errors.push(this.$t('response.user.register.password.required'))
            }

            if (this.errors.length > 0) {
                e.preventDefault()
            } else {
                this.save()
            }
        },
    },
}
</script>
