<script>
import Endpoints from '../../components/common/Endpoints'
import Common from '../../components/common/Common'
import Request from '../../components/common/Request'
import jsPDF from 'jspdf'
import domtoimage from 'dom-to-image'
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
                `${Endpoints.hubs.hub}${this.data._id ? this.data._id : ''}`,
                hubResponse => {
                    //SUCCESS CALLBACK
                    this.errors = []
                    this.$eventHub.$emit('refreshList')
                    this.$fire({
                        text: this.data._id ? this.$t('str.register.put.sucess') : this.$t('string.user.register.success'),
                        type: 'success',
                        timer: 2000,
                    }).then(r => {
                        this.data._id = hubResponse.result._id
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
        isAdminMaster: function () {
            let user = this.$session.get('user')
            if (user) {
                return user.companyUser && user.companyUser.subtype == 'ADMIN_MASTER'
            }
            return false
        },
        customLabelCompany(option) {
            return `${this.toUpperCase(option.fantasyName)}`
        },
        archive: function (response) {
            if (response == 1) {
                this.errors = []
                this.messageIdToast = null
                let state = this

                Request.do(
                    this,
                    'DELETE',
                    Request.getDefaultHeader(this),
                    this.data,
                    `${Endpoints.hubs.hub}${this.data._id}`,
                    response => {
                        //SUCCESS CALLBACK
                        this.$fire({
                            text: this.$t('str.hub.delete.sucess'),
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
                                    fields += state.$t(value.id) + ';<br/>'
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
            this.messageToast = this.$t('response.archive.hub.confirmation')
            this.cancelText = this.$t('string.msg.cancel')
            this.yesText = this.$t('string.msg.yes')
            $('#confirmationModal').modal('show')
        },
        clearForm: function () {
            this.errors = []
            this.data = {}
            this.longitude = null
            this.latitude = null
        },
        checkForm: function (e) {
            this.errors = []
            if (!this.data.name) {
                this.errors.push(this.$t('response.user.register.name.required'))
            }
            if (!this.data.type) {
                this.errors.push(this.$t('response.user.register.hub.type.required'))
            }

            if (this.errors.length > 0) {
                e.preventDefault()
            } else {
                this.errors = []
                this.save()
            }
        },
        selectItem: function (item) {
            this.latitude = null
            this.longitude = null
            this.data = JSON.parse(JSON.stringify(item))
            // console.log(this.data);
            document.body.scrollTop = 0 // For Safari
            document.documentElement.scrollTop = 0 // For Chrome, Firefox, IE and Opera
        },
        download() {
            let name = ''
            if (this.data.name) {
                name = this.data.name
            }
            domtoimage
                .toPng(this.$refs.content)
                .then(function (dataUrl) {
                    var img = new Image()
                    img.src = dataUrl
                    const doc = new jsPDF('p', 'pt', 'A4')
                    doc.text('Nº ' + name, 275, 180)
                    doc.addImage(img, 'PNG', 150, 200, 300, 300)
                    const filename = 'Hub-' + name + '.pdf'
                    doc.save(filename)
                })
                .catch(function (error) {
                    alert('oops, alguma coisa deu errada!\n', error)
                })
        },
        camelize: Common.camelize,
        toUpperCase: Common.toUpperCase,
    },
}
</script>