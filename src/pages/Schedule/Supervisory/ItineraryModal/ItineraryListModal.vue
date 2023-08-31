<template>
    <b-modal no-close-on-backdrop id="itineraryListModal" @hide="closeModal" :hide-footer="true" size="l" class="modal-message">
        <template slot="modal-header">
            <h4 class="modal-title">{{ $t('str.modal.itinerary.list.title') }}</h4>
            <a class="btn-close cursor_pointer" @click="$bvModal.hide('itineraryListModal')"></a>
        </template>

        <vue-good-table
                class="table-container"
                :columns="columns"
                :rows="items"
                :search-options="{ enabled: true, placeholder: $t('str.table.search.in.this.table') }"
                :lineNumbers="true"
                @on-row-click="selectItem"
            >

                <div slot="emptystate" class="vgt-center-align vgt-text-disabled">{{ $t('str.table.subtitle.no.data') }}</div>
                <template slot="table-row" slot-scope="props">
                    <span>
                        {{ props.formattedRow[props.column.field] }}
                    </span>
                </template>
            </vue-good-table>
     
        <div class="row">
            <div class="col-md-12 mb-3">
                <div class="btn-center mt-4 mb-2">
                    <button @click="save()" class="ms-10px btn btn-primary w-100px" type="button" 
                        :disabled="!selectedItinerary ? true : false">
                            {{ $t('str.btn.select') }}
                    </button>
                    <button @click="closeModal()" type="submit" class="ms-10px btn btn-secondary w-100px">
                        {{ $t('str.btn.close') }}
                    </button>
                </div>
            </div>
        </div>

    </b-modal>
</template>

<script>
import Vue from 'vue'
Vue.prototype.$registerEvent = new Vue()

export default {
    props: ['itineraryList'],
    watch: {
        itineraryList: function () {
            this.items = this.itineraryList
        },
    },
    data() {
        return {
            isLoading: false,
            errors: [],
            selectedItinerary: null,
            items: [],
            columns: [
                {
                    label: this.$t('str.table.header.name'),
                    field: 'name',
                    type: 'string',
                },
            ],
        }
    },
    methods: {
        closeModal() {
            this.$bvModal.hide('itineraryListModal')
        },
    },
    created() {
        let state = this
        state.$registerEvent.$on('changeLanguage', function () {
            state.initTable()
        })
    },
}
</script>
<style lang="scss" scoped>
.center-spinner {
    display: flex;
    justify-content: center;
    align-items: center;
    height: 100%;
    margin-top: 30%;
    margin-bottom: 30%;
}
.table-container {
  max-height: 320px;
  overflow-y: auto;
}

.icon-cell {
    display: flex;
    justify-content: center;
    align-items: center;
}
</style>
