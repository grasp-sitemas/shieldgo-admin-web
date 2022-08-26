<script>
import Endpoints from '../../../components/common/Endpoints';
import Common from '../../../components/common/Common';
import Request from '../../../components/common/Request';
import { mapActions } from 'vuex';

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
    },
    methods:{
        save: function(){
            $('#spinner').modal('toggle');
            this.errors = [];
            this.messageIdToast = null;
            let state = this;
            
            let currentEmail = this.data.email;
            this.data.email = this.newEmail;

            Request.do(this, 'PUT', Request.getDefaultHeader(this), this.data, `${Endpoints.systemUsers.systemUser}${currentEmail}`,
                (response)=>{//SUCCESS CALLBACK
                    this.newEmail = null;
                    $('#spinner').modal('toggle');
                    
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
                    console.log(JSON.stringify(error));
            });
        },
        checkForm: function (e) {
            this.errors = [];
            if (!this.newEmail) {
                this.errors.push(this.$t('string.msg.user.change.email.required'));
            }
            if (this.errors.length>0){
                e.preventDefault();
            }else{
                this.save();
            }
        },
        getUser: function(e){
            this.systemUser
        }
    }
}
</script>
