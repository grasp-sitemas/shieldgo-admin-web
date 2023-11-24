<template>
    <download-excel class="btn btn-primary" :fetch="fetchData" :data="sortedPatrols" :fields="fields" :meta="meta" :name="name" :header="title" type="csv">
        <label style="cursor: pointer" class="download-csv">CSV</label>
    </download-excel>
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
        jsonTitle: {
            type: String,
            default: '',
        },
        filename: {
            type: String,
            default: '',
        },
    },
    watch: {
        jsonData() {
            alert('watch')
            // this.data = this.jsonData
            // this.title = this.jsonTitle
            // this.fields = this.jsonFields
            // this.meta = this.jsonMeta
            // this.name = this.filename + '.csv'
            // console.log(this.data)
        },
    },
    computed: {
        sortedPatrols() {
            if (!this.jsonData) return
            return [...this.jsonData].sort((a, b) => {
                return new Date(a.BeginTime) - new Date(b.BeginTime) || a.SiteName.localeCompare(b.SiteName)
            })
        },
    },
    data() {
        return {
            data: [],
            title: '',
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
