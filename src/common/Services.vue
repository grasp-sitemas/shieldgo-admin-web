<script>
import Endpoints from './Endpoints.vue'
import Request from './Request.vue'
import moment from 'moment'

export default {
    getMe: async function (state) {
        const response = await Request.do(state, 'GET', Request.getDefaultHeader(state), {}, `${Endpoints.systemUsers.getMe}`)
        return response?.data?.result || {}
    },
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

        const response = await Request.do(state, 'POST', Request.getDefaultHeader(state), filters, `${Endpoints.companies.filter}`)
        return response?.data?.results || []
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
    getVigilantsByClient: async function (state, client) {
        const filters = {
            name: '',
            client: client,
            status: 'ACTIVE',
            subtype: 'VIGILANT',
        }

        if (client) {
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
    getFormattedEventsByDate: async function (state, filters) {
        const response = await Request.do(state, 'POST', Request.getDefaultHeader(state), filters, `${Endpoints.events.filter}`)
        const results = response?.data?.results
        if (results?.length > 0) {
            const mappedResults = results.map(item => {
                return {
                    _id: item._id,
                    event: item.name,
                    vigilant: item.vigilant.fullName,
                    startDate: moment(item.startDate).utc(false).format('YYYY-MM-DD HH:mm:ss'),
                    endDate: moment(item.endDate).utc(false).format('YYYY-MM-DD HH:mm:ss'),
                    account: item.account.name,
                    client: item.client.name,
                    site: item.site.name,
                }
            })
            return mappedResults
        }
        return []
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
    attendanceEvent: async function (state, patrolActionId, attendance, siteGroup) {
        const body = {
            patrolActionId: patrolActionId,
            attendance: attendance,
            siteGroup: siteGroup,
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
    filterReports: async function (state, filters) {
        const response = await Request.do(state, 'POST', Request.getDefaultHeader(state), filters, `${Endpoints.reports.filter}`)
        const results = response?.data?.results

        if (results?.length > 0) {
            const mappedResults = results.reduce((acc, item) => {
                const items = item.items.map(i => ({
                    patrolPoint: i.patrolPoint,
                    event: i.event,
                    vigilant: i.vigilant,
                    startDate: moment(i.startDate).utc(false).format('DD-MM-YYYY HH:mm:ss'),
                    endDate: moment(i.endDate).utc(false).format('DD-MM-YYYY HH:mm:ss'),
                    timeSlot: i.timeSlot,
                    client: i.client,
                    site: i.site,
                    schedule: i.schedule,
                    checked: i.checked,
                    account: item.name,
                    accountAddress:
                        item?.address?.address +
                        ' ' +
                        item?.address?.number +
                        ' ' +
                        item?.address?.complement +
                        ' ' +
                        item?.address?.neighborhood +
                        ' ' +
                        item?.address?.cep +
                        ' ' +
                        item?.address?.city +
                        ' ' +
                        item?.address?.state,
                }))

                return [
                    ...acc,
                    {
                        _id: item._id,
                        account: item.name,
                        accountAddress:
                            item?.address?.address +
                            ' ' +
                            item?.address?.number +
                            ' ' +
                            item?.address?.complement +
                            ' ' +
                            item?.address?.neighborhood +
                            ' ' +
                            item?.address?.cep +
                            ' ' +
                            item?.address?.city +
                            ' ' +
                            item?.address?.state,
                        status: item.status,
                        items: items,
                    },
                ]
            }, [])

            const flattenedItems = mappedResults.reduce((acc, item) => {
                return [...acc, ...item.items]
            }, [])

            return {
                tableItems: flattenedItems,
                reportItems: mappedResults,
            }
        }
        return []
    },
}
</script>
