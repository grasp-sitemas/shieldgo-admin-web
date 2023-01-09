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
    { path: '/guard-groups', icon: 'fa fa-people-group', title: 'str.sidebar.menu.guard.groups', roles: [ROLES.SUPER_ADMIN_MASTER, ROLES.ADMIN, ROLES.MANAGER] },
    { path: '/schedules', icon: 'fa fa-calendar', title: 'str.sidebar.menu.schedules', roles: [ROLES.SUPER_ADMIN_MASTER, ROLES.ADMIN, ROLES.MANAGER] },
    { path: '/timeline', icon: 'fa fa-bars-staggered', title: 'str.sidebar.menu.timeline', roles: [ROLES.SUPER_ADMIN_MASTER, ROLES.ADMIN, ROLES.MANAGER, ROLES.OPERATOR] },
    { path: '/users', icon: 'fa fa-users', title: 'str.sidebar.menu.users', roles: [ROLES.SUPER_ADMIN_MASTER, ROLES.ADMIN, ROLES.MANAGER] },
    // {
    //     path: '/menu',
    //     icon: 'fa fa-align-left',
    //     title: 'Menu Level',
    //     children: [
    //         {
    //             path: '/menu/menu-1-1',
    //             title: 'Menu 1.1',
    //             children: [
    //                 {
    //                     path: '/menu/menu-1-1/menu-2-1',
    //                     title: 'Menu 2.1',
    //                     children: [
    //                         { path: '/menu/menu-1-1/menu-2-1/menu-3-1', title: 'Menu 3.1' },
    //                         { path: '/menu/menu-1-1/menu-2-1/menu-3-2', title: 'Menu 3.2' },
    //                     ],
    //                 },
    //                 { path: '/menu/menu-1-1/menu-2-2', title: 'Menu 2.2' },
    //                 { path: '/menu/menu-1-1/menu-2-3', title: 'Menu 2.3' },
    //             ],
    //         },
    //         { path: '/menu/menu-1-2', title: 'Menu 1.2' },
    //         { path: '/menu/menu-1-3', title: 'Menu 1.3' },
    //     ],
    // },
]

export default sidebarMenu
</script>
