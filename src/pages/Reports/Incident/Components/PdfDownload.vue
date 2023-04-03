<template>
    <button type="submit" class="btn btn-primary is-loading" v-on:click="downloadPDF">
        <i v-if="isLoading" class="fas fa-spinner fa-pulse" />
        PDF
    </button>
</template>

<script>
import moment from 'moment'
import jsPDF from 'jspdf'
import Endpoints from '../../../../common/Endpoints.vue'
import axios from 'axios'
const domain = Endpoints.domain
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

            let renderImagePromises = []

            async function generateData(items, state) {
                const results = []

                items.forEach(item => {
                    const newItem = {
                        _id: String(item._id),
                        account: String(item.account),
                        client: String(item.client),
                        site: String(item.site),
                        vigilant: String(item.vigilant),
                        date: String(item.date),
                        event: item?.event ? String(item.event?.name) : ' ',
                        geolocation: item.geolocation ? String(item.geolocation.latitude) + ' - ' + String(item.geolocation.longitude) : ' ',
                        deviceInfo: item.deviceInfo ? String(item.deviceInfo?.brand) + ' - ' + String(item.deviceInfo?.model) : ' ',
                        isAttendance: item?.attendance?.isAttendance ? state.$t('str.yes') : state.$t('str.no'),
                        attendanceStatus: item?.attendance?.status ? state.$t(item.attendance.status) : ' ',
                        operator: item?.attendance?.operator ? String(item?.attendance?.operator) : ' ',
                        openedDate: item?.attendance?.openedDate ? moment(item?.attendance?.openedDate).utc(false).format('DD/MM/YYYY HH:mm:ss') : ' ',
                        closedDate: item?.attendance?.closedDate ? moment(item?.attendance?.closedDate).utc(false).format('DD/MM/YYYY HH:mm:ss') : ' ',
                        photoURL: item?.photoURL ? String(item.photoURL) : ' ',
                        signatureURL: item?.signatureURL ? String(item.signatureURL) : ' ',
                    }

                    results.push(newItem)
                })
                return results
            }

            function createHeaders(keys) {
                const result = []
                for (let i = 0; i < keys.length; i += 1) {
                    result.push({
                        dataKey: keys[i]._id,
                        header: keys[i].name,
                        width: 45,
                        align: 'left',
                        padding: 0,
                    })
                }
                return result
            }

            // function renderImageCell(doc, data) {
            //     return new Promise(async resolve => {
            //         const url = data.cell.raw
            //         const { x, y } = data.cell

            //         if (url && url !== 'https://') {
            //             try {
            //                 const imageResponse = await axios.get(`${domain}${url}`, { responseType: 'arraybuffer' })
            //                 console.log('imageResponseColun', imageResponse)
            //                 const imageData = new Uint8Array(imageResponse.data)
            //                 const imageMimeType = 'image/png'
            //                 const imageBase64 = btoa(String.fromCharCode.apply(null, imageData))

            //                 doc.addImage(`data:${imageMimeType};base64,${imageBase64}`, 'PNG', x, y, 40, 40)
            //             } catch (error) {
            //                 console.error('Error while adding image to PDF:', error)
            //             }
            //         }
            //         resolve()
            //     })
            // }

            try {
                doc.setFont('helvetica', 'bold')
                doc.text(this.title.toUpperCase(), 5, 10)

                doc.setTextColor('#161B22')
                doc.setFont('helvetica', 'normal')
                doc.setFontSize(8)

                doc.text(this.$t('str.generated.on') + ': ' + moment().utc(true).format('DD/MM/YYYY HH:mm:ss'), 5, 15)

                for (let i = 0; i < items.length; i++) {
                    let item = items[i]

                    if (item?.clients?.length > 0) {
                        if (i > 0) {
                            doc.addPage('a4', 'l')
                            y = 25
                        }

                        // add company image logo to pdf
                        const logoURL = item?.logoURL
                        const logoResponse = await axios.get(`${domain}${logoURL}`, { responseType: 'arraybuffer' })
                        console.log('logoResponse', logoResponse)
                        const logoData = new Uint8Array(logoResponse.data)
                        const logoMimeType = 'image/png'
                        const logoBase64 = btoa(String.fromCharCode.apply(null, logoData))
                        doc.addImage(`data:${logoMimeType};base64,${logoBase64}`, 'PNG', 250, 10, 20, 20)

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
                                y += 4

                                doc.setFontSize(6)

                                const data = await generateData(client.items, this)

                                doc.autoTable({
                                    startY: y,
                                    body: data,
                                    columns: headers,
                                    styles: { fontSize: 6, cellPadding: 1, overflow: 'linebreak' },
                                    columnStyles: { photoURL: { cellWidth: 45 }, signatureURL: { cellWidth: 45 } },
                                    didDrawCell: data => {
                                        if (data.column.dataKey === 'photoURL' || data.column.dataKey === 'signatureURL') {
                                            renderImagePromises.push(
                                                (async () => {
                                                    const url = data.cell.raw
                                                    const { x, y } = data.cell

                                                    if (url && url !== 'https://') {
                                                        try {
                                                            const imageResponse = await axios.get(`${domain}${url}`, { responseType: 'arraybuffer' })
                                                            console.log('imageResponseColun', imageResponse)
                                                            const imageData = new Uint8Array(imageResponse.data)
                                                            const imageMimeType = imageResponse.headers['content-type'] || 'image/jpeg'
                                                            const imageFormat = imageMimeType.split('/')[1].toUpperCase()
                                                            const imageBase64 = btoa(String.fromCharCode.apply(null, imageData))

                                                            console.log('imageBase64', imageBase64)
                                                            console.log('imageFormat', imageFormat)
                                                            console.log('imageMimeType', imageMimeType)

                                                            doc.addImage(`data:${imageMimeType};base64,${imageBase64}`, imageFormat, x, y, 40, 40)
                                                        } catch (error) {
                                                            console.error('Error while adding image to PDF:', error)
                                                        }
                                                    }
                                                })(),
                                            )
                                        }
                                    },
                                })
                                await Promise.all(renderImagePromises)
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
