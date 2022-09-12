<script>
import Endpoints from '../../common/Endpoints.vue'
import Request from '../../common/Request.vue'

export default {
    init: async payload => {
        payload.getMe()

        if (payload.browserDarkMode()) {
            payload.darkMode = true
            payload.handleSetDarkMode(true)
        }
    },
    methods: {
        browserDarkMode() {
            return window.matchMedia('(prefers-color-scheme: dark)').matches
        },
        getMe() {
            Request.do(
                this,
                'get',
                Request.getDefaultHeader(this),
                {},
                `${Endpoints.systemUsers.getMe}`,
                response => {
                    if (response) {
                        this.user = response?.result
                    }
                },
                error => {
                    console.log(error)
                },
            )
        },
        handleSetDarkMode: function (e) {
            const value = e.target.checked
            if (value === true) {
                document.body.classList.add('dark-mode')
            } else {
                document.body.classList.remove('dark-mode')
            }
        },
    },
}
</script>
