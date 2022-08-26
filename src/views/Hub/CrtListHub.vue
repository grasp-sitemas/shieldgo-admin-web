<script>
import Endpoints from '../../components/common/Endpoints';
import Common from '../../components/common/Common';
import Request from '../../components/common/Request';

export default {
    init: (payload) => {
        const el = document.body;
        el.removeAttribute("class");
        $('.modal').modal('hide');

        payload.filter();
    },
    methods:{
        filter: function(){
            let state = this;
            state.items = [];
            state.errors = [];

            if(state.filters.name == null){
                state.filters.name = "";
            }

            $('#spinner').modal('toggle');
            Request.do(state, 'POST', Request.getDefaultHeader(state), state.filters, `${Endpoints.hubs.filter}`,
            (response)=>{//SUCCESS CALLBACK
                console.log(response);
                state.items = response.results;
                console.log(state.items);
                $('#spinner').modal('toggle');
            },
            (error)=>{//ERROR CALLBACK
                console.log(error);
            });
        },
        isAdminMaster: function(){
            let user = this.$session.get('user');
            if (user){
                return user.companyUser && user.companyUser.subtype == "ADMIN_MASTER";
            }
            return false;
        },
        selectItem: function(item){
            this.$emit('load-item', item);
        },
        onChangePage(pageOfItems) {
            // update page of items
            this.pageOfItems = pageOfItems;
        },
        getPageNumbers: function(){
            return this.items.length/10;
        },
        fetchData(){
            // console.log(this.items.companyUser.company);
            this.json_data = this.items;
            return this.json_data;
        }, 
        camelize: Common.camelize,
        toUpperCase: Common.toUpperCase,
    }
}
</script>