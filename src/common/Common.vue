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
    loadFunctionsElements: () => {
        let $body = $('body')
        let $window = $(window)
        $('.button-menu-mobile').on('click', function (event) {
            event.preventDefault()
            $body.toggleClass('sidebar-enable')
            if ($window.width() >= 768) {
                $body.toggleClass('enlarged')
            } else {
                $body.removeClass('enlarged')
            }
        })
        $(document).on('click', 'body', function (e) {
            if ($(e.target).closest('.right-bar-toggle, .right-bar').length > 0) {
                return
            }
            if ($(e.target).closest('.left-side-menu, .side-nav').length > 0 || $(e.target).hasClass('button-menu-mobile') || $(e.target).closest('.button-menu-mobile').length > 0) {
                return
            }
            $('body').removeClass('right-bar-enabled')
            $('body').removeClass('sidebar-enable')
            return
        })
        $('.navbar-toggle').on('click', function (event) {
            $(this).toggleClass('open')
            $('#navigation').slideToggle(400)
        })
    },
    checkPassword: str => {
        var re = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{6,}$/
        return re.test(str)
    },
    isValidEmail: email => {
        var reg = /^\w+([-+.']\w+)*@\w+([-.]\w+)*\.\w+([-.]\w+)*$/
        if (reg.test(email)) {
            return true
        } else {
            return false
        }
    },
}
</script>
