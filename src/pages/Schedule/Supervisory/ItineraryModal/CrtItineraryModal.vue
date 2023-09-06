<script>
import Common from '../../../../common/Common.vue'
import Endpoints from '../../../../common/Endpoints.vue'
import Request from '../../../../common/Request.vue'
import Vue from 'vue'

Vue.prototype.$registerEvent = new Vue()

export default {
    init: (payload) => {
        if (payload.$refs.nameField) {
            payload.$refs.nameField.focus()
        }
    },
    methods: {
        async save() {
            if (!this.isLoading) {
                this.isLoading = true

                try {
                    Request.do(
                        this,
                        'post',
                        Request.getDefaultHeader(this),
                        this.data,
                        `${Endpoints.itineraries.itinerary}`,
                        async response => {
                            if (response.status === 200) {
                                this.isLoading = false
                                Common.show(this, 'bottom-right', 'success', this.$t('str.form.create.success'))
                                this.$registerEvent.$emit('refreshItinerary')
                                await this.closeModal()
                            }
                        },
                        error => {
                            this.isLoading = false
                            Common.show(this, 'bottom-right', 'warn', this.$t('str.form.save.generic.error'))
                            console.log(error)
                        },
                    )
                } catch (error) {
                    this.isLoading = false
                    Common.show(this, 'bottom-right', 'warn', this.$t('str.form.save.generic.error'))
                    console.log(error)
                }
            }
        },
        async closeModal() {
            this.errors = []
            this.data.name = ''
            this.isLoading = false
            
            if(this.data?._id){
                delete this.data._id
            }

            this.$bvModal.hide('createItineraryModal')
        },
       
    },
}
</script>
