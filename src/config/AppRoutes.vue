<script>
import Vue from 'vue'
import VueSession from 'vue-session'

import Companies from '../pages/Company/Company/Company.vue'
import ChangePassword from '../pages/User/ChangePassword/ChangePassword.vue'
import Clients from '../pages/Company/Client/Client.vue'
import Dashboard from '../pages/Dashboard/Dashboard.vue'
import Login from '../pages/Login/Login.vue'
import PageNotFound from '../pages/PageNotFound/PageNotFound.vue'
import RegisterData from '../pages/Company/RegisterData/RegisterData.vue'
import Settings from '../pages/Settings/Settings.vue'
import Sites from '../pages/Company/Site/Site.vue'
import Schedule from '../pages/Schedule/Schedule.vue'
import User from '../pages/User/User/User.vue'
import Vigilant from '../pages/User/Vigilant/Vigilant.vue'

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
        path: '/register-data',
        name: 'register-data',
        component: RegisterData,
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
        path: '/clients',
        name: 'clients',
        component: Clients,
        beforeEnter: (_to, _from, next) => {
            next(checkSession())
        },
    },
    {
        path: '/change-password',
        name: 'change-password',
        component: ChangePassword,
        beforeEnter: (_to, _from, next) => {
            next(checkSession())
        },
    },
    {
        path: '/settings',
        name: 'settings',
        component: Settings,
        beforeEnter: (_to, _from, next) => {
            next(checkSession())
        },
    },
    {
        path: '/sites',
        name: 'sites',
        component: Sites,
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
    {
        path: '/users',
        name: 'users',
        component: User,
        beforeEnter: (_to, _from, next) => {
            next(checkSession())
        },
    },
    {
        path: '/vigilants',
        name: 'vigilants',
        component: Vigilant,
        beforeEnter: (_to, _from, next) => {
            next(checkSession())
        },
    },
]

export default routes
</script>
