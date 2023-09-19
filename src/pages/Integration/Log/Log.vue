<template>
    <div>

            <h1 class="page-header">{{ $t('str.form.title.integration.logs.list') }}</h1>
            <hr />
            <div class="row">

               <div class="col-md-12">
                <vue-good-table
                    :columns="columns"
                    :rows="items"
                    :lineNumbers="false"
                    :totalRows="totalItems"
                    :search-options="{ enabled: true, placeholder: $t('str.table.search.in.this.table') }"
                    :pagination-options="paginationOptions"
                    :current-page="currentPage" 
                    :total-pages="totalPages"  
                    @on-page-change="onPageChange"
                >
                        <div slot="emptystate" class="vgt-center-align vgt-text-disabled">
                            <i v-if="isLoading" class="fas fa-spinner fa-spin" />
                            <span v-if="!isLoading && items?.length === 0">{{ $t('str.table.subtitle.no.data') }}</span>
                        </div>
                        <template slot="table-row" slot-scope="props">
                            <span v-if="props.column.field === 'domain' || props.column.field === 'operation'">
                                {{ $t(props.formattedRow[props.column.field]) }}
                            </span>
                            <span v-else-if="props.column.field === 'createDate'">
                                {{ moment(props.formattedRow[props.column.field]).utc(true).format('DD/MM/YYYY HH:mm:ss') }}
                            </span>
                            <span v-else-if="props.column.field === 'substatus'">
                                <span class="badge" v-bind:class="props.formattedRow[props.column.field] === 'SUCCESS' ? 'bg-success' : 'bg-danger'"> {{ $t(props.formattedRow[props.column.field]) }} </span>
                            </span>
                            <span v-else>
                                {{ props.formattedRow[props.column.field] }}
                            </span>
                        </template>
                    </vue-good-table>
                </div>
            </div>
    </div>
</template>

<script>
import Controller from './CrtLog.vue'
import Vue from 'vue'
Vue.prototype.$registerEvent = new Vue()
import moment from 'moment'
export default {
    components: {},
    data() {
        return {
            isLoading: false,
            valuekey: 0,
            errors: [],
            items: [],
            currentPage: 0, // Current page number
            totalPages: 1,  // Total number of pages
            totalItems: 0,  // Total number of items
            filters: {
                status: 'ACTIVE',
                substatus: '',
                skip: 0,
                limit: 25,
            },
            isSuperAdminMaster: false,
            columns: [],
            paginationOptions: {
                perPage: 25,
            },
            moment: moment, 
        }
    },
    mounted() {
        Controller.init(this)
    },
    created() {
        const state = this
    
        state.$registerEvent.$on('changeLanguage', function () {
            state.initTable()
        })
    },
    methods: Controller.methods,
}
</script>
