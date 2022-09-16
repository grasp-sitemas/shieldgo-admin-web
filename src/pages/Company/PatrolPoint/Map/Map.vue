<template>
    <l-map ref="map" :zoom="zoom" :center="geolocation" :options="mapOptions" style="height: 380px">
        <l-tile-layer :url="url" :attribution="attribution" />
        <l-circle :lat-lng="circle.center" :radius="circle.radius" :color="circle.color" :interactive="true" :bubblingMouseEvents="true" />
        <l-draw-toolbar position="topright" />
    </l-map>
</template>
<script>
import Controller from './CrtMap.vue'
import { LMap, LTileLayer, LCircle } from 'vue2-leaflet'
import LDrawToolbar from 'vue2-leaflet-draw-toolbar'
export default {
    props: ['location', 'radius'],
    watch: {
        location: function () {
            this.geolocation = this.location
            this.circle.center = this.location
        },
        radius: function () {
            this.circle.radius = this.radius
        },
    },
    components: {
        LMap,
        LTileLayer,
        LCircle,
        LDrawToolbar,
    },
    data() {
        return {
            zoom: 12,
            url: 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',
            attribution: '&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors',
            gettingLocation: true,
            geolocation: [0, 0],
            mapOptions: {
                zoomSnap: 0.5,
            },
            center: [47.31322, -1.319482],
            circle: {
                center: [0, 0],
                radius: 0,
                color: 'red',
            },
            circleOptions: {
                strokeColor: '#FF0000',
                strokeOpacity: 0.8,
                strokeWeight: 2,
                fillColor: '#FF0000',
                fillOpacity: 0.35,
            },
        }
    },
    methods: Controller.methods,
    mounted() {
        Controller.init(this)
    },
}
</script>