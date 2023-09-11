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
                        :totalRows="items?.length"
                        :search-options="{ enabled: true, placeholder: $t('str.table.search.in.this.table') }"
                        :pagination-options="paginationOptions"
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
                                {{ formatDate(props.formattedRow[props.column.field]) }}
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

const { socketDomain } = require('../../../common/Endpoints.vue').default
import io from 'socket.io-client';
const socket = io(socketDomain);


export default {
    components: {},
    data() {
        return {
            isLoading: false,
            valuekey: 0,
            errors: [],
            items: [],
            filters: {
                status: 'ACTIVE',
                substatus: '',
            },
            isSuperAdminMaster: false,
            columns: [],
            paginationOptions: {
                perPage: 25,
            },
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

        socket.on('new-events', () => {
          state.filter()
        });
    },
    methods: Controller.methods,
}
</script>
