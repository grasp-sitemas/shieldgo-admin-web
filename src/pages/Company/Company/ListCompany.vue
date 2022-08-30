<template>
    <div>
        <panel :title="$t('str.table.list.companies')" bodyClass="p-0" class="">
            <vue-good-table
                :columns="columns"
                :rows="rows"
                :lineNumbers="true"
                :search-options="{ enabled: true, placeholder: $t('str.table.search.in.this.table') }"
                :pagination-options="{ enabled: true, position: 'bottom' }"
                :selectOptions="{
                    enabled: false,
                    selectOnCheckboxOnly: true,
                    selectionInfoClass: 'alert alert-info m-b-0 no-rounded-corner',
                }"
            >
                <div slot="emptystate" class="vgt-center-align vgt-text-disabled">{{ $t('str.table.subtitle.no.data') }}</div>
                <template slot="table-row" slot-scope="props">
                    <span v-if="props.column.field == 'image'">
                        <img v-bind:src="props.row.image" class="rounded my-n1 mx-auto d-block" width="26" />
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
export default {
    data() {
        return {
            columns: [
                {
                    label: this.$t('str.table.company.column.fantasyName'),
                    field: 'fantasyName',
                    width: '15%',
                    thClass: 'text-nowrap',
                    tdClass: 'text-nowrap',
                },
                {
                    label: this.$t('str.table.company.column.document'),
                    field: 'document',
                    thClass: 'text-nowrap',
                    tdClass: 'text-nowrap',
                },
                {
                    label: this.$t('str.table.company.column.email'),
                    field: 'email',
                    type: 'number',
                    width: '10%',
                    tdClass: 'text-center text-nowrap',
                    thClass: 'text-center text-nowrap',
                },
                {
                    label: this.$t('str.table.company.column.phone'),
                    field: 'primaryPhone',
                    type: 'number',
                    width: '10%',
                    tdClass: 'text-center text-nowrap',
                    thClass: 'text-center text-nowrap',
                },
                {
                    label: this.$t('str.table.company.column.creat.at'),
                    field: 'createDate',
                    type: 'date',
                    dateInputFormat: 'yyyy-mm-dd',
                    dateOutputFormat: 'MMM Do yy',
                    width: '10%',
                    tdClass: 'text-center text-nowrap',
                    thClass: 'text-center text-nowrap',
                },
            ],
            rows: [],
        }
    },
}
</script>