<script>
import Endpoints from '../../../../components/common/Endpoints';
import Common from '../../../../components/common/Common';
import Request from '../../../../components/common/Request';
import { mapActions } from 'vuex'

export default {
    init: async(payload) => {
        const el = document.body;
        el.removeAttribute("class");
        $('.modal').modal('hide');

    },
  methods:{
    filter: async function(){
      let responseUserRollon = (await Request.do(this, 'POST', Request.getDefaultHeader(this),{fileName : "CompanyUsers",collectionName : "company-users",filters:{status: "ACTIVE",subtype:"EMPLOYEE",employedType:"ROLLON"}}, `${Endpoints.systemUsers.count}`)).data;
      let responseUserTricycle = (await Request.do(this, 'POST', Request.getDefaultHeader(this),{fileName : "CompanyUsers",collectionName : "company-users",filters:{status: "ACTIVE",subtype:"EMPLOYEE",employedType:"TRICYCLE"}}, `${Endpoints.systemUsers.count}`)).data;

      this.total = responseUserRollon.count+responseUserTricycle.count;

      if (responseUserRollon.status==200 && responseUserTricycle.status==200){
        this.chart.data.datasets[0].data = [responseUserRollon.count,responseUserTricycle.count];
        this.chart.update(); 
      }
    } 
  } 
}
</script>
