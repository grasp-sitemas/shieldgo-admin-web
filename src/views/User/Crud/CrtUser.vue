<script>
import Endpoints from '../../../components/common/Endpoints';
import Request from '../../../components/common/Request';
import Common from '../../../components/common/Common';
export default {
    init: (payload) => {

        const el = document.body;
        el.removeAttribute("class");
        $('.modal').modal('hide');

        setTimeout(async function() {
            $('#spinner').modal('toggle'); 
            let response = (await Request.do(payload, 'GET', Request.getDefaultHeader(payload), {}, `${Endpoints.systemUsers.getMe}`)).data;
            if (response && response.status==200){
                payload.data = response.result;
            } 
            $('#spinner').modal('toggle');
        }, 100);

        payload.getServices();
        
        payload.filters.company =  payload.$session.get('user').companyUser.company._id;
        payload.findAllUser();
    },
    methods:{
        save: function(){
            this.errors = [];
            this.messageIdToast = null;
            let state = this;

            Request.do(this, this.newData._id ? 'PUT' : 'POST', Request.getDefaultHeader(this), this.newData, `${Endpoints.systemUsers.systemUser}${this.newData._id ? this.newData._id : ''}`,
                (userResponse)=>{//SUCCESS CALLBACK
                    this.cancelAdd();
                    this.findAllUser();
                    this.$fire({
                        text: this.$t('str.register.user.sucess'),
                        type: "success",
                        timer: 2000
                        }).then(r => {
                    });
                },
                (error)=>{//ERROR CALLBACK
                    $('#spinner').modal('toggle');
                    let res = error.response;
                    if (res && res.status){
                        this.titleToast = this.$t("string.msg.warning");
                        if (res.data.messageId === 'response.msg.error.empty.fields'){
                            let fields = "";
                            res.data.errors.forEach(function (value) {
                                fields += state.$t(value.id)+";<br/>";
                            });
                            this.titleToast = this.$t(res.data.messageId);
                            this.messageToast = this.$t(fields);
                        }else if (res.data.messageId === 'response.already.exists'){
                            this.messageToast = this.$t('response.company.already.exists');
                        }else{
                            this.messageToast = this.$t(res.data.messageId);
                            this.messageIdToast = res.data.messageId;
                        }

                        $('#toast').modal('show');
                    }
            });
        },
        getServices: function(){
            //################### LOAD SERVICE TYPES
            Request.do(this, 'GET', Request.getDefaultHeader(this), null, `${Endpoints.services.service}`,
            (response)=>{//SUCCESS CALLBACK
                this.services = response.results;
            },
            (error)=>{//ERROR CALLBACK
            });
        },
        checkForm: function (e) {
            this.errors = [];
            if (!this.newData.firstName) {
                this.errors.push(this.$t('response.user.register.firstname.required'));
            }
            if (!this.newData.lastName) {
                this.errors.push(this.$t('response.user.register.lastname.required'));
            }
            if (!this.newData.email) {
                this.errors.push(this.$t('response.user.register.email.required'));
            }
            if (!this.newData.password) {
                this.errors.push(this.$t('response.user.register.password.required'));
            }
            if (!this.newData.companyUser.subtype || this.newData.companyUser.subtype === null) {
                this.errors.push(this.$t('response.user.register.level.access.required'));
            }

            if (this.errors.length>0){
                e.preventDefault();
            }else{
                this.save();
            }
        },
        addUser: function (){
            this.formCrud = 'show';
        },
        cancelAdd: function (){
            this.formCrud = false;
            this.newData = {
                status: "ACTIVE",
                firstName: null,
                lastName: null,
                email: null,
                password: null,
                isAcceptGeneralTerms: true,
                type: "USER-COMPANY",
                companyUser:{
                    company: null,
                    status: "ACTIVE",
                    photoURL: "https://",
                    userPlatforms:[],
                    subtype: null
                }
            }
            this.newData.companyUser.company = this.filters.company;
        },
        findAllUser: function(){
            const state = this;
            Request.do(state, 'POST', Request.getDefaultHeader(state), state.filters, `${Endpoints.systemUsers.companyUser}`,
            (userResponse)=>{//SUCCESS CALLBACK
                state.users = userResponse.results;
            },
            (error)=>{//ERROR CALLBACK
            }); 
        },
        selectItem: function(item){

            this.errors = [];
            this.newData = JSON.parse(JSON.stringify(item));

            if(this.newData.companyUser.userPlatforms && this.newData.companyUser.userPlatforms.length > 0){
                let copyPlatforms = this.newData.companyUser.userPlatforms;
                let platforms = [];
                for(let i=0; i< copyPlatforms.length; i++){
                    if(copyPlatforms[i] && copyPlatforms[i]._id)
                        platforms.push(copyPlatforms[i]._id)
                }
                this.newData.companyUser.userPlatforms = platforms;
            }
            this.formCrud = 'show';

            document.body.scrollTop = 0; // For Safari
            document.documentElement.scrollTop = 0; // For Chrome, Firefox, IE and Opera
                    
        },
        camelize: Common.camelize,
        toUpperCase: Common.toUpperCase,
    }
}
</script>
