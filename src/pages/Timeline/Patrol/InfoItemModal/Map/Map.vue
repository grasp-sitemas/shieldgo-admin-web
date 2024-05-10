<template>
    <b-modal id="mapModal" :hide-header="true" :hide-footer="true" size="m" class="modal-message">
        <GmapMap
            :center="{
                lat: geolocation?.latitude ? Number(geolocation.latitude) : 0,
                lng: geolocation?.longitude ? Number(geolocation.longitude) : 0,
            }"
            :zoom="15"
            style="height: 220px"
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
                    lat: geolocation?.latitude ? Number(geolocation.latitude) : 0,
                    lng: geolocation?.longitude ? Number(geolocation.longitude) : 0,
                }"
            />
        </GmapMap>
    </b-modal>
</template>

<script>
export default {
    props: ['data'],
    watch: {
        data: function () {
            console.log(JSON.stringify(this.data?.row?.geolocation))
            this.geolocation = this.data?.row?.geolocation
        },
    },
    data() {
        return {
            geolocation: {},
        }
    },
}
</script>

<style></style>
