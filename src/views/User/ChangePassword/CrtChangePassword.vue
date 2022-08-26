<script>
import Endpoints from '../../../components/common/Endpoints';
import Request from '../../../components/common/Request';

export default {
    init: (payload) => {

        const el = document.body;
        el.removeAttribute("class");
        $('.modal').modal('hide');

        setTimeout(async function() {
        $('#spinner').modal('toggle');
      
        let response = (await Request.do(payload, 'GET', Request.getDefaultHeader(payload), {}, `${Endpoints.systemUsers.getMe}`)).data;
        if (response && response.status==200){
            payload.user = response.result;
            payload.data.email = payload.user.email;
        } 
        $('#spinner').modal('toggle');
        }, 100);
    },
    methods:{
        save: function(){
            $('#spinner').modal('toggle');
            this.errors = [];
            this.messageIdToast = null;
            let state = this;
            let user = JSON.parse(JSON.stringify(this.data));
            user.password = this.newPassword;

            let userLoginTest = JSON.parse(JSON.stringify(this.data));
            userLoginTest.email = this.$session.get('user').email;


            Request.do(this, 'POST', Request.getDefaultHeader(this), userLoginTest, `${Endpoints.systemUsers.login}`,
                async (dataResponse, fullResponse)=>{//SUCCESS CALLBACK
                    
                    Request.do(state, 'POST', Request.getDefaultHeader(state), user, `${Endpoints.systemUsers.resetPass}`,
                        (userResponse)=>{//SUCCESS CALLBACK
                            $('#spinner').modal('toggle');

                            this.clearForm();

                            this.$fire({
                                text: this.$t('str.password.changed.sucess'),
                                type: "success",
                                timer: 2000
                                }).then(r => {
                            });
                        },
                        (error)=>{//ERROR CALLBACK
                            $('#spinner').modal('toggle');
                            let res = error.response;
                            if (res && res.status){
                                state.titleToast = state.$t("string.msg.warning");
                                if (res.data.messageId === 'response.msg.error.empty.fields'){
                                    let fields = "";
                                    res.data.errors.forEach(function (value) {
                                        fields += state.$t(value.id)+";<br/>";
                                    });
                                    state.titleToast = state.$t(res.data.messageId);
                                    state.messageToast = state.$t(fields);
                                }else if (res.data.messageId === 'response.already.exists'){
                                    state.messageToast = state.$t('response.company.already.exists');
                                }else{
                                    state.messageToast = state.$t(res.data.messageId);
                                    state.messageIdToast = res.data.messageId;
                                }
                                $('#toast').modal('show');
                            }
                            console.log(JSON.stringify(error));
                    });
                },
                (error)=>{//ERROR CALLBACK
                    $('#spinner').modal('toggle');

                    let res = error.response;
                    if (res && res.status != 200){
                        state.titleToast = state.$t("string.msg.warning");
                        if (res.data.messageId === 'response.user.password.incorrect'){
                            state.messageToast = state.$t("response.user.password.actual.incorrect");
                        }else{
                            state.messageToast = state.$t(res.data.messageId);
                            state.messageIdToast = res.data.messageId;
                        }
                        $('#toast').modal('show');
                    }
                    console.log(JSON.stringify(error));
            });
            
        },
        checkForm: function (e) {
            this.errors = [];
            if (!this.data.email) {
                this.errors.push(this.$t('string.msg.user.change.current.password.required'));
            }
            if (!this.newPassword) {
                this.errors.push(this.$t('string.msg.user.change.password.required'));
            }
            if (!this.cfNewPassword) {
                this.errors.push(this.$t('string.msg.user.change.cnpassword.required'));
            }
            // if(this.newPassword != this.cfNewPassword) {
            //     this.errors.push(this.$t('string.msg.user.change.password.label.equals'));
            // }
            // if(!this.checkPassword()){
            //     this.errors.push(this.$t('string.msg.user.change.password.label.invalid'));
            // }
            if(this.errors.length>0){
                e.preventDefault();
            }else{
                this.save();
            }
        },
        clearForm: function (){
            this.newPassword = null,
            this.cfNewPassword = null,
            this.currentPassword = null,
            this.data = {
                email: null,
                password: null,
            }
        }
    }
}
</script>
