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
    searchPatrols: async function (state, filters) {
        const response = await Request.do(state, 'POST', Request.getDefaultHeader(state), filters, `${Endpoints.reports.filter}`)
        const results = response?.data?.results

        if (results?.length > 0) {
            const flattenedItems = results.reduce((acc, item) => {
                const items = item.schedules.reduce((acc, schedule) => {
                    return [
                        ...acc,
                        ...schedule?.items.reduce((acc, i) => {
                            return [
                                ...acc,
                                ...i?.actions.map(action => ({
                                    patrolPoint: action.patrolPoint?.name,
                                    event: schedule.name,
                                    vigilant: i.vigilant,
                                    scannedDate: action.date ? moment(action.date).utc(false).format('DD/MM/YYYY HH:mm:ss') : '',
                                    account: item.name,
                                    client: i.client,
                                    site: i.site,
                                    startDate: moment(i.startDate).utc(false).format('DD/MM/YYYY HH:mm:ss'),
                                    endDate: moment(i.endDate).utc(false).format('DD/MM/YYYY HH:mm:ss'),
                                    frequency: schedule.frequency,
                                })),
                            ]
                        }, []),
                    ]
                }, [])
                return [...acc, ...items]
            }, [])
            console.log(flattenedItems)
            console.log(results)
            return {
                tableItems: flattenedItems,
                reportItems: results,
            }
        }

        return []
    },
    incidents: async function (state, filters) {
        const response = await Request.do(state, 'POST', Request.getDefaultHeader(state), filters, `${Endpoints.reports.filter}`)
        const results = response?.data?.results

        if (results?.length > 0) {
            const flattenedItems = results.reduce((acc, account) => {
                const items = account.clients.reduce((acc, client) => {
                    console.log(client)
                    return [
                        ...acc,
                        ...client?.sites.reduce((acc, site) => {
                            return [
                                ...acc,
                                ...site?.items.map(item => ({
                                    date: item.date ? moment(item.date).utc(false).format('DD/MM/YYYY HH:mm:ss') : '',
                                    vigilant: item.vigilant,
                                    geolocation: item.geolocation,
                                    event: item?.event ? item.event.name : '',
                                    incidents: item.incidents,
                                    notes: item.notes,
                                    soundURL: item.soundURL,
                                    photoURL: item.photoURL,
                                    signatureURL: item.signatureURL,
                                    account: account.account,
                                    client: client.name,
                                    site: site.name,
                                    attendance: item.attendance,
                                    deviceInfo: item.deviceInfo,
                                    status: item.status,
                                })),
                            ]
                        }, []),
                    ]
                }, [])
                return [...acc, ...items]
            }, [])

            return {
                tableItems: flattenedItems,
                reportItems: results,
            }
        }
    },
    missedCall: async function (state, filters) {
        const response = await Request.do(state, 'POST', Request.getDefaultHeader(state), filters, `${Endpoints.reports.filter}`)
        const results = response?.data?.results

        if (results?.length > 0) {
            const flattenedItems = results.reduce((acc, account) => {
                const items = account.clients.reduce((acc, client) => {
                    console.log(client)
                    return [
                        ...acc,
                        ...client?.sites.reduce((acc, site) => {
                            return [
                                ...acc,
                                ...site?.items.map(item => ({
                                    date: item.date ? moment(item.date).utc(false).format('DD/MM/YYYY HH:mm:ss') : '',
                                    vigilant: item.vigilant,
                                    type: item?.type ? state.$t(item.type) : '',
                                    event: item?.event ? item.event.name : '',
                                    incidents: item.incidents,
                                    notes: item.notes,
                                    account: account.account,
                                    client: client.name,
                                    site: site.name,
                                    deviceInfo: item.deviceInfo,
                                    status: item.status,
                                })),
                            ]
                        }, []),
                    ]
                }, [])
                return [...acc, ...items]
            }, [])

            return {
                tableItems: flattenedItems,
                reportItems: results,
            }
        }
    },
    sosAlerts: async function (state, filters) {
        const response = await Request.do(state, 'POST', Request.getDefaultHeader(state), filters, `${Endpoints.reports.filter}`)
        const results = response?.data?.results

        if (results?.length > 0) {
            const flattenedItems = results.reduce((acc, item) => {
                const items = item.items.reduce((acc, i) => {
                    return [
                        ...acc,
                        {
                            date: i.date ? moment(i.date).utc(false).format('DD/MM/YYYY HH:mm:ss') : '',
                            vigilant: i.vigilant,
                            geolocation: i.geolocation,
                            event: i.event,
                            attendance: i.attendance,
                            deviceInfo: i.deviceInfo,
                            account: i.account,
                            client: i.client,
                            site: i.site,
                        },
                    ]
                }, [])
                return [...acc, ...items]
            }, [])

            return {
                tableItems: flattenedItems,
                reportItems: results,
            }
        }
        return []
    },
    filterReports: async function (state, filters) {
        switch (filters?.report) {
            case 'PATROL_POINTS_COMPLETED':
                return this.searchPatrols(state, filters)
            case 'PATROL_POINTS_NOT_VISITED':
                return this.searchPatrols(state, filters)
            case 'PATROL_POINTS_INCOMPLETED':
                return this.searchPatrols(state, filters)

            default:
                break
        }
    },
}
</script>
