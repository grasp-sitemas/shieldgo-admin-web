<script>
import Vue from 'vue'
import VueSession from 'vue-session'

import Companies from '../pages/Company/Company/ListCompany.vue'
import ChangePassword from '../pages/User/ChangePassword/ChangePassword.vue'
import ClientGroup from '../pages/Company/ClientGroup/ListClientGroup.vue'
import Clients from '../pages/Company/Client/ListClient.vue'
import Analysis from '../pages/Dashboard/Analysis/Analysis.vue'
import Performance from '../pages/Dashboard/Performance/Performance.vue'
import GuardGroup from '../pages/User/GuardGroup/ListGuardGroup.vue'
import Incident from '../pages/Company/Incident/ListIncident.vue'
import Log from '../pages/Log/Log.vue'
import Login from '../pages/Login/Login.vue'
import Monitor from '../pages/Monitor/Monitor.vue'
import PageNotFound from '../pages/PageNotFound/PageNotFound.vue'
import PatrolPoint from '../pages/Company/PatrolPoint/PatrolPoint.vue'
import ReportPatrol from '../pages/Reports/Patrol/Patrol/Patrol.vue'
import PatrolNotVisited from '../pages/Reports/Patrol/NotVisited/NotVisited.vue'
import PatrolCompleted from '../pages/Reports/Patrol/Completed/Completed.vue'
import PatrolIncompleted from '../pages/Reports/Patrol/Incompleted/Incompleted.vue'
import Profile from '../pages/User/Profile/Profile.vue'
import RegisterData from '../pages/Company/RegisterData/RegisterData.vue'
import Settings from '../pages/Settings/Settings.vue'
import SiteGroup from '../pages/Company/SiteGroup/ListSiteGroup.vue'
import Sites from '../pages/Company/Site/ListSite.vue'
import VigilantSchedule from '../pages/Schedule/Vigilant/Schedule.vue'
import SupervisorySchedule from '../pages/Schedule/Supervisory/Schedule.vue'
import Timeline from '../pages/Timeline/Timeline.vue'
import User from '../pages/User/User/ListUser.vue'
import Colaborator from '../pages/User/Colaborator/ListColaborator.vue'
import sosAlert from '../pages/Reports/PanicAlert/PanicAlert.vue'
import IncidentReport from '../pages/Reports/Incident/Incident.vue'
import MisssingCallReport from '../pages/Reports/Event/MissedCall/MissedCall.vue'
import SupervisionPatrolReport from '../pages/Reports/Patrol/Supervision/Supervision.vue'
import PatrolPointsReport from '../pages/Reports/PatrolPoints/PatrolPoints.vue'
import PrivacyPolicy from '../pages/PrivacyPolicy/PrivacyPolicy.vue'
import Itinerary from '../pages/Company/Itineraries/ListItineraries.vue'
import IntegrationLogs from '../pages/Integration/Log/Log.vue'
import ReportSettings from '../pages/Reports/Settings/ListReportSettings.vue'
import ReportExternalPatrol from '../pages/Integration/Reports/PerformancePatrol/PerformancePatrol.vue'

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
    {
        path: '/privacy-policy',
        component: PrivacyPolicy,
    },
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
        path: '/dashboard/analysis',
        name: 'dashboard-analysis',
        component: Analysis,
        beforeEnter: (_to, _from, next) => {
            next(checkSession())
        },
    },
    {
        path: '/dashboard/performance',
        name: 'dashboard-performance',
        component: Performance,
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
        path: '/itineraries',
        name: 'itineraries',
        component: Itinerary,
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
        path: '/schedules/vigilant',
        name: 'vigilant-schedule',
        component: VigilantSchedule,
        beforeEnter: (_to, _from, next) => {
            next(checkSession())
        },
    },
    {
        path: '/schedules/supervisory',
        name: 'supervisory-schedule',
        component: SupervisorySchedule,
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
        path: '/timeline/:filterParams',
        name: 'timeline',
        props: true,
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
        path: '/colaborators',
        name: 'colaborators',
        component: Colaborator,
        beforeEnter: (_to, _from, next) => {
            next(checkSession())
        },
    },
    {
        path: '/reports/patrols',
        name: 'reports-patrols',
        component: ReportPatrol,
        beforeEnter: (_to, _from, next) => {
            next(checkSession())
        },
    },
    {
        path: '/reports/patrols/:filterParams',
        name: 'params-reports-patrols',
        props: true,
        component: ReportPatrol,
        beforeEnter: (_to, _from, next) => {
            next(checkSession())
        },
    },
    {
        path: '/reports/patrols/completed',
        name: 'patrols-completed',
        component: PatrolCompleted,
        beforeEnter: (_to, _from, next) => {
            next(checkSession())
        },
    },
    {
        path: '/reports/patrols/completed/:filterParams',
        name: 'patrols-completed',
        props: true,
        component: PatrolCompleted,
        beforeEnter: (_to, _from, next) => {
            next(checkSession())
        },
    },
    {
        path: '/reports/patrols/not-visited',
        name: 'patrols-not-visited',
        component: PatrolNotVisited,
        beforeEnter: (_to, _from, next) => {
            next(checkSession())
        },
    },
    {
        path: '/reports/patrols/not-visited/:filterParams',
        name: 'patrols-not-visited',
        props: true,
        component: PatrolNotVisited,
        beforeEnter: (_to, _from, next) => {
            next(checkSession())
        },
    },
    {
        path: '/reports/patrols/incompleted',
        name: 'patrols-incompleted',
        component: PatrolIncompleted,
        beforeEnter: (_to, _from, next) => {
            next(checkSession())
        },
    },
    {
        path: '/reports/patrols/incompleted/:filterParams',
        name: 'patrols-incompleted',
        props: true,
        component: PatrolIncompleted,
        beforeEnter: (_to, _from, next) => {
            next(checkSession())
        },
    },
    {
        path: '/reports/sos-alert',
        name: 'sos-alert',
        component: sosAlert,
        beforeEnter: (_to, _from, next) => {
            next(checkSession())
        },
    },
    {
        path: '/reports/incident',
        name: 'incident',
        component: IncidentReport,
        beforeEnter: (_to, _from, next) => {
            next(checkSession())
        },
    },
    {
        path: '/reports/missing-call',
        name: 'missing-call',
        component: MisssingCallReport,
        beforeEnter: (_to, _from, next) => {
            next(checkSession())
        },
    },
    {
        path: '/reports/supervision-patrol',
        name: 'supervision-patrol',
        component: SupervisionPatrolReport,
        beforeEnter: (_to, _from, next) => {
            next(checkSession())
        },
    },
    {
        path: '/reports/patrol-points',
        name: 'patrol-points',
        component: PatrolPointsReport,
        beforeEnter: (_to, _from, next) => {
            next(checkSession())
        },
    },
    {
        path: '/reports/settings',
        name: 'reports-settings',
        component: ReportSettings,
        beforeEnter: (_to, _from, next) => {
            next(checkSession())
        },
    },
    {
        path: '/integrations/logs',
        name: 'integrations-logs',
        component: IntegrationLogs,
        beforeEnter: (_to, _from, next) => {
            next(checkSession())
        },
    },
    {
        path: '/integrations/reports/summary-patrol',
        name: 'integrations-reports-summary-patrol',
        component: ReportExternalPatrol,
        beforeEnter: (_to, _from, next) => {
            next(checkSession())
        },
    },
]

export default routes
</script>
