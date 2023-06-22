<template>
    <b-modal no-close-on-backdrop id="infoItemModal" :hide-footer="true" size="xl" class="modal-message">
        <template slot="modal-header">
            <h5 class="modal-title">
                {{ `${$t('str.modal.create.timeline.item.info.title')}: ${data?.name}` }}
            </h5>

            <span
                class="badge align-badge"
                v-bind:class="
                    data.status === 'ACTIVE'
                        ? 'bg-blue'
                        : data.status === 'IN_PROGRESS'
                        ? 'bg-success'
                        : data.status === 'FINISHED'
                        ? 'bg-info'
                        : data.status === 'EXPIRED'
                        ? 'bg-danger'
                        : data.status === 'CLOSED_BY_SYSTEM'
                        ? 'bg-warning'
                        : 'bg-dark'
                "
            >
                {{ $t(getStatusName(data.status)) }}
            </span>

            <a class="btn-close cursor_pointer" @click="$bvModal.hide('infoItemModal')"></a>

            <!-- <p class="timeline-closed-by-system-position" v-if="data?.closedBySystemDate">{{ $t('str.closed.by.system.date.label') + ': ' + formatDate(data.closedBySystemDate) }}</p> -->
        </template>

        <div class="row">
            <div class="col-md-4">
                <dt class="text-dark">{{ $t('str.timeline.item.vigilant') }}</dt>
                <dd>{{ data.vigilant?.firstName }} {{ data.vigilant?.lastName }}</dd>
            </div>
            <div class="col-md-2">
                <dt class="text-dark">{{ $t('str.timeline.item.starts.in') }}</dt>
                <dd>{{ data.startDate }}</dd>
            </div>
            <div class="col-md-2">
                <dt class="text-dark">{{ $t('str.timeline.item.ends.in') }}</dt>
                <dd>{{ data.endDate }}</dd>
            </div>

            <div class="col-md-2">
                <dt class="text-dark">{{ $t('str.timeline.item.patrol.points') }}</dt>
                {{ data?.patrolPoints?.length }} {{ $t('str.timeline.item.points.name') }} <br />
            </div>

            <div class="col-md-2">
                <a v-on:click="showPatrolPoints()" class="btn btn-xs btn-gray fs-10px ps-2 pe-2 mt-1">
                    <i class="fas fa-qrcode" />
                    {{ $t('str.timeline.item.patrol.points.view') }}
                </a>
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
        <PatrolPoints :patrolPoints="patrolPoints" />
        <notifications group="bottom-right" position="bottom right" :speed="500" />
    </b-modal>
</template>

<script>
import Controller from './CrtInfoItemModal.vue'
import moment from 'moment'
import Services from '../../../common/Services.vue'
import Map from './Map/Map.vue'
import Photo from './Photo/Photo.vue'
import Signature from './Signature/Signature.vue'
import Sound from './Sound/Sound.vue'
import DeviceInfo from './DeviceInfo/DeviceInfo.vue'
import PatrolPoints from './PatrolPoints/PatrolPoints.vue'
export default {
    components: {
        Map,
        Photo,
        Signature,
        Sound,
        DeviceInfo,
        PatrolPoints,
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
            this.data = this.selectedItem

            const startDate = moment(this.data.startDate).utc()
            const endDate = moment(this.data.endDate).utc()
            this.data.startDate = startDate.format('DD/MM/YYYY - HH:mm')
            this.data.endDate = endDate.format('DD/MM/YYYY - HH:mm')

            this.isLoading = true

            const filters = {
                status: 'ACTIVE',
                vigilant: this.data?.vigilant?._id,
                event: this.data?._id,
            }

            const resultPatrolAction = await Services.getPatrolActionsByEvent(this, filters)
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
