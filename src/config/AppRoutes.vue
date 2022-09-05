<script>
import Vue from 'vue'
import VueSession from 'vue-session'

import Companies from '../pages/Company/Company/Company.vue'
import Dashboard from '../pages/Dashboard/Dashboard.vue'
import Schedule from '../pages/Schedule/Schedule.vue'
import Login from '../pages/Login/Login.vue'
import PageNotFound from '../pages/PageNotFound/PageNotFound.vue'

Vue.use(VueSession)

const session = Vue.prototype.$session

const checkSession = () => {
    let isUser = session.exists('user')
    let isToken = session.exists('token')
    if (!isUser || !isToken) {
        session.destroy()
        return '/'
    } else {
        return
    }
}

const routes = [
    { path: '/', component: Login },
    { path: '/404', component: PageNotFound },
    { path: '*', redirect: '/404' },
    {
        path: '/dashboard',
        name: 'dashboard',
        component: Dashboard,
        beforeEnter: (_to, _from, next) => {
            next(checkSession())
        },
    },
    {
        path: '/companies',
        name: 'companies',
        component: Companies,
        beforeEnter: (_to, _from, next) => {
            next(checkSession())
        },
    },
    {
        path: '/schedules',
        name: 'schedules',
        component: Schedule,
        beforeEnter: (_to, _from, next) => {
            next(checkSession())
        },
    },
]

export default routes
</script>
