<template>
    <div>
        <button type="submit" class="btn btn-primary" v-on:click="viewPDF">
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
        logoURL: {
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
            const doc = new jsPDF({ orientation: 'p', unit: 'mm', format: 'a4' })
            let y = 10

            // Adicionar logo se existir
            if (this.logoURL) {
                const imgData = await this.loadImageWithWhiteBackground(this.logoURL)
                const imgProps = doc.getImageProperties(imgData)
                const imgWidth = 40 // Largura fixa para o logotipo
                const imgHeight = (imgProps.height * imgWidth) / imgProps.width // Altura proporcional
                const x = (doc.internal.pageSize.getWidth() - imgWidth) / 2 // Centralizar horizontalmente
                doc.addImage(imgData, 'PNG', x, y, imgWidth, imgHeight)
                y += imgHeight + 10 // Adicionar margem após a imagem
            }

            // Título
            doc.setFont('helvetica', 'bold')
            doc.setFontSize(16)
            doc.text(this.title.toUpperCase(), 105, y, { align: 'center' })
            y += 5

            // Data de geração
            doc.setFontSize(10)
            doc.setFont('helvetica', 'normal')
            doc.text('Gerado em: ' + moment().format('DD/MM/YYYY HH:mm:ss'), 105, y, { align: 'center' })
            y += 10

            const startDate = this.periodStart ? moment(this.periodStart).utc(false).format('DD/MM/YYYY') : ' '
            const endDate = this.periodEnd ? moment(this.periodEnd).utc(false).format('DD/MM/YYYY') : ' '
            const account = this.jsonInfo.account
            const address = this.jsonInfo.accountAddress

            doc.setFont('helvetica', 'bold')
            doc.text(account?.toUpperCase(), 15, y)
            y += 5
            doc.setFont('helvetica', 'normal')
            doc.text(`${address?.address}, ${address?.number}, ${address?.neighborhood}, ${address?.cep}, ${address?.city}, ${address?.state}`, 15, y)
            y += 10

            doc.text(`${this.$t('str.supervisor')}: ${this.supervisor}`, 15, y) // supervisor
            doc.text(`${this.$t('str.total.visits')}: ${this.totalVisits}/${this.data.length}`, 110, y) // total visits

            y += 5

            doc.text(`${this.$t('str.period')}: ${startDate} - ${endDate}`, 15, y)
            y += 5

            // Linha separadora
            y += 2
            doc.setDrawColor(200) // Cor cinza
            doc.setLineWidth(0.5) // Espessura da linha
            doc.line(15, y, 200, y)
            y += 8

            async function generateData(items, state) {
                const results = []
                for (const item of items) {
                    const newItem = {
                        read: item.read ? state.$t('str.visited') : state.$t('str.not.visited'),
                        scanDate: item?.scanDate ? String(item.scanDate) : ' ',
                        name: String(item.name).toUpperCase(),
                    }
                    results.push(newItem)
                }
                return results
            }

            const data = await generateData(this.data, this)
            doc.autoTable({
                startY: y,
                head: [this.headers.map(header => header.name)],
                body: data.map(item => Object.values(item)),
                theme: 'striped',
                styles: { font: 'helvetica', fontSize: 8, fontStyle: 'normal' },
                headStyles: {
                    fillColor: [128, 128, 128],
                    textColor: 255,
                    fontStyle: 'bold',
                },
                columnStyles: {
                    0: { fontStyle: 'normal' },
                    1: { fontStyle: 'normal' },
                },
                didDrawPage: dataArg => {
                    y = dataArg.cursor.y + 10 // Update y after drawing the table
                },
            })

            this.isLoading = false
            return new Promise(resolve => {
                const pdfData = doc.output('blob')
                resolve(pdfData)
            })
        },
        async viewPDF() {
            try {
                const pdfData = await this.downloadPDF()
                const pdfURL = URL.createObjectURL(pdfData)
                window.open(pdfURL, '_blank')
            } catch (error) {
                this.isLoading = false
                console.error('Error while generating PDF:', error)
            }
        },
        async loadImageWithWhiteBackground(url) {
            return new Promise((resolve, reject) => {
                const img = new Image()
                img.crossOrigin = 'Anonymous'
                img.onload = () => {
                    const canvas = document.createElement('canvas')
                    const ctx = canvas.getContext('2d')
                    canvas.width = img.width
                    canvas.height = img.height

                    // Preencher o fundo com branco
                    ctx.fillStyle = '#FFFFFF'
                    ctx.fillRect(0, 0, canvas.width, canvas.height)

                    // Desenhar a imagem sobre o fundo branco
                    ctx.drawImage(img, 0, 0)
                    resolve(canvas.toDataURL('image/png'))
                }
                img.onerror = () => reject(new Error('Failed to load image'))
                img.src = url
            })
        },
    },
}
</script>
