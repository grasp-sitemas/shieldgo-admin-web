<template>
    <div>
        <panel :title="$t('str.table.list.vigilants')" bodyClass="p-0">
            <div class="row ms-2 mb-1 mt-3">
                <div class="col-md-4">
                    <label class="form-label" for="statusField">{{ $t('str.register.status.field') }}</label>
                    <select v-model="filters.status" @change="filter" class="form-control" id="statusField">
                        <option value="ACTIVE">{{ $t('str.register.status.active') }}</option>
                        <option value="ARCHIVED">{{ $t('str.register.status.archived') }}</option>
                    </select>
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
                    <span v-if="props.column.field === 'address' && props.formattedRow[props.column.field].address">
                        {{
                            props.formattedRow[props.column.field].address +
                            ' ' +
                            props.formattedRow[props.column.field].number +
                            ', ' +
                            props.formattedRow[props.column.field].neighborhood +
                            ', ' +
                            props.formattedRow[props.column.field].city +
                            '- ' +
                            props.formattedRow[props.column.field].state
                        }}
                    </span>
                    <span v-else-if="props.column.field === 'customerUser.subtype'">
                        {{ $t(props.formattedRow[props.column.field]) }}
                    </span>
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
import Controller from './CrtListVigilant.vue'
import Vue from 'vue'
Vue.prototype.$registerEvent = new Vue()

export default {
    components: {},
    data() {
        return {
            items: [],
            filters: {
                account: '',
                client: '',
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