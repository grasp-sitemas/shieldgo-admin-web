<script>
import Endpoints from '../../common/Endpoints.vue'
import Request from '../../common/Request.vue'

export default {
    init: payload => {
        payload.user = payload.$session.get('user')
        payload.domain = Endpoints.domain
    },
    methods: {
        changeLanguage: function (language) {
            this.$i18n.locale = language
            this.$registerEvent.$emit('changeLanguage')
            try {
                Request.do(
                    this,
                    'put',
                    Request.getDefaultHeader(this),
                    { language: language },
                    `${Endpoints.systemUsers.changeLanguage}${this.user._id}`,
                    response => {
                        if (response.status === 200) {
                            this.$session.set('user', response.result)
                            this.user = response.result
                            this.valuekey += 1
                        }
                    },
                    error => {
                        console.log(error)
                    },
                )
            } catch (error) {
                console.log(error)
            }
        },
        logout() {
            this.$session.destroy()
            this.$router.push('/')
        },
        toggleSidebarMobile() {
            this.appOptions.appSidebarMobileToggled = !this.appOptions.appSidebarMobileToggled
        },
        toggleSidebarEnd() {
            this.appOptions.appSidebarEndToggled = !this.appOptions.appSidebarEndToggled
        },
        toggleSidebarEndMobile() {
            this.appOptions.appSidebarEndMobileToggled = !this.appOptions.appSidebarEndMobileToggled
        },
        toggleTopMenuMobile() {
            this.appOptions.appTopMenuMobileToggled = !this.appOptions.appTopMenuMobileToggled
        },
        toggleHeaderMegaMenuMobile() {
            this.appOptions.appHeaderMegaMenuMobileToggled = !this.appOptions.appHeaderMegaMenuMobileToggled
        },
        checkForm: function (e) {
            e.preventDefault()
            this.$router.push({ path: '/extra/search' })
        },
    },
}
</script>
