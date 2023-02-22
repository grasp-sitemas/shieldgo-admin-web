<template>
    <div class="mb-2">
        <download-excel class="btn btn-primary" :fetch="fetchData" :fields="fields" :meta="jsonMeta" type="csv" :name="name">
            <label style="cursor: pointer" class="download-csv">Download CSV</label>
        </download-excel>
    </div>
</template>

<script>
export default {
    props: {
        jsonData: {
            type: Array,
            default: () => [],
        },
        jsonFields: {
            type: Object,
            default: () => {},
        },
        jsonMeta: {
            type: Array,
            default: () => [],
        },
        filename: {
            type: String,
            default: '',
        },
    },
    watch: {
        jsonData() {
            this.data = this.jsonData
            this.fields = this.jsonFields
            this.meta = this.jsonMeta
            this.name = this.filename
        },
    },
    data() {
        return {
            data: [],
            fields: {},
            meta: [],
            name: '',
        }
    },
    methods: {
        fetchData() {
            return this.data
        },
    },
}
</script>
