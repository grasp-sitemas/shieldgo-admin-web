<script>
// define enum for user ROLES
const ROLES = {
    SUPER_ADMIN_MASTER: 'SUPER_ADMIN_MASTER',
    ADMIN: 'ADMIN',
    MANAGER: 'MANAGER',
    OPERATOR: 'OPERATOR',
}

const sidebarMenu = [
    { path: '/dashboard', icon: 'fa fa-tachometer-alt', title: 'str.sidebar.menu.dashboard', roles: [ROLES.SUPER_ADMIN_MASTER, ROLES.ADMIN, ROLES.MANAGER] },
    { path: '/monitor', icon: 'fa fa-crosshairs', title: 'str.sidebar.menu.monitor', roles: [ROLES.SUPER_ADMIN_MASTER, ROLES.ADMIN, ROLES.MANAGER, ROLES.OPERATOR] },
    { path: '/companies', icon: 'fa fa-building', title: 'str.sidebar.menu.companies', roles: [ROLES.SUPER_ADMIN_MASTER] },
    { path: '/clients', active: false, icon: 'fa fa-user-tie', title: 'str.sidebar.menu.clients', roles: [ROLES.SUPER_ADMIN_MASTER, ROLES.ADMIN] },
    { path: '/sites', icon: 'fa fa-sitemap', title: 'str.sidebar.menu.sites', roles: [ROLES.SUPER_ADMIN_MASTER, ROLES.ADMIN, ROLES.MANAGER] },
    { path: '/patrol-points', icon: 'fa fa-road', title: 'str.sidebar.menu.patrol.points', roles: [ROLES.SUPER_ADMIN_MASTER, ROLES.ADMIN, ROLES.MANAGER, ROLES.OPERATOR] },
    { path: '/incidents', icon: 'fa fa-person-burst', title: 'str.sidebar.menu.incidents', roles: [ROLES.SUPER_ADMIN_MASTER, ROLES.ADMIN, ROLES.MANAGER] },
    { path: '/vigilants', icon: 'fa fa-person-military-pointing', title: 'str.sidebar.menu.vigilants', roles: [ROLES.SUPER_ADMIN_MASTER, ROLES.ADMIN, ROLES.MANAGER] },
    // { path: '/guard-groups', icon: 'fa fa-people-group', title: 'str.sidebar.menu.guard.groups', roles: [ROLES.SUPER_ADMIN_MASTER, ROLES.ADMIN, ROLES.MANAGER] },
    { path: '/schedules', icon: 'fa fa-calendar', title: 'str.sidebar.menu.schedules', roles: [ROLES.SUPER_ADMIN_MASTER, ROLES.ADMIN, ROLES.MANAGER] },
    { path: '/timeline', icon: 'fa fa-bars-staggered', title: 'str.sidebar.menu.timeline', roles: [ROLES.SUPER_ADMIN_MASTER, ROLES.ADMIN, ROLES.MANAGER, ROLES.OPERATOR] },
    { path: '/users', icon: 'fa fa-users', title: 'str.sidebar.menu.users', roles: [ROLES.SUPER_ADMIN_MASTER, ROLES.ADMIN, ROLES.MANAGER] },
    {
        path: '/groups',
        icon: 'fa fa-align-left',
        title: 'str.sidebar.menu.group.management',
        roles: [ROLES.SUPER_ADMIN_MASTER, ROLES.ADMIN, ROLES.MANAGER],
        children: [
            {
                path: '/groups/guards',
                title: 'str.sidebar.menu.guard.groups',
                roles: [ROLES.SUPER_ADMIN_MASTER, ROLES.ADMIN, ROLES.MANAGER],
            },
            {
                path: '/groups/sites',
                title: 'str.sidebar.menu.site.groups',
                roles: [ROLES.SUPER_ADMIN_MASTER, ROLES.ADMIN, ROLES.MANAGER],
            },
            {
                path: '/groups/clients',
                title: 'str.sidebar.menu.client.groups',
                roles: [ROLES.SUPER_ADMIN_MASTER, ROLES.ADMIN],
            },
        ],
    },
    {
        path: '/reports/patrols',
        icon: 'fa-solid fa-file-contract',
        title: 'str.sidebar.menu.reports',
        roles: [ROLES.SUPER_ADMIN_MASTER, ROLES.ADMIN, ROLES.MANAGER],
        topMenu: true,
        label: 'str.sidebar.menu.new',
        children: [
            {
                path: '/reports/patrols/completed',
                title: 'str.sidebar.menu.reports.completed.patrols',
                roles: [ROLES.SUPER_ADMIN_MASTER, ROLES.ADMIN, ROLES.MANAGER],
            },

            {
                path: '/reports/patrols/incompleted',
                title: 'str.sidebar.menu.reports.not.completed.patrols',
                roles: [ROLES.SUPER_ADMIN_MASTER, ROLES.ADMIN, ROLES.MANAGER],
            },
            {
                path: '/reports/patrols/not-visited',
                title: 'str.sidebar.menu.reports.patrols.not-visited',
                roles: [ROLES.SUPER_ADMIN_MASTER, ROLES.ADMIN, ROLES.MANAGER],
            },
            {
                path: '/reports/missing-call',
                title: 'str.sidebar.menu.reports.missed.calls',
                roles: [ROLES.SUPER_ADMIN_MASTER, ROLES.ADMIN, ROLES.MANAGER],
            },
            {
                path: '/reports/sos-alert',
                title: 'str.sidebar.menu.reports.sos.alert',
                roles: [ROLES.SUPER_ADMIN_MASTER, ROLES.ADMIN, ROLES.MANAGER],
            },
            {
                path: '/reports/incident',
                title: 'str.sidebar.menu.reports.incidents',
                roles: [ROLES.SUPER_ADMIN_MASTER, ROLES.ADMIN, ROLES.MANAGER],
            },
        ],
    },
]

export default sidebarMenu
</script>
