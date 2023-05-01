<template>
    <div>
        <button type="submit" class="btn btn-primary is-loading" v-on:click="viewPDF">
            <i v-if="isLoading" class="fas fa-spinner fa-pulse" />
            PDF
        </button>
    </div>
</template>

<script>
import moment from 'moment'
import jsPDF from 'jspdf'
export default {
    props: {
        jsonData: {
            type: Array,
            default: () => [],
        },
        pdfHeader: {
            type: Array,
            default: () => [],
        },
        jsonTitle: {
            type: String,
            default: '',
        },
        filename: {
            type: String,
            default: '',
        },
        reportName: {
            type: String,
            default: '',
        },
    },
    watch: {
        jsonData() {
            this.data = this.jsonData
            this.title = this.jsonTitle
            this.headers = this.pdfHeader
            this.name = this.filename + '.pdf'
            this.report = this.reportName
        },
    },
    data() {
        return {
            isLoading: false,
            data: [],
            title: '',
            headers: [],
            meta: [],
            name: '',
            report: '',
        }
    },
    methods: {
        async downloadPDF() {
            this.isLoading = true
            let items = this.data
            let y = 25

            var doc = new jsPDF({ orientation: 'l', unit: 'mm', format: 'a4' })

            let headers = createHeaders(this.headers)

            function generateData(items) {
                const results = []

                items.forEach(item => {
                    item.actions.forEach(action => {
                        const startDate = moment(item?.startDate).utc(false).format('DD/MM/YYYY HH:mm:ss')
                        const endDate = moment(item?.endDate).utc(false).format('DD/MM/YYYY HH:mm:ss')
                        const scannedDate = action?.date ? moment(action?.date).utc(false).format('DD/MM/YYYY HH:mm:ss') : ' '

                        const newItem = {
                            patrolPoint: action?.patrolPoint?.name ? String(action.patrolPoint.name) : ' ',
                            vigilant: item.vigilant ? String(item.vigilant) : ' ',
                            startDate: String(startDate),
                            endDate: String(endDate),
                            scannedDate: String(scannedDate),
                            client: String(item.client),
                            site: String(item.site),
                        }
                        results.push(newItem)
                    })
                })
                return results
            }

            function createHeaders(keys) {
                const result = []
                for (let i = 0; i < keys.length; i += 1) {
                    result.push({
                        id: keys[i]._id,
                        name: keys[i]._id,
                        prompt: keys[i].name,
                        width: 45,
                        align: 'left',
                        padding: 0,
                    })
                }
                return result
            }

            try {
                doc.setFont('helvetica', 'bold')
                doc.text(this.title.toUpperCase(), 5, 10)

                doc.setTextColor('#161B22')
                doc.setFont('helvetica', 'normal')
                doc.setFontSize(8)

                doc.text(this.$t('str.generated.on') + ': ' + moment().utc(true).format('DD/MM/YYYY HH:mm:ss'), 5, 15)

                for (let i = 0; i < items.length; i++) {
                    let item = items[i]

                    if (i > 0) {
                        doc.addPage('a4', 'l')
                        y = 25
                    }

                    doc.setFontSize(12)
                    doc.setFont('helvetica', 'bold')
                    doc.text(String(item.name).toUpperCase(), 5, y)
                    y += 4

                    doc.setFontSize(8)
                    doc.setFont('helvetica', 'normal')

                    const address = item.address.address + ', ' + item.address.number + ', ' + item.address.neighborhood + ', ' + item.address.city + ' - ' + item.address.state
                    doc.text(address, 5, y)

                    y += 10

                    for (let j = 0; j < item.schedules.length; j++) {
                        const schedule = item.schedules[j]

                        const beginDate = moment(schedule.beginDate).utc(false).format('DD/MM/YYYY HH:mm:ss')
                        const endDate = moment(schedule.endDate).utc(false).format('DD/MM/YYYY HH:mm:ss')

                        doc.text(this.$t('str.description') + ': ' + String(schedule.name), 5, y)
                        y += 4
                        doc.text(this.$t('str.begins.in') + ': ' + String(beginDate), 5, y)
                        y += 4
                        doc.text(this.$t('str.ends.in') + ': ' + String(endDate), 5, y)
                        y += 4
                        doc.text(this.$t('str.frequency') + ': ' + this.$t(String(schedule.frequency)), 5, y)
                        y += 6

                        let data = await generateData(schedule.items)
                        doc.table(5, y, data, headers, { autoSize: true, fontSize: 8 })

                        y += data.length * 10 + 10
                    }

                    y += 10
                }

                this.isLoading = false

                return new Promise(resolve => {
                    const pdfData = doc.output('blob')
                    resolve(pdfData)
                })
            } catch (error) {
                this.isLoading = false
                console.log(error)
            }
        },
        async viewPDF() {
            try {
                this.isLoading = true
                const pdfData = await this.downloadPDF()
                this.isLoading = false

                // Crie uma URL a partir do Blob
                const pdfURL = URL.createObjectURL(pdfData)

                // Defina as propriedades da janela pop-up
                const width = window.innerWidth * 0.8
                const height = window.innerHeight * 0.8
                const left = (window.innerWidth - width) / 2
                const top = (window.innerHeight - height) / 2
                const windowFeatures = `width=${width},height=${height},left=${left},top=${top},scrollbars=yes,toolbar=yes,menubar=no,location=no,status=yes`

                // Abra uma nova janela pop-up com o PDF
                const previewWindow = window.open(pdfURL, '_blank', windowFeatures)

                // Adicione um listener para fechar a janela pop-up quando o documento for impresso ou o usuário cancelar
                if (previewWindow) {
                    previewWindow.print = function () {
                        previewWindow.close()
                    }
                }
            } catch (error) {
                this.isLoading = false
                console.error(error)
            }
        },
    },
}
</script>
