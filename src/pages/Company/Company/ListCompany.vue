<template>
    <div>
        <panel :title="$t('str.table.list.companies')" bodyClass="p-0">
            <div class="row ms-2 mb-1 mt-3 me-1">
                <div class="col-md-4">
                    <label class="form-label" for="statusField">{{ $t('str.register.status.field') }}</label>
                    <select v-model="filters.status" @change="filter" class="form-select" id="statusField">
                        <option value="ACTIVE">{{ $t('str.register.status.active') }}</option>
                        <option value="ARCHIVED">{{ $t('str.register.status.archived') }}</option>
                    </select>
                </div>
                <div class="col-md-8 text-end mt-2">
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
                style="height: 500px"
            >
                <div slot="emptystate" class="vgt-center-align vgt-text-disabled">
                    <i v-if="isLoading" class="fas fa-spinner fa-spin" />
                    <span v-if="!isLoading && items?.length === 0">{{ $t('str.table.subtitle.no.data') }}</span>
                </div>
                <template slot="table-row" slot-scope="props">
                    <span v-if="props.column.field === 'address'">
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
                    <span v-else-if="props.column.field === 'status'">
                        <span class="badge" v-bind:class="props.formattedRow[props.column.field] === 'ACTIVE' ? 'bg-success' : 'bg-danger'"> {{ $t(props.formattedRow[props.column.field]) }} </span>
                    </span>
                    <span v-else-if="props.column.field === 'createDate'">
                        {{ formatDate(props.formattedRow[props.column.field]) }}
                    </span>
                    <span v-else>
                        {{ props.formattedRow[props.column.field] }}
                    </span>
                </template>
            </vue-good-table>
        </panel>
        <CompanyModal :selectedData="data" />
    </div>
</template>

<script>
import CompanyModal from './Company.vue'
import Controller from './CrtListCompany.vue'
import Vue from 'vue'
Vue.prototype.$registerEvent = new Vue()

export default {
    components: {
        CompanyModal,
    },
    data() {
        return {
            items: [],
            isLoading: false,
            data: {},
            filters: {
                type: 'ACCOUNT',
                status: 'ACTIVE',
                name: '',
            },
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
<style lang="scss" scoped>
.body-style {
    height: 400px !important;
}
</style>
