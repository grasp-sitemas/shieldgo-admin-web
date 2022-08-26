<template>
    <div id="wrapper" :key="valuekey">
        <div class="content-page">
            <div class="content">
                <div class="container-fluid">
                    <div class="row">
                        <div class="col-12">
                            <div class="page-title-box">
                                <h4 class="page-title">{{ $t('str.msg.points.label') }}</h4>
                            </div>
                        </div>
                    </div>
                    <!-- Form row -->
                    <div class="row">
                        <div class="col-md-12">
                            <div class="card-box">
                                <p class="sub-header">
                                    {{ $t('str.msg.register.points.label') }}
                                </p>

                                <form>
                                    <div v-if="data._id" class="form-row">
                                        <div class="form-group col-md-3">
                                            <label for="inputAddress" class="col-form-label"> <code class="highlighter-rouge">*</code> {{ $t('string.msg.product.brand.label.id') }} </label>
                                            <input type="text" v-model="data._id" readonly class="form-control" />
                                        </div>
                                        <div class="form-group col-md-2 mt-4">
                                            <button v-on:click="confirmArchive" class="text-dark-gray btn btn-warning w-100">{{ $t('string.msg.status.archive') }}</button>
                                        </div>
                                    </div>

                                    <div v-if="isAdminMaster()" class="form-row">
                                        <div class="form-group col-md-6">
                                            <label for="inputAddress" class="col-form-label">
                                                <strong>{{ $t('string.msg.companies.label') }}</strong>
                                                <span class="ml-2" style="color: gray">{{ $t('string.msg.search.companies.label') }}</span>
                                            </label>
                                            <multiselect
                                                v-model="data.company"
                                                :options="companies"
                                                :close-on-select="true"
                                                track-by="_id"
                                                :custom-label="customLabelCompany"
                                                :searchable="true"
                                                placeholder="Selecione"
                                            >
                                            </multiselect>
                                        </div>
                                        <div class="m-0 form-group col-md-6">
                                            <label for="inputAddress" class="col-form-label">
                                                <code class="highlighter-rouge">*</code>
                                                <strong>{{ $t('string.msg.project.label') }}</strong>
                                            </label>
                                            <multiselect
                                                v-model="data.project"
                                                :options="projects"
                                                :close-on-select="true"
                                                track-by="_id"
                                                :custom-label="customLabelProject"
                                                :searchable="true"
                                                placeholder="Selecione"
                                            >
                                            </multiselect>
                                        </div>
                                    </div>

                                    <div class="form-row">
                                        <div class="form-group col-md-6">
                                            <label>
                                                <code class="highlighter-rouge">*</code>
                                                {{ $t('string.msg.list.user.label.name') }}
                                            </label>
                                            <input type="text" v-model="data.name" class="form-control" :placeholder="$t('string.msg.list.user.label.name')" />
                                        </div>
                                        <div class="form-group col-md-6">
                                            <label>
                                                <code class="highlighter-rouge">*</code>
                                                {{ $t('string.msg.question.table.label.type') }}
                                            </label>
                                            <select v-model="data.type" class="form-control">
                                                <option :value="null" selected>{{ $t('string.msg.select.selector.item') }}</option>
                                                <option value="PUB">{{ $t('string.msg.point.type.pub') }}</option>
                                                <option value="SUPERMARKET">{{ $t('string.msg.point.type.supermarkert') }}</option>
                                                <option value="RESTAURANT">{{ $t('string.msg.point.type.restaurant') }}</option>
                                                <option value="BALLAD">{{ $t('string.msg.point.type.ballad') }}</option>
                                                <option value="SHOW-HOUSE">{{ $t('string.msg.point.type.show-house') }}</option>
                                                <option value="OTHERS">{{ $t('string.msg.point.type.others') }}</option>
                                            </select>
                                        </div>
                                    </div>

                                    <div class="form-row">
                                        <div class="form-group col-md-6">
                                            <label>
                                                {{ $t('string.msg.company.label.primaryphone') }}
                                            </label>
                                            <input
                                                type="text"
                                                v-model="data.primaryPhone"
                                                class="form-control"
                                                :placeholder="$t('string.msg.company.label.primaryphone')"
                                                v-mask="['(##) ####-####', '(##) #####-####']"
                                            />
                                        </div>

                                        <div class="form-group col-md-6">
                                            <label>
                                                {{ $t('string.msg.company.label.personToTalk') }}
                                            </label>
                                            <input type="text" v-model="data.personToTalk" class="form-control" :placeholder="$t('string.msg.list.user.label.name')" />
                                        </div>
                                    </div>

                                    <div class="form-row mt-2">
                                        <div class="form-group col-md-2">
                                            <label>
                                                <code class="highlighter-rouge">*</code>
                                                {{ $t('string.msg.company.label.cep') }}
                                            </label>
                                            <input @blur="loadInfosByCEP" v-mask="'#####-###'" v-model="data.address.cep" type="tel" class="form-control" :placeholder="$t('string.msg.company.label.cep')" />
                                        </div>
                                    </div>

                                    <div class="form-row">
                                        <div class="form-group col-sm-2">
                                            <label> <code class="highlighter-rouge">*</code>{{ $t('string.msg.company.label.state') }} </label>
                                            <select v-model="data.address.state" class="form-control select2">
                                                <option :value="null" selected>{{ $t('string.msg.element.select.selectitem') }}</option>
                                                <option value="AC">AC</option>
                                                <option value="AL">AL</option>
                                                <option value="AP">AP</option>
                                                <option value="AM">AM</option>
                                                <option value="BA">BA</option>
                                                <option value="CE">CE</option>
                                                <option value="DF">DF</option>
                                                <option value="ES">ES</option>
                                                <option value="GO">GO</option>
                                                <option value="MA">MA</option>
                                                <option value="MT">MT</option>
                                                <option value="MS">MS</option>
                                                <option value="MG">MG</option>
                                                <option value="PA">PA</option>
                                                <option value="PB">PB</option>
                                                <option value="PR">PR</option>
                                                <option value="PE">PE</option>
                                                <option value="PI">PI</option>
                                                <option value="RJ">RJ</option>
                                                <option value="RN">RN</option>
                                                <option value="RS">RS</option>
                                                <option value="RO">RO</option>
                                                <option value="RR">RR</option>
                                                <option value="SC">SC</option>
                                                <option value="SP">SP</option>
                                                <option value="SE">SE</option>
                                                <option value="TO">TO</option>
                                            </select>
                                        </div>
                                        <div class="col-sm-5">
                                            <label>
                                                <code class="highlighter-rouge">*</code>
                                                {{ $t('string.msg.company.label.city') }}
                                            </label>
                                            <input v-model="data.address.city" type="text" class="form-control" :placeholder="$t('string.msg.company.label.city')" />
                                        </div>
                                        <div class="form-group col-sm-5">
                                            <label>
                                                <code class="highlighter-rouge">*</code>
                                                {{ $t('string.msg.company.label.street') }}
                                            </label>
                                            <input v-model="data.address.address" type="text" class="form-control" :placeholder="$t('string.msg.company.label.street')" />
                                        </div>
                                    </div>

                                    <div class="form-row">
                                        <div class="form-group col-sm-2">
                                            <label>
                                                <code class="highlighter-rouge">*</code>
                                                {{ $t('string.msg.company.label.number') }}
                                            </label>
                                            <input v-model="data.address.number" type="text" class="form-control" :placeholder="$t('string.msg.company.label.number')" />
                                        </div>
                                        <div class="form-group col-sm-5">
                                            <label>
                                                <code class="highlighter-rouge">*</code>
                                                {{ $t('string.msg.company.label.neighborhood') }}
                                            </label>
                                            <input v-model="data.address.neighborhood" type="text" class="form-control" :placeholder="$t('string.msg.company.label.neighborhood')" />
                                        </div>
                                        <div class="form-group col-sm-5">
                                            <label>
                                                {{ $t('string.msg.company.label.complement') }}
                                            </label>
                                            <input v-model="data.address.complement" type="text" class="form-control" :placeholder="$t('string.msg.company.label.complement')" />
                                        </div>
                                    </div>

                                    <div class="form-row">
                                        <div class="col-md-6" v-if="longitude && latitude">
                                            <label class="col-form-label">
                                                {{ $t('string.msg.point.location.label') }}
                                            </label>
                                            <GmapMap
                                                class="form-group col-md-12"
                                                :center="{ lng: longitude ? Number(longitude) : null, lat: latitude ? Number(latitude) : null }"
                                                :zoom="15"
                                                :map-type-id="terrain"
                                                style="width: 2140px; height: 250px"
                                                :options="{
                                                    zoomControl: true,
                                                    mapTypeControl: false,
                                                    scaleControl: false,
                                                    streetViewControl: true,
                                                    rotateControl: false,
                                                    fullscreenControl: true,
                                                    disableDefaultUi: false,
                                                }"
                                            >
                                                <GmapMarker
                                                    :key="index"
                                                    :position="{ lng: longitude ? Number(longitude) : null, lat: latitude ? Number(latitude) : null }"
                                                    :clickable="true"
                                                    :draggable="true"
                                                    @click="center = m.position"
                                                />
                                            </GmapMap>
                                        </div>
                                    </div>

                                    <div v-if="errors.length" class="alert alert-danger">
                                        <p class="lead">{{ $t('response.msg.error.empty.fields') }}</p>
                                        <ul>
                                            <li v-bind:key="error" v-for="error in errors">{{ error }}</li>
                                        </ul>
                                    </div>

                                    <div class="mt-2 form-row text-center">
                                        <div class="form-group col-md-6">
                                            <button @click="clearForm" class="btn btn-secondary w-50">{{ $t('string.msg.form.btn.clear') }}</button>
                                        </div>
                                        <div class="form-group col-md-6">
                                            <button @click="checkForm" class="btn btn-primaryGreen w-50">{{ $t('string.msg.form.btn.save') }}</button>
                                        </div>
                                    </div>
                                </form>
                            </div>
                        </div>
                    </div>
                    <List v-on:load-item="selectItem" />
                </div>
            </div>
        </div>

        <Spinner />
        <Toast :title="titleToast" :message="messageToast" :messageId="messageIdToast" />
        <Confirmation :title="titleToast" :message="messageToast" :cancelText="cancelText" :yesText="yesText" v-on:confirmation-return="archive" />
    </div>
</template>

<script>
import Controller from './CrtPoint'
import List from './ListPoint'
import Spinner from '../../components/layout/Spinner'
import Toast from '../../components/layout/Toast'
import Confirmation from '../../components/layout/Confirmation'
import Vue from 'vue'
Vue.prototype.$eventHub = new Vue()
export default {
    name: 'Point',
    components: {
        Spinner,
        Toast,
        List,
        Confirmation,
    },
    data() {
        return {
            errors: [],
            addresses: [],
            companies: [],
            projects: [],
            valuekey: 0,
            titleToast: null,
            latitude: Number(-13.053232),
            longitude: Number(-37.615482),
            messageToast: null,
            messageIdToast: null,
            data: {
                status: 'ACTIVE',
                name: null,
                personToTalk: null,
                primaryPhone: null,
                type: null,
                date: new Date(),
                company: null,
                project: null,
                address: {
                    state: null,
                    cep: null,
                    city: null,
                    address: null,
                    neighborhood: null,
                    number: null,
                    complement: null,
                    ibge: null,
                    gia: null,
                },
            },
        }
    },
    methods: Controller.methods,
    created() {
        Controller.init(this)
    },
    computed: {},
    mounted() {},
}
</script>

<style>
</style>
