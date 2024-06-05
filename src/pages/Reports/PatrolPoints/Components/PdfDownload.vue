<template>
    <div>
        <button type="submit" class="btn btn-primary" v-on:click="viewPDF">
            <i v-if="isLoading" class="fas fa-spinner fa-pulse" />
            PDF
        </button>
    </div>
</template>

<script>
import jsPDF from 'jspdf'
import QRCode from 'qrcode'
import moment from 'moment'

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

            let items = this.data
            var doc = new jsPDF({ orientation: 'p', unit: 'mm', format: 'a4' })

            async function generateData(items) {
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

            async function addHeader(doc, y) {
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

                return y
            }

            let x = 10 // posição inicial do x
            let y = 10 // posição inicial do y

            // Adicionar cabeçalho na primeira página
            y = await addHeader.call(this, doc, y)

            try {
                let data = await generateData(items, this)

                for (let i = 0; i < data.length; i++) {
                    if (i !== 0 && i % 30 === 0) {
                        doc.addPage()
                        y = 10 // Iniciar y a 10 para páginas subsequentes
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
