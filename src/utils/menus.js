export const COMPANY_MENU = [
    {
        path: '#/settings',
        icon: 'fa fa-cog',
        title: 'str.sidebar.menu.settings',
        roles: ['SUPER_ADMIN_MASTER', 'ADMIN'],
    },
    {
        path: '#/register-data',
        icon: 'fa fa-pencil-alt',
        title: 'str.sidebar.menu.register.data',
        roles: ['SUPER_ADMIN_MASTER', 'ADMIN', 'MANAGER'],
    },
    {
        path: '#/actions-log',
        icon: 'fa fa-file-contract',
        title: 'str.sidebar.menu.actions.log',
        roles: ['SUPER_ADMIN_MASTER', 'ADMIN', 'MANAGER'],
    },
]
