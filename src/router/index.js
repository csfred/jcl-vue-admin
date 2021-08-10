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
    meta: { title: '站点信息' },
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
  // 设备信息
  {
    path: '/machine',
    component: Layout,
    meta: { title: '设备信息' },
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
      }        
    ]
  },
  // 水质信息
  {
    path: '/water',
    component: Layout,
    redirect: '/order/index',
    meta: { title: '水质信息' },
    children: [
      {
        path: 'water',
        name: 'water-msg',
        component: () => import('@/views/sys/member/member'),
        meta: { title: '水质信息' },
      },
    ]
  }, 
  // 监控信息
  {
    path: '/monitoring',
    component: Layout,
    meta: { title: '监控信息' },
    children: [
      {
        path: 'monitoringconf',
        name: 'monitoringConf',
        component: () => import('@/views/monitoring/monitoringConf/index'),
        meta: { title: '监控基本配置' }
      },
      {
        path: 'leCheng',
        name: 'leCheng',
        component: () => import('@/views/monitoring/monitoringConf/leCheng'),
        meta: { title: '乐橙云配置' },
        hidden: true
      },
      {
        path: 'yingShi',
        name: 'yingShi',
        component: () => import('@/views/monitoring/monitoringConf/yingShi'),
        meta: { title: '萤石云配置' },
        hidden: true
      },
      {
        path: 'monitoringview',
        name: 'monitoringView',
        component: () => import('@/views/monitoring/monitoringView/index'),
        meta: { title: '监控视频画面' }
      }
    ]
  },
  // 巡检管理
  {
    path: '/patrol',
    component: Layout,
    redirect: '/order/index',
    meta: { title: '巡检管理' },
    children: [
      {
        path: 'setup',
        name: 'patrol-setup',
        component: () => import('@/views/patrol/setup/setup'),
        meta: { title: '巡检设置' },
      },{
        path: 'plan',
        name: 'patrol-plan',
        component: () => import('@/views/patrol/plan/plan'),
        meta: { title: '巡检计划' }
      },{
        path: 'record',
        name: 'patrol-record',
        component: () => import('@/views/patrol/record/record'),
        meta: { title: '巡检记录' }
      },
    ]
  }, 
  // 预警管理
  {
    path: '/warning',
    component: Layout,
    redirect: '/order/index',
    meta: { title: '预警管理' },
    children: [
      {
        path: 'warning1',
        name: 'warning-setup',
        component: () => import('@/views/warning/setup/setup'),
        meta: { title: '预警设置' },
      },
      {
        path: 'warning2',
        name: 'warning-msg',
        component: () => import('@/views/sys/member/member'),
        meta: { title: '预警消息' },
      },
      {
        path: 'warning3',
        name: 'warning-report',
        component: () => import('@/views/sys/member/member'),
        meta: { title: '预警报表' },
      }
    ]
  }, 
  // 报表中心
  {
    path: '/report',
    component: Layout,
    redirect: '/order/index',
    meta: { title: '报表中心' },
    children: [
      {
        path: 'report',
        name: 'patrol-report',
        component: () => import('@/views/sys/member/member'),
        meta: { title: '报表中心' },
      },
    ]
  }, 
  // 系统管理
  {
    path: '/sys',
    component: Layout,
    redirect: '/order/index',
    meta: { title: '系统管理' },
    children: [
      {
        path: 'sys',
        name: 'patrol-member',
        component: () => import('@/views/sys/member/member'),
        meta: { title: '账号管理' },
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
