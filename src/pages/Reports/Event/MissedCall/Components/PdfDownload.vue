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

            let headers = createHeaders(this.headers)

            function generateData(items, state) {
                const results = []

                items.forEach(item => {
                    const newItem = {
                        _id: String(item._id),
                        date: String(item.date),
                        vigilant: String(item.vigilant),
                        type: item?.type ? state.$t(item.type) : ' ',
                        event: item?.event ? String(item.event?.name) : ' ',
                        account: String(item.account),
                        client: String(item.client),
                        site: String(item.site),
                        notes: item?.notes ? String(item.notes) : ' ',
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
                doc.text(this.report, 5, 10)

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

                                    const total = this.$t('str.total.missed.calls') + ': ' + site?.items?.length
                                    const textWidth = (doc.getStringUnitWidth(total) * doc.internal.getFontSize()) / doc.internal.scaleFactor
                                    const textOffset = doc.internal.pageSize.width - textWidth
                                    doc.text(total, textOffset - 15, y)
                                    y += 5

                                    doc.setFontSize(6)

                                    let data = await generateData(site.items, this)
                                    doc.table(5, y, data, headers, { autoSize: true, fontSize: 6, printHeaders: true, margin: { top: 0, left: 0, right: 0, bottom: 0 } })
                                    y += 10
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
