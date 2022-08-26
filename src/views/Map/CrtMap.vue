<script>
import Endpoints from '../../components/common/Endpoints';
import Common from '../../components/common/Common';
import Request from '../../components/common/Request';

export default {
    init: (payload) => {
        const el = document.body;
        el.removeAttribute("class");
        $('.modal').modal('hide');

        payload.getCollectPoints();
        payload.getCollectHubs();
    },
    methods:{
        getCollectPoints: function(){

            Request.do(this, 'POST', Request.getDefaultHeader(this), {status: 'ACTIVE', notEmptyAddress: true }, `${Endpoints.points.filter}`,
            (response)=>{//SUCCESS CALLBACK
                this.collectPoints = response.results;
            },
            (error)=>{//ERROR CALLBACK  
            });
        },
        getCollectHubs: function(){

            Request.do(this, 'POST', Request.getDefaultHeader(this), {status: 'ACTIVE', notEmptyAddress: true}, `${Endpoints.pointHubs.filter}`,
            (response)=>{//SUCCESS CALLBACK
                this.collectHubs = response.results;
            },
            (error)=>{//ERROR CALLBACK
            });
        },
        openWindowPoints (index) {
            this.windowPoint_open = true
            this.indexPoints = index;
        },
        openWindowHubs (index) {
            this.windowHub_open = true
            this.indexHubs = index;
        },
        async getLocation() {
            return new Promise((resolve, reject) => {

            if(!("geolocation" in navigator)) {
                reject(new Error('Geolocation is not available.'));
            }

            navigator.geolocation.getCurrentPosition(pos => {
                resolve(pos);
            }, err => {
                reject(err);
            });

            });
        },
        async locateMe() {
            this.gettingLocation = true;
            try {
                this.gettingLocation = false;
                this.location = await this.getLocation();
            } catch(e) {
                this.gettingLocation = false;
                this.errorStr = e.message;
            }
        
        },
        selectItem: function(item){
            this.latitude = null;
            this.longitude = null;

            this.data = JSON.parse(JSON.stringify(item));
            if(this.data.address && this.data.address.location && this.data.address.location.coordinates && this.data.address.location.coordinates.length > 0){
                this.latitude = this.data.address.location.coordinates[1];
                this.longitude = this.data.address.location.coordinates[0];
            }
        },
        onChange(item){
            if(item == 'COLLECT-HUB'){
                this.collectPoints = [];
                this.collectHubs = [];
                this.getCollectHubs();
            }else
            if(item == 'COLLECT-POINT'){
                this.collectPoints = [];
                this.collectHubs = [];
                this.getCollectPoints();
            }else
            if(item == 'ALL'){
                this.collectPoints = [];
                this.collectHubs = [];
                this.getCollectPoints();
                this.getCollectHubs();
            }else
            {
                this.collectPoints = [];
                this.collectHubs = [];
            }
        },
        camelize: Common.camelize,
        toUpperCase: Common.toUpperCase,
    }
}
</script>