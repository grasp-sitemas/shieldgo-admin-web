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
        const account = state.$session.get('user')?.account?._id || ''

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
    getSites: async function (state) {
        const client = state.$session.get('user')?.client?._id || ''

        const filters = {
            name: '',
            client: client,
            status: 'ACTIVE',
            type: 'SITE',
        }

        if (client) {
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
            type: 'SITE',
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

            const result = response?.data?.results
            if (result && result.length > 0) {
                const mappedResult = result.map(item => {
                    return {
                        _id: item._id,
                        firstName: item.firstName,
                        lastName: item.lastName,
                        fullName: `${item.firstName} ${item.lastName}`,
                        status: item.status,
                    }
                })
                return mappedResult
            }
            return []
        }
        return []
    },
    getVigilantsByGuardGroup: async function (state, guardGroup) {
        const filters = {
            guardGroup: guardGroup,
            status: 'ACTIVE',
        }

        if (guardGroup) {
            const response = await Request.do(state, 'POST', Request.getDefaultHeader(state), filters, `${Endpoints.guardGroups.filter}`)

            const result = response?.data?.result?.vigilants
            if (result && result?.length > 0) {
                const mappedResult = result.map(item => {
                    return {
                        _id: item._id,
                        firstName: item.firstName,
                        lastName: item.lastName,
                        fullName: `${item.firstName} ${item.lastName}`,
                        status: item.status,
                    }
                })
                return mappedResult
            }
        }

        return []
    },
    getAppointmentsByDate: async function (state, filters) {
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
    getPatrolActions: async function (state, filters) {
        const response = await Request.do(state, 'POST', Request.getDefaultHeader(state), filters, `${Endpoints.patrolActions.filter}`)
        return response?.data?.results || []
    },
    getPatrolActionById: async function (state, id) {
        const response = await Request.do(state, 'GET', Request.getDefaultHeader(state), {}, `${Endpoints.patrolActions.patrolAction}/${id}`)
        return response?.data?.result || {}
    },
    getAttendancesOptionsTypes: async function (state) {
        const response = await Request.do(state, 'GET', Request.getDefaultHeader(state), {}, `${Endpoints.helpers.attendancesTypes}`)
        return response?.data?.results || []
    },

    getEventAttendances: async function (state, filters) {
        const response = await Request.do(state, 'POST', Request.getDefaultHeader(state), filters, `${Endpoints.events.attendances.filter}`)
        return response?.data?.results || []
    },
    getScheduleById: async function (state, filters) {
        const response = await Request.do(state, 'POST', Request.getDefaultHeader(state), filters, `${Endpoints.schedules.filter}`)
        return response?.data?.results[0] || []
    },
    cancelAppointmentSeries: async function (state, filters) {
        const response = await Request.do(state, 'POST', Request.getDefaultHeader(state), filters, `${Endpoints.appointments.cancelSeries}`)
        return response?.data?.deleteSchedule || null
    },
    cancelAppointmentOccurrence: async function (state, filters) {
        const response = await Request.do(state, 'POST', Request.getDefaultHeader(state), filters, `${Endpoints.appointments.cancelOccurrence}`)
        return response?.data?.deleteAppointment || null
    },
    getEventsByDate: async function (state, filters) {
        const response = await Request.do(state, 'POST', Request.getDefaultHeader(state), filters, `${Endpoints.events.filter}`)
        return response?.data?.results || []
    },
    emailAlreadyExists: async function (state, email) {
        const response = await Request.do(state, 'GET', Request.getDefaultHeader(state), {}, `${Endpoints.systemUsers.checkEmailExist}${email}`)
        return response?.data?.result || null
    },
    usernameAlreadyExists: async function (state, username) {
        const response = await Request.do(state, 'GET', Request.getDefaultHeader(state), {}, `${Endpoints.systemUsers.checkUsernameExist}${username}`)
        return response?.data?.result || null
    },
    getPatrolActionsByEvent: async function (state, filters) {
        const response = await Request.do(state, 'POST', Request.getDefaultHeader(state), filters, `${Endpoints.patrolActions.filter}`)
        return response?.data?.results || []
    },
    createAttendance: async function (state, attendance) {
        const response = await Request.do(state, 'POST', Request.getDefaultHeader(state), attendance, `${Endpoints.events.attendances.attendance}`)
        return response?.data?.result || null
    },
    attendanceEvent: async function (state, patrolActionId, attendance) {
        const body = {
            patrolActionId: patrolActionId,
            attendance: attendance,
        }

        const response = await Request.do(state, 'POST', Request.getDefaultHeader(state), body, `${Endpoints.patrolActions.attendanceEvent}`)
        return response?.data?.result || null
    },
    getSiteGroupsByAccount: async function (state, account) {
        const filters = {
            account: account,
            status: 'ACTIVE',
        }

        const response = await Request.do(state, 'POST', Request.getDefaultHeader(state), filters, `${Endpoints.siteGroups.filter}`)
        return response?.data?.results || []
    },
    getClientGroupsByAccount: async function (state, account) {
        const filters = {
            account: account,
            status: 'ACTIVE',
        }

        const response = await Request.do(state, 'POST', Request.getDefaultHeader(state), filters, `${Endpoints.clientGroups.filter}`)
        return response?.data?.results || []
    },
}
</script>
