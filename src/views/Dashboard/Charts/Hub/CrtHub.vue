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
      let responseHubRollon = (await Request.do(this, 'POST', Request.getDefaultHeader(this),{fileName : "Hubs",collectionName : "hubs",filters:{type: "ACTIVE",type: "ROLLON"}}, `${Endpoints.systemUsers.count}`)).data;
      let responseHubPEV = (await Request.do(this, 'POST', Request.getDefaultHeader(this),{fileName : "Hubs",collectionName : "hubs",filters:{type: "ACTIVE",type: "PEV"}}, `${Endpoints.systemUsers.count}`)).data;

      this.total = responseHubRollon.count+responseHubPEV.count;

      if (responseHubRollon.status==200 && responseHubPEV.status==200){
        this.chart.data.datasets[0].data = [responseHubRollon.count,responseHubPEV.count];
        this.chart.update(); 
      }
    } 
  } 
}
</script>
