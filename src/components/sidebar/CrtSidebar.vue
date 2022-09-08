<script>
import Endpoints from '../../common/Endpoints.vue'

export default {
    init: payload => {
        payload.user = payload.$session.get('user')
        payload.domain = Endpoints.domain
        payload.valuekey += 1
    },
    methods: {
        expand: function () {
            this.stat = this.stat == 'expand' ? 'collapse' : 'expand'
        },
    },
}
</script>