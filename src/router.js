import Vue from 'vue'
import Router from 'vue-router'
import User from './views/User/User.vue'
import CrudUser from './views/User/Crud/User.vue'
import ChangeEmail from './views/User/ChangeEmail/ChangeEmail.vue'
import ChangePassword from './views/User/ChangePassword/ChangePassword.vue'
import ListUser from './views/User/List/User.vue'
import ListCompany from './views/Company/List/Company.vue'
import Login from './views/Login/Login.vue'
import Logout from './views/Logout/Logout.vue'
import Dashboard from './views/Dashboard/Dashboard.vue'
import Hubs from './views/Hub/Hub.vue'
import Signals from './views/Signal/Signal.vue'
import CollectPev from './views/CollectPev/Collect.vue'
import CollectRollon from './views/CollectRollon/Collect.vue'
import CollectTricycle from './views/CollectTricycle/Collect.vue'
import Points from './views/Point/Point.vue'
import PointHubs from './views/PointHub/Point.vue'
import Maps from './views/Map/Map.vue'
import Deposit from './views/Deposit/Deposit.vue'
import Project from './views/Project/Project.vue'


//SHIELDS
import Schedule from './views/Schedule/Schedule.vue'

import VueSession from 'vue-session'//https://github.com/victorsferreira/vue-session
Vue.use(VueSession)
Vue.use(Router)

const session = Vue.prototype.$session

const checkSession = () => {
  let isUser = session.exists('user')
  let isToken = session.exists('token')
  if (!isUser || !isToken) {
    session.destroy()
    return '/'//redirect to login page
  } else {
    return
  }

}

export default new Router({
  routes: [
    {
      path: '/',
      name: 'login',
      component: Login
    },
    {
      path: '/logout',
      name: 'logout',
      component: Logout
    },
    {
      path: '/users',
      name: 'users',
      component: User
    },
    {
      path: '/list-user',
      name: 'list-user',
      component: ListUser,
      beforeEnter: (to, from, next) => {
        next(checkSession())
      }
    },
    {
      path: '/list-company',
      name: 'list-company',
      component: ListCompany,
      beforeEnter: (to, from, next) => {
        next(checkSession())
      }
    },
    {
      path: '/dashboard',
      name: 'dashboard',
      component: Dashboard,
      beforeEnter: (to, from, next) => {
        next(checkSession())
      }

    },
    {
      path: '/crud-user',
      name: 'crud-user',
      component: CrudUser,
      beforeEnter: (to, from, next) => {
        next(checkSession())
      }
    },
    {
      path: '/change-email',
      name: 'change-email',
      component: ChangeEmail,
      beforeEnter: (to, from, next) => {
        next(checkSession())
      }
    },
    {
      path: '/change-password',
      name: 'change-password',
      component: ChangePassword,
      beforeEnter: (to, from, next) => {
        next(checkSession())
      }
    },
    {
      path: '/schedule',
      name: 'schedule',
      component: Schedule,
      beforeEnter: (to, from, next) => {
        next(checkSession())
      }
    },
    {
      path: '/projects',
      name: 'projects',
      component: Project,
      beforeEnter: (to, from, next) => {
        next(checkSession())
      }
    },
    {
      path: '/signals',
      name: 'signals',
      component: Signals,
      beforeEnter: (to, from, next) => {
        next(checkSession())
      }
    },
    {
      path: '/collects-pev',
      name: 'collects-pev',
      component: CollectPev,
      beforeEnter: (to, from, next) => {
        next(checkSession())
      }
    },
    {
      path: '/collects-rollon',
      name: 'collects-rollon',
      component: CollectRollon,
      beforeEnter: (to, from, next) => {
        next(checkSession())
      }
    },
    {
      path: '/collects-tricycle',
      name: 'collects-tricycle',
      component: CollectTricycle,
      beforeEnter: (to, from, next) => {
        next(checkSession())
      }
    },
    {
      path: '/points',
      name: 'points',
      component: Points,
      beforeEnter: (to, from, next) => {
        next(checkSession())
      }
    },
    {
      path: '/point-hubs',
      name: 'point-hubs',
      component: PointHubs,
      beforeEnter: (to, from, next) => {
        next(checkSession())
      }
    },
    {
      path: '/maps',
      name: 'maps',
      component: Maps,
      beforeEnter: (to, from, next) => {
        next(checkSession())
      }
    },
    {
      path: '/deposits',
      name: 'deposits',
      component: Deposit,
      beforeEnter: (to, from, next) => {
        next(checkSession())
      }
    },

  ]
})
