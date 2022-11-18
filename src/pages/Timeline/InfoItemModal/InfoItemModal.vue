<template>
    <b-modal no-close-on-backdrop id="infoItemModal" :hide-footer="true" size="lg" class="modal-message">
        <template slot="modal-header">
            <h4 class="modal-title">{{ $t('str.modal.create.timeline.item.info.title') }} {{ data?.name }}</h4>
            <a class="btn-close cursor_pointer" @click="$bvModal.hide('infoItemModal')"></a>
        </template>

        <div class="row">
            <div class="col-md-3">
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
            <div class="col-md-3">
                <dt class="text-dark">{{ $t('str.timeline.item.patrol.points') }}</dt>
                <dd>
                    <ul>
                        <li v-for="patrolPoint in data.patrolPoints" :key="patrolPoint._id">
                            {{ patrolPoint.name }}
                        </li>
                    </ul>
                </dd>
            </div>
            <div class="col-md-2">
                <dt class="text-dark">{{ $t('str.timeline.item.status') }}</dt>
                <span class="badge" v-bind:class="data.status === 'ACTIVE' ? 'bg-success' : 'bg-danger'"> {{ $t(getStatusName(data.status)) }} </span>
            </div>
        </div>

        <div class="row">
            <dt class="text-dark">{{ $t('str.timeline.item.patrol.actions') }}</dt>

            <vue-good-table :columns="columns" :rows="patrolActions" :lineNumbers="false" :totalRows="patrolActions?.length" @on-row-click="selectItem">
                <div slot="emptystate" class="vgt-center-align vgt-text-disabled">
                    <i v-if="isLoading" class="fas fa-spinner fa-spin" />
                    <span v-if="!isLoading && patrolActions?.length === 0">{{ $t('str.table.subtitle.no.data') }}</span>
                </div>
                <template slot="table-row" slot-scope="props">
                    <span v-if="props.column.field === 'type'">
                        {{ $t(props.formattedRow[props.column.field]) }}
                    </span>
                    <span v-else-if="props.column.field === 'geolocation'">
                        <i v-on:click="showMap()" class="fas fa-map"></i>
                        <!-- {{ getDeviceInfo(props.formattedRow[props.column.field]) }} -->
                    </span>
                    <span v-else-if="props.column.field === 'notes'">
                        {{ props.formattedRow[props.column.field]?.length > 0 ? props.formattedRow[props.column.field] : '-' }}
                    </span>
                    <span v-else-if="props.column.field === 'deviceInfo'">
                        <i class="fas fa-mobile-alt"></i>
                        <!-- {{ getDeviceInfo(props.formattedRow[props.column.field]) }} -->
                    </span>
                    <span v-else>
                        {{ props.formattedRow[props.column.field] }}
                    </span>
                </template>
            </vue-good-table>
        </div>

        <Map :data="patrolActionItem" />

        <notifications group="bottom-right" position="bottom right" :speed="500" />
    </b-modal>
</template>

<script>
import Controller from './CrtInfoItemModal.vue'
import moment from 'moment'
import Services from '../../../common/Services.vue'
import Map from './Map/Map.vue'
export default {
    components: {
        Map,
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

            const startDate = moment(this.data.startDate)
            const endDate = moment(this.data.endDate)
            this.data.startDate = startDate.format('DD/MM/YYYY - HH:mm')
            this.data.endDate = endDate.format('DD/MM/YYYY - HH:mm')

            this.isLoading = true

            // const filters = {
            //     status: this.data?.status,
            //     vigilant: this.data?.vigilant?._id,
            //     event: this.data?._id,
            // }

            const filters = {
                status: 'ACTIVE',
                vigilant: '634ed3ce8f86d500100aef96',
                event: '6374e85864b161001044e30f',
            }
            this.patrolActions = await Services.getPatrolActionsByEvent(this, filters)
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
