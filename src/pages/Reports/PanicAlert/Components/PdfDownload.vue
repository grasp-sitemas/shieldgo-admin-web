<template>
    <button type="submit" class="btn btn-primary is-loading" v-on:click="downloadPDF">
        <i v-if="isLoading" class="fas fa-spinner fa-pulse" />
        PDF
    </button>
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

            function generateData(items, state) {
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
                    }

                    results.push(newItem)
                })
                return results
            }

            function createHeaders(keys) {
                const result = []
                for (let i = 0; i < keys.length; i += 1) {
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
                doc.setFont('helvetica', 'bold')
                doc.text(this.title.toUpperCase(), 5, 10)

                doc.setTextColor('#161B22')
                doc.setFont('helvetica', 'normal')
                doc.setFontSize(8)

                doc.text(this.$t('str.generated.on') + ': ' + moment().utc(true).format('DD/MM/YYYY HH:mm:ss'), 5, 15)

                for (let i = 0; i < items.length; i++) {
                    let item = items[i]

                    if (i > 0) {
                        doc.addPage('a4', 'l')
                        y = 25
                    }

                    doc.setFontSize(12)
                    doc.setFont('helvetica', 'bold')
                    doc.text(String(item.account).toUpperCase(), 5, y)
                    y += 4

                    doc.setFontSize(8)
                    doc.setFont('helvetica', 'normal')

                    const totalAlerts = this.$t('str.total.alerts') + ': ' + item?.items?.length
                    const textWidth = (doc.getStringUnitWidth(totalAlerts) * doc.internal.getFontSize()) / doc.internal.scaleFactor
                    const textOffset = doc.internal.pageSize.width - textWidth
                    doc.text(totalAlerts, textOffset - 15, y)

                    const address = item.address.address + ', ' + item.address.number + ', ' + item.address.neighborhood + ', ' + item.address.city + ' - ' + item.address.state
                    doc.text(address, 5, y)

                    y += 10

                    doc.setFontSize(6)

                    let data = await generateData(item.items, this)
                    doc.table(5, y, data, headers, { autoSize: true, fontSize: 6, printHeaders: true, margin: { top: 0, left: 0, right: 0, bottom: 0 } })

                    y += 10
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