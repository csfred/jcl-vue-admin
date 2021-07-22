import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router)

/* Layout */
import Layout from '@/layout'

export const constantRoutes = [
  {
    path: '/login',
    component: () => import('@/views/login/index'),
    hidden: true
  },

  {
    path: '/404',
    component: () => import('@/views/404'),
    hidden: true
  },

  {
    path: '/',
    component: Layout,
    redirect: '/index',
    children: [
      {
        path: 'index',
        name: 'Index',
        root: true,
        component: () => import('@/views/stationInfo/index'),
        meta: { title: '工作台' }
      }
    ]
  },
  // 站点基本信息
  {
    path: '/station',
    component: Layout,
    redirect: '/order/index',
    // name: 'site',
    meta: { title: '站点基本数据' },
    children: [
      {
        path: 'index',
        name: 'site-menu',
        component: () => import('@/views/stationInfo/index'),
        meta: { title: '站点展示' },
      },{
        path: 'updateStation',
        name: 'site-menu2',
        component: () => import('@/views/stationInfo/updateStation'),
        meta: { title: '站点编辑' }
      },
      // 新建站点
      {
        path: 'addStation',
        name: 'site-menu3',
        component: () => import('@/views/stationInfo/addStation'),
      },
      // 编辑站点 
      {
        path: 'updateStation',
        name: 'site-menu4',
        component: () => import('@/views/stationInfo/updateStation'),
      }
    ]
  },  
  // 设备基本信息
  {
    path: '/machine',
    component: Layout,
    meta: { title: '站点设备信息' },
    children: [
      {
        path: 'index',
        name: 'machine-menu',
        component: () => import('@/views/machine/index'),
        meta: { title: '设备展示' },
      },
      {
        path: 'addMachine',
        name: 'machine-menu2',
        component: () => import('@/views/machine/addMachine'),
        meta: { title: '设备添加' },
      },
      {
        path: 'editMachine',
        name: 'machine-menu3',
        component: () => import('@/views/machine/editMachine'),
        meta: { title: '设备编辑' },
      }          
    ]
  },


  // 404 page must be placed at the end !!!
  { path: '*', redirect: '/404', hidden: true }
]

const createRouter = () => new Router({
  // mode: 'history', // require service support
  scrollBehavior: () => ({ y: 0 }),
  routes: constantRoutes
})

const router = createRouter()

// Detail see: https://github.com/vuejs/vue-router/issues/1234#issuecomment-357941465
export function resetRouter() {
  const newRouter = createRouter()
  router.matcher = newRouter.matcher // reset router
}

export default router
