<template>
    <b-modal no-close-on-backdrop id="infoItemModal" :hide-footer="true" size="lg" class="modal-message">
        <template slot="modal-header">
            <h4 class="modal-title">{{ $t('str.modal.create.timeline.item.info.title') }} {{ data?.name }}</h4>
            <a class="btn-close cursor_pointer" @click="$bvModal.hide('infoItemModal')"></a>
        </template>

        <dl class="row">
            <dl class="col-md-6">
                <dt class="text-dark">{{ $t('str.timeline.item.vigilant') }}</dt>
                <dd>{{ data.vigilant?.firstName }} {{ data.vigilant?.lastName }}</dd>
                <dt class="text-dark">{{ $t('str.timeline.item.starts.in') }}</dt>
                <dd>{{ data.startDate }}</dd>
                <dt class="text-dark">{{ $t('str.timeline.item.ends.in') }}</dt>
                <dd>{{ data.endDate }}</dd>
                <dt class="text-dark">{{ $t('str.timeline.item.patrol.points') }}</dt>
                <dd>
                    <ul>
                        <li v-for="patrolPoint in data.patrolPoints" :key="patrolPoint._id">
                            {{ patrolPoint.name }}
                        </li>
                    </ul>
                </dd>
                <dt class="text-dark">{{ $t('str.timeline.item.patrol.actions') }}</dt>

                <!-- //table with patrol actions -->
                <table class="table table-sm mb-0">
                    <thead>
                        <tr>
                            <th scope="col">{{ $t('str.timeline.item.patrol.actions.date') }}</th>
                            <th scope="col">{{ $t('str.timeline.item.patrol.actions.type') }}</th>
                            <th scope="col">{{ $t('str.timeline.item.patrol.actions.notes') }}</th>
                            <!-- <th scope="col">{{ $t('str.timeline.item.patrol.actions.geolocation') }}</th> -->
                            <!-- <th scope="col">{{ $t('str.timeline.item.patrol.actions.deviceInfo') }}</th> -->
                            <th scope="col">{{ $t('str.timeline.item.patrol.actions.medias') }}</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr v-for="patrolAction in patrolActions" :key="patrolAction._id">
                            <td>{{ patrolAction.date }}</td>
                            <td>{{ patrolAction.type }}</td>
                            <td>{{ patrolAction.notes }}</td>
                            <td>{{ patrolAction.geolocation }}</td>
                            <td>{{ patrolAction.deviceInfo }}</td>
                            <td>
                                <ul>
                                    <li v-for="media in patrolAction.medias" :key="media._id">
                                        {{ media.name }}
                                    </li>
                                </ul>
                            </td>
                        </tr>
                    </tbody>
                </table>
            </dl>

            <dl class="col-md-6"></dl>
        </dl>

        <notifications group="bottom-right" position="bottom right" :speed="500" />
    </b-modal>
</template>

<script>
import Controller from './CrtInfoItemModal.vue'
import moment from 'moment'

export default {
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
        selectedItem: function () {
            this.data = this.selectedItem

            const startDate = moment(this.data.startDate)
            const endDate = moment(this.data.endDate)

            this.data.startDate = startDate.format('DD/MM/YYYY - HH:mm')
            this.data.endDate = endDate.format('DD/MM/YYYY - HH:mm')
        },
    },
    data() {
        return {
            isLoading: false,
            errors: [],
            patrolPoints: [],
            vigilants: [],
            table: null,
            data: {},
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
