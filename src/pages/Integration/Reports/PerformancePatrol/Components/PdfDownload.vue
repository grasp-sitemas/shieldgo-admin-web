<template>
    <div class="card p-5">
        <div class="row btn-container">
            <button type="submit" class="btn btn-primary center w-25" @click="downloadPdf"><i v-if="isLoading" class="fas fa-spinner fa-spin" /> Baixar PDF</button>
        </div>

        <div class="row">
            <div class="col-md-6">
                <PatrolDataChart ref="patrolDataChart" :item="summary?.patrolData" />
            </div>
            <div class="col-md-6">
                <DailyPatrolDataChart ref="dailyPatrolDataChart" :item="dailyItems?.dailyPatrolData" />
            </div>
        </div>

        <div class="row mt-xl-5">
            <div class="col-md-6">
                <AlertsChart ref="alertsChart" :item="summary?.alertData" />
            </div>
            <div class="col-md-6">
                <DailyAlertsChart ref="dailyAlertsChart" :item="dailyItems?.dailyAlertData" />
            </div>
        </div>

        <div class="row mt-xl-5">
            <div class="col-md-6">
                <PatrolPointDataChart ref="patrolPointDataChart" :item="summary?.patrolPointData" />
            </div>
            <div class="col-md-6">
                <DailyPatrolPointDataChart ref="dailyPatrolPointDataChart" :item="dailyItems?.dailyPatrolPointData" />
            </div>
        </div>

        <div class="row mt-xl-5">
            <div class="col-md-12">
                <PatrolPointListChart ref="PatrolPointListChart" :items="items" :periodStart="periodStart" :periodEnd="periodEnd" />
            </div>
        </div>
    </div>
</template>

<script>
import jsPDF from 'jspdf'
import html2canvas from 'html2canvas'
import moment from 'moment'

export default {
    props: ['summary', 'dailyItems', 'items', 'periodStart', 'periodEnd'],
    components: {
        DailyPatrolDataChart: () => import('./Patrols/DailyPatrolDataChart.vue'),
        PatrolDataChart: () => import('./Patrols/PatrolDataChart.vue'),
        AlertsChart: () => import('./Alerts/AlertsChart.vue'),
        DailyAlertsChart: () => import('./Alerts/DailyAlertsChart.vue'),
        PatrolPointDataChart: () => import('./PatrolPoint/PatrolPointDataChart.vue'),
        DailyPatrolPointDataChart: () => import('./PatrolPoint/DailyPatrolPointDataChart.vue'),
        PatrolPointListChart: () => import('./PatrolPointListChart/PatrolPointListChart.vue'),
    },
    data() {
        return {
            isLoading: false,
            alertData: {
                sosAlerts: null,
                crashAlerts: null,
                lowBatteryAlerts: null,
                totalAlerts: 0,
            },
            moment: moment,
        }
    },
    methods: {
        async downloadPdf() {
            this.isLoading = true

            try {
                const pdf = new jsPDF('p', 'pt', 'a4')
                const pageWidth = pdf.internal.pageSize.getWidth()
                const pageHeight = pdf.internal.pageSize.getHeight()
                const titleHeight = 40 // Altura para o título
                const spacingBetweenGraphs = 20 // Espaçamento entre os gráficos
                const graphHeight = (pageHeight - titleHeight - spacingBetweenGraphs * 3) / 2 // Altura ajustada para cada gráfico

                // Adicionando o título na primeira página
                pdf.setFillColor('#2d353c')
                pdf.rect(0, 0, pageWidth, pageHeight, 'F')
                pdf.setFontSize(13)
                pdf.setTextColor('#fff')
                pdf.text(this.$t('str.reports.performance.patrol.legacy'), 20, 30) // Posição do título

                // adicionar a data
                pdf.setFontSize(9)
                pdf.setTextColor('#fff')
                pdf.text(`${this.$t('str.reports.performance.patrol.date')}: ${moment().utc(true).format('DD/MM/YYYY HH:mm:ss')}`, 20, 45) // Posição da data

                // Função para adicionar gráficos
                const addGraph = async (ref, posY) => {
                    if (this.$refs[ref]) {
                        const canvas = await html2canvas(this.$refs[ref].$el, { backgroundColor: null, scale: 2 })
                        pdf.addImage(canvas.toDataURL('image/png'), 'PNG', 0, posY, pageWidth, graphHeight - 60)
                    }
                }

                // Adicionando os gráficos
                await addGraph('patrolDataChart', titleHeight + spacingBetweenGraphs)
                await addGraph('dailyPatrolDataChart', titleHeight + graphHeight + spacingBetweenGraphs * 2)

                // Nova página para os próximos gráficos
                pdf.addPage()
                pdf.setFillColor('#2d353c')
                pdf.rect(0, 0, pageWidth, pageHeight, 'F')

                await addGraph('alertsChart', spacingBetweenGraphs)
                await addGraph('dailyAlertsChart', graphHeight + spacingBetweenGraphs * 2)

                // Nova página para os próximos gráficos
                pdf.addPage()
                pdf.setFillColor('#2d353c')
                pdf.rect(0, 0, pageWidth, pageHeight, 'F')

                await addGraph('patrolPointDataChart', spacingBetweenGraphs)
                await addGraph('dailyPatrolPointDataChart', graphHeight + spacingBetweenGraphs * 2)

                pdf.save(`${this.$t('str.reports.performance.patrol.file.name')}.pdf`)
            } catch (error) {
                console.error('Erro ao gerar PDF:', error)
            }

            this.isLoading = false
        },
    },
}
</script>

<style scoped>
.btn .is-loading {
    pointer-events: none;
    opacity: 0.7;
}

.btn-container {
    display: flex;
    justify-content: center;
    margin-bottom: 20px;
}

.d-none {
    display: none;
}
</style>
