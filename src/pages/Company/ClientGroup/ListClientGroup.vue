<template>
    <div>
        <panel :title="$t('str.table.list.client.groups')" bodyClass="p-0">
            <div class="row ms-2 mb-1 mt-3 me-1">
                <div v-if="isSuperAdminMaster" class="col-md-4 mb-3">
                    <label class="form-label" for="accountField">{{ $t('str.register.client.groups.account.field') }}</label>
                    <select v-model="filters.account" @change="changeAccount" class="form-select" id="accountField">
                        <option value="">{{ $t('str.register.select.placeholder') }}</option>
                        <option v-for="account in listAccounts" :value="account._id" :key="account._id">
                            {{ account.name }}
                        </option>
                    </select>
                    <div class="invalid-feedback">{{ $t('str.register.client.groups.account.required') }}</div>
                </div>
                <div class="col-md-4">
                    <label class="form-label" for="statusField">{{ $t('str.register.status.field') }}</label>
                    <select v-model="filters.status" @change="filter" class="form-select" id="statusField">
                        <option value="ACTIVE">{{ $t('str.register.status.active') }}</option>
                        <option value="ARCHIVED">{{ $t('str.register.status.archived') }}</option>
                    </select>
                </div>
                <div class="col-md-4 text-end mt-2">
                    <button @click="selectItem()" type="submit" class="btn btn-default w-150px">{{ $t('str.btn.new.form') }}</button>
                </div>
            </div>
            <vue-good-table
                :columns="columns"
                :rows="items"
                :lineNumbers="true"
                @on-row-click="selectItem"
                :search-options="{ enabled: true, placeholder: $t('str.table.search.in.this.table') }"
                :pagination-options="paginationOptions"
                tableLayout="fixed"
            >
                <div slot="emptystate" class="vgt-center-align vgt-text-disabled">
                    <i v-if="isLoading" class="fas fa-spinner fa-spin" />
                    <span v-if="!isLoading && items?.length === 0">{{ $t('str.table.subtitle.no.data') }}</span>
                </div>

                <template slot="table-row" slot-scope="props">
                    <span v-if="props.column.field === 'account'">
                        {{ props.formattedRow[props.column.field]?.name }}
                    </span>
                    <span v-else-if="props.column.field === 'clients'">
                        <p v-for="client in props.formattedRow[props.column.field]" :key="client._id" class="m-0">
                            {{ client.name }}
                        </p>
                    </span>
                    <span v-else-if="props.column.field === 'createDate'">
                        {{ formatDate(props.formattedRow[props.column.field]) }}
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
        <ClientGroupModal :selectedData="data" />
    </div>
</template>

<script>
import Controller from './CrtListClientGroup.vue'
import ClientGroupModal from './ClientGroup.vue'
import Vue from 'vue'
Vue.prototype.$registerEvent = new Vue()

export default {
    components: {
        ClientGroupModal,
    },
    props: {
        isSuperAdminMaster: {
            type: Boolean,
            default: false,
        },
        accounts: {
            type: Array,
            default: () => [],
        },
    },
    watch: {
        accounts: function () {
            this.listAccounts = this.accounts
        },
    },
    data() {
        return {
            items: [],
            isLoading: false,
            filters: {
                account: '',
                status: 'ACTIVE',
                name: '',
            },
            data: {},
            listAccounts: [],
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
