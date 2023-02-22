<template>
    <button class="btn btn-primary" @click="downloadPDF">PDF</button>
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
            data: [],
            title: '',
            headers: [],
            meta: [],
            name: '',
        }
    },
    methods: {
        async downloadPDF() {
            let items = this.data

            const generateData = function (items) {
                let result = []

                if (items.length > 0) {
                    items.forEach((item, index) => {
                        const data = {
                            _id: String(index + 1),
                            patrolPoint: item.patrolPoint ? String(item.patrolPoint) : ' ',
                            event: String(item?.event),
                            vigilant: item.vigilant ? String(item.vigilant) : ' ',
                            startDate: String(item.startDate),
                            endDate: String(item.endDate),
                            client: String(item.client),
                            site: String(item.site),
                        }
                        result.push(data)
                    })
                }

                return result
            }

            async function createHeaders(keys) {
                const result = []
                for (let i = 0; i < keys.length; i += 1) {
                    if (keys[i] && keys[i]._id && keys[i].name) {
                        result.push({
                            id: keys[i]._id,
                            name: keys[i]._id,
                            prompt: keys[i].name,
                            width: 45,
                            align: 'left',
                            padding: 0,
                        })
                    }
                }
                return result
            }

            const headers = await createHeaders(this.headers)

            let doc = new jsPDF({ orientation: 'landscape' })

            doc.text(this.title, 5, 10)
            doc.setFontSize(8)
            doc.setTextColor('#161B22')
            doc.text(this.$t('str.generated.on') + ': ' + moment().utc(true).format('DD/MM/YYYY HH:mm:ss'), 5, 15)

            let y = 25 // initial y-coordinate for the first item
            items.forEach((item, index) => {
                if (index > 0) {
                    doc.addPage() // add a new page for each account except the first one
                    y = 25 // reset the y-coordinate to the top of the new page
                    doc.setPage(y)
                }
                doc.text(item.account, 5, y)
                y += 5
                doc.text(item.accountAddress, 5, y)
                y += 3
                doc.table(5, y + 8, generateData(item.items), headers, { autoSize: true, fontSize: 7, padding: 1 })
                y += item.items.length * 8
                y += 10 // increment y-coordinate for the next item
            })

            const pdfName = this.name + '.pdf'
            doc.save(pdfName)
        },
    },
}
</script>
