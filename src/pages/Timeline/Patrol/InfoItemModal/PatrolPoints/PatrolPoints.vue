<template>
    <b-modal body-class="patrolPointsModal" id="patrolPointsModal" :hide-header="true" :hide-footer="true" size="l" class="modal-message">
        <vue-good-table ref="table" :columns="columns" :rows="patrolPoints" :totalRows="patrolPoints?.length">
            <div slot="emptystate" class="vgt-center-align vgt-text-disabled">
                <span v-if="patrolPoints?.length === 0">{{ $t('str.table.subtitle.no.data') }}</span>
            </div>
            <template slot="table-row" slot-scope="props">
                <span v-if="props.column.field === 'scanned'">
                    <i v-if="props.formattedRow[props.column.field]" class="fas fa-check-circle fa-success" />
                    <i v-else class="fas fa-times-circle fa-error" />
                </span>
                <span v-else>
                    {{ props.formattedRow[props.column.field] }}
                </span>
            </template>
        </vue-good-table>
    </b-modal>
</template>

<script>
export default {
    props: {
        patrolPoints: {
            type: Array,
            default: () => [],
        },
    },
    data() {
        return {
            columns: [
                {
                    label: this.$t('str.timeline.item.patrol.point.checked'),
                    field: 'scanned',
                    tdClass: 'text-nowrap text-center',
                    thClass: 'text-nowrap text-center',
                    sortable: true,
                    width: '10%',
                },
                {
                    label: this.$t('str.timeline.item.patrol.point.name'),
                    field: 'name',
                    tdClass: 'text-nowrap',
                    thClass: 'text-nowrap',
                    sortable: true,
                    width: '90%',
                },
            ],
        }
    },
}
</script>
<style scoped>
span {
    font-size: 9px;
}
</style>
