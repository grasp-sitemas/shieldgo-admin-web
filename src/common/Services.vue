<script>
import Endpoints from './Endpoints.vue'
import Request from './Request.vue'
import moment from 'moment'
import { EVENT_CHART_TYPES } from '../utils/events'
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
    getItinerariesByClient: async function (state, client) {
        const filters = {
            client: client,
            status: 'ACTIVE',
        }

        const response = await Request.do(state, 'POST', Request.getDefaultHeader(state), filters, `${Endpoints.itineraries.filter}`)
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
    getSupervisoryPointByClient: async function (state, filters) {
        if (filters) {
            const response = await Request.do(state, 'POST', Request.getDefaultHeader(state), filters, `${Endpoints.patrolPoints.filter}`)

            const result = response?.data?.results
            if (result && result.length > 0) {
                const mappedResult = result.map(item => {
                    return {
                        ...item,
                        actions: true,
                    }
                })
                return mappedResult
            }
            return []
        }
        return []
    },
    getSupervisorsBySite: async function (state, site) {
        const filters = {
            name: '',
            site: site,
            status: 'ACTIVE',
            subtype: 'SUPERVISOR',
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
    getSupervisorsByClient: async function (state, client) {
        const filters = {
            name: '',
            client: client,
            status: 'ACTIVE',
            subtype: 'SUPERVISOR',
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
    externalAnalysisPatrol: async function (state, filters) {
        const response = await Request.do(state, 'POST', Request.getDefaultHeader(state), filters, `${Endpoints.reports.externalFilter}`)

        return response?.data?.results || []
    },
    getExternalSites: async function (state, filters) {
        const response = await Request.do(state, 'POST', Request.getDefaultHeader(state), filters, `${Endpoints.companies.externalLocalList}`)

        const results = response?.data?.results

        if (results?.length > 0) {
            const mappedResults = results.map(item => {
                return {
                    ...item,
                    _id: `${item.deptID}-${item.database}`,
                }
            })

            return mappedResults
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
    getPatrolPoints: async function (state, filter) {
        if (filter) {
            const response = await Request.do(state, 'POST', Request.getDefaultHeader(state), filter, `${Endpoints.patrolPoints.filter}`)
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
    getSupervisionCheckPointsByClient: async function (state, client) {
        if (client) {
            const filters = {
                client: client,
                type: 'SUPERVISION',
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
    getExternalCompanies: async function (state) {
        const response = await Request.do(state, 'GET', Request.getDefaultHeader(state), {}, `${Endpoints.companies.externalList}`)

        const results = response?.data?.results

        if (results?.length > 0) {
            const mappedResults = results.map(item => {
                return {
                    ...item,
                    _id: `${item.deptID}-${item.database}`,
                }
            })

            return mappedResults
        }

        return []
    },
    getGatewayExternalCompanies: async function (state) {
        const response = await Request.do(state, 'GET', Request.getDefaultHeader(state), {}, `${Endpoints.companies.gatewayExternalList}`)

        const results = response?.data?.results

        if (results?.length > 0) {
            const mappedResults = results.map(item => {
                return {
                    ...item,
                    _id: `${item.deptID}-${item.database}`,
                }
            })

            return mappedResults
        }

        return []
    },
    getPatrolActionById: async function (state, id) {
        const response = await Request.do(state, 'GET', Request.getDefaultHeader(state), {}, `${Endpoints.patrolActions.patrolAction}/${id}`)
        return response?.data?.result || {}
    },
    getAttendancesOptionsTypes: async function (state) {
        const response = await Request.do(state, 'GET', Request.getDefaultHeader(state), {}, `${Endpoints.helpers.attendancesTypes}`)
        return response?.data?.results || []
    },
    getReportNamesTypes: async function (state) {
        const response = await Request.do(state, 'GET', Request.getDefaultHeader(state), {}, `${Endpoints.helpers.reportNames}`)
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
        try {
            const response = await Request.do(state, 'POST', Request.getDefaultHeader(state), filters, `${Endpoints.appointments.cancelSeries}`)
            if (response.status === 200) {
                return true
            }

            return null
        } catch (error) {
            console.log('error', error)
            return null
        }
    },
    updateScheduleSeries: async function (state, body) {
        try {
            const response = await Request.do(state, 'POST', Request.getDefaultHeader(state), body, `${Endpoints.schedules.update}`)
            if (response.status === 200) {
                return true
            }

            return null
        } catch (error) {
            console.log('error', error)
            return null
        }
    },
    updateAppointmentOccurence: async function (state, body) {
        try {
            const response = await Request.do(state, 'POST', Request.getDefaultHeader(state), body, `${Endpoints.appointments.update}`)
            if (response.status === 200) {
                return true
            }

            return null
        } catch (error) {
            console.log('error', error)
            return null
        }
    },
    cancelAppointmentOccurrence: async function (state, filters) {
        const response = await Request.do(state, 'POST', Request.getDefaultHeader(state), filters, `${Endpoints.appointments.cancelOccurrence}`)
        return response?.data?.deleteAppointment || null
    },
    getEventsByDate: async function (state, filters) {
        const response = await Request.do(state, 'POST', Request.getDefaultHeader(state), filters, `${Endpoints.events.filter}`)
        return response?.data?.results || []
    },
    getPatrolsChart: async function (state, filters) {
        const response = await Request.do(state, 'POST', Request.getDefaultHeader(state), filters, `${Endpoints.charts.patrols}`)
        return response?.data?.result || {}
    },
    getEventsAttendance: async function (state, filters) {
        filters.types = EVENT_CHART_TYPES
        const response = await Request.do(state, 'POST', Request.getDefaultHeader(state), filters, `${Endpoints.charts.eventsAttendance}`)
        return response?.data?.result || {}
    },
    getAvaregeTimeAttendanceEvent: async function (state, filters) {
        filters.types = EVENT_CHART_TYPES
        const response = await Request.do(state, 'POST', Request.getDefaultHeader(state), filters, `${Endpoints.charts.avaregeTimeAttendanceEvent}`)
        return response?.data?.result || {}
    },
    getEventsByType: async function (state, filters) {
        const response = await Request.do(state, 'POST', Request.getDefaultHeader(state), filters, `${Endpoints.charts.eventsByType}`)
        return response?.data?.result || {}
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
    patrolPointsPerformance: async function (state, filters) {
        const response = await Request.do(state, 'POST', Request.getDefaultHeader(state), filters, `${Endpoints.charts.patrolPointsPerformance}`)
        return response?.data?.result || []
    },
    localsPerformance: async function (state, filters) {
        const response = await Request.do(state, 'POST', Request.getDefaultHeader(state), filters, `${Endpoints.charts.localsPerformance}`)
        return response?.data?.result || []
    },
    guardsPerformance: async function (state, filters) {
        const response = await Request.do(state, 'POST', Request.getDefaultHeader(state), filters, `${Endpoints.charts.guardsPerformance}`)
        return response?.data?.result || []
    },
    eventsPerformance: async function (state, filters) {
        const response = await Request.do(state, 'POST', Request.getDefaultHeader(state), filters, `${Endpoints.charts.eventsPerformance}`)
        return response?.data?.result || {}
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
    getSiteGroupsByClient: async function (state, client) {
        const filters = {
            client: client,
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
                                    medias: {
                                        soundURL: item.soundURL,
                                        photoURL: item.photoURL,
                                        signatureURL: item.signatureURL,
                                    },
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
    getPatrolPointsByClient: async function (state, client) {
        const filters = {
            client: client,
            status: 'ACTIVE',
            type: 'SUPERVISION',
        }

        const response = await Request.do(state, 'POST', Request.getDefaultHeader(state), filters, `${Endpoints.patrolPoints.filter}`)
        return response?.data?.results || []
    },
    SupervisorPatrol: async function (state, filters) {
        const response = await Request.do(state, 'POST', Request.getDefaultHeader(state), filters, `${Endpoints.reports.filter}`)
        const results = response?.data?.results

        if (results?.length > 0) {
            const formattedResults = results.map(result => {
                return {
                    account: result.account?.name,
                    accountAddress: result.account?.address,
                    client: result.client?.name,
                    site: result.site?.name,
                    vigilant: result?.vigilant?.fullName,
                    patrolPoints: result?.patrolPoints,
                }
            })

            const allPatrolPoints = [].concat(...formattedResults.map(result => result.patrolPoints))

            allPatrolPoints.sort((a, b) => {
                if (a.read === false) {
                    return -1
                }
                if (b.read === false) {
                    return 1
                }
                return 0
            })

            const finalResult = {
                account: formattedResults[0].account,
                accountAddress: formattedResults[0].accountAddress,
                client: formattedResults[0].client,
                site: formattedResults[0].site,
                vigilant: formattedResults[0].vigilant,
                patrolPoints: allPatrolPoints,
            }

            return finalResult
        }

        return null // Ou algum outro valor padrão em caso de não haver resultados
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
