<template>
    <b-modal no-close-on-backdrop id="mapModal" :hide-footer="true" size="m" class="modal-message">
        <template slot="modal-header">
            <a class="btn-close cursor_pointer" @click="$bvModal.hide('mapModal')"></a>
        </template>

        <GmapMap
            :center="{
                lat: data?.geolocation?.latitude ? Number(data.geolocation.latitude) : 0,
                lng: data?.geolocation?.longitude ? Number(data.geolocation.longitude) : 0,
            }"
            :zoom="15"
            style="width: 200px; height: 200px"
            :options="{
                zoomControl: true,
                mapTypeControl: false,
                scaleControl: false,
                streetViewControl: false,
                rotateControl: false,
                fullscreenControl: false,
                disableDefaultUi: false,
            }"
        >
            <GmapMarker
                :position="{
                    lat: data?.geolocation?.latitude ? Number(data.geolocation.latitude) : 0,
                    lng: data?.geolocation?.longitude ? Number(data.geolocation.longitude) : 0,
                }"
            />
        </GmapMap>
    </b-modal>
</template>

<script>
export default {
    props: {
        data: {
            type: Object,
            default: () => {},
        },
    },
}
</script>

<style></style>
