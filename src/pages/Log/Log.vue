<template>
    <div>
        <panel :title="$t('str.table.list.logs')" bodyClass="p-0">
            <!-- <div class="row ms-2 mb-1 mt-3">
                <div class="col-md-4">
                    <label class="form-label" for="statusField">{{ $t('str.register.status.field') }}</label>
                    <select v-model="filters.status" @change="filter" class="form-control" id="statusField">
                        <option value="ACTIVE">{{ $t('str.register.status.active') }}</option>
                        <option value="ARCHIVED">{{ $t('str.register.status.archived') }}</option>
                    </select>
                </div>
            </div> -->
            <vue-good-table :columns="columns" :rows="items" :lineNumbers="true" :search-options="{ enabled: true, placeholder: $t('str.table.search.in.this.table') }" :pagination-options="paginationOptions">
                <div slot="emptystate" class="vgt-center-align vgt-text-disabled">{{ $t('str.table.subtitle.no.data') }}</div>
                <template slot="table-row" slot-scope="props">
                    <span v-if="props.column.field === 'domain' || props.column.field === 'operation'">
                        {{ $t(props.formattedRow[props.column.field]) }}
                    </span>
                    <span v-else-if="props.column.field === 'systemUser'"> {{ props.formattedRow[props.column.field]?.firstName }} {{ props.formattedRow[props.column.field]?.lastName }} </span>
                    <span v-else-if="props.column.field === 'account'">
                        {{ props.formattedRow[props.column.field]?.name }}
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
    </div>
</template>

<script>
import Controller from './CrtLog.vue'
import Vue from 'vue'
Vue.prototype.$registerEvent = new Vue()

import { ROLES } from '../../utils/roles.js'

export default {
    components: {},
    data() {
        return {
            roles: ROLES,
            isLoading: false,
            errors: [],
            accounts: [],
            clients: [],
            sites: [],
            valuekey: 0,
            isSuperAdminMaster: false,
            filters: {
                status: 'ACTIVE',
                account: '',
                client: '',
                site: '',
            },
            columns: [],
            items: [],
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
