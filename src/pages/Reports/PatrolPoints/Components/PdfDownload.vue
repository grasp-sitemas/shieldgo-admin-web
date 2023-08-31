<template>
    <div>
        <button type="submit" class="btn btn-primary is-loading" v-on:click="viewPDF">
            <i v-if="isLoading" class="fas fa-spinner fa-pulse" />
            PDF
        </button>
    </div>
</template>

<script>
import jsPDF from 'jspdf'
import QRCode from 'qrcode'
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
            var doc = new jsPDF({ orientation: 'p', unit: 'mm', format: 'a4' })

            function generateData(items) {
                const results = []
                for (let i = 0; i < items.length; i++) {
                    const newItem = {
                        _id: items[i]._id ? String(items[i]._id) : '',
                        patrolPointCode: items[i].patrolPointCode ? String(items[i].patrolPointCode) : '',
                        name: items[i].name ? String(items[i].name) : '',
                    }

                    results.push(newItem)
                }
                return results
            }

            try {
                let x = 10 // posição inicial do x
                let y = 20 // posição inicial do y

                let data = await generateData(items, this)

                for (let i = 0; i < data.length; i++) {
                    if (i !== 0 && i % 30 === 0) {
                        // Agora verifica se são 25 QRCodes para uma nova página
                        doc.addPage()
                        y = 20
                        x = 10
                    }

                    // se passar de 5 QRCodes, resetar x e incrementar y
                    if (i !== 0 && i % 5 === 0) {
                        x = 10
                        y += 40 // Adicione espaço suficiente para o QRCode maior e o texto
                    }

                    doc.setFontSize(11)
                    doc.text(data[i].patrolPointCode, x + 7, y) // Adicione o texto abaixo do QRCode

                    // Generate QR Code
                    const qrImageData = await QRCode.toDataURL(data[i]._id, { errorCorrectionLevel: 'H' })
                    const qrImage = qrImageData.replace('data:image/png;base64,', '')
                    doc.addImage(qrImage, 'PNG', x, y, 36, 36) // Aumentar o tamanho do QRCode

                    x += 37 // Incrementar x para a próxima coluna
                }

                this.isLoading = false

                return new Promise(resolve => {
                    const pdfArrayBuffer = doc.output('arraybuffer')
                    const pdfBlob = new Blob([pdfArrayBuffer], { type: 'application/pdf' })
                    resolve(pdfBlob)
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
