<template>
    <div>
        <div class="row">
            <div class="col-md-12 mb-3 d-inline-flex">
                <CsvDownload class="me-2" v-show="items?.length > 0" :jsonFields="jsonFields" :jsonData="items" :jsonMeta="jsonMeta" :filename="filename" :jsonTitle="jsonTitle" />
                <XlsDownload class="me-2" v-show="items?.length > 0" :jsonFields="jsonFields" :jsonData="items" :jsonMeta="jsonMeta" :filename="filename" :jsonTitle="jsonTitle" />
                <PdfDownload v-show="items?.length > 0" :pdfHeader="pdfHeader" :jsonData="reportItems" :filename="filename" :jsonTitle="jsonTitle" :logoURL="logoURL" />
            </div>
        </div>

        <vue-good-table
            :columns="columns"
            :rows="items"
            :totalRows="items?.length"
            :search-options="{ enabled: false, placeholder: $t('str.table.search.in.this.table') }"
            :pagination-options="paginationOptions"
        >
            <div slot="emptystate" class="vgt-center-align vgt-text-disabled">
                <i v-if="isLoading" class="fas fa-spinner fa-spin" />
                <span v-if="!isLoading && items?.length === 0">{{ $t('str.table.subtitle.no.data') }}</span>
            </div>
            <template slot="table-row" slot-scope="props">
                <span>
                    {{ props.formattedRow[props.column.field] }}
                </span>
            </template>
        </vue-good-table>
    </div>
</template>

<script>
import Controller from './CrtAllPatrol.vue'
import CsvDownload from '../Components/CsvDownload.vue'
import XlsDownload from '../Components/XlsDownload.vue'
import PdfDownload from '../Components/PdfDownload.vue'
import Vue from 'vue'
import { JSON_FIELDS_CSV } from './Utils/jsonFieldsCsv'
import { PDF_HEADER } from './Utils/jsonFieldsPdf'

Vue.prototype.$registerEvent = new Vue()

export default {
    components: {
        CsvDownload,
        XlsDownload,
        PdfDownload,
    },
    props: ['isLoading', 'filterParams', 'role', 'isSuperAdminMaster', 'items', 'reportItems', 'logoURL'],
    watch: {
        filterParams: {
            handler: function (val) {
                if (val) {
                    this.filters = val
                }
            },
            deep: true,
        },
    },
    data() {
        return {
            paginationOptions: {},
            fields: [],
            filters: {},
            selectedItem: null,
            JSON_FIELDS_CSV: JSON_FIELDS_CSV,
            PDF_HEADER: PDF_HEADER,
            jsonFields: JSON_FIELDS_CSV.incompletedPatrolPoints.pt.json_fields,
            jsonData: [JSON_FIELDS_CSV.incompletedPatrolPoints.pt.json_data],
            jsonMeta: [JSON_FIELDS_CSV.incompletedPatrolPoints.pt.json_meta],
            filename: JSON_FIELDS_CSV.incompletedPatrolPoints.pt.filename,
            jsonTitle: JSON_FIELDS_CSV.incompletedPatrolPoints.pt.title,
            pdfHeader: PDF_HEADER.pt,
        }
    },
    methods: Controller.methods,
    async created() {
        await Controller.init(this)
    },
}
</script>
