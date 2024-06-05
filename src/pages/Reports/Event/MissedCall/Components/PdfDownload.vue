<template>
    <div>
        <button type="submit" class="btn btn-primary" @click="viewPDF">
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
            y += 10

            // Data de geração
            doc.setFontSize(10)
            doc.setFont('helvetica', 'normal')
            doc.text('Gerado em: ' + moment().format('DD/MM/YYYY HH:mm:ss'), 105, y, { align: 'center' })
            y += 10

            const headers = this.headers.map(header => header.title)

            // Processar cada item no jsonData
            for (let i = 0; i < this.data.length; i++) {
                const item = this.data[i]

                if (i > 0) {
                    doc.addPage()
                    y = 25
                }

                if (item.clients.length > 0) {
                    for (let j = 0; j < item.clients.length; j++) {
                        const client = item.clients[j]

                        if (j > 0) {
                            doc.addPage()
                            y = 25
                        }

                        doc.setFontSize(12)
                        doc.setFont('helvetica', 'bold')
                        doc.text(`${this.$t('str.client').toUpperCase()}: ${client.name}`, 15, y)
                        y += 10

                        if (client.sites.length > 0) {
                            for (let k = 0; k < client.sites.length; k++) {
                                const site = client.sites[k]

                                doc.setFontSize(12)
                                doc.setFont('helvetica', 'bold')
                                doc.text(`${this.$t('str.site').toUpperCase()}: ${site.name}`, 15, y)
                                y += 4

                                doc.setFontSize(10)
                                doc.setFont('helvetica', 'normal')
                                const address = `${site.address.address}, ${site.address.number}, ${site.address.neighborhood}, ${site.address.city} - ${site.address.state}`
                                doc.text(address, 15, y)

                                const total = `${this.$t('str.total.missed.calls')}: ${site.items.length}`
                                const textWidth = (doc.getStringUnitWidth(total) * doc.internal.getFontSize()) / doc.internal.scaleFactor
                                const textOffset = doc.internal.pageSize.width - textWidth
                                doc.text(total, textOffset - 15, y)
                                y += 10

                                let formattedList = []

                                for (let m = 0; m < site.items.length; m++) {
                                    const subItem = site.items[m]
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
                                    head: [headers],
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
                                        y = dataArg.cursor.y + 10 // Atualizar y após desenhar a tabela
                                    },
                                })

                                y = doc.lastAutoTable.finalY + 10
                            }
                        }
                    }
                }
            }

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
