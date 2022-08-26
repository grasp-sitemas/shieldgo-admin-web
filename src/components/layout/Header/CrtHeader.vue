<script>
import Common from '../../common/Common';

export default {
    init: (payload) => {
        Common.loadFunctionsElements();
    },
    methods:{
        loadUserInfos: function(){
            if (this.$session){
                let user = this.$session.get('user');
                this.user = user ? user : {};
                this.user.firstName = Common.camelize(this.user.firstName);
            }
        },
        loggout: function(){
            this.$router.push({ path: '/Logout' });
            window.location.href = "?#/Logout";
        },
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
