<script>
import Endpoints from '../../components/common/Endpoints'
import Common from '../../components/common/Common'
import Request from '../../components/common/Request'

export default {
    init: payload => {
        const el = document.body
        el.removeAttribute('class')
        $('.modal').modal('hide')

        // payload.filter()
        payload.listCompanies()
    },
    methods: {
        filter: function () {
            $('#spinner').modal('toggle')

            let state = this
            state.items = []
            state.errors = []

            const filters = JSON.parse(JSON.stringify(this.filters))

            if (filters.name == null) {
                filters.name = ''
            }

            if (filters.company) {
                filters.company = filters.company._id
            }

            Request.do(
                state,
                'POST',
                Request.getDefaultHeader(state),
                filters,
                `${Endpoints.points.filter}`,
                response => {
                    //SUCCESS CALLBACK
                    state.items = response.results
                    $('#spinner').modal('toggle')
                },
                error => {
                    //ERROR CALLBACK
                    $('#spinner').modal('toggle')
                    console.log(error)
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
        selectItem: function (item) {
            this.$emit('load-item', item)
        },
        onChangePage(pageOfItems) {
            // update page of items
            this.pageOfItems = pageOfItems
        },
        getPageNumbers: function () {
            return this.items.length / 10
        },
        fetchData() {
            // console.log(this.items.companyUser.company);
            this.json_data = this.items
            return this.json_data
        },
        camelize: Common.camelize,
        toUpperCase: Common.toUpperCase,
    },
}
</script>