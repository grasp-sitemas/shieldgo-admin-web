<template>
    <div>
        <button type="submit" class="btn btn-primary" @click="viewPDF">
            <i v-if="isLoading" class="fas fa-spinner fa-pulse"></i>
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
        },
    },
    data() {
        return {
            isLoading: false,
            data: [],
            title: '',
            headers: [],
            name: '',
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
            y += 10

            // Data de geração
            doc.setFontSize(10)
            doc.setFont('helvetica', 'normal')
            doc.text('Gerado em: ' + moment().format('DD/MM/YYYY HH:mm:ss'), 105, y, { align: 'center' })
            y += 10

            // Processar cada item no jsonData
            this.jsonData.forEach((item, index) => {
                if (index > 0) {
                    doc.addPage()
                    y = 25
                }

                doc.setFontSize(12)
                doc.text(item?.account ? item.account.toUpperCase() : ' ', 15, y)
                y += 6

                doc.setFontSize(10)
                const addressParts = [item.address?.address, item.address?.number, item.address?.neighborhood, item.address?.city, item.address?.state].filter(part => part) // Remove partes undefined ou null
                const address = addressParts.join(', ')
                doc.text(address, 15, y)
                y += 10

                let formattedList = []

                for (let k = 0; k < item.items.length; k++) {
                    const subItem = item.items[k]
                    formattedList.push({
                        client: subItem.client,
                        site: subItem.site,
                        vigilant: subItem.vigilant,
                        date: moment(subItem.date).format('DD/MM/YYYY HH:mm:ss'),
                        deviceInfo: `${subItem.deviceInfo?.brand || ''} - ${subItem.deviceInfo?.model || ''}`,
                        isAttendance: subItem?.attendance?.isAttendance ? 'Sim' : 'Não',
                    })
                }

                doc.autoTable({
                    startY: y,
                    head: [this.headers.map(header => header.title)],
                    body: formattedList.map(item => Object.values(item)),
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

                y = doc.lastAutoTable.finalY + 10
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
