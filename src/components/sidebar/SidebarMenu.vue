<script>
// define enum for user ROLES
const ROLES = {
    SUPER_ADMIN_MASTER: 'SUPER_ADMIN_MASTER',
    ADMIN: 'ADMIN',
    MANAGER: 'MANAGER',
    OPERATOR: 'OPERATOR',
    AUDITOR: 'AUDITOR',
}

const sidebarMenu = [
    {
        path: '/dashboard',
        icon: 'fa fa-tachometer-alt',
        title: 'str.sidebar.menu.dashboard',
        roles: [ROLES.SUPER_ADMIN_MASTER, ROLES.ADMIN, ROLES.MANAGER, ROLES.AUDITOR],
        children: [
            {
                path: '/dashboard/analysis',
                title: 'str.sidebar.menu.analysis',
                roles: [ROLES.SUPER_ADMIN_MASTER, ROLES.ADMIN, ROLES.MANAGER, ROLES.AUDITOR],
            },
            {
                path: '/dashboard/performance',
                title: 'str.sidebar.menu.performance',
                roles: [ROLES.SUPER_ADMIN_MASTER, ROLES.ADMIN, ROLES.MANAGER, ROLES.AUDITOR],
            },
        ],
    },
    { path: '/monitor', icon: 'fa fa-crosshairs', title: 'str.sidebar.menu.monitor', roles: [ROLES.SUPER_ADMIN_MASTER, ROLES.ADMIN, ROLES.MANAGER, ROLES.OPERATOR] },
    { path: '/companies', icon: 'fa fa-building', title: 'str.sidebar.menu.companies', roles: [ROLES.SUPER_ADMIN_MASTER] },
    { path: '/clients', active: false, icon: 'fa fa-user-tie', title: 'str.sidebar.menu.clients', roles: [ROLES.SUPER_ADMIN_MASTER, ROLES.ADMIN] },
    { path: '/sites', icon: 'fa fa-sitemap', title: 'str.sidebar.menu.sites', roles: [ROLES.SUPER_ADMIN_MASTER, ROLES.ADMIN, ROLES.MANAGER, ROLES.AUDITOR] },
    { path: '/incidents', icon: 'fa fa-person-burst', title: 'str.sidebar.menu.incidents', roles: [ROLES.SUPER_ADMIN_MASTER, ROLES.ADMIN, ROLES.MANAGER, ROLES.AUDITOR] },
    { path: '/users', icon: 'fa fa-users', title: 'str.sidebar.menu.users', roles: [ROLES.SUPER_ADMIN_MASTER, ROLES.ADMIN, ROLES.MANAGER] },
    {
        path: '/colaborators',
        icon: 'fa fa-person-military-pointing',
        title: 'str.sidebar.menu.colaborators',
        roles: [ROLES.SUPER_ADMIN_MASTER, ROLES.ADMIN, ROLES.MANAGER],
    },
    { path: '/patrol-points', icon: 'fa fa-road', title: 'str.sidebar.menu.patrol.points', roles: [ROLES.SUPER_ADMIN_MASTER, ROLES.ADMIN, ROLES.MANAGER, ROLES.OPERATOR, ROLES.AUDITOR] },
    {
        path: '/schedules',
        icon: 'fa fa-calendar',
        title: 'str.sidebar.menu.schedules',
        roles: [ROLES.SUPER_ADMIN_MASTER, ROLES.ADMIN, ROLES.MANAGER, ROLES.AUDITOR],
        children: [
            {
                path: '/schedules/vigilant',
                title: 'str.sidebar.menu.schedule.vigilant',
                roles: [ROLES.SUPER_ADMIN_MASTER, ROLES.ADMIN, ROLES.MANAGER],
            },
            {
                path: '/schedules/supervisory',
                title: 'str.sidebar.menu.schedule.supervision',
                roles: [ROLES.SUPER_ADMIN_MASTER, ROLES.ADMIN, ROLES.MANAGER],
            },
        ],
    },
    {
        path: '/timeline',
        icon: 'fa fa-bars-staggered',
        title: 'str.sidebar.menu.timeline',
        roles: [ROLES.SUPER_ADMIN_MASTER, ROLES.ADMIN, ROLES.MANAGER, ROLES.OPERATOR, ROLES.AUDITOR],
        children: [
            {
                path: '/timeline/schedule-patrols',
                title: 'str.sidebar.menu.timeline.schedule.patrols',
                roles: [ROLES.SUPER_ADMIN_MASTER, ROLES.ADMIN, ROLES.MANAGER, ROLES.OPERATOR, ROLES.AUDITOR],
            },
            {
                path: '/timeline/free-patrols',
                title: 'str.sidebar.menu.timeline.free.patrols',
                roles: [ROLES.SUPER_ADMIN_MASTER, ROLES.ADMIN, ROLES.MANAGER, ROLES.OPERATOR, ROLES.AUDITOR],
            },
        ],
    },
    // { path: '/timeline', icon: 'fa fa-bars-staggered', title: 'str.sidebar.menu.timeline', roles: [ROLES.SUPER_ADMIN_MASTER, ROLES.ADMIN, ROLES.MANAGER, ROLES.OPERATOR, ROLES.AUDITOR] },
    {
        path: '/management',
        icon: 'fa fa-align-left',
        title: 'str.sidebar.menu.management',
        roles: [ROLES.SUPER_ADMIN_MASTER, ROLES.ADMIN, ROLES.MANAGER],
        children: [
            {
                path: '/management/equipments',
                title: 'str.sidebar.menu.equipaments',
                roles: [ROLES.SUPER_ADMIN_MASTER, ROLES.ADMIN, ROLES.MANAGER],
            },
            {
                path: '/management/guard-groups',
                title: 'str.sidebar.menu.guard.groups',
                roles: [ROLES.SUPER_ADMIN_MASTER, ROLES.ADMIN, ROLES.MANAGER],
            },
            {
                path: '/management/site-groups',
                title: 'str.sidebar.menu.site.groups',
                roles: [ROLES.SUPER_ADMIN_MASTER, ROLES.ADMIN, ROLES.MANAGER],
            },
            {
                path: '/management/client-groups',
                title: 'str.sidebar.menu.client.groups',
                roles: [ROLES.SUPER_ADMIN_MASTER, ROLES.ADMIN],
            },
            {
                path: '/management/itineraries',
                title: 'str.sidebar.menu.itineraries',
                roles: [ROLES.SUPER_ADMIN_MASTER, ROLES.ADMIN, ROLES.MANAGER],
            },
        ],
    },
    {
        path: '/reports/patrols',
        icon: 'fa-solid fa-file-contract',
        title: 'str.sidebar.menu.reports',
        roles: [ROLES.SUPER_ADMIN_MASTER, ROLES.ADMIN, ROLES.MANAGER, ROLES.AUDITOR],
        topMenu: false,
        children: [
            {
                path: '/reports/sos-alert',
                title: 'str.sidebar.menu.reports.sos.alert',
                roles: [ROLES.SUPER_ADMIN_MASTER, ROLES.ADMIN, ROLES.MANAGER, ROLES.AUDITOR],
            },
            {
                path: '/reports/missing-call',
                title: 'str.sidebar.menu.reports.missed.calls',
                roles: [ROLES.SUPER_ADMIN_MASTER, ROLES.ADMIN, ROLES.MANAGER, ROLES.AUDITOR],
            },
            {
                path: '/reports/incident',
                title: 'str.sidebar.menu.reports.incidents',
                roles: [ROLES.SUPER_ADMIN_MASTER, ROLES.ADMIN, ROLES.MANAGER, ROLES.AUDITOR],
            },
            {
                path: '/reports/patrols',
                title: 'str.sidebar.menu.reports.patrols',
                roles: [ROLES.SUPER_ADMIN_MASTER, ROLES.ADMIN, ROLES.MANAGER, ROLES.AUDITOR],
            },
            {
                path: '/reports/supervision-patrol',
                title: 'str.sidebar.menu.reports.supervision.patrol',
                roles: [ROLES.SUPER_ADMIN_MASTER, ROLES.ADMIN],
            },
            {
                path: '/reports/patrol-points',
                title: 'str.sidebar.menu.reports.patrol.points',
                roles: [ROLES.SUPER_ADMIN_MASTER, ROLES.ADMIN],
            },
            {
                path: '/reports/settings',
                title: 'str.sidebar.menu.reports.settings',
                roles: [ROLES.SUPER_ADMIN_MASTER, ROLES.ADMIN],
            },
        ],
    },
    {
        path: 'integrations',
        icon: 'fa-solid fa-plug',
        title: 'str.sidebar.menu.integrations',
        roles: [ROLES.SUPER_ADMIN_MASTER, ROLES.ADMIN],
        topMenu: false,
        children: [
            {
                path: '/integrations/reports/summary-patrol',
                title: 'str.sidebar.menu.integrations.reports.summary.patrol',
                roles: [ROLES.SUPER_ADMIN_MASTER, ROLES.ADMIN],
            },
            {
                path: '/integrations/logs',
                title: 'str.sidebar.menu.integrations.logs',
                roles: [ROLES.SUPER_ADMIN_MASTER],
            },
        ],
    },
]

export default sidebarMenu
</script>
