<script>
// const domain = 'https://api-gateway-shield.herokuapp.com'
const domain = 'http://localhost:3000'
const viaCepDomain = 'https://viacep.com.br/ws/'

export default {
    domain: domain,
    appointments: {
        filter: `${domain}/api/company/appointments/filter/v1/`,
        appointment: `${domain}/api/company/appointments/v1/`,
        delete: `${domain}/api/company/appointments/delete/v1/`,
        cancelSeries: `${domain}/api/company/appointments/cancel/series/v1/`,
        cancelOccurrence: `${domain}/api/company/appointments/cancel/occurrence/v1/`,
    },
    addresses: {
        address: `${domain}/api/address/v1/`,
        geolocation: `${domain}/api/address/geo/v1/`,
    },
    events: {
        filter: `${domain}/api/company/events/filter/v1/`,
        event: `${domain}/api/company/events/v1/`,
        delete: `${domain}/api/company/events/delete/v1/`,
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
        count: `${domain}/api/generic/count/byfilter/v1/`,
    },
    companies: {
        company: `${domain}/api/company/v1/`,
        formData: `${domain}/api/company/formdata/v1/`,
        filter: `${domain}/api/company/filter/v1/`,
        delete: `${domain}/api/company/delete/v1/`,
    },
    incidents: {
        incident: `${domain}/api/company/incidents/v1/`,
        saveMany: `${domain}/api/company/incidents/savemany/v1/`,
        filter: `${domain}/api/company/incidents/filter/v1/`,
        delete: `${domain}/api/company/incidents/delete/v1/`,
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
    logs: {
        filter: `${domain}/api/logs/filter/v1/`,
    },
    schedules: {
        filter: `${domain}/api/company/schedules/filter/v1/`,
        schedule: `${domain}/api/company/schedules/v1/`,
        delete: `${domain}/api/company/schedules/delete/v1/`,
    },
    cep: {
        find: `${viaCepDomain}`,
    },
    helpers: {
        companyType: `${domain}/api/helpers/data/company/types/v1/`,
    },
    location: {
        geolocation: `https://maps.googleapis.com/maps/api/geocode/json?latlng=`,
    },
}
</script>
