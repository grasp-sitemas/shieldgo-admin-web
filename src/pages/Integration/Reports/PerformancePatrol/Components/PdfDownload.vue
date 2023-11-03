<template>
    <div class="card p-5">

        <div class="row">
            <div class="col-md-6">
                <PatrolDataChart ref="patrolDataChart" :item="items?.patrolData" />
            </div>
            <div class="col-md-6">
                <DailyPatrolDataChart ref="dailyPatrolDataChart" :item="dailyItems?.dailyPatrolData" />
            </div>
        </div>

        <div class="row mt-xl-5">
            <div class="col-md-6">
                <AlertsChart ref="alertsChart" :item="items?.alertData?.alertSummary ? items.alertData.alertSummary : alertSummary" />
            </div>
            <div class="col-md-6">
                <DailyAlertsChart ref="dailyAlertsChart" :item="dailyItems?.dailyAlertData" />
            </div>
        </div>

        <div class="row mt-xl-5">
            <div class="col-md-6">
                <PatrolPointDataChart ref="patrolPointDataChart" :item="items?.patrolPointData?.countSummary" />
            </div>
            <div class="col-md-6">
                <DailyPatrolPointDataChart ref="dailyPatrolPointDataChart" :item="dailyItems?.dailyPatrolPointData" />
            </div>
        </div>

        <div class="row mt-xl-5 ">
            <div class="col-md-12">
                <PatrolPointList ref="PatrolPointListChart" :items="items?.patrolPointData?.patrols" />
            </div>
        </div>



    </div>
</template>

<script>
import jsPDF from 'jspdf'

export default {
    props: ['items', 'dailyItems'],
    components: {
        DailyPatrolDataChart: () => import('./Patrols/DailyPatrolDataChart.vue'),
        PatrolDataChart: () => import('./Patrols/PatrolDataChart.vue'),
        AlertsChart: () => import('./Alerts/AlertsChart.vue'),
        DailyAlertsChart: () => import('./Alerts/DailyAlertsChart.vue'),
        PatrolPointDataChart: () => import('./PatrolPoint/PatrolPointDataChart.vue'),
        DailyPatrolPointDataChart: () => import('./PatrolPoint/DailyPatrolPointDataChart.vue'),
        PatrolPointList: () => import('./PatrolPointList/PatrolPointList.vue'),
    },
    data() {
        return {
            alertSummary:{
                SOSAlerts: null,
                LowBatteryAlerts: null,
                TotalAlerts: 0
            }
        }
    },
    methods: {
        generatePDF() {
            const pdf = new jsPDF()

            // Adicione os gráficos ao PDF
            const chartRefs = ['patrolDataChart', 'dailyPatrolDataChart', 'alertsChart', 'dailyAlertsChart', 'patrolPointDataChart', 'dailyPatrolPointDataChart']

            const pdfWidth = pdf.internal.pageSize.getWidth()
            let yOffset = 10

            chartRefs.forEach(ref => {
                const chartCanvas = this.$refs[ref]
                const chartImage = chartCanvas.toDataURL('image/jpeg', 1.0)
                const aspectRatio = chartCanvas.width / chartCanvas.height
                const imageWidth = pdfWidth - 20
                const imageHeight = imageWidth / aspectRatio

                pdf.addImage(chartImage, 'JPEG', 10, yOffset, imageWidth, imageHeight)
                yOffset += imageHeight + 10
            })

            pdf.save('patrol-analysis.pdf')
        },
    },
}
</script>
<style scoped>
.pdf-download {
    display: flex;
    flex-direction: column;
    align-items: center;
}
