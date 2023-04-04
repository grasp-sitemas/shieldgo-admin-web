<template>
    <button type="submit" class="btn btn-primary is-loading" v-on:click="downloadPDF">
        <i v-if="isLoading" class="fas fa-spinner fa-pulse" />
        PDF
    </button>
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
            let pdfName = String(this.name) + '.pdf'

            let headers = createHeaders(this.headers)

            async function generateData(items, state) {
                const results = []

                for (const item of items) {
                    const photoBase64 = item?.photoURL && item?.photoURL !== 'https://' ? await getBase64Image(domain + String(item.photoURL)) : null
                    const signatureBase64 = item?.signatureURL && item.signatureURL !== 'https://' ? await getBase64Image(domain + String(item.signatureURL)) : null
                    // const incidents = item?.incidents?.length > 0 ? item?.incidents?.map(incident => state.$t(incident.name)).join(', ') : ' '
                    const newItem = {
                        _id: String(item._id),
                        // incidents: incidents,
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
                        photoURL: photoBase64,
                        signatureURL: signatureBase64,
                    }

                    results.push(newItem)
                }
                return results
            }

            function createHeaders(keys) {
                const result = []
                for (let i = 0; i < keys.length; i += 1) {
                    const baseWidth = 28
                    result.push({
                        id: keys[i]._id,
                        name: keys[i]._id,
                        prompt: keys[i].name,
                        width: baseWidth,
                        maxWidth: 32,
                        align: 'left',
                        padding: 0,
                    })
                }
                return result
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

            function drawImageInCell(doc, base64Image, x, y, width, height) {
                if (base64Image) {
                    doc.addImage(base64Image, 'PNG', x, y, width, height)
                }
            }

            try {
                doc.setFont('helvetica', 'bold')
                doc.text(this.title.toUpperCase(), 5, 10)

                doc.setTextColor('#161B22')
                doc.setFont('helvetica', 'normal')
                doc.setFontSize(7)

                doc.text(this.$t('str.generated.on') + ': ' + moment().utc(true).format('DD/MM/YYYY HH:mm:ss'), 5, 15)

                for (let i = 0; i < items.length; i++) {
                    let item = items[i]

                    if (item?.clients?.length > 0) {
                        if (i > 0) {
                            doc.addPage('a4', 'l')
                            y = 25
                        }

                        try {
                            const logoURL = item?.logoURL
                            const logoBase64 = await getBase64Image(`${domain}${logoURL}`)
                            if (logoBase64) {
                                doc.addImage(logoBase64, 'PNG', 250, 10, 20, 20)
                            }
                        } catch (e) {
                            console.log('error', e)
                        }

                        doc.setFontSize(12)
                        doc.setFont('helvetica', 'bold')
                        doc.text(String(item.account).toUpperCase(), 5, y)
                        y += 4

                        doc.setFontSize(8)
                        doc.setFont('helvetica', 'normal')
                        const address = item.address.address + ', ' + item.address.number + ', ' + item.address.neighborhood + ', ' + item.address.city + ' - ' + item.address.state
                        doc.text(address, 5, y)
                        y += 10

                        for (let j = 0; j < item.clients.length; j++) {
                            const client = item.clients[j]

                            if (client?.items?.length > 0) {
                                if (j > 0) {
                                    doc.addPage('a4', 'l')
                                    y = 25
                                }

                                doc.setFontSize(12)
                                doc.setFont('helvetica', 'bold')
                                doc.text(`${this.$t('str.client').toUpperCase()}: ${client.name}`, 5, y)
                                y += 4

                                doc.setFontSize(8)
                                doc.setFont('helvetica', 'normal')

                                const startDate = item?.startDate ? moment(item.startDate).utc(false).format('DD/MM/YYYY') : ' '
                                const endDate = item?.endDate ? moment(item.endDate).utc(false).format('DD/MM/YYYY') : ' '
                                doc.text(`${this.$t('str.period').toUpperCase()}: ${startDate} - ${endDate}`, 5, y)

                                const totalAlerts = this.$t('str.total.incidents') + ': ' + client?.items?.length
                                const textWidth = (doc.getStringUnitWidth(totalAlerts) * doc.internal.getFontSize()) / doc.internal.scaleFactor
                                const textOffset = doc.internal.pageSize.width - textWidth
                                doc.text(totalAlerts, textOffset - 15, y)
                                y += 15

                                doc.setFontSize(6)

                                let data = await generateData(client.items, this)

                                // Desenhar os cabeçalhos da tabela
                                doc.setFont('helvetica', 'bold')
                                doc.setFontSize(10)
                                for (let j = 0; j < headers.length; j++) {
                                    let header = headers[j]
                                    if (header.id === 'photoURL' || header.id === 'signatureURL') {
                                        doc.text(header.prompt, 5 + j * header.maxWidth, y)
                                    } else {
                                        doc.text(header.prompt, 5 + j * header.width, y)
                                    }
                                }
                                y += 10

                                doc.setFontSize(6)
                                doc.setFont('helvetica', 'normal')

                                // Substitua doc.table() por um loop para desenhar cada célula individualmente.
                                for (let i = 0; i < data.length; i++) {
                                    if (i === 0) y += 20
                                    let item = data[i]
                                    let currentY = y + i * 50 // Ajuste a altura de cada linha para acomodar o novo tamanho das imagens

                                    // Desenhe o conteúdo de cada célula (exceto photoURL e signatureURL)
                                    for (let j = 0; j < headers.length; j++) {
                                        const header = headers[j]
                                        let cellX = 5 + j * header.width

                                        if (header.id !== 'photoURL' && header.id !== 'signatureURL') {
                                            doc.text(String(item[header.id]), cellX, currentY)
                                        }
                                    }

                                    // Desenhe as imagens nas células correspondentes
                                    let photoCellX =
                                        12 +
                                        headers
                                            .slice(
                                                0,
                                                headers.findIndex(header => header.id === 'photoURL'),
                                            )
                                            .reduce((acc, header) => acc + header.width, 0)
                                    let signatureCellX =
                                        25 +
                                        headers
                                            .slice(
                                                0,
                                                headers.findIndex(header => header.id === 'signatureURL'),
                                            )
                                            .reduce((acc, header) => acc + header.width, 0)

                                    drawImageInCell(doc, item.photoURL, photoCellX, currentY - 20, 45, 45) // Ajuste o tamanho da imagem conforme necessário
                                    drawImageInCell(doc, item.signatureURL, signatureCellX, currentY - 20, 45, 45) // Ajuste o tamanho da imagem conforme necessário
                                }

                                y += 10
                            }
                        }
                    }
                }

                this.isLoading = false

                doc.save(pdfName)
            } catch (error) {
                this.isLoading = false
                console.log(error)
            }
        },
    },
}
</script>
