<template>
    <div>
        <panel :title="$t('str.table.list.patrol.points')" bodyClass="p-0">
            <div class="row ms-2 mb-1 mt-3">
                <div class="col-md-4">
                    <label class="form-label" for="statusField">{{ $t('str.register.status.field') }}</label>
                    <select v-model="filters.status" @change="filter" class="form-control" id="statusField">
                        <option value="ACTIVE">{{ $t('str.register.status.active') }}</option>
                        <option value="ARCHIVED">{{ $t('str.register.status.archived') }}</option>
                    </select>
                </div>
                <div class="col-md-4 mt-4">
                    <button v-b-modal.checkPointModal type="submit" class="btn btn-default w-200px">{{ $t('str.btn.new.form') }}</button>
                </div>
            </div>
            <vue-good-table
                :columns="columns"
                :rows="items"
                :lineNumbers="true"
                @on-row-click="selectItem"
                :search-options="{ enabled: true, placeholder: $t('str.table.search.in.this.table') }"
                :pagination-options="paginationOptions"
            >
                <div slot="emptystate" class="vgt-center-align vgt-text-disabled">{{ $t('str.table.subtitle.no.data') }}</div>
                <template slot="table-row" slot-scope="props">
                    <span v-if="props.column.field === 'type'">
                        {{ $t(props.formattedRow[props.column.field]) }}
                    </span>
                    <span v-else-if="props.column.field === 'note'">
                        {{ props.formattedRow[props.column.field] }}
                    </span>
                    <span v-else-if="props.column.field === 'account'">
                        {{ props.formattedRow[props.column.field]?.name }}
                    </span>
                    <span v-else-if="props.column.field === 'geolocation' && props.formattedRow[props.column.field]?.latitude && props.formattedRow[props.column.field]?.longitude">
                        {{ 'Lat: ' + props.formattedRow[props.column.field]?.latitude + ' Lng: ' + props.formattedRow[props.column.field]?.longitude }}
                    </span>
                    <span v-else-if="props.column.field === 'client'">
                        {{ props.formattedRow[props.column.field]?.name }}
                    </span>
                    <span v-else-if="props.column.field === 'site'">
                        {{ props.formattedRow[props.column.field]?.name }}
                    </span>
                    <span v-else-if="props.column.field === 'status'">
                        <span class="badge" v-bind:class="props.formattedRow[props.column.field] === 'ACTIVE' ? 'bg-success' : 'bg-danger'"> {{ $t(props.formattedRow[props.column.field]) }} </span>
                    </span>
                    <span v-else>
                        {{ props.formattedRow[props.column.field] }}
                    </span>
                </template>
            </vue-good-table>
        </panel>
        <CheckPointModal :isSuperAdminMaster="isSuperAdminMaster" :accounts="accounts" />
    </div>
</template>

<script>
import Controller from './CrtListPatrolPoint.vue'
import CheckPointModal from './CheckPointModal/CheckPointModal.vue'
import Vue from 'vue'
Vue.prototype.$registerEvent = new Vue()

export default {
    components: {
        CheckPointModal,
    },
    props: ['accounts', 'clients'],
    data() {
        return {
            items: [],
            filters: {
                account: '',
                client: '',
                site: '',
                status: 'ACTIVE',
                name: '',
            },
            isSuperAdminMaster: false,
            columns: [],
            paginationOptions: {},
        }
    },
    mounted() {
        Controller.init(this)
    },
    created() {
        let state = this
        this.$registerEvent.$on('refreshList', function () {
            state.filter()
        })
        this.$registerEvent.$on('changeLanguage', function () {
            state.initTable()
        })
    },
    methods: Controller.methods,
}
</script>
 