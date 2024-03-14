<script>
import Common from '../../common/Common.vue'
import Endpoints from '../../common/Endpoints.vue'
import Request from '../../common/Request.vue'

export default {
    init: async payload => {
        await payload.getMe()
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
                        this.company = response?.result?.company
                        this.darkMode = this.user.darkMode

                        if (!this.company.reportConfigs) {
                            this.company.reportConfigs = []
                        }

                        if (this.darkMode) {
                            document.body.classList.add('dark-mode')
                            this.$registerEvent.$emit('setDarkMode', true)
                        } else {
                            document.body.classList.remove('dark-mode')
                            this.$registerEvent.$emit('setDarkMode', false)
                        }

                        this.isLoading = false
                    }
                },
                error => {
                    console.log(error)
                    this.isLoading = false
                },
            )
        },
        updateDarkMode() {
            const data = this.user
            data.darkMode = this.darkMode

            try {
                Request.do(
                    this,
                    'put',
                    Request.getDefaultHeader(this),
                    data,
                    `${Endpoints.systemUsers.systemUser}${data._id}`,
                    response => {
                        if (response.status === 200) {
                            this.$session.set('user', response.result)
                            this.$registerEvent.$emit('setDarkMode', response.result?.darkMode)
                            Common.show(this, 'bottom-right', 'success', this.$t('str.form.update.success'))
                        }
                    },
                    error => {
                        Common.show(this, 'bottom-right', 'warn', this.$t('str.form.update.generic.error'))
                        console.log(error)
                    },
                )
            } catch (error) {
                Common.show(this, 'bottom-right', 'warn', this.$t('str.form.update.generic.error'))
                console.log(error)
            }
        },
        handleSetDarkMode: function (e) {
            const value = e.target.checked
            if (value === true) {
                document.body.classList.add('dark-mode')
                this.$registerEvent.$emit('setDarkMode', true)
            } else {
                document.body.classList.remove('dark-mode')
                this.$registerEvent.$emit('setDarkMode', false)
            }

            this.updateDarkMode()
        },
    },
}
</script>
