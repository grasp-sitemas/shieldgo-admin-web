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
// import { font } from '../../../../../assets/fonts/font'
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
        jsonInfo: {
            type: Object,
            default: () => {},
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
        supervisor: {
            type: String,
            default: '',
        },
        totalVisits: {
            type: Number,
            default: 0,
        },
        periodStart: {
            type: String,
            default: '',
        },
        periodEnd: {
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

            var doc = new jsPDF({ orientation: 'p', unit: 'mm', format: 'a4' })

            // doc.addFileToVFS('arial-unicode-ms-normal.ttf', font)
            // doc.addFont('arial-unicode-ms-normal.ttf', 'arial-unicode-ms', 'normal')
            // doc.setFont('arial-unicode-ms')

            let headers = createHeaders(this.headers)

            function generateData(items, state) {
                const results = []

                items.forEach(item => {
                    const newItem = {
                        read: item.read ? state.$t('str.visited') : state.$t('str.not.visited'),
                        name: String(item.name).toUpperCase(),
                    }

                    results.push(newItem)
                })
                return results
            }

            function createHeaders(keys) {
                const result = []
                for (let i = 0; i < keys?.length; i += 1) {
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
                doc.setFont('Arial', 'bold')
                doc.setFontSize(14)
                doc.setTextColor(0, 0, 0)

                let y = 20
                doc.text(this.jsonTitle.toUpperCase(), 15, y)
                y += 10

                doc.setFontSize(12)
                doc.setFont('arial', 'normal')
                doc.text(this.$t('str.generated.on') + ': ' + moment().utc(true).format('DD/MM/YYYY HH:mm:ss'), 15, y)
                y += 5

                const account = this.jsonInfo.account
                const address = this.jsonInfo.accountAddress

                doc.setFont('arial', 'bold')
                doc.text(account?.toUpperCase(), 15, y)
                y += 5
                doc.setFont('arial', 'normal')
                doc.text(address?.address + ', ' + address?.number + ', ' + address?.neighborhood + ', ' + address?.cep + ', ' + address?.city + ', ' + address?.state, 15, y)
                y += 10

                doc.text(`${this.$t('str.supervisor')}: ${this.supervisor}`, 15, y) // supervisor
                doc.text(`${this.$t('str.total.visits')}: ${this.totalVisits}/${items.length}`, 110, y) // total visits

                y += 5

                doc.text(`${this.$t('str.period')}: ${this.periodStart} - ${this.periodEnd}`, 15, y)
                y += 5

                y += 10

                let data = await generateData(items, this)
                doc.table(15, y, data, headers, { autoSize: true, fontSize: 8, fontFamily: 'arial-unicode-ms', printHeaders: true, margin: { top: 0, left: 0, right: 0, bottom: 0 } })

                y += 10

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
