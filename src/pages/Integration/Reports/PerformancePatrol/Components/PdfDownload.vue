<template>
    <div class="card p-5">
        <!-- Botão para baixar o PDF -->
        <!-- <div class="row btn-container">
            <button type="submit" class="btn btn-primary center w-25" :class="{ 'is-loading': isLoading }" @click="viewPDF">Baixar PDF</button>
        </div> -->

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

        <div class="row mt-xl-5">
            <div class="col-md-12">
                <PatrolPointListChart ref="PatrolPointListChart" :items="items?.patrolPointData?.patrols" />
            </div>
        </div>

        <div id="pdf-content" class="d-none">
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

            <div class="row mt-xl-5">
                <div class="col-md-12">
                    <PatrolPointListChart ref="PatrolPointListChart" :items="items?.patrolPointData?.patrols" />
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import jsPDF from 'jspdf'
import html2canvas from 'html2canvas' // Usado para capturar imagens dos gráficos

export default {
    props: ['items', 'dailyItems'],
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
            alertSummary: {
                SOSAlerts: null,
                LowBatteryAlerts: null,
                TotalAlerts: 0,
            },
        }
    },
    methods: {
        async viewPDF() {
            this.isLoading = true

            try {
                const pdfData = await this.generatePDF()

                console.log('pdfData', pdfData)
                const pdfURL = URL.createObjectURL(pdfData)

                this.openPDFWindow(pdfURL)
            } catch (error) {
                console.error('Failed to view PDF', error)
                this.$emit('error', 'Erro ao gerar o PDF.') // Emita um evento de erro
            } finally {
                this.isLoading = false
            }
        },

        async generatePDF() {
            const pdf = new jsPDF()

            // Mostra temporariamente o conteúdo do PDF para captura
            const pdfContent = document.getElementById('pdf-content')
            pdfContent.classList.remove('d-none')

            try {
                // Use html2canvas para capturar o conteúdo da div 'pdf-content'
                const canvas = await html2canvas(pdfContent, {
                    scale: 2, // Ajuste o scale conforme necessário para melhorar a qualidade
                })

                const imgData = canvas.toDataURL('image/jpeg', 1.0)
                pdf.addImage(imgData, 'JPEG', 0, 0)

                pdfContent.classList.add('d-none') // Esconder o conteúdo novamente após captura
                return pdf.output('blob')
            } catch (error) {
                console.error('Error while generating PDF:', error)
                throw error
            }
        },

        async addChartToPDF(pdf, chartComponent, index, charts) {
            if (chartComponent && chartComponent.getChartInstance) {
                const chart = chartComponent.getChartInstance()
                if (chart) {
                    const canvas = chart.canvas
                    const canvasImage = await html2canvas(canvas)
                    const imgData = canvasImage.toDataURL('image/jpeg', 1.0)
                    const imgProps = pdf.getImageProperties(imgData)
                    const pdfWidth = pdf.internal.pageSize.getWidth() - 20
                    const pdfHeight = (imgProps.height * pdfWidth) / imgProps.width

                    // Calcular a altura acumulada baseando-se na altura de cada gráfico anterior
                    const margin = 10
                    const positionY = index === 0 ? margin : pdf.internal.pageSize.getHeight() * index + margin

                    pdf.addImage(imgData, 'JPEG', 10, positionY, pdfWidth, pdfHeight)

                    if (index !== charts.length - 1) {
                        pdf.addPage()
                    }
                }
            } else {
                console.error('O componente do gráfico não está definido ou não possui o método getChartInstance.')
            }
        },

        openPDFWindow(pdfURL) {
            const width = window.innerWidth * 0.8
            const height = window.innerHeight * 0.8
            const left = (window.innerWidth - width) / 2
            const top = (window.innerHeight - height) / 2

            window.open(pdfURL, '_blank', `width=${width},height=${height},left=${left},top=${top},scrollbars=yes`)
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
