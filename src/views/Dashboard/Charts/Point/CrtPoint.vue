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
      let responsePoints = (await Request.do(this, 'POST', Request.getDefaultHeader(this),{fileName : "Points",collectionName : "points",filters:{status: "ACTIVE"}}, `${Endpoints.systemUsers.count}`)).data;

      this.total = responsePoints.count;

      if (responsePoints.status==200){
        this.chart.data.datasets[0].data = [responsePoints.count];
        this.chart.update(); 
      }
    } 
  } 
}
</script>
