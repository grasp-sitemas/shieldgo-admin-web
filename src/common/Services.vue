<script>
import Endpoints from './Endpoints.vue'
import Request from './Request.vue'

export default {
    getAccounts: async function (state) {
        const filters = {
            name: '',
            status: 'ACTIVE',
            type: 'ACCOUNT',
        }
        const response = await Request.do(state, 'POST', Request.getDefaultHeader(state), filters, `${Endpoints.companies.filter}`)
        return response?.data?.results || []
    },
    getClients: async function (state) {
        const company = state.$session.get('user')?.company
        const account = company.type === 'ACCOUNT' ? company._id : ''

        const filters = {
            name: '',
            account: account,
            status: 'ACTIVE',
            type: 'CLIENT',
        }

        if (account) {
            const response = await Request.do(state, 'POST', Request.getDefaultHeader(state), filters, `${Endpoints.companies.filter}`)
            return response?.data?.results || []
        }

        return []
    },
    getClientsByAccount: async function (state, account) {
        const filters = {
            name: '',
            account: account,
            status: 'ACTIVE',
            type: 'CLIENT',
        }

        if (account) {
            const response = await Request.do(state, 'POST', Request.getDefaultHeader(state), filters, `${Endpoints.companies.filter}`)

            return response?.data?.results || []
        }

        return []
    },
}
</script>
