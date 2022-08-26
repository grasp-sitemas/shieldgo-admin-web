<script>
import Endpoints from '../../../components/common/Endpoints'
import Common from '../../../components/common/Common'
import Request from '../../../components/common/Request'

export default {
    init: payload => {
        const el = document.body
        el.removeAttribute('class')
        $('.modal').modal('hide')

        payload.filter()
    },
    methods: {
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
        filter: function () {
            this.items = []
            this.errors = []

            $('#spinner').modal('toggle')
            Request.do(
                this,
                'POST',
                Request.getDefaultHeader(this),
                this.filters,
                `${Endpoints.companies.filter}`,
                response => {
                    //SUCCESS CALLBACK
                    this.items = response.results
                    $('#spinner').modal('toggle')
                },
                error => {
                    //ERROR CALLBACK
                    console.log(error)
                },
            )
        },
        customLabelCompany(option) {
            return `${this.toUpperCase(option.fantasyName)}`
        },
        selectItem: function (item) {
            this.$emit('load-item', JSON.parse(JSON.stringify(item)))
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
