<script>
import Endpoints from '../../common/Endpoints.vue'
import Request from '../../common/Request.vue'

export default {
    init: payload => {
        payload.user = payload.$session.get('user')
        payload.domain = Endpoints.domain

        if (payload.getSoundStore() === false) {
            payload.soundEnabled = false
        } else {
            payload.soundEnabled = true
        }
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
                            const user = this.user
                            user.language = language
                            this.$session.set('user', user)
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
        handleEnableSound: function () {
            this.soundEnabled = !this.soundEnabled
            this.setSoundStore(this.soundEnabled)
        },
        setSoundStore: function (sound) {
            this.$session.set('sound', sound)
        },
        getSoundStore: function () {
            return this.$session.get('sound')
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
        refreshUser(state) {
            Request.do(
                state,
                'get',
                Request.getDefaultHeader(state),
                {},
                `${Endpoints.systemUsers.getMe}`,
                response => {
                    if (response) {
                        const result = response?.result
                        state.$session.set('user', result)
                        state.user = result
                    }
                },
                error => {
                    console.log(error)
                },
            )
        },
        isCurrentLanguage(language) {
            return this.$i18n.locale === language
        },
        playSound() {
            if (this.soundEnabled) {
                this.audio.play()
            }
        },
    },
}
</script>
