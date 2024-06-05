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
import axios from 'axios'
import Endpoints from '../../../../common/Endpoints.vue'
const domain = Endpoints.domain

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
        startDate: {
            type: String,
            default: '',
        },
        endDate: {
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

            const startDate = this?.startDate ? moment(this.startDate).utc(false).format('DD/MM/YYYY') : ' '
            const endDate = this?.endDate ? moment(this.endDate).utc(false).format('DD/MM/YYYY') : ' '
            doc.text(`${this.$t('str.period')}: ${startDate} - ${endDate}`, 5, y)
            y += 10

            async function generateData(items, state) {
                const results = []

                for (const item of items) {
                    const photoBase64 = item?.photoURL && item?.photoURL !== 'https://' ? await getBase64Image(domain + String(item.photoURL)) : null
                    const signatureBase64 = item?.signatureURL && item.signatureURL !== 'https://' ? await getBase64Image(domain + String(item.signatureURL)) : null
                    const newItem = {
                        _id: String(item._id),
                        account: String(item.account),
                        client: String(item.client),
                        site: String(item.site),
                        vigilant: String(item.vigilant),
                        date: item.date ? moment(item.date).utc(false).format('DD/MM/YYYY HH:mm:ss') : ' ',
                        event: item?.event ? String(item.event?.name) : ' ',
                        geolocation: item.geolocation ? String(item.geolocation.latitude) + ' - ' + String(item.geolocation.longitude) : ' ',
                        deviceInfo: item.deviceInfo ? String(item.deviceInfo?.brand) + ' - ' + String(item.deviceInfo?.model) : ' ',
                        isAttendance: item?.attendance?.isAttendance ? state.$t('str.yes') : state.$t('str.no'),
                        attendanceStatus: item?.attendance?.status ? state.$t(item.attendance.status) : ' ',
                        operator: item?.attendance?.operator ? String(item?.attendance?.operator) : ' ',
                        openedDate: item?.attendance?.openedDate ? moment(item?.attendance?.openedDate).utc(false).format('DD/MM/YYYY HH:mm:ss') : ' ',
                        closedDate: item?.attendance?.closedDate ? moment(item?.attendance?.closedDate).utc(false).format('DD/MM/YYYY HH:mm:ss') : ' ',
                        notes: item?.notes ? String(item?.notes) : ' ',
                        photoURL: photoBase64,
                        signatureURL: signatureBase64,
                    }

                    results.push(newItem)
                }
                return results
            }

            function arrayBufferToBase64(buffer) {
                let binary = ''
                const bytes = new Uint8Array(buffer)
                const len = bytes.byteLength
                for (let i = 0; i < len; i++) {
                    binary += String.fromCharCode(bytes[i])
                }
                return window.btoa(binary)
            }

            async function getBase64Image(imgUrl) {
                try {
                    const response = await axios.get(imgUrl, { responseType: 'arraybuffer' })
                    const mimeType = 'image/png'

                    const base64 = arrayBufferToBase64(response.data)
                    return `data:${mimeType};base64,${base64}`
                } catch (error) {
                    console.log(error)
                    return null
                }
            }

            async function drawImageInCell(doc, base64Image, x, y, width, height) {
                if (base64Image) {
                    doc.addImage(base64Image, 'PNG', x, y, width, height)
                }
            }

            try {
                const items = this.data

                for (let i = 0; i < items.length; i++) {
                    let item = items[i]

                    if (item?.clients?.length > 0) {
                        if (i > 0) {
                            doc.addPage('a4', 'p')
                            y = 20
                        }

                        for (let j = 0; j < item.clients.length; j++) {
                            const client = item.clients[j]

                            if (j > 0) {
                                doc.addPage('a4', 'p')
                                y = 25
                            }

                            doc.setFontSize(12)
                            doc.setFont('helvetica', 'bold')
                            doc.text(`${this.$t('str.client').toUpperCase()}: ${client.name}`, 5, y)
                            y += 2

                            // Adicionar linha fina cinza
                            doc.setDrawColor(200) // Cor cinza
                            doc.setLineWidth(0.5) // Espessura da linha
                            doc.line(5, y, 200, y)
                            y += 8

                            if (client?.sites?.length > 0) {
                                for (let k = 0; k < client.sites.length; k++) {
                                    const site = client.sites[k]

                                    doc.setFontSize(12)
                                    doc.setFont('helvetica', 'bold')
                                    doc.text(`${this.$t('str.site').toUpperCase()}: ${site.name}`, 5, y)
                                    y += 4

                                    doc.setFontSize(10)
                                    doc.setFont('helvetica', 'normal')
                                    const address = `${site.address.address}, ${site.address.number}, ${site.address.neighborhood}, ${site.address.city} - ${site.address.state}`
                                    doc.text(address, 5, y)

                                    const totalAlerts = `${this.$t('str.total.incidents')}: ${site.items.length}`
                                    const textWidth = (doc.getStringUnitWidth(totalAlerts) * doc.internal.getFontSize()) / doc.internal.scaleFactor
                                    const textOffset = doc.internal.pageSize.width - textWidth
                                    doc.text(totalAlerts, textOffset - 15, y)
                                    y += 10

                                    let data = await generateData(site.items, this)

                                    // Substitua doc.table() por um loop para desenhar cada célula individualmente.
                                    for (let l = 0; l < data.length; l++) {
                                        const incident = data[l]

                                        // Adicione este trecho para verificar se é necessário adicionar uma nova página
                                        if (y + 5 >= doc.internal.pageSize.height - 20) {
                                            doc.addPage('a4', 'p')
                                            y = 20
                                        }

                                        y += 5
                                        doc.setFontSize(8)
                                        doc.setFont('helvetica', 'bold')
                                        doc.text(`${this.$t('str.incident.date')}`, 5, y)
                                        doc.text(`${this.$t('str.incident.photo')}`, 110, y)
                                        doc.text(`${this.$t('str.incident.signature')}`, 155, y)

                                        doc.setFont('helvetica', 'normal')
                                        doc.text(incident.date, 40, y)

                                        await drawImageInCell(doc, incident.photoURL, 90, y + 5, 45, 45)
                                        await drawImageInCell(doc, incident.signatureURL, 145, y + 5, 45, 45)

                                        y += 5

                                        doc.setFont('helvetica', 'bold')
                                        doc.text(`${this.$t('str.incident.vigilant')}`, 5, y)
                                        doc.setFont('helvetica', 'normal')
                                        doc.text(incident.vigilant, 40, y)

                                        y += 5

                                        doc.setFont('helvetica', 'bold')
                                        doc.text(`${this.$t('str.incident.attendance')}`, 5, y)
                                        doc.setFont('helvetica', 'normal')
                                        doc.text(incident.isAttendance, 40, y)
                                        y += 5

                                        doc.setFont('helvetica', 'bold')
                                        doc.text(`${this.$t('str.incident.status')}`, 5, y)
                                        doc.setFont('helvetica', 'normal')
                                        doc.text(incident.attendanceStatus, 40, y)
                                        y += 5

                                        doc.setFont('helvetica', 'bold')
                                        doc.text(`${this.$t('str.incident.operator')}`, 5, y)
                                        doc.setFont('helvetica', 'normal')
                                        doc.text(incident.operator, 40, y)
                                        y += 5

                                        doc.setFont('helvetica', 'bold')
                                        doc.text(`${this.$t('str.incident.opened.date')}`, 5, y)
                                        doc.setFont('helvetica', 'normal')
                                        doc.text(incident.openedDate, 40, y)
                                        y += 5

                                        doc.setFont('helvetica', 'bold')
                                        doc.text(`${this.$t('str.incident.closed.date')}`, 5, y)
                                        doc.setFont('helvetica', 'normal')
                                        doc.text(incident.closedDate, 40, y)
                                        y += 5

                                        doc.setFont('helvetica', 'bold')
                                        doc.text(`${this.$t('str.incident.notes')}`, 5, y)
                                        doc.setFont('helvetica', 'normal')

                                        // se o notes passar de 50 caracteres, quebra a linha e adiciona mais 10px
                                        if (incident.notes.length > 50) {
                                            doc.text(incident.notes.substring(0, 50), 40, y, {
                                                maxWidth: 50,
                                                align: 'left',
                                            })
                                            y += 10
                                            doc.text(incident.notes.substring(50, incident.notes.length), 40, y, {
                                                maxWidth: 50,
                                                align: 'left',
                                            })
                                        } else {
                                            doc.text(incident.notes, 40, y, {
                                                maxWidth: 50,
                                                align: 'left',
                                            })
                                        }

                                        y += 30
                                    }
                                }
                            }
                        }
                    }
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
