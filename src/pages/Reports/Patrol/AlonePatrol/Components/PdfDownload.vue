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
import 'jspdf-autotable'
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
        logoURL: {
            type: String,
            default: '',
        },
    },
    watch: {
        jsonData() {
            this.title = this.jsonTitle
            this.headers = this.pdfHeader
            this.name = this.filename + '.pdf'
            this.report = this.reportName
        },
    },
    data() {
        return {
            isLoading: false,
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

            doc.setFont('helvetica', 'bold')
            doc.setFontSize(16)
            doc.text(this.title.toUpperCase(), 105, y, { align: 'center' })

            y += 5

            doc.setFontSize(10)
            doc.setFont('helvetica', 'normal')
            doc.text('Gerado em: ' + moment().format('DD/MM/YYYY HH:mm:ss'), 105, y, { align: 'center' })
            y += 10

            this.jsonData.forEach((item, index) => {
                if (index > 0) {
                    doc.addPage()
                    y = 25
                }

                doc.setFontSize(12)

                doc.text(item?.name ? item.name.toUpperCase() : ' ', 15, y)

                y += 6

                doc.setFontSize(10)
                const addressParts = [item.address?.address, item.address?.number, item.address?.neighborhood, item.address?.city, item.address?.state].filter(part => part) // Remove partes undefined ou null
                const address = addressParts.join(', ')
                doc.text(address, 15, y)

                y += 10

                for (let j = 0; j < item.patrols.length; j++) {
                    const patrol = item.patrols[j]
                    const startDate = moment(patrol.startDate).format('DD/MM/YYYY HH:mm:ss')
                    const endDate = moment(patrol.endDate).format('DD/MM/YYYY HH:mm:ss')

                    doc.text(`Início: ${startDate} | Término: ${endDate}`, 15, y)
                    y += 6
                    doc.text(`Vigilante: ${patrol.vigilant}`, 15, y)
                    y += 6

                    let data = []

                    for (let k = 0; k < patrol.items.length; k++) {
                        const item = patrol.items[k]
                        const itemName = item.name || ' '
                        const itemDate = item.date ? moment(item.date).format('DD/MM/YYYY HH:mm:ss') : ' '

                        data.push([itemName, itemDate])
                    }

                    doc.autoTable({
                        startY: y,
                        head: [this.headers],
                        body: data,
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

                    y += 10 // Spacing after each patrol
                }
            })

            this.isLoading = false
            return doc.output('blob')
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

<style scoped>
.report-container {
    display: flex;
    justify-content: center;
    margin-top: 20px;
}
</style>
