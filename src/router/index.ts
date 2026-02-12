import type { RouteRecordRaw } from 'vue-router'
import { createRouter, createWebHistory } from 'vue-router'

const routes: Array<RouteRecordRaw> = [
  {
    path: '/',
    name: 'Home',
    component: () => import('@/views/Home.vue'),
    meta: {
      title: '首页'
    }
  },
  {
    path: '/ticket',
    name: 'Ticket',
    component: () => import('@/views/ticket/index.vue'),
    meta: {
      title: '票卷'
    }
  },
  {
    path: '/check-in',
    name: 'CheckIn',
    component: () => import('@/views/checkin/CheckIn.vue'),
    meta: {
      title: '每日签到'
    }
  },
  {
    path: '/check-in/detail',
    name: 'CheckInDetail',
    component: () => import('@/views/checkin/CheckInDetail.vue'),
    meta: {
      title: '签到详情'
    }
  }
]

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes
})

// 路由守卫
router.beforeEach((to, from, next) => {
  if (to.meta.title) {
    document.title = to.meta.title as string
  }
  next()
})

export default router
