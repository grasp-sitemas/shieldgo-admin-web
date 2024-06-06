<template>
    <div class="report-container">
        <button type="submit" class="btn btn-primary" v-on:click="viewPDF">
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

            for (let i = 0; i < this.jsonData.length; i++) {
                const item = this.jsonData[i]
                if (i > 0) {
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

                for (let j = 0; j < item.schedules.length; j++) {
                    const schedule = item.schedules[j]
                    const startDate = moment(schedule.beginDate).format('DD/MM/YYYY HH:mm:ss')
                    const endDate = moment(schedule.endDate).format('DD/MM/YYYY HH:mm:ss')

                    doc.text(`Agenda: ${schedule.name} / Início: ${startDate} | Término: ${endDate}`, 15, y)
                    y += 6

                    for (let k = 0; k < schedule.items.length; k++) {
                        const patrolItem = schedule.items[k]
                        const eventStartDate = moment(patrolItem.startDate).format('DD/MM/YYYY HH:mm:ss')
                        const eventEndDate = moment(patrolItem.endDate).format('DD/MM/YYYY HH:mm:ss')

                        doc.text(`Evento: ${eventStartDate} | Fim: ${eventEndDate}`, 15, y)
                        y += 6

                        let data = []

                        for (let l = 0; l < patrolItem.points.length; l++) {
                            const point = patrolItem.points[l]
                            data.push([point, patrolItem.client, patrolItem.site])
                        }

                        doc.autoTable({
                            startY: y,
                            head: [['Ponto de Patrulha', 'Cliente', 'Site']],
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
                                2: { fontStyle: 'normal' },
                            },
                            didDrawCell: data => {
                                if (data.cell.section === 'body' && data.row.index === data.table.body.length - 1) {
                                    y = data.cell.y + data.cell.height + 10
                                }
                            },
                        })

                        y += 10 // Spacing after each event
                    }
                }

                doc.text(`Total de rondas não realizadas: ${item.schedules.reduce((acc, schedule) => acc + schedule.items.length, 0)}`, 15, y)
                y += 10
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
