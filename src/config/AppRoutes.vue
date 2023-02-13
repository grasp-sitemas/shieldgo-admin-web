<script>
import Vue from 'vue'
import VueSession from 'vue-session'

import Companies from '../pages/Company/Company/ListCompany.vue'
import ChangePassword from '../pages/User/ChangePassword/ChangePassword.vue'
import ClientGroup from '../pages/Company/ClientGroup/ClientGroup.vue'
import Clients from '../pages/Company/Client/Client.vue'
import Dashboard from '../pages/Dashboard/Dashboard.vue'
import GuardGroup from '../pages/User/GuardGroup/GuardGroup.vue'
import Incident from '../pages/Company/Incident/Incident.vue'
import Log from '../pages/Log/Log.vue'
import Login from '../pages/Login/Login.vue'
import Monitor from '../pages/Monitor/Monitor.vue'
import PageNotFound from '../pages/PageNotFound/PageNotFound.vue'
import PatrolPoint from '../pages/Company/PatrolPoint/PatrolPoint.vue'
import Profile from '../pages/User/Profile/Profile.vue'
import RegisterData from '../pages/Company/RegisterData/RegisterData.vue'
import Settings from '../pages/Settings/Settings.vue'
import SiteGroup from '../pages/Company/SiteGroup/SiteGroup.vue'
import Sites from '../pages/Company/Site/Site.vue'
import Schedule from '../pages/Schedule/Schedule.vue'
import Timeline from '../pages/Timeline/Timeline.vue'
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
        path: '/actions-log',
        name: 'actions-log',
        component: Log,
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
        path: '/groups/clients',
        name: 'client-groups',
        component: ClientGroup,
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
        path: '/dashboard',
        name: 'dashboard',
        component: Dashboard,
        beforeEnter: (_to, _from, next) => {
            next(checkSession())
        },
    },
    {
        path: '/groups/guards',
        name: 'guard-groups',
        component: GuardGroup,
        beforeEnter: (_to, _from, next) => {
            next(checkSession())
        },
    },
    {
        path: '/incidents',
        name: 'incidents',
        component: Incident,
        beforeEnter: (_to, _from, next) => {
            next(checkSession())
        },
    },
    {
        path: '/monitor',
        name: 'monitor',
        component: Monitor,
        beforeEnter: (_to, _from, next) => {
            next(checkSession())
        },
    },
    {
        path: '/patrol-points',
        name: 'patrol-points',
        component: PatrolPoint,
        beforeEnter: (_to, _from, next) => {
            next(checkSession())
        },
    },
    {
        path: '/profile',
        name: 'profile',
        component: Profile,
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
        path: '/groups/sites',
        name: 'site-groups',
        component: SiteGroup,
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
        path: '/timeline',
        name: 'timeline',
        component: Timeline,
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
