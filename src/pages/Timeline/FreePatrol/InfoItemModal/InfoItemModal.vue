<template>
    <b-modal no-close-on-backdrop id="infoItemModal" :hide-footer="true" size="xl" class="modal-message">
        <template slot="modal-header">
            <h5 class="modal-title">
                {{ $t('str.modal.timeline.free.patrols.title') }}
            </h5>

            <span
                class="badge align-badge"
                v-bind:class="
                    data.status === 'ACTIVE' ? 'bg-blue' : data.status === 'IN_PROGRESS' ? 'bg-success' : data.status === 'FINISHED' ? 'bg-info' : data.status === 'CANCELLED' ? 'bg-indigo' : 'bg-dark'
                "
            >
                {{ $t(getStatusName(data.status)) }}
            </span>

            <a class="btn-close cursor_pointer" @click="$bvModal.hide('infoItemModal')"></a>
        </template>

        <div class="row">
            <div class="col-md-4">
                <dt class="text-dark">{{ $t('str.timeline.item.vigilant') }}</dt>
                <dd>{{ data.vigilant?.fullName }}</dd>
            </div>
            <div class="col-md-4">
                <dt class="text-dark">{{ $t('str.timeline.item.starts.in') }}</dt>
                <dd>{{ data.startDate }}</dd>
            </div>
            <div class="col-md-4">
                <dt class="text-dark">{{ $t('str.timeline.item.ends.in') }}</dt>
                <dd>{{ data.endDate ? data.endDate : ' -' }}</dd>
            </div>
        </div>

        <div class="row">
            <div class="col-md-12">
                <dt class="text-dark">{{ $t('str.timeline.item.patrol.actions') }}</dt>
                <vue-good-table ref="table" :columns="columns" :rows="patrolActions" :totalRows="patrolActions?.length" @on-row-click="selectItem">
                    <div slot="emptystate" class="vgt-center-align vgt-text-disabled">
                        <i v-if="isLoading" class="fas fa-spinner fa-spin" />
                        <span v-if="!isLoading && patrolActions?.length === 0">{{ $t('str.table.subtitle.no.data') }}</span>
                    </div>

                    <template slot="table-row" slot-scope="props">
                        <span v-if="props.column.field === 'type'">
                            {{ $t(props.formattedRow[props.column.field]) }}
                        </span>
                        <span v-else-if="props.column.field === 'geolocation'">
                            <i v-on:click="showMap()" class="fas fa-map-marker-alt cursor_pointer" />
                        </span>
                        <span v-else-if="props.column.field === 'date'">
                            {{ formatDate(props.formattedRow[props.column.field]) }}
                        </span>
                        <span v-else-if="props.column.field === 'deviceInfo'">
                            <i v-on:click="showDeviceInfo()" class="fas fa-mobile-alt cursor_pointer" />
                        </span>
                        <span v-else-if="props.column.field === 'notes'">
                            <span v-if="props.row.type === 'SCAN'">{{ props.row.patrolPoint.name }}</span>
                            <span v-else>{{ props.formattedRow[props.column.field] }}</span>
                        </span>
                        <span class="align-medias" v-else-if="props.column.field === 'medias'">
                            <i v-on:click="showPhoto()" v-show="props.formattedRow[props.column.field].photo" class="fas fa-image" />
                            <i v-on:click="showSound()" v-show="props.formattedRow[props.column.field].sound" class="fas fa-volume-up" />
                            <i v-on:click="showSignature()" v-show="props.formattedRow[props.column.field].signature" class="fas fa-pen" />
                            <i
                                v-show="!props.formattedRow[props.column.field].signature && !props.formattedRow[props.column.field].sound && !props.formattedRow[props.column.field].photo"
                                class="fas fa-minus"
                            />
                        </span>
                        <span v-else>
                            {{ props.formattedRow[props.column.field] }}
                        </span>
                    </template>
                </vue-good-table>
            </div>
        </div>
        <Map :data="patrolActionItem" />
        <Photo :data="patrolActionItem" />
        <Signature :data="patrolActionItem" />
        <Sound :data="patrolActionItem" />
        <DeviceInfo :data="patrolActionItem" />
        <notifications group="bottom-right" position="bottom right" :speed="500" />
    </b-modal>
</template>

<script>
import Controller from './CrtInfoItemModal.vue'
import Services from '../../../../common/Services.vue'
import Map from './Map/Map.vue'
import Photo from './Photo/Photo.vue'
import Signature from './Signature/Signature.vue'
import Sound from './Sound/Sound.vue'
import DeviceInfo from './DeviceInfo/DeviceInfo.vue'
export default {
    components: {
        Map,
        Photo,
        Signature,
        Sound,
        DeviceInfo,
    },
    props: {
        selectedItem: {
            type: Object,
            default: () => {},
        },
        isSuperAdminMaster: {
            type: Boolean,
            default: false,
        },
    },
    watch: {
        selectedItem: async function () {
            if (this.isLoading) return

            this.isLoading = true

            this.data = this.selectedItem

            this.data.startDate = this.formatDate(this.data.startDate)
            this.data.endDate = this.formatDate(this.data.endDate)

            const filters = {
                vigilant: this.data?.vigilant?._id,
                patrol: this.data?._id,
            }

            const resultPatrolAction = await Services.getPatrolActionsByPatrol(this, filters)
            const patrolActions = resultPatrolAction?.filter(patrolAction => patrolAction?.type !== 'FAILURE_PATROL') // remove actions failure_patrol

            const formattedPatrolActions = patrolActions?.map(patrolAction => {
                patrolAction.medias = {
                    photo: patrolAction?.photoURL ? patrolAction?.photoURL : null,
                    signature: patrolAction?.signatureURL ? patrolAction?.signatureURL : null,
                    sound: patrolAction?.soundURL ? patrolAction?.soundURL : null,
                }

                return patrolAction
            })

            this.patrolActions = formattedPatrolActions

            //get scanned patrol points
            const patrolPoints = this.data.patrolPoints
            const scannedPatrolPoints = this.patrolActions.filter(patrolAction => patrolAction?.type === 'SCAN')
            const formattedPatrolPoints = patrolPoints?.map(patrolPoint => {
                const scannedPatrolPoint = scannedPatrolPoints.find(scannedPatrolPoint => scannedPatrolPoint?.patrolPoint?._id === patrolPoint?._id)
                patrolPoint._id = patrolPoint?._id
                patrolPoint.name = patrolPoint?.name
                patrolPoint.scanned = scannedPatrolPoint ? true : false
                return patrolPoint
            })
            this.patrolPoints = formattedPatrolPoints

            this.isLoading = false
        },
    },
    data() {
        return {
            isLoading: false,
            errors: [],
            vigilants: [],
            table: null,
            data: {},
            patrolActionItem: {},
            columns: [],
            patrolActions: [],
            paginationOptions: {},
            patrolPoints: [],
        }
    },
    methods: Controller.methods,
    mounted() {
        Controller.init(this)
    },
    created() {
        let state = this
        state.$registerEvent.$on('changeLanguage', function () {
            state.initTable()
        })
    },
}
</script>
<style lang="scss" scoped>
.same-line {
    display: inline-block;
}

.align-badge {
    position: absolute;
    top: 25px;
    right: 50px;
}

.align-medias {
    display: flex;
    justify-content: space-around;
}

.vgt-responsive {
    height: 420px !important;
}
</style>
