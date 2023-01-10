<script>
const moment = require('moment')

export default {
    camelize: text => {
        if (text) {
            const words = text.split(' ')
            const result = []
            words.slice(0).forEach(word => result.push(`${word.slice(0, 1).toUpperCase()}${word.slice(1).toLowerCase()}`))
            return result.join(' ')
        }
        return ''
    },
    toUpperCase: text => {
        if (text) {
            return text.toString().toUpperCase()
        }
        return ''
    },
    formatDecimal: text => {
        return parseFloat(Math.round(text * 100) / 100)
            .toFixed(2)
            .toString()
            .split(',')
            .join('')
            .split('.')
            .join(',')
    },
    formatDate: text => {
        return new Date(text).toLocaleDateString()
    },
    formatDateTime: text => {
        const dateTimezone = moment(text).utc(true)
        const formattedDate = dateTimezone.format('DD/MM/YYYY')
        const formattedTime = dateTimezone.format('HH:mm')

        return formattedDate + ' - ' + formattedTime
    },
    checkValidDate: function (date) {
        const currentDate = moment().format('DD-MM-YYYY')
        return moment(date).isSameOrAfter(currentDate)
    },
    compareDates: function (d1, d2) {
        let date1 = new Date(d1).getTime()
        let date2 = new Date(d2).getTime()

        if (date1 < date2) {
            return false
        } else if (date1 > date2) {
            return true
        } else {
            return true
        }
    },
    checkPassword: str => {
        var re = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{6,}$/
        return re.test(str)
    },
    isValidEmail: email => {
        var res = /^\w+([-+.']\w+)*@\w+([-.]\w+)*\.\w+([-.]\w+)*$/
        return res.test(email)
    },
    show(vue, group, type, title) {
        const text = `${vue.$t('str.date.subtitle')}: ${new Date().toLocaleString('pt-br')}`
        vue.$notify({
            group,
            title,
            text: text,
            type,
        })
    },
    isSuperAdminMaster: state => {
        return state.$session.get('user')?.companyUser?.subtype === 'SUPER_ADMIN_MASTER' ? true : false
    },
    isAdmin: state => {
        return state.$session.get('user')?.companyUser?.subtype === 'ADMIN' ? true : false
    },
    isManager: state => {
        return state.$session.get('user')?.companyUser?.subtype === 'MANAGER' ? true : false
    },
    isOperator: state => {
        return state.$session.get('user')?.companyUser?.subtype === 'OPERATOR' ? true : false
    },
    getAccountId: state => {
        const type = state.$session.get('user')?.account?.type
        return type === 'ACCOUNT' && state.$session.get('user')?.account ? state.$session.get('user')?.account?._id : ''
    },
    getClientId: state => {
        const type = state.$session.get('user')?.client?.type
        return type === 'CLIENT' && state.$session.get('user')?.client ? state.$session.get('user')?.client?._id : ''
    },
    getEventStatusName(status) {
        switch (status) {
            case 'ACTIVE':
                return 'str.event.status.pendent'
            case 'CANCELED':
                return 'str.event.status.canceled'
            case 'DONE':
                return 'str.event.status.done'
            case 'EXPIRED':
                return 'str.event.status.expired'
            case 'FINISHED':
                return 'str.event.status.finished'
            case 'PENDENT':
                return 'str.event.status.pendent'
            case 'IN_PROGRESS':
                return 'str.event.status.in_progress'

            default:
                return ''
        }
    },
    formatDateAndTime(date) {
        return moment(date).utc(true).format('DD/MM/YYYY HH:mm:ss')
    },
    checkCPF: str => {
        /* eslint-disable */
        var re = /^\d{3}\.\d{3}\.\d{3}\-\d{2}$/
        return re.test(str)
    },
    checkCNPJ: str => {
        /* eslint-disable */
        var re = /^\d{2}\.\d{3}\.\d{3}\/\d{4}\-\d{2}$/
        return re.test(str)
    },
}
</script>
