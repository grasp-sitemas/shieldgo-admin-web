<script>
import Endpoints from '../../components/common/Endpoints'
import Common from '../../components/common/Common'
import Request from '../../components/common/Request'
import jsPDF from 'jspdf'
import { HEADER_PDF } from '../../utils/constants'

export default {
    init: async payload => {
        const el = document.body
        payload.domain = Endpoints.domain
        el.removeAttribute('class')
        $('.modal').modal('hide')

        payload.dayBegin = new Date().getDate()
        payload.monthBegin = new Date().getMonth()
        payload.yearBegin = new Date().getFullYear()

        payload.dayEnd = new Date().getDate()
        payload.monthEnd = new Date().getMonth()
        payload.yearEnd = new Date().getFullYear()

        payload.daysInMonthBegin(payload.monthBegin, payload.yearBegin)
        payload.daysInMonthEnd(payload.monthEnd, payload.yearEnd)
        payload.listCompanies()
        payload.listProjects()
        payload.listPointCollect()
        payload.onChange()
    },
    methods: {
        async setDates() {
            await Promise.all(
                (this.dayBegin = new Date().getDate()),
                (this.monthBegin = new Date().getMonth()),
                (this.yearBegin = new Date().getFullYear()),
                (this.dayEnd = new Date().getDate()),
                (this.monthEnd = new Date().getMonth()),
                (this.yearEnd = new Date().getFullYear()),
            )

            this.daysInMonthBegin(this.monthBegin, this.yearBegin)
            this.daysInMonthEnd(this.monthEnd, this.yearEnd)
        },
        filter: function () {
            $('#spinner').modal('toggle')

            this.items = []
            this.totalWeight = 0

            const filters = JSON.parse(JSON.stringify(this.filters))

            filters.startCollect = this.formatDateBegin(this.dayBegin, this.monthBegin, this.yearBegin)
            filters.endCollect = this.formatDateEnd(this.dayEnd, this.monthEnd, this.yearEnd)

            if (filters.company) {
                filters.company = filters.company._id
            }

            if (filters.project) {
                filters.project = filters.project._id
            }

            if (filters.systemUser) {
                filters.systemUser = filters.systemUser._id
            }

            if (filters.pointCollect) {
                filters.pointCollect = filters.pointCollect._id
            }

            if (filters.address && filters.address.state) {
                filters.address.state = filters.address.state.value
            }

            if (filters.address && filters.address.city) {
                filters.address.city = filters.address.city.name
            }

            Request.do(
                this,
                'POST',
                Request.getDefaultHeader(this),
                filters,
                `${Endpoints.collects.filter}`,
                response => {
                    //SUCCESS CALLBACK
                    this.items = JSON.parse(JSON.stringify(response.results))
                    this.getTotalWeight()
                    $('#spinner').modal('toggle')
                },
                error => {
                    //ERROR CALLBACK
                    $('#spinner').modal('toggle')
                },
            )
        },
        getTotalWeight() {
            for (let i = 0; i < this.items.length; i++) {
                if (this.items[i] && this.items[i].weight) {
                    this.totalWeight += this.items[i].weight
                }
            }
        },
        isAdminMaster: function () {
            if (this.$session.get('user')) {
                return this.$session.get('user').companyUser.subtype == 'ADMIN_MASTER'
            }
            return false
        },
        confirmArchive: function (id, index) {
            this.collectId = id
            this.collectIndex = index
            this.titleToast = this.$t('string.msg.confirm')
            this.messageToast = this.$t('response.delete.collect.confirmation')
            this.cancelText = this.$t('string.msg.cancel')
            this.yesText = this.$t('string.msg.yes')
            $('#confirmationModal').modal('show')
        },
        applyProject(item) {
            if (item && item.project && item.project._id && item._id && !this.isLoading) {
                const data = JSON.parse(JSON.stringify(item))
                data.project = item.project._id
                data.changeOrClearProject = true
                this.isLoading = true
                Request.do(
                    this,
                    'PUT',
                    Request.getDefaultHeader(this),
                    data,
                    `${Endpoints.collects.collect}${data._id}`,
                    response => {
                        //SUCCESS CALLBACK
                        this.isLoading = false
                    },
                    error => {
                        //ERROR CALLBACK
                        this.isLoading = false
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
        removeProject(item, index) {
            if (item && item.project && item.project._id && item._id) {
                const data = JSON.parse(JSON.stringify(item))
                data.project = null

                Request.do(
                    this,
                    'PUT',
                    Request.getDefaultHeader(this),
                    data,
                    `${Endpoints.collects.collect}${data._id}`,
                    response => {
                        //SUCCESS CALLBACK
                        if (response && response.status == 200) {
                            this.items[index].project = null
                        }
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
        archive: function (response) {
            if (response == 1) {
                this.errors = []
                this.messageIdToast = null
                let state = this

                Request.do(
                    this,
                    'DELETE',
                    Request.getDefaultHeader(this),
                    null,
                    `${Endpoints.collects.delete}${this.collectId}`,
                    response => {
                        //SUCCESS CALLBACK
                        if (response && response.status == 200) {
                            this.items.splice(this.collectIndex, 1)
                        }
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
        listProjects: function () {
            this.companies = []
            Request.do(
                this,
                'POST',
                Request.getDefaultHeader(this),
                { status: 'ACTIVE' },
                `${Endpoints.projects.filter}`,
                response => {
                    //SUCCESS CALLBACK
                    this.projects = response.results
                },
                error => {
                    //ERROR CALLBACK
                },
            )
        },
        customLabelCompany(option) {
            return `${this.toUpperCase(option.fantasyName)}`
        },
        customLabelProject(option) {
            return `${this.toUpperCase(option.name)}`
        },
        customLabelState(option) {
            return `${this.toUpperCase(option.name)}`
        },
        customLabelCity(option) {
            return `${this.toUpperCase(option.name)}`
        },
        checkForm: function (e) {
            this.errors = []
            this.items = []
            if (this.filters.startCollect > this.filters.endCollect) {
                this.errors.push(this.$t('response.orders.filter.day.required'))
            }
            if (this.errors.length > 0) {
                e.preventDefault()
            } else {
                this.filter()
            }
        },
        clearFilters() {
            this.filters = {
                type: null,
                systemUser: null,
                company: null,
                project: null,
                startCollect: null,
                endCollect: null,
                collectType: 'TRICYCLE',
                productType: null,
                status: 'ACTIVE',
                pointCollect: null,
                address: {
                    state: null,
                    city: null,
                },
            }
            this.setDates()
        },
        formatDateBegin: function (day, month, year) {
            let date = new Date()
            date.setUTCDate(day)
            date.setUTCMonth(month)
            date.setUTCFullYear(year)
            date.setUTCHours(0, 0, 0, 0)
            return date.toISOString()
        },
        formatDateEnd: function (day, month, year) {
            let date = new Date()
            date.setUTCDate(day)
            date.setUTCMonth(month)
            date.setUTCFullYear(year)
            date.setUTCHours(23, 59, 59, 999)
            return date.toISOString()
        },
        daysInMonthBegin: function (month, year) {
            this.daysBegin = []
            let nDay = new Date(year, month + 1, 0).getDate()
            for (let i = 0; i < nDay; i++) {
                this.daysBegin.push({ day: i + 1 })
            }
        },
        daysInMonthEnd: function (month, year) {
            this.daysEnd = []
            let nDay = new Date(year, month + 1, 0).getDate()
            for (let i = 0; i < nDay; i++) {
                this.daysEnd.push({ day: i + 1 })
            }
        },
        listPointCollect: function () {
            this.pointCollects = []
            Request.do(
                this,
                'GET',
                Request.getDefaultHeader(this),
                null,
                `${Endpoints.pointCollects.pointCollect}`,
                response => {
                    //SUCCESS CALLBACK
                    this.pointCollects = response.results
                },
                error => {
                    //ERROR CALLBACK
                },
            )
        },
        RefreshScreen: function () {
            this.$forceUpdate()
        },
        onChangeDay: async function () {
            await Promise.all((this.filters.startCollect = new Date().setDate(new Date().getDate() - this.nDays)), (this.filters.endCollect = new Date()))
            this.filter()
        },
        checkClose: function (item) {
            return item.statusOrder.toUpperCase() != 'CLOSED' && item.statusOrder.toUpperCase() != 'PAID' && item.statusOrder.toUpperCase() != 'REJECTED'
        },
        showMap: function (geo) {
            this.geolocation = geo
            $('#modalMap').modal('show')
        },
        showPhoto: function (url) {
            this.photoURL = url
            $('#modalPhoto').modal('show')
        },
        onChange: function () {
            Request.do(
                this,
                'POST',
                Request.getDefaultHeader(this),
                { subtype: 'EMPLOYEE' },
                `${Endpoints.systemUsers.search}`,
                response => {
                    //SUCCESS CALLBACK
                    this.systemUsers = response.results
                },
                error => {
                    //ERROR CALLBACK
                    this.titleToast = this.$t('str.msg.toast.advice')
                    this.messageToast = this.$t('str.msg.error.generic')
                    let res = error.response
                    if (res) {
                        this.messageIdToast = res
                    }
                    $('#toast').modal('show')
                },
            )
        },
        onChangePage(pageOfItems) {
            // update page of items
            this.pageOfItems = pageOfItems
        },
        fetchData() {
            this.json_data = this.items
            return this.json_data
        },
        customLabelSystemUser(option) {
            return `${option.firstName + ' ' + option.lastName}`
        },
        customLabelPointCollect(option) {
            return `${option.name}`
        },
        downloadPDF() {
            let items = this.items
            const generateData = function () {
                let result = []

                if (items.length > 0) {
                    items.forEach((item, index) => {
                        const data = {
                            _id: String(index + 1),
                            project: item?.project?.name ?? '',
                            pointCollect: item?.pointCollect?.name ?? '',
                            startCollect: new Date(item?.startCollect).toLocaleString('pt-BR') ?? '',
                            weight: String(item?.weight) ?? '',
                            systemUser: item?.systemUser?.firstName + ' ' + item?.systemUser?.lastName,
                            geolocation: '',
                            status: '',
                        }

                        if (item.type === 'OPENED') {
                            data.status = 'Pendente'
                        } else if (item.type === 'CLOSED') {
                            data.status = 'Finalizado'
                        }

                        if (item.latlng && item.latlng.latitude && item.latlng.longitude) {
                            data.geolocation = 'Lat: ' + String(item.latlng.latitude) + '\n' + 'Lng: ' + String(item.latlng.longitude)
                        }
                        result.push(data)
                    })
                }

                return result
            }

            function createHeaders(keys) {
                const result = []
                for (let i = 0; i < keys.length; i += 1) {
                    result.push({
                        id: keys[i]._id,
                        name: keys[i]._id,
                        prompt: keys[i].name,
                        width: 45,
                        align: 'left',
                        padding: 0,
                    })
                }
                return result
            }

            const headers = createHeaders(HEADER_PDF)

            let doc = new jsPDF({ orientation: 'landscape' })

            doc.text('Relatório: Coletas de Triciclo', 5, 10)
            doc.setFontSize(8)
            doc.setTextColor('#161B22')
            doc.text('Data: ' + new Date().toLocaleString('pt-BR'), 5, 15)

            doc.table(5, 25, generateData(), headers, { autoSize: true, fontSize: 7, padding: 1 })

            doc.text('Peso total: ' + this.totalWeight + ' (kg)', 5, doc.internal.pageSize.height - 10)

            const pdfName = 'Relatorio_Triciclo_' + new Date().toLocaleDateString('pt-BR') + '.pdf'
            doc.save(pdfName)
        },
        camelize: Common.camelize,
        toUpperCase: Common.toUpperCase,
    },
}
</script>