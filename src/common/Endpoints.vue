<script>
const domain = process.env.VUE_APP_API_DOMAIN
// const domain = 'http://localhost:3000'
const socketDomain = 'http://localhost:3001'
const viaCepDomain = 'https://viacep.com.br/ws/'
export default {
    domain: domain,
    socketDomain: socketDomain,
    appointments: {
        filter: `${domain}/api/company/appointments/filter/v1/`,
        filterV2: `${domain}/api/company/appointments/filter/v2/`,
        appointment: `${domain}/api/company/appointments/v1/`,
        delete: `${domain}/api/company/appointments/delete/v1/`,
        cancelSeries: `${domain}/api/company/appointments/cancel/series/v1/`,
        cancelOccurrence: `${domain}/api/company/appointments/cancel/occurrence/v1/`,
        update: `${domain}/api/company/appointments/update/v1/`,
        updateSupervisory: `${domain}/api/company/appointments/supervisor/update/v1/`,
        updateOccurrence: `${domain}/api/company/appointments/update/occurrence/v1/`,
        supervisorUpdateOccurrence: `${domain}/api/company/appointments/supervisor/update/occurrence/v1/`,
    },
    addresses: {
        address: `${domain}/api/address/v1/`,
        geolocation: `${domain}/api/address/geo/v1/`,
    },
    itineraries: {
        itinerary: `${domain}/api/company/itineraries/v1/`,
        delete: `${domain}/api/company/itineraries/delete/v1/`,
        update: `${domain}/api/company/itineraries/update/v1/`,
        filter: `${domain}/api/company/itineraries/filter/v1/`,
    },
    events: {
        filter: `${domain}/api/company/events/filter/v1/`,
        event: `${domain}/api/company/events/v1/`,
        delete: `${domain}/api/company/events/delete/v1/`,
        attendances: {
            filter: `${domain}/api/users/attendances/filter/v1/`,
            attendance: `${domain}/api/users/attendances/v1/`,
        },
    },
    patrols: {
        freePatrols: `${domain}/api/users/patrols/free/v1/`,
    },
    charts: {
        patrols: `${domain}/api/users/charts/patrols/v1/`,
        eventsByType: `${domain}/api/users/charts/events/bytype/v1/`,
        eventsPerformance: `${domain}/api/users/charts/events/performance/v1/`,
        eventsPerformanceSubstatus: `${domain}/api/users/charts/events/performance/substatus/v1/`,
        avaregeTimeAttendanceEvent: `${domain}/api/users/charts/events/average/attendances/v1/`,
        eventsAttendance: `${domain}/api/users/charts/events/attendances/v1/`,
        patrolPointsPerformance: `${domain}/api/users/charts/checkpoints/performance/v1/`,
        guardsPerformance: `${domain}/api/users/charts/guards/performance/v1/`,
        localsPerformance: `${domain}/api/users/charts/locals/performance/v1/`,
    },
    systemUsers: {
        changeLanguage: `${domain}/api/users/system/change/language/v1/`,
        delete: `${domain}/api/users/delete/v1/`,
        systemUser: `${domain}/api/users/v1/`,
        formData: `${domain}/api/users/formdata/v1/`,
        login: `${domain}/api/users/system/login/v1/`,
        gencode: `${domain}/api/users/system/password/gencode/v1/`,
        checkCode: `${domain}/api/users/system/password/checkcode/v1/`,
        resetPass: `${domain}/api/users/system/password/change/online/v1/`,
        resetPassNotLog: `${domain}/api/users/system/password/change/v1/`,
        getMe: `${domain}/api/users/me/v1/`,
        ListUserByType: `${domain}/api/users/bytype/v1/`,
        companyUser: {
            search: `${domain}/api/users/system/search/companyuser/v1/`,
        },
        customerUser: {
            search: `${domain}/api/users/system/search/customeruser/v1/`,
            byGuardGroup: `${domain}/api/users/system/search/customeruser/byguardgroup/v1/`,
        },
        checkEmailExist: `${domain}/api/users/check/email/v1/`,
        checkUsernameExist: `${domain}/api/users/check/username/v1/`,
        count: `${domain}/api/generic/count/byfilter/v1/`,
    },
    reports: {
        filter: `${domain}/api/users/reports/filter/v1/`,
        externalFilter: `${domain}/api/users/reports/external/filter/v1/`,
    },
    equipments: {
        equipment: `${domain}/api/company/equipments/v1/`,
        filter: `${domain}/api/company/equipments/filter/v1/`,
        delete: `${domain}/api/company/equipments/delete/v1/`,
    },
    companies: {
        company: `${domain}/api/company/v1/`,
        formData: `${domain}/api/company/formdata/v1/`,
        filter: `${domain}/api/company/filter/v1/`,
        delete: `${domain}/api/company/delete/v1/`,
        externalList: `${domain}/api/company/external/list/v1/`,
        externalLocalList: `${domain}/api/company/external/local/list/v1/`,
        gatewayExternalList: `${domain}/api/helpers/data/external/companies/v1/`,
    },
    incidents: {
        incident: `${domain}/api/company/incidents/v1/`,
        saveMany: `${domain}/api/company/incidents/savemany/v1/`,
        filter: `${domain}/api/company/incidents/filter/v1/`,
        delete: `${domain}/api/company/incidents/delete/v1/`,
    },
    patrolActions: {
        patrolAction: `${domain}/api/users/patrol/actions/v1/`,
        filter: `${domain}/api/users/patrol/actions/filter/v1/`,
        attendanceEvent: `${domain}/api/users/patrol/actions/attendance/v1/`,
    },
    patrolPoints: {
        patrolPoint: `${domain}/api/company/patrolpoints/v1/`,
        saveMany: `${domain}/api/company/patrolpoints/savemany/v1/`,
        filter: `${domain}/api/company/patrolpoints/filter/v1/`,
        delete: `${domain}/api/company/patrolpoints/delete/v1/`,
    },
    guardGroups: {
        guardGroup: `${domain}/api/users/guardgroups/v1/`,
        filter: `${domain}/api/users/guardgroups/filter/v1/`,
        delete: `${domain}/api/users/guardgroups/delete/v1/`,
    },
    siteGroups: {
        siteGroup: `${domain}/api/company/sitegroups/v1/`,
        filter: `${domain}/api/company/sitegroups/filter/v1/`,
        delete: `${domain}/api/company/sitegroups/delete/v1/`,
    },
    clientGroups: {
        clientGroup: `${domain}/api/company/clientgroups/v1/`,
        filter: `${domain}/api/company/clientgroups/filter/v1/`,
        delete: `${domain}/api/company/clientgroups/delete/v1/`,
    },
    reportSettings: {
        reportSetting: `${domain}/api/users/reports/settings/v1/`,
        filter: `${domain}/api/users/reports/settings/filter/v1/`,
        delete: `${domain}/api/users/reports/settings/delete/v1/`,
    },
    logs: {
        filter: `${domain}/api/logs/filter/v1/`,
    },
    integrationLogs: {
        filter: `${domain}/api/logs/integrations/filter/v1/`,
    },
    schedules: {
        filter: `${domain}/api/company/schedules/filter/v1/`,
        schedule: `${domain}/api/company/schedules/v1/`,
        delete: `${domain}/api/company/schedules/delete/v1/`,
        update: `${domain}/api/company/schedules/update/v1/`,
        supervisorySchedule: `${domain}/api/company/schedules/supervisory/v1/`,
        supervisoryUpdate: `${domain}/api/company/schedules/supervisory/update/v1/`,
    },
    cep: {
        find: `${viaCepDomain}`,
    },
    helpers: {
        attendancesTypes: `${domain}/api/helpers/data/events/attendances/types/v1/`,
        reportNames: `${domain}/api/helpers/data/reports/scheduled/types/v1/`,
    },
    location: {
        geolocation: `https://maps.googleapis.com/maps/api/geocode/json?latlng=`,
    },
}
</script>
