<template>
    <b-modal id="qrCodeModal" :hide-footer="true" class="modal-message">
        <template slot="modal-header">
            <h4 class="modal-title">{{ $t('str.modal.check.points.qrcode.title') }}</h4>
            <a class="btn-close cursor_pointer" @click="$bvModal.hide('qrCodeModal')"></a>
        </template>

        <div class="text-center">
            <div id="qrCodeContent" ref="qrCodeContent" key="qrCodeContent">
                <qrcode-vue :value="qrcodeId" :size="200" level="H" />
            </div>

            <button v-on:click="downloadQrCode" v-if="qrcodeId" type="submit" class="mt-10px ms-10px btn btn-success w-200px">
                <i v-if="isLoading === true" class="fas fa-spinner fa-pulse"></i>
                {{ $t('str.btn.download') }}
            </button>
        </div>
    </b-modal>
</template>

<script>
import QrcodeVue from 'qrcode.vue'
import jsPDF from 'jspdf'
import domtoimage from 'dom-to-image'
export default {
    props: {
        qrcodeId: {
            type: String,
            default: null,
        },
        data: {
            type: Object,
            default: null,
        },
    },
    components: {
        QrcodeVue,
    },
    data() {
        return {
            isLoading: false,
        }
    },
    methods: {
        downloadQrCode() {
            let name = this.data?.name ? this.data.name : 'patrol_point'
            name = name.replace(/\s/g, '_')
            let accountName = this.data?.account?.name ? this.data.account?.name : 'account'
            domtoimage
                .toPng(this.$refs.qrCodeContent)
                .then(function (dataUrl) {
                    var img = new Image()
                    img.src = dataUrl
                    const doc = new jsPDF('p', 'pt', 'A4')
                    doc.text(name, 230, 180)
                    doc.addImage(img, 'PNG', 100, 200, 400, 200)
                    const filename = accountName + '_' + name + '.pdf'
                    doc.save(filename)
                })
                .catch(function (error) {
                    console.log(error)
                })
        },
    },
}
</script>
