<script>
import Endpoints from '../../common/Endpoints';
import Request from '../../common/Request';
export default {
    init: async (payload) => {
        // let response = (await Request.do(payload, 'GET', Request.getDefaultHeader(payload), {}, `${Endpoints.systemUsers.getMe}`)).data;
        payload.user = payload.$session.get('user');
        payload.user.serviceTypes = payload.$session.get('user').companyUser.company.typeService;
    },
    methods:{
        hasType: function(type){
            if (this.user){
                return this.user.serviceTypes.findIndex(x => x == type) > -1;
            }else{
                return false;
            }
        },
        isAdminMaster: function(){
            if (this.user){
                return this.user.companyUser && this.user.companyUser.subtype == "ADMIN_MASTER";
            }
            return false;
        },
        isAdmin: function(){
            if (this.user){
                return this.user.companyUser && this.user.companyUser.subtype == "ADMIN";
            }
            return false;
        },
        isSimple: function(){
            if (this.user){
                return this.user.companyUser && this.user.companyUser.subtype == "SIMPLE";
            }
            return false;
        },
        to: function(path){
            this.$router.push({ path: path });
        }
    }
}
</script>
