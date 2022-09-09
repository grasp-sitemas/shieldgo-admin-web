<script>
const domain = 'https://api-gateway-shield.herokuapp.com'
// const domain = 'http://localhost:3000'
const viaCepDomain = 'https://viacep.com.br/ws/'

export default {
    domain: domain,
    addresses: {
        address: `${domain}/api/address/v1/`,
        geolocation: `${domain}/api/address/geo/v1/`,
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
        },
        count: `${domain}/api/generic/count/byfilter/v1/`,
    },
    companies: {
        company: `${domain}/api/company/v1/`,
        formData: `${domain}/api/company/formdata/v1/`,
        filter: `${domain}/api/company/filter/v1/`,
        delete: `${domain}/api/company/delete/v1/`,
    },
    projects: {
        project: `${domain}/api/projects/v1/`,
        archive: `${domain}/api/projects/v1/`,
        filter: `${domain}/api/projects/search/v1/`,
    },
    hubs: {
        hub: `${domain}/api/hubs/v1/`,
        filter: `${domain}/api/hubs/search/v1/`,
    },
    signals: {
        signal: `${domain}/api/hubs/signal/v1/`,
        filter: `${domain}/api/hubs/signal/search/v1/`,
    },
    collects: {
        collect: `${domain}/api/collects/v1/`,
        filter: `${domain}/api/collects/search/v1/`,
        delete: `${domain}/api/collects/delete/v1/`,
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
    points: {
        point: `${domain}/api/points/v1/`,
        filter: `${domain}/api/points/search/v1/`,
    },
    pointHubs: {
        pointHub: `${domain}/api/point-hubs/v1/`,
        filter: `${domain}/api/point-hubs/search/v1/`,
    },
    deposits: {
        filter: `${domain}/api/deposits/search/v1/`,
        deposit: `${domain}/api/deposits/v1/`,
    },
    pointCollects: {
        pointCollect: `${domain}/api/points/v1/`,
        filter: `${domain}/api/points/search/v1/`,
    },
}
</script>
