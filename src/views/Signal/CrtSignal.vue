<script>
import Endpoints from '../../components/common/Endpoints';
import Common from '../../components/common/Common';
import Request from '../../components/common/Request';

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

    },
    methods:{
        filter: function(){
          
            let state = this; 
            state.items = [];

            this.filters.startDate = this.formatDateBegin(this.dayBegin,this.monthBegin,this.yearBegin);
            this.filters.endDate = this.formatDateEnd(this.dayEnd,this.monthEnd,this.yearEnd);
            Request.do(state, 'POST', Request.getDefaultHeader(state), state.filters, `${Endpoints.signals.filter}`,
            (response)=>{//SUCCESS CALLBACK
                state.items = JSON.parse(JSON.stringify(response.results));
                state.totalSignals = state.items.length;
            },
            (error)=>{//ERROR CALLBACK
            });
        },
        load(){
            this.time = this.filter();
        },
        checkForm: function(e){
            this.errors = [];
            this.items=[];
            if (this.filters.startDate > this.filters.endDate){
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
        onChangePage(pageOfItems) {
            this.pageOfItems = pageOfItems;
        },
        getPageNumbers: function(){
            return this.items.length/10;
        },
        customLabelName(option) {
            return `${option.name}` 
        },
        camelize: Common.camelize,
        toUpperCase: Common.toUpperCase,
    },

    }

</script>