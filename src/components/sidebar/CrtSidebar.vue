<script>
import Endpoints from '../../common/Endpoints.vue'
// import Request from '../../common/Request.vue'

export default {
    init: payload => {
        payload.user = payload.$session.get('user')
        payload.domain = Endpoints.domain
    },
    methods: {
        expand: function () {
            this.stat = this.stat == 'expand' ? 'collapse' : 'expand'
        },
    },
}
</script>
blank