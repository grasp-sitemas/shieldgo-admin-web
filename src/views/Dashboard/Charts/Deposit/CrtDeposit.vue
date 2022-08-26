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
      let responseDeposits = (await Request.do(this, 'POST', Request.getDefaultHeader(this),{fileName : "Deposits", collectionName : "deposits", filters: {status: "ACTIVE"} }, `${Endpoints.systemUsers.count}`)).data;

      this.total = responseDeposits.count;

      if (responseDeposits.status==200){
        this.chart.data.datasets[0].data = [responseDeposits.count];
        this.chart.update(); 
      }
    } 
  } 
}
</script>
