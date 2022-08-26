<script>
import Endpoints from '../../components/common/Endpoints'
import Common from '../../components/common/Common'
import Request from '../../components/common/Request'

export default {
    init: payload => {
        const el = document.body
        el.removeAttribute('class')
        $('.modal').modal('hide')

        payload.listCompanies()
    },
    methods: {
        save: function () {
            this.errors = []
            this.messageIdToast = null
            let state = this

            let data = JSON.parse(JSON.stringify(this.data))

            if (data.company) {
                data.company = data.company._id
            }

            Request.do(
                this,
                this.data._id ? 'PUT' : 'POST',
                Request.getDefaultHeader(this),
                data,
                `${Endpoints.projects.project}${this.data._id ? this.data._id : ''}`,
                response => {
                    //SUCCESS CALLBACK
                    this.errors = []
                    this.$fire({
                        text: this.data._id ? this.$t('str.register.put.sucess') : this.$t('string.user.register.success'),
                        type: 'success',
                        timer: 2000,
                    }).then(r => {
                        this.data._id = response.result._id
                        this.$eventHub.$emit('refreshList')
                    })
                },
                error => {
                    //ERROR CALLBACK
                    let res = error.response
                    if (res && res.status) {
                        this.titleToast = this.$t('string.msg.warning')
                        if (res.data.messageId === 'response.msg.error.empty.fields') {
                            let fields = ''
                            res.data.errors.forEach(function (value) {
                                fields += state.$t(value.id) + ';<br/>'
                            })
                            this.titleToast = this.$t(res.data.messageId)
                            this.messageToast = this.$t(fields)
                        } else if (res.data.messageId === 'response.already.exists') {
                            this.messageToast = this.$t('response.company.already.exists')
                        } else {
                            this.messageToast = this.$t(res.data.messageId)
                            this.messageIdToast = res.data.messageId
                        }

                        $('#toast').modal('show')
                    }
                },
            )
        },
        listCompanies: function () {
            this.companies = []
            Request.do(
                this,
                'GET',
                Request.getDefaultHeader(this),
                null,
                `${Endpoints.companies.company}`,
                response => {
                    //SUCCESS CALLBACK
                    this.companies = response.results
                },
                error => {
                    //ERROR CALLBACK
                },
            )
        },
        customLabelCompany(option) {
            return `${this.toUpperCase(option.fantasyName)}`
        },
        archive: function (response) {
            if (response == 1) {
                this.errors = []
                this.messageIdToast = null

                Request.do(
                    this,
                    'DELETE',
                    Request.getDefaultHeader(this),
                    this.data,
                    `${Endpoints.projects.project}${this.data._id}`,
                    response => {
                        //SUCCESS CALLBACK
                        this.$fire({
                            text: this.$t('str.register.delete.sucess'),
                            type: 'success',
                            timer: 2000,
                        }).then(r => {
                            this.$eventHub.$emit('refreshList')
                        })
                    },
                    error => {
                        //ERROR CALLBACK
                        let res = error.response
                        if (res && res.status) {
                            this.titleToast = this.$t('string.msg.warning')
                            if (res.data.messageId === 'response.msg.error.empty.fields') {
                                let fields = ''
                                res.data.errors.forEach(function (value) {
                                    fields += this.$t(value.id) + ';<br/>'
                                })
                                this.titleToast = this.$t(res.data.messageId)
                                this.messageToast = this.$t(fields)
                            } else {
                                this.messageToast = this.$t(res.data.messageId)
                                this.messageIdToast = res.data.messageId
                            }
                            $('#toast').modal('show')
                        }
                    },
                )
            }
        },

        confirmArchive: function () {
            this.titleToast = this.$t('string.msg.confirm')
            this.messageToast = this.$t('response.archive.project.confirmation')
            this.cancelText = this.$t('string.msg.cancel')
            this.yesText = this.$t('string.msg.yes')
            $('#confirmationModal').modal('show')
        },
        clearForm: function () {
            this.errors = []
            this.data = {
                status: 'ACTIVE',
                name: null,
                company: null,
            }
        },
        checkForm: function (e) {
            this.errors = []
            if (!this.data.name) {
                this.errors.push(this.$t('response.user.register.name.required'))
            }

            if (!this.data.company) {
                this.errors.push(this.$t('response.user.register.company.required'))
            }

            if (this.errors.length > 0) {
                e.preventDefault()
            } else {
                this.save()
            }
        },
        selectItem: function (item) {
            this.data = JSON.parse(JSON.stringify(item))

            // console.log(this.data);
            document.body.scrollTop = 0 // For Safari
            document.documentElement.scrollTop = 0 // For Chrome, Firefox, IE and Opera
        },
        camelize: Common.camelize,
        toUpperCase: Common.toUpperCase,
    },
}
</script>