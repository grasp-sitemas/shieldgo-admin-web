<script>
import Endpoints from '../../../common/Endpoints.vue'
import Request from '../../../common/Request.vue'

export default {
    init: payload => {
        payload.filter()
    },
    methods: {
        filter: function () {
            this.items = []
            this.errors = []
            Request.do(
                this,
                'POST',
                Request.getDefaultHeader(this),
                this.filters,
                `${Endpoints.companies.filter}`,
                response => {
                    this.items = response.results
                },
                error => {
                    console.log(error)
                },
            )
        },
        selectItem(params) {
            const data = JSON.parse(JSON.stringify(params.row))

            delete data.vgt_id
            delete data.originalIndex

            this.$emit('load-item', data)
        },
    },
}
</script>
