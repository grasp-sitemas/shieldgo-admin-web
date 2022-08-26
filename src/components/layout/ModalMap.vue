<template>
    <div class="modal fade" id="modalMap" tabindex="-1" role="dialog" aria-labelledby="modalMap" aria-hidden="true">
        <div class="modal-dialog modal-lg" role="document">
            <div class="modal-content">
                <div class="modal-header">
                    <button type="button" class="close" data-dismiss="modal" aria-label="Close">
                    </button>
                </div>
                <div class="modal-body">
                    <div class="d-flex justify-content-center">
                        <GmapMap class="form-group col-md-12 mt-4" 
                            :center="{lng: Number(geolocation.longitude), lat: Number(geolocation.latitude)}"
                            :zoom="15"
                            :map-type-id="terrain"
                            style="width: 2140px; height: 450px"
                            :options="{
                                zoomControl: true,
                                mapTypeControl: false,
                                scaleControl: false,
                                streetViewControl: true,
                                rotateControl: false,
                                fullscreenControl: true,
                                disableDefaultUi: false
                                }">

                            <GmapMarker 
                                :key="index"
                                :position="{lng: Number(geolocation.longitude), lat: Number(geolocation.latitude)}"
                                :clickable="true"
                                :draggable="true"
                                :icon="markerHubs"
                            />  
                            
                        </GmapMap>
                    </div>
                    <div class="modal-footer">
                        <button type="button" class="btn btn-secondary" data-dismiss="modal" v-on:click="$emit('confirmation-return', 0)">{{$t('string.msg.term.btn.cancel')}}</button>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>
<script>    
import Endpoints from '../../components/common/Endpoints';
const MarkerPoints = require('../../../public/assets/images/points.png');
const MarkerHubs = require('../../../public/assets/images/hubs.png');
    export default {
        props: ["geolocation"],
        data() {
            return {
                errors: [],
                latitude: null,
                titleToast: null,
                messageToast: null,
                messageIdToast: null,
                domain: Endpoints.domain,
                markerHubs: {
                    url: MarkerHubs,
                    size: {width: 60, height: 90, f: 'px', b: 'px',},
                    scaledSize: {width: 30, height: 45, f: 'px', b: 'px',},
                },
                markerPoints: {
                    url: MarkerPoints,
                    size: {width: 60, height: 90, f: 'px', b: 'px',},
                    scaledSize: {width: 30, height: 45, f: 'px', b: 'px',},
                },
            }
        },
        created(){
            const el = document.body;
            el.removeAttribute("class");
            $('.modal').modal('hide');
        },
        mounted(){
        },
        methods: {
        },
    }
</script>

