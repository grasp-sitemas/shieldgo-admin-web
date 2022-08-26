<script>
import Endpoints from '../../../../components/common/Endpoints'
import Request from '../../../../components/common/Request'

export default {
    init: () => {
        const el = document.body
        el.removeAttribute('class')
        $('.modal').modal('hide')
    },
    methods: {
        filter: async function () {
            // let responseCollectRollon = (await Request.do(this, 'POST', Request.getDefaultHeader(this),{fileName : "Collects",collectionName : "collects",filters:{type: "OPENED",collectType: "ROLLON"}}, `${Endpoints.systemUsers.count}`)).data;
            // let responseCollectTricycle = (await Request.do(this, 'POST', Request.getDefaultHeader(this),{fileName : "Collects",collectionName : "collects",filters:{type: "OPENED",collectType: "TRICYCLE"}}, `${Endpoints.systemUsers.count}`)).data;
            // let responseCollectPEV = (await Request.do(this, 'POST', Request.getDefaultHeader(this),{fileName : "Collects",collectionName : "collects",filters:{type: "OPENED",collectType: "PEV"}}, `${Endpoints.systemUsers.count}`)).data;

            let responseCollectRollonClosed = (
                await Request.do(
                    this,
                    'POST',
                    Request.getDefaultHeader(this),
                    { fileName: 'Collects', collectionName: 'collects', filters: { type: 'CLOSED', collectType: 'ROLLON' } },
                    `${Endpoints.systemUsers.count}`,
                )
            ).data

            let responseCollectTricycleClosed = (
                await Request.do(
                    this,
                    'POST',
                    Request.getDefaultHeader(this),
                    { fileName: 'Collects', collectionName: 'collects', filters: { type: 'CLOSED', collectType: 'TRICYCLE' } },
                    `${Endpoints.systemUsers.count}`,
                )
            ).data

            let responseCollectPEVClosed = (
                await Request.do(
                    this,
                    'POST',
                    Request.getDefaultHeader(this),
                    { fileName: 'Collects', collectionName: 'collects', filters: { type: 'CLOSED', collectType: 'PEV' } },
                    `${Endpoints.systemUsers.count}`,
                )
            ).data

            // this.total = responseCollectRollon.count + responseCollectTricycle.count + responseCollectPEV.count;
            this.totalClosed = responseCollectRollonClosed.count + responseCollectTricycleClosed.count + responseCollectPEVClosed.count

            if (responseCollectRollonClosed.status == 200 && responseCollectTricycleClosed.status == 200 && responseCollectPEVClosed.status == 200) {
                // this.chart.data.datasets[0].data = [responseCollectRollon.count, responseCollectTricycle.count, responseCollectPEV.count];
                this.chart.data.datasets[0].data = [responseCollectRollonClosed.count, responseCollectTricycleClosed.count, responseCollectPEVClosed.count]
                this.chart.update()
            }
        },
    },
}
</script>
