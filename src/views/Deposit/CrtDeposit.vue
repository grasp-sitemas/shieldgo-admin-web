<script>
import Endpoints from '../../components/common/Endpoints'
import Common from '../../components/common/Common'
import Request from '../../components/common/Request'
import { mapActions } from 'vuex'

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

        await Promise.all(payload.listCompanies(), payload.listHubs(), payload.onChange())
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

            let state = this

            state.items = []
            state.totalCollects = 0

            const filters = JSON.parse(JSON.stringify(this.filters))

            filters.startDate = this.formatDateBegin(this.dayBegin, this.monthBegin, this.yearBegin)
            filters.endDate = this.formatDateEnd(this.dayEnd, this.monthEnd, this.yearEnd)

            if (filters.company) {
                filters.company = filters.company._id
            }

            if (filters.hub) {
                filters.hub = filters.hub._id
            }

            Request.do(
                state,
                'POST',
                Request.getDefaultHeader(state),
                filters,
                `${Endpoints.deposits.filter}`,
                response => {
                    //SUCCESS CALLBACK
                    state.items = JSON.parse(JSON.stringify(response.results))
                    state.totalCollects = state.items.length
                    $('#spinner').modal('toggle')
                },
                error => {
                    //ERROR CALLBACK
                    $('#spinner').modal('toggle')
                },
            )
        },
        clearFilters() {
            this.filters = {
                company: null,
                systemUser: null,
                startDate: null,
                endDate: null,
                hub: null,
                status: 'ACTIVE',
            }
            this.setDates()
        },
        isAdminMaster: function () {
            let user = this.$session.get('user')
            if (user) {
                return user.companyUser && user.companyUser.subtype == 'ADMIN_MASTER'
            }
            return false
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
        checkForm: function (e) {
            this.errors = []
            this.items = []
            if (this.filters.startDate > this.filters.endDate) {
                this.errors.push(this.$t('response.orders.filter.day.required'))
            }
            if (this.errors.length > 0) {
                e.preventDefault()
            } else {
                this.filter()
            }
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
        RefreshScreen: function () {
            this.$forceUpdate()
        },
        infoOne: function (item) {
            console.log(item.collects.filter(i => this.opened.includes(item._id)))
            return item.collects.filter(i => this.opened.includes(item._id))
        },
        onChangeDay: function () {
            ;(this.filters.startDate = new Date().setDate(new Date().getDate() - this.nDays)), (this.filters.endDate = new Date())
            this.filter()
        },
        showPhoto: function (url) {
            this.photoURL = url
            $('#modalPhoto').modal('show')
        },
        listHubs: function () {
            let state = this
            state.hubs = []

            Request.do(
                state,
                'GET',
                Request.getDefaultHeader(state),
                null,
                `${Endpoints.hubs.hub}`,
                response => {
                    //SUCCESS CALLBACK
                    state.hubs = response.results
                },
                error => {
                    //ERROR CALLBACK
                },
            )
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
            // console.log(this.items.companyUser.company);
            this.json_data = this.items
            return this.json_data
        },
        customLabelSystemUser(option) {
            return `${option.firstName + ' ' + option.lastName}`
        },
        customLabelHub(option) {
            return `${option.name + ''}`
        },
        toggle(id) {
            if (this.collapsedId != id) {
                const index = this.opened.indexOf(this.collapsedId)
                if (index != -1) {
                    this.opened.splice(index, 1)
                }
                this.opened.push(id)
                this.collapsedId = id
            } else {
                const index = this.opened.indexOf(id)
                if (index != -1) {
                    this.opened.splice(index, 1)
                    this.collapsedId = null
                }
            }
        },
        camelize: Common.camelize,
        toUpperCase: Common.toUpperCase,
    },
}
</script>