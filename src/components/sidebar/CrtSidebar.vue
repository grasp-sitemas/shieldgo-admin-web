<script>
import Endpoints from '../../common/Endpoints.vue'

export default {
    init: payload => {
        payload.user = payload.$session.get('user')
        payload.domain = Endpoints.domain
        payload.valuekey += 1
    },
    methods: {
        expand: function () {
            this.stat = this.stat == 'expand' ? 'collapse' : 'expand'
        },
        getCompanyName: function () {
            const subtype = this?.user?.companyUser?.subtype
            if (subtype === 'SUPER_ADMIN_MASTER' || subtype === 'ADMIN_MASTER') {
                return this?.user?.company?.name
            } else if (subtype === 'ADMIN') {
                return this?.user?.account?.name
            } else if (subtype === 'MANAGER') {
                return this?.user?.client?.name
            } else if (subtype === 'OPERATOR') {
                return this?.user?.site?.name
            }
            return ''
        },
        handleShowFloatSubmenu: function (menu, offset) {
            this.$emit('show-float-submenu', menu, offset)
        },
        handleHideFloatSubmenu: function () {
            this.$emit('hide-float-submenu')
        },
        handleCollapseOther: function (menu) {
            for (var i = 0; i < this.menus.length; i++) {
                this.$refs.sidebarNavList[i].collapse(menu)
            }
        },
        handleSidebarMinify: function () {
            this.appOptions.appSidebarMinified = !this.appOptions.appSidebarMinified
        },
        handleSidebarFilter: function (e) {
            var value = e.target.value
            value = value.toLowerCase()

            if (value) {
                for (var x = 0; x < this.menus.length; x++) {
                    var title = this.menus[x].title.toLowerCase()
                    var children = this.menus[x].children

                    if (title.search(value) > -1) {
                        this.$refs.sidebarNavList[x].show()

                        if (children) {
                            this.$refs.sidebarNavList[x].searchExpand()
                        }
                    } else {
                        if (children) {
                            var hasActive = false
                            for (var y = 0; y < children.length; y++) {
                                var title2 = children[y].title.toLowerCase()

                                if (title2.search(value) > -1) {
                                    hasActive = true
                                    this.$refs.sidebarNavList[x].$refs.sidebarNavList[y].show()
                                    this.$refs.sidebarNavList[x].searchExpand()
                                } else {
                                    if (hasActive) {
                                        this.$refs.sidebarNavList[x].searchExpand()
                                    } else {
                                        this.$refs.sidebarNavList[x].hide()
                                    }
                                    this.$refs.sidebarNavList[x].$refs.sidebarNavList[y].hide()
                                }
                            }
                        } else {
                            this.$refs.sidebarNavList[x].hide()
                        }
                    }
                }
            } else {
                for (var a = 0; a < this.menus.length; a++) {
                    this.$refs.sidebarNavList[a].show()

                    var submenu = this.menus[a].children
                    if (submenu) {
                        for (var b = 0; b < submenu.length; b++) {
                            this.$refs.sidebarNavList[a].$refs.sidebarNavList[b].show()
                        }
                    }
                }
            }
            console.log('------')
        },
        applyMenuRole: function (state) {
            const role = state?.user?.companyUser?.subtype
            if (role !== 'SUPER_ADMIN_MASTER' && role !== 'ADMIN_MASTER') {
                state.menus = state.menus.filter(menu => menu?.path !== '/companies')
            }
        },
    },
}
</script>