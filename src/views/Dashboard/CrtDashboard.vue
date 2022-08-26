<script>
import Endpoints from '../../components/common/Endpoints';
import Common from '../../components/common/Common';
import Request from '../../components/common/Request';

import { mapActions } from 'vuex';

export default {
    init: async(payload) => {
        payload.domain = Endpoints.domain;
        const el = document.body;
        el.removeAttribute("class");
        $('.modal').modal('hide');
    },
    methods:{
       isAdminMaster: function(){
            let user = this.$session.get('user');
            if (user){
                return user.companyUser && user.companyUser.subtype == "ADMIN_MASTER";
            }
            return false;
        },
    }
 
}
</script>
