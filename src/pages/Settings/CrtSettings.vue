<script>
import Endpoints from '../../common/Endpoints.vue'
import Request from '../../common/Request.vue'
// import Common from '../../common/Common.vue'

export default {
    init: async payload => {
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
