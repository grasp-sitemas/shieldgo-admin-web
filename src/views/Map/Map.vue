<template>
    <div id="wrapper" :key="valuekey">
        <div class="content-page">
            <div class="content">
                <div class="container-fluid">
                    <div class="row">
                        <div class="col-12">
                            <div class="page-title-box">
                                <h4 class="page-title">{{ $t('str.msg.map.label') }}</h4>
                            </div>
                        </div>
                    </div>
                    <!-- Form row -->
                    <div class="row">
                        <div class="col-md-12">
                            <div class="card-box">
                                <form>
                                    <div class="form-row">
                                        <div class="col-md-12">
                                            <GmapMap
                                                class="form-group col-md-12 mt-4"
                                                :center="{
                                                    lat: location && location.coords && location.coords.latitude ? location.coords.latitude : -23.54305,
                                                    lng: location && location.coords && location.coords.longitude ? location.coords.longitude : -46.641048,
                                                }"
                                                :zoom="15"
                                                :map-type-id="terrain"
                                                style="width: 2140px; height: 650px"
                                                :options="{
                                                    zoomControl: true,
                                                    mapTypeControl: false,
                                                    scaleControl: false,
                                                    streetViewControl: true,
                                                    rotateControl: false,
                                                    fullscreenControl: true,
                                                    disableDefaultUi: false,
                                                }"
                                            >
                                                <GmapMarker
                                                    :position="{
                                                        lat: location && location.coords && location.coords.latitude ? location.coords.latitude : -23.54305,
                                                        lng: location && location.coords && location.coords.longitude ? location.coords.longitude : -46.641048,
                                                    }"
                                                    :clickable="true"
                                                    :draggable="true"
                                                    @click="center = m.position"
                                                />

                                                <GmapMarker
                                                    v-bind:key="index"
                                                    v-for="(item, index) in collectPoints"
                                                    :position="{
                                                        lat: item.address && item.address.location && item.address.location.coordinates[1] ? item.address.location.coordinates[1] : -23.54305,
                                                        lng: item.address && item.address.location && item.address.location.coordinates[0] ? item.address.location.coordinates[0] : -46.641048,
                                                    }"
                                                    :clickable="true"
                                                    :draggable="true"
                                                    @click="openWindowPoints(index)"
                                                    :icon="markerPoints"
                                                />

                                                <GmapMarker
                                                    v-bind:key="index"
                                                    v-for="(item, index) in collectHubs"
                                                    :position="{
                                                        lat: item.address && item.address.location && item.address.location.coordinates[1] ? item.address.location.coordinates[1] : -23.54305,
                                                        lng: item.address && item.address.location && item.address.location.coordinates[0] ? item.address.location.coordinates[0] : -46.641048,
                                                    }"
                                                    :clickable="true"
                                                    :draggable="true"
                                                    :icon="markerHubs"
                                                    @click="openWindowHubs(index)"
                                                />

                                                <gmap-info-window
                                                    @closeclick="windowPoint_open = false"
                                                    :opened="windowPoint_open"
                                                    :position="{
                                                        lat:
                                                            collectPoints[indexPoints] &&
                                                            collectPoints[indexPoints].address &&
                                                            collectPoints[indexPoints].address.location &&
                                                            collectPoints[indexPoints].address.location.coordinates[1]
                                                                ? collectPoints[indexPoints].address.location.coordinates[1]
                                                                : -23.54305,
                                                        lng:
                                                            collectPoints[indexPoints] &&
                                                            collectPoints[indexPoints].address &&
                                                            collectPoints[indexPoints].address.location &&
                                                            collectPoints[indexPoints].address.location.coordinates[0]
                                                                ? collectPoints[indexPoints].address.location.coordinates[0]
                                                                : -46.641048,
                                                    }"
                                                    :options="{
                                                        pixelOffset: {
                                                            width: 0,
                                                            height: -90,
                                                        },
                                                    }"
                                                >
                                                    <div v-if="collectPoints[indexPoints]" id="content">
                                                        <h3>{{ $t('string.msg.point.collect') }}</h3>
                                                        <h4 class="mt-3" v-if="collectPoints[indexPoints].name">
                                                            {{ camelize(collectPoints[indexPoints].name) + ' - ' + camelize($t(collectPoints[indexPoints].type)) }}
                                                        </h4>
                                                        <h4 style="color: gray" v-if="collectPoints[indexPoints].address">
                                                            {{
                                                                collectPoints[indexPoints].address.address +
                                                                ' ' +
                                                                collectPoints[indexPoints].address.number +
                                                                ', ' +
                                                                collectPoints[indexPoints].address.neighborhood +
                                                                ', ' +
                                                                collectPoints[indexPoints].address.city +
                                                                ' - ' +
                                                                collectPoints[indexPoints].address.state
                                                            }}
                                                        </h4>
                                                    </div>
                                                </gmap-info-window>

                                                <gmap-info-window
                                                    @closeclick="windowHub_open = false"
                                                    :opened="windowHub_open"
                                                    :position="{
                                                        lat:
                                                            collectHubs[indexHubs] &&
                                                            collectHubs[indexHubs].address &&
                                                            collectHubs[indexHubs].address.location &&
                                                            collectHubs[indexHubs].address.location.coordinates[1]
                                                                ? collectHubs[indexHubs].address.location.coordinates[1]
                                                                : -23.54305,
                                                        lng:
                                                            collectHubs[indexHubs] &&
                                                            collectHubs[indexHubs].address &&
                                                            collectHubs[indexHubs].address.location &&
                                                            collectHubs[indexHubs].address.location.coordinates[0]
                                                                ? collectHubs[indexHubs].address.location.coordinates[0]
                                                                : -46.641048,
                                                    }"
                                                    :title="Titulo"
                                                    :options="{
                                                        pixelOffset: {
                                                            width: 0,
                                                            height: -90,
                                                        },
                                                    }"
                                                >
                                                    <div v-if="collectHubs[indexHubs]" id="content">
                                                        <h3>{{ $t('string.msg.point.hub') }}</h3>
                                                        <h4 class="mt-3" v-if="collectHubs[indexHubs].name">
                                                            {{ camelize(collectHubs[indexHubs].name) }}
                                                        </h4>
                                                        <h4 style="color: gray" v-if="collectHubs[indexHubs].address">
                                                            {{
                                                                collectHubs[indexHubs].address.address +
                                                                ' ' +
                                                                collectHubs[indexHubs].address.number +
                                                                ', ' +
                                                                collectHubs[indexHubs].address.neighborhood +
                                                                ', ' +
                                                                collectHubs[indexHubs].address.city +
                                                                ' - ' +
                                                                collectHubs[indexHubs].address.state
                                                            }}
                                                        </h4>
                                                        <h4 class="mt-2">
                                                            {{ $t('str.hubs.founded') }}
                                                        </h4>
                                                        <div v-bind:key="hub._id" v-for="hub in collectHubs[indexHubs].hubs">
                                                            <span style="font-size: 15px">
                                                                {{ hub.name + ' - ' + camelize($t(hub.type)) }}
                                                            </span>
                                                        </div>
                                                    </div>
                                                </gmap-info-window>
                                            </GmapMap>
                                        </div>
                                    </div>

                                    <div v-if="errors.length" class="alert alert-danger">
                                        <p class="lead">{{ $t('response.msg.error.empty.fields') }}</p>
                                        <ul>
                                            <li v-bind:key="error" v-for="error in errors">{{ error }}</li>
                                        </ul>
                                    </div>
                                    <br />
                                </form>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>

        <Spinner />
        <Toast :title="titleToast" :message="messageToast" :messageId="messageIdToast" />
        <Confirmation :title="titleToast" :message="messageToast" :cancelText="cancelText" :yesText="yesText" v-on:confirmation-return="archive" />
    </div>
</template>

<script>
import Controller from './CrtMap'
import Spinner from '../../components/layout/Spinner'
import Toast from '../../components/layout/Toast'
import Confirmation from '../../components/layout/Confirmation'
const MarkerPoints = require('../../../public/assets/images/points.png')
const MarkerHubs = require('../../../public/assets/images/hubs.png')
export default {
    name: 'Map',
    components: {
        Spinner,
        Toast,
        Confirmation,
    },
    data() {
        return {
            errors: [],
            indexPoints: null,
            indexHubs: null,
            info_marker: null,
            infowindow: { lat: 10, lng: 10.0 },
            windowPoint_open: false,
            windowHub_open: false,
            collectPoints: [],
            collectHubs: [],
            searchFilter: null,
            valuekey: 0,
            location: null,
            gettingLocation: false,
            errorStr: null,
            titleToast: null,
            latitude: null,
            longitude: null,
            messageToast: null,
            messageIdToast: null,
            markerPoints: {
                url: MarkerPoints,
                size: { width: 60, height: 60, f: 'px', b: 'px' },
                scaledSize: { width: 40, height: 40, f: 'px', b: 'px' },
            },
            markerHubs: {
                url: MarkerHubs,
                size: { width: 60, height: 60, f: 'px', b: 'px' },
                scaledSize: { width: 30, height: 45, f: 'px', b: 'px' },
            },
        }
    },
    methods: Controller.methods,
    created() {},
    mounted() {
        Controller.init(this)
        this.locateMe()
    },
}
</script>

<style>
</style>
