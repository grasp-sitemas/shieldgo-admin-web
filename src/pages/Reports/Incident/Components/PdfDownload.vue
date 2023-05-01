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

            var doc = new jsPDF({ orientation: 'p', unit: 'mm', format: 'a4' })

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
                doc.setFont('helvetica', 'bold')
                doc.text(this.$t('str.incident.report').toUpperCase(), 5, 10)

                doc.setTextColor('#161B22')
                doc.setFont('helvetica', 'normal')
                doc.setFontSize(8)

                doc.text(this.$t('str.generated.on').toUpperCase() + ': ' + moment().utc(true).format('DD/MM/YYYY HH:mm:ss'), 5, 15)

                for (let i = 0; i < items.length; i++) {
                    let item = items[i]

                    if (item?.clients?.length > 0) {
                        if (i > 0) {
                            doc.addPage('a4', 'p')
                            y = 20
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

                        doc.setFontSize(8)
                        doc.setFont('helvetica', 'normal')

                        const startDate = item?.startDate ? moment(item.startDate).utc(false).format('DD/MM/YYYY') : ' '
                        const endDate = item?.endDate ? moment(item.endDate).utc(false).format('DD/MM/YYYY') : ' '
                        doc.text(`${this.$t('str.period').toUpperCase()}: ${startDate} - ${endDate}`, 5, y)

                        y += 10

                        for (let j = 0; j < item.clients.length; j++) {
                            const client = item.clients[j]

                            if (j > 0) {
                                doc.addPage('a4', 'p')
                                y = 25
                            }

                            doc.setFontSize(12)
                            doc.setFont('helvetica', 'bold')
                            doc.text(`${this.$t('str.client').toUpperCase()}: ${client.name}`, 5, y)
                            y += 10

                            if (client?.sites?.length > 0) {
                                for (let k = 0; k < client.sites.length; k++) {
                                    const site = client.sites[k]

                                    doc.setFontSize(12)
                                    doc.setFont('helvetica', 'bold')
                                    doc.text(`${this.$t('str.site').toUpperCase()}: ${site.name}`, 5, y)
                                    y += 4

                                    doc.setFontSize(8)
                                    doc.setFont('helvetica', 'normal')
                                    const address = site.address.address + ', ' + site.address.number + ', ' + site.address.neighborhood + ', ' + site.address.city + ' - ' + site.address.state
                                    doc.text(address, 5, y)
                                    y += 10

                                    const totalAlerts = this.$t('str.total.incidents') + ': ' + site?.items?.length
                                    const textWidth = (doc.getStringUnitWidth(totalAlerts) * doc.internal.getFontSize()) / doc.internal.scaleFactor
                                    const textOffset = doc.internal.pageSize.width - textWidth
                                    doc.text(totalAlerts, textOffset - 15, y)
                                    y += 5

                                    doc.setFontSize(6)

                                    let data = await generateData(site.items, this)

                                    // Substitua doc.table() por um loop para desenhar cada célula individualmente.
                                    for (let i = 0; i < data.length; i++) {
                                        const item = data[i]

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
                                        doc.text(item.date, 40, y)

                                        await drawImageInCell(doc, item.photoURL, 90, y + 5, 45, 45)
                                        await drawImageInCell(doc, item.signatureURL, 145, y + 5, 45, 45)

                                        y += 5

                                        doc.setFont('helvetica', 'bold')
                                        doc.text(`${this.$t('str.incident.vigilant')}`, 5, y)
                                        doc.setFont('helvetica', 'normal')
                                        doc.text(item.vigilant, 40, y)

                                        y += 5

                                        doc.setFont('helvetica', 'bold')
                                        doc.text(`${this.$t('str.incident.attendance')}`, 5, y)
                                        doc.setFont('helvetica', 'normal')
                                        doc.text(item.isAttendance, 40, y)
                                        y += 5

                                        doc.setFont('helvetica', 'bold')
                                        doc.text(`${this.$t('str.incident.status')}`, 5, y)
                                        doc.setFont('helvetica', 'normal')
                                        doc.text(item.attendanceStatus, 40, y)
                                        y += 5

                                        doc.setFont('helvetica', 'bold')
                                        doc.text(`${this.$t('str.incident.operator')}`, 5, y)
                                        doc.setFont('helvetica', 'normal')
                                        doc.text(item.operator, 40, y)
                                        y += 5

                                        doc.setFont('helvetica', 'bold')
                                        doc.text(`${this.$t('str.incident.opened.date')}`, 5, y)
                                        doc.setFont('helvetica', 'normal')
                                        doc.text(item.openedDate, 40, y)
                                        y += 5

                                        doc.setFont('helvetica', 'bold')
                                        doc.text(`${this.$t('str.incident.closed.date')}`, 5, y)
                                        doc.setFont('helvetica', 'normal')
                                        doc.text(item.closedDate, 40, y)
                                        y += 5

                                        doc.setFont('helvetica', 'bold')
                                        doc.text(`${this.$t('str.incident.notes')}`, 5, y)
                                        doc.setFont('helvetica', 'normal')

                                        // se o notes passar de 50 caracteres, quebra a linha
                                        doc.text(item.notes, 40, y, {
                                            maxWidth: 90,
                                            align: 'justify',
                                        })

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
    },
}
</script>
<style scoped>
.modal {
    display: none;
    position: fixed;
    z-index: 1;
    left: 8%;
    top: 5;
    width: 100%;
    height: 100%;
    overflow: auto;
    background-color: rgba(0, 0, 0, 0.4);
}

.modal-content {
    margin: 8% auto;
    padding: 0px;
    border: 1px solid #888;
    width: 80%;
    display: flex;
    flex-direction: column;
    align-items: center;
}

x.iframe-container {
    position: relative;
    width: 100%;
    height: 100%;
}

.close {
    position: absolute;
    top: 10px;
    right: 15px;
    background-color: transparent;
    border: none;
    color: #aaa;
    font-size: 28px;
    font-weight: bold;
    cursor: pointer;
}

.close:focus {
    color: black;
    text-decoration: none;
    cursor: pointer;
}
</style>
