<script>
import Endpoints from '../../../common/Endpoints.vue'
import Request from '../../../common/Request.vue'
import Common from '../../../common/Common.vue'
import Services from '../../../common/Services.vue'

export default {
    init: async payload => {
        payload.data.account = Common.getAccountId(payload)

        payload.isSuperAdminMaster = await Common.isSuperAdminMaster(payload)
        if (payload.isSuperAdminMaster) {
            payload.accounts = await Services.getAccounts(payload)
        } 
    },
    methods: {
        save() {
            this.isLoading = true
            try {
                Request.do(
                    this,
                    this.data._id ? 'put' : 'post',
                    Request.getDefaultHeader(this),
                    this.data,
                    `${Endpoints.reportSettings.reportSetting}${this.data._id ? this.data._id : ''}`,
                    response => {
                        if (response.status === 200) {
                            this.data.status = response?.result?.status
                            this.data._id = response?.result?._id
                            this.closeModal()
                            Common.show(this, 'bottom-right', 'success', this.data._id ? this.$t('str.form.update.success') : this.$t('str.form.create.success'))
                            this.$registerEvent.$emit('refreshList')
                        }
                    },
                    error => {
                        this.isLoading = false
                        Common.show(this, 'bottom-right', 'warn', this.$t('str.form.update.generic.error'))
                        console.log(error)
                    },
                )
            } catch (error) {
                this.isLoading = false
                Common.show(this, 'bottom-right', 'warn', this.$t('str.form.update.generic.error'))
                console.log(error)
            }
        },
        archive() {
            try {
                Request.do(
                    this,
                    'DELETE',
                    Request.getDefaultHeader(this),
                    this.data,
                    `${Endpoints.reportSettings.reportSetting}${this.data._id}`,
                    response => {
                        if (response.status === 200) {
                            Common.show(this, 'bottom-right', 'success', this.$t('str.form.archive.success'))
                            this.$registerEvent.$emit('refreshList')
                            this.closeModal()
                        }
                    },
                    error => {
                        console.log(error)
                        Common.show(this, 'bottom-right', 'warn', this.$t('str.form.archive.generic.error'))
                    },
                )
            } catch (error) {
                console.log(error)
                Common.show(this, 'bottom-right', 'warn', this.$t('str.form.archive.generic.error'))
            }
        },
        confirmArchive() {
            this.$swal({
                title: this.$t('str.are.you.sure'),
                text: this.$t('str.are.you.sure.archive'),
                showCancelButton: true,
                buttonsStyling: false,
                confirmButtonText: this.$t('str.title.archive'),
                cancelButtonText: this.$t('str.btn.cancel'),
                confirmButtonClass: 'btn me-5px btn-warning',
                cancelButtonClass: 'btn btn-default',
            }).then(result => {
                if (result.isConfirmed && result.value) {
                    this.archive()
                }
            })
        },
        checkRequiredField(field) {
            return this.errors.includes(field)
        },
        removeRequiredField(field) {
          
            this.errors = this.errors.filter(item => item !== field)
            
        },
        checkForm() {
         
            if (!this.data.account || this.data.account === '') {
                this.errors.push('account')
            }
            if (!this.data.dispatchTime || this.data.dispatchTime === '') {
                this.errors.push('dispatchTime')
            }
            if (!this.data.reportName || this.data.reportName === '') {
                this.errors.push('reportName')
            }

            if (!this.data.emails || this.data.emails?.length === 0) {
                Common.show(this, 'bottom-right', 'warn', this.$t('str.add.at.least.one.email'))
                return
            }

            if (!this.errors || this.errors.length === 0) {
                this.save()
            }
        },
        closeModal: function () {
            const state = this

            state.errors = []
            state.data = state.reportConfigObj
            state.isLoading = false

            state.$bvModal.hide('createReportSettingsModal')
        },
        removeAllEmails() {
            this.data.emails = []
        },
        createEmailOption(newEmail) {
            if (newEmail.trim().length === 0) {
                return;
            }

            this.handleTag(newEmail)
        },
        handleTag: function(tagArray) {
            if(!tagArray || tagArray?.length === 0) return

            const newEmail = tagArray[tagArray.length - 1];

            console.log(newEmail);

            if (!this.isValidEmail(newEmail)) {
                this.data.emails.pop();
                Common.show(this, 'bottom-right', 'warn', this.$t('str.email.invalid'));
            } else if (this.isEmailDuplicate(newEmail, tagArray)) { // Passando o tagArray para verificação
                this.data.emails.pop();
                Common.show(this, 'bottom-right', 'warn', this.$t('str.email.duplicate'));
            }
        },
        isEmailDuplicate(email, tagArray) {
            // Verificar se o email aparece mais de uma vez no array
            const occurrences = tagArray.filter(e => e === email).length;
            return occurrences > 1; // Se aparecer mais de uma vez, é duplicado
        },
        isValidEmail(email) {
            let regex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}$/;
            return regex.test(email);
        },
    },
}
</script>
