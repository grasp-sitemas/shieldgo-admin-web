<template>
    <b-modal no-close-on-backdrop id="createItineraryModal" @hide="closeModal" :hide-footer="true" size="l" class="modal-message">
        <template slot="modal-header">
            <h4 class="modal-title">{{ $t('str.modal.itinerary.register.title') }}</h4>
            <a class="btn-close cursor_pointer" @click="$bvModal.hide('createItineraryModal')"></a>
        </template>
        <div class="row">
            <div class="col-md-12">
                <div class="form-group">
                    <label class="form-label" for="name">{{ $t('str.modal.create.itinerary.label.name') }}</label>
                    <input type="text" class="form-control" id="name" v-model="data.name" :placeholder="$t('str.modal.create.itinerary.placeholder.name')">
                </div>
            </div>
        </div>

        <div class="row" >
            <div class="col-md-12 mb-3">
                <div class="btn-center mt-4 mb-2">
                    <button @click="save()" class="ms-10px btn btn-primary w-100px" type="button" 
                        :disabled="(!data?.points || data?.points?.length === 0) && (!data?.name || data?.name?.length === 0)">
                            {{ $t('str.btn.save') }}
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
import Controller from './CrtItineraryModal.vue'
import Vue from 'vue'
Vue.prototype.$registerEvent = new Vue()

export default {
    props: ['itinerary'],
    watch: {
        itinerary: function () {
            this.data.account = this.itinerary?.account
            this.data.client = this.itinerary?.client
            this.data.patrolPoints = this.itinerary?.points?.map(point => point._id)
            this.data.status = 'ACTIVE',
            this.data.name = ''
        },
    },
    data() {
        return {
            isLoading: false,
            errors: [],
            data: {
                name: '',
                account: '',
                client: '',
                patrolPoints: [],
                status: 'ACTIVE',
            }
        }
    },
    methods: Controller.methods,
    mounted() {
        Controller.init(this)
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
