<template>
    <b-modal body-class="deviceInfoModal" id="deviceInfoModal" :hide-header="true" :hide-footer="true" size="l" class="modal-message">
        <div class="row mb-2">
            <div class="col-md-4">
                <h6 class="text-decoration-none text-dark m-0">{{ $t('str.device.info.brand') }}</h6>
                <label class="text-opacity-50 small fw-bold">{{ deviceInfo?.brand }}</label>
            </div>
            <div class="col-md-4">
                <h6 class="text-decoration-none text-dark m-0">{{ $t('str.device.info.model') }}</h6>
                <label class="text-opacity-50 small fw-bold">{{ deviceInfo?.model }}</label>
            </div>
            <div class="col-md-4">
                <h6 class="text-decoration-none text-dark m-0">{{ $t('str.device.info.deviceId') }}</h6>
                <label class="text-opacity-50 small fw-bold">{{ deviceInfo?.deviceId }}</label>
            </div>
        </div>
        <div class="row">
            <div class="col-md-4">
                <h6 class="text-decoration-none text-dark m-0">{{ $t('str.device.info.version') }}</h6>
                <label class="text-opacity-50 small fw-bold">{{ deviceInfo?.version }}</label>
            </div>
            <div class="col-md-4">
                <h6 class="text-decoration-none text-dark m-0">{{ $t('str.device.info.isCharging') }}</h6>
                <label class="text-opacity-50 small fw-bold">
                    {{ deviceInfo?.isCharging ? $t('str.msg.yes') : $t('str.msg.no') }}
                </label>
            </div>
            <div class="col-md-4">
                <h6 class="text-decoration-none text-dark m-0">{{ $t('str.device.info.ipAddress') }}</h6>
                <label v-if="deviceInfo?.ipAddress" class="text-opacity-50 small fw-bold"> {{ deviceInfo?.ipAddress }} </label>
                <label v-else class="text-opacity-50 small fw-bold"> {{ $t('str.msg.noData') }} </label>
            </div>
        </div>
    </b-modal>
</template>

<script>
import Endpoints from '../../../../../common/Endpoints.vue'
export default {
    props: ['data'],
    watch: {
        data: function () {
            this.deviceInfo = this.data?.row?.deviceInfo
        },
    },
    data() {
        return {
            deviceInfo: null,
            domain: Endpoints.domain,
        }
    },
}
</script>
<style lang="scss" scoped>
.audio {
    width: -webkit-fill-available !important;
}
</style>
