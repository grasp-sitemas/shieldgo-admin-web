<script>
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
        return type === 'ACCOUNT' ? state.$session.get('user')?.account?._id : ''
    },
    getClientId: state => {
        const type = state.$session.get('user')?.client?.type
        return type === 'CLIENT' ? state.$session.get('user')?.client?._id : ''
    },
}
</script>
