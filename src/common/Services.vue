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
        const account = state.$session.get('user')?.account?._id

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
    getSitesByClient: async function (state, client) {
        const filters = {
            name: '',
            client: client,
            status: 'ACTIVE',
        }

        if (client) {
            const response = await Request.do(state, 'POST', Request.getDefaultHeader(state), filters, `${Endpoints.companies.filter}`)

            return response?.data?.results || []
        }

        return []
    },
    getVigilantsBySite: async function (state, site) {
        const filters = {
            name: '',
            site: site,
            status: 'ACTIVE',
            subtype: 'VIGILANT',
        }

        if (site) {
            const response = await Request.do(state, 'POST', Request.getDefaultHeader(state), filters, `${Endpoints.systemUsers.customerUser.search}`)

            return response?.data?.results || []
        }

        return []
    },
    getAppointmentsByDate: async function (state, date) {
        const filters = {
            startDate: date,
            isSortByStartDate: true,
        }

        const response = await Request.do(state, 'POST', Request.getDefaultHeader(state), filters, `${Endpoints.appointments.filter}`)

        return response?.data?.results || []
    },
    getSchedulesByDate: async function (state, date) {
        const filters = {
            startDate: date,
            isSortByStartDate: true,
        }

        const response = await Request.do(state, 'POST', Request.getDefaultHeader(state), filters, `${Endpoints.schedules.filter}`)

        return response?.data?.results || []
    },
    getGuardGroupsBySite: async function (state, site) {
        if (site) {
            const filters = {
                site: site,
                status: 'ACTIVE',
            }

            const response = await Request.do(state, 'POST', Request.getDefaultHeader(state), filters, `${Endpoints.guardGroups.filter}`)
            return response?.data?.results || []
        }

        return []
    },
    getPatrolPointsBySite: async function (state, site) {
        if (site) {
            const filters = {
                site: site,
                status: 'ACTIVE',
            }

            const response = await Request.do(state, 'POST', Request.getDefaultHeader(state), filters, `${Endpoints.patrolPoints.filter}`)
            return response?.data?.results || []
        }

        return []
    },
}
</script>
