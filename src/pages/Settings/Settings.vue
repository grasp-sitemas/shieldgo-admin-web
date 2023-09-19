<template>
    <div v-if="!isLoading">
        <panel :title="$t('str.form.title.settings')">
            <form>
                <fieldset>
                    <!-- Configurações do Modo Escuro -->
                    <div class="row mt-10px">
                        <div class="col-8 control-label fw-bold">
                            <label class="form-label">{{ $t('str.dark.mode') }}</label>
                            <div class="lh-14">
                                <small class="text-dark opacity-50">{{ $t('str.dark.mode.description') }}</small>
                            </div>
                        </div>
                        <div class="col-4 d-flex">
                            <div class="form-check form-switch ms-auto mb-0">
                                <input type="checkbox" class="form-check-input" name="app-theme-dark-mode" id="appThemeDarkMode" @change="handleSetDarkMode" v-model="darkMode" />
                                <label class="form-check-label" for="appThemeDarkMode">&nbsp;</label>
                            </div>
                        </div>
                    </div>

                    <!-- Seção de Relatórios -->
                    <div class="mt-4">
                        <label class="form-label mb-0">{{ $t('str.form.title.reports') }}</label>
                        <hr />
                        <!-- // espaco dos lados -->
                        <div v-for="(report, index) in reportTypes" :key="index" class="mt-10px">
                            
                            <!-- Seletor do Tipo de Relatório -->
                            <div class="col-4 d-flex align-items-center">  <!-- Use 'align-items-center' for vertical alignment -->
                                <div class="form-check">
                                    <input  v-model="selectedReports[report]" @change="toggleReport(report)" class="form-check-input" type="checkbox" id="checkbox1" />
                                    <label class="form-check-label ms-1">{{ $t(report) }}</label> <!-- 'ms-2' gives a small space between checkbox and label -->
                                </div>
                            </div>

                        <!-- Configuração do Relatório -->
                            <div v-if="selectedReports[report]">
                                <div class="row mt-10px">
                                    <!-- Frequência do relatório -->
                                    <div class="col-4">
                                        <div class="control-label fw-bold">
                                            <label class="form-label">{{ $t('str.report.frequency') }}</label>
                                        </div>
                                        <select class="form-select" v-model="company.reportConfigs[report].selectedFrequency">
                                            <option v-for="freq in frequencies" :value="freq" :key="freq">{{ $t(freq) }}</option>
                                        </select>
                                    </div>
                                    
                                    <!-- Hora de Envio -->
                                    <div class="col-4">
                                        <div class="control-label fw-bold">
                                            <label class="form-label">{{ $t('str.report.dispatchTime') }}</label>
                                        </div>
                                        <input type="time" class="form-control" v-model="company.reportConfigs[report].dispatchTime">
                                    </div>
                                </div>

                                <!-- E-mails Adicionais -->
                                <div class="row mt-10px">
                                    <div class="col-8 control-label fw-bold">
                                        <label class="form-label">{{ $t('str.report.emails') }}</label>
                                    </div>
                                    <div class="col-12 mt-2">
                                        <!-- Campo para adicionar novo e-mail -->
                                        <div class="mb-2 d-flex">
                                            <input type="email" v-model="newEmail" placeholder="Enter email" class="form-control mr-2"> <!-- Vamos usar a variável 'newEmail' para vincular este campo -->
                                            <button @click.prevent="addEmailField(report)">{{ $t('str.report.addEmail') }}</button>
                                        </div>

                                        <!-- Tabela com e-mails adicionados -->
                                        <table class="table">
                                            <tbody>
                                                <tr v-for="(email, emailIndex) in company.reportConfigs[report].emails" :key="'email-' + emailIndex">
                                                    <td>
                                                        <input type="email" v-model="company.reportConfigs[report].emails[emailIndex]" placeholder="Enter email">
                                                    </td>
                                                </tr>
                                            </tbody>
                                        </table>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                  
                </fieldset>
            </form>
        </panel>
    </div>
    <div v-else class="center-spinner">
        <i class="fas fa-spinner fa-spin" />
    </div>
</template>

<script>
import Controller from './CrtSettings.vue';
import Vue from 'vue';

Vue.prototype.$registerEvent = new Vue();

export default {
    name: 'Settings',
    data() {
        return {
            isLoading: true,
            errors: [],
            company: {},
            user: null,
            darkMode: false,
            selectedReports: {},
            frequencies: ['DAILY', 'WEEKLY', 'MONTHLY'],
            reportTypes: ['REPORT_PERFORMANCE_LOCAL'],
            newEmail: '',
        }
    },
    methods: {
        ...Controller.methods,
        toggleReport(report) {
            if (!this.selectedReports[report]) {
                Vue.delete(this.company.reportConfigs, report);
            } else {
                Vue.set(this.company.reportConfigs, report, {
                    selectedFrequency: this.frequencies[0],
                    dispatchTime: '',
                    emails: []
                });
            }
        },
        addEmailField(report) {
            this.company.reportConfigs[report].emails.push('');
        }
    },
    mounted() {
        Controller.init(this)
    },
}
</script>
