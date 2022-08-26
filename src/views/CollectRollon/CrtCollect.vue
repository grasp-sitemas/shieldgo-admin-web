<script>
import Endpoints from '../../components/common/Endpoints';
import Common from '../../components/common/Common';
import Request from '../../components/common/Request';
import { mapActions } from 'vuex'

export default {
    init: (payload) => {
        const el = document.body;
        payload.domain = Endpoints.domain;
        el.removeAttribute("class");
        $('.modal').modal('hide');


        payload.dayBegin = new Date().getDate();
        payload.monthBegin = new Date().getMonth();
        payload.yearBegin = new Date().getFullYear();

        payload.dayEnd = new Date().getDate();
        payload.monthEnd = new Date().getMonth();
        payload.yearEnd = new Date().getFullYear();

        payload.daysInMonthBegin(payload.monthBegin,payload.yearBegin);
        payload.daysInMonthEnd(payload.monthEnd,payload.yearEnd);

        payload.listCompanies();
        payload.listHubs();
        payload.onChange();

    },
    methods:{
        filter: function(){
          
            this.items = [];

            let copyFilters = JSON.parse(JSON.stringify(this.filters));
            this.filters.startCollect = this.formatDateBegin(this.dayBegin,this.monthBegin,this.yearBegin);
            this.filters.endCollect = this.formatDateEnd(this.dayEnd,this.monthEnd,this.yearEnd);

            if(this.filters.company){
                this.filters.company = this.filters.company._id;
            }
            if(this.filters.collectedHub){
                this.filters.collectedHub = this.filters.collectedHub._id;
            }
            if(this.filters.depositedHub){
                this.filters.depositedHub = this.filters.depositedHub._id;
            }
            if(this.filters.systemUser){
                this.filters.systemUser = this.filters.systemUser._id;
            }
            
            Request.do(this, 'POST', Request.getDefaultHeader(this), this.filters, `${Endpoints.collects.filter}`,
            (response)=>{//SUCCESS CALLBACK
                this.items = JSON.parse(JSON.stringify(response.results));
                this.getTotalWeight();
            },
            (error)=>{//ERROR CALLBACK
            });
            this.filters = copyFilters;

        },
        getTotalWeight(){
            this.totalWeight = 0;
            for(let i=0; i < this.items.length; i++){
                if(this.items[i] && this.items[i].weight){
                    this.totalWeight += this.items[i].weight
                }
            }
        },
        isAdminMaster: function(){
            if (this.$session.get('user')){
                return this.$session.get('user').companyUser.subtype == "ADMIN_MASTER";
            }
            return false;
        },
        confirmArchive: function(id, index){
            this.collectId = id;
            this.collectIndex = index;
            this.titleToast = this.$t("string.msg.confirm");
            this.messageToast = this.$t("response.delete.collect.confirmation");
            this.cancelText = this.$t("string.msg.cancel");
            this.yesText = this.$t("string.msg.yes");
            $('#confirmationModal').modal('show');
        },
        archive: function(response){
            if (response==1){
                this.errors = [];
                this.messageIdToast = null;
                let state = this;
                
                Request.do(this, 'DELETE', Request.getDefaultHeader(this), null, `${Endpoints.collects.delete}${this.collectId}`,
                    (response)=>{//SUCCESS CALLBACK
                        if(response && response.status == 200){
                            this.items.splice(this.collectIndex, 1);
                        }
                    },
                    (error)=>{//ERROR CALLBACK
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
                            }else{
                                this.messageToast = this.$t(res.data.messageId);
                                this.messageIdToast = res.data.messageId;
                            }
                            $('#toast').modal('show');
                        }
                });
            }
        },
        listCompanies: function(){
            this.companies = [];
            Request.do(this, 'GET', Request.getDefaultHeader(this), null, `${Endpoints.companies.company}`,
            (response)=>{//SUCCESS CALLBACK
                this.companies = response.results;
            },
            (error)=>{//ERROR CALLBACK
            });
        },
        customLabelCompany(option) {
            return `${this.toUpperCase(option.fantasyName)}`
        },
        checkForm: function(e){
            this.errors = [];
            this.items=[];
            if (this.filters.startCollect > this.filters.endCollect){
                this.errors.push(this.$t('response.orders.filter.day.required'));
            }
            if (this.errors.length>0){
                 e.preventDefault();
            }else{
                this.filter();
            }
        },
        formatDateBegin: function(day,month,year){
                let date = new Date();
                date.setUTCDate(day);
                date.setUTCMonth(month); 
                date.setUTCFullYear(year);
                date.setUTCHours(0,0,0,0);
                return date.toISOString();
        },

        formatDateEnd: function(day,month,year){
                let date = new Date();
                date.setUTCDate(day);
                date.setUTCMonth(month); 
                date.setUTCFullYear(year);
                date.setUTCHours(23,59,59,999);
                return date.toISOString();
        },
        daysInMonthBegin: function(month, year) { 
           this.daysBegin = [];
            let nDay = new Date(year, month + 1, 0).getDate();
            for(let i = 0; i < nDay ; i ++){
                this.daysBegin.push({day:i + 1});
            } 
          
         },
        daysInMonthEnd: function(month, year) { 
            this.daysEnd = [];
            let nDay = new Date(year, month + 1, 0).getDate();
            for(let i = 0; i < nDay ; i ++){
                this.daysEnd.push({day:i + 1});
            } 
        },
        listHubs: function(){

            this.hubs = [];
            Request.do(this, 'GET', Request.getDefaultHeader(this), null, `${Endpoints.hubs.hub}`,
            (response)=>{//SUCCESS CALLBACK
                this.hubs =response.results;
            },
            (error)=>{//ERROR CALLBACK
            });
        },
        RefreshScreen: function(){
            this.$forceUpdate();
        },
        onChangeDay: function(){
            this.filters.startCollect =  new Date().setDate(new Date().getDate() - this.nDays),
            this.filters.endCollect = new Date();
            this.filter();
             
        },
        checkClose: function(item){
            return (item.statusOrder.toUpperCase() != 'CLOSED' && item.statusOrder.toUpperCase() != 'PAID' && item.statusOrder.toUpperCase() != 'REJECTED' )
            return null;
        },
        showMap: function(geo){
            this.geolocation = geo; 
            $('#modalMap').modal('show');
        },
        showPhoto: function(url){
            this.photoURL = url;
            $('#modalPhoto').modal('show');
        },
        onChange: function(){
            Request.do(this, 'POST', Request.getDefaultHeader(this), {subtype: "EMPLOYEE"}, `${Endpoints.systemUsers.search}`,
            (response)=>{//SUCCESS CALLBACK
                this.systemUsers = response.results; 
            },
            (error)=>{//ERROR CALLBACK
                this.titleToast = this.$t('str.msg.toast.advice');
                this.messageToast = this.$t('str.msg.error.generic');
                let res = error.response;
                if (res){
                    this.messageIdToast = res;
                }
                $('#toast').modal('show');
            });
        },
        onChangePage(pageOfItems) {
            // update page of items
            this.pageOfItems = pageOfItems;
        },
        fetchData(){
            // console.log(this.items.companyUser.company);
            this.json_data = this.items;
            return this.json_data;
        }, 
        customLabelSystemUser(option) {
            return `${option.firstName + ' ' + option.lastName}`
        },
        customLabelCollectedHub(option) {
            return `${option.name + ''}`
        },
        customLabelDepositedHub(option) {
            return `${option.name + ''}`
        },
        camelize: Common.camelize,
        toUpperCase: Common.toUpperCase,
    }
}
</script>