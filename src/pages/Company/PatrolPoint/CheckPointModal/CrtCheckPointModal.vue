<script>
import Common from '../../../../common/Common.vue'
import Services from '../../../../common/Services.vue'
import Endpoints from '../../../../common/Endpoints.vue'
import Request from '../../../../common/Request.vue'

export default {
    methods: {
        checkRequiredField(field) {
            return this.errors.includes(field)
        },
        removeRequiredField(field) {
            this.errors = this.errors.filter(item => item !== field)
        },
        changeAccount: async function () {
            const account = this.data.account

            this.data.client = ''
            this.data.site = ''
            this.sites = []

            this.clients = await Services.getClientsByAccount(this, account)
        },
        changeClient: async function () {
            const client = this.data.client

            if (client === '') {
                this.data.site = ''
            }

            this.sites = await Services.getSitesByClient(this, client)
        },
        async handleCheckpointOption(option) {
            this.errors = []
            if(!this.isSuperAdminMaster){
                this.data.account = await Common.getAccountId(this)
            }
            this.data.client = ''
            this.data.site = ''
            this.data.type = option;
        },
        checkForm() {

            if (!this.data.account || this.data.account === '') {
                this.errors.push('account')
            }

            if (!this.data.client || this.data.client === '') {
                this.errors.push('client')
            }

            if(this.data?.type === 'QRCODE'){
                if (!this.data.site || this.data.site === '') {
                    this.errors.push(this.$t('site'))
                }
            }else{
                this.data.site = ''
                this.removeRequiredField('site')
            }

            if (!this.quantity || this.quantity === '') {
                this.errors.push(this.$t('quantity'))
            }

            if (!this.errors || this.errors.length === 0) {
                this.save()
            }
        },
        save() {
            this.isLoading = true

            const arrayOfData = []

            if(this.data?.type === 'QRCODE'){
                for (let index = 0; index < this.quantity; index++) {
                    arrayOfData.push({
                        name: '',
                        account: this.data.account,
                        client: this.data.client,
                        site: this.data.site,
                        type: this.data.type,
                        status: this.data.status,
                    })
                }
            }else{
                for (let index = 0; index < this.quantity; index++) {
                    arrayOfData.push({
                        name: '',
                        account: this.data.account,
                        client: this.data.client,
                        type: this.data.type,
                        status: this.data.status,
                    })
                }
            }

            try {
                Request.do(
                    this,
                    this.data._id ? 'put' : 'post',
                    Request.getDefaultHeader(this),
                    arrayOfData,
                    `${Endpoints.patrolPoints.saveMany}`,
                    response => {
                        if (response.status === 200) {
                            this.isLoading = false
                            this.clearForm()
                            this.$registerEvent.$emit('refreshList')
                            Common.show(this, 'bottom-right', 'success', this.$t('str.form.create.success'))
                            this.$bvModal.hide('checkPointModal')
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
        async closeModal() {
            this.clearForm()
            this.$bvModal.hide('checkPointModal')
        },
        clearForm() {
            this.errors = []
            this.quantity = null
            this.isSelected = false
            this.isSupervisionSelected = false

            this.data = {
                account: '',
                client: '',
                site: '',
                type: '',
                status: 'ACTIVE',
            }
            if (this.isSuperAdminMaster) {
                this.clients = []
                this.sites = []
            } else this.data.account = Common.getAccountId(this)


            this.isLoading = false

            this.$bvModal.hide('checkPointModal')

        },
    },
}
</script>
