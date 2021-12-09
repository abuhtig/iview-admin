import Main from '@/components/main'
export default [
  {
    path: '/article',
    name: 'article_manage',
    meta: {
      icon: 'logo-buffer',
      title: '文章管理'
    },
    component: Main,
    children: [
      {
        path: '/content',
        name: 'content_manage',
        meta: {
          icon: 'md-grid',
          title: '内容管理'
        },
        component: () => import('@/view/content/content_manage.vue')
      },
      {
        path: '/label',
        name: 'label_manage',
        meta: {
          icon: 'md-grid',
          title: '标签管理'
        },
        component: () => import('@/view/content/label_manage.vue')
      }
    ]
  },
  {
    path: '/user',
    name: 'user',
    meta: {
      icon: 'logo-buffer',
      title: '用户管理'
    },
    component: Main,
    children: [
      {
        path: '/index',
        name: 'user_manage',
        meta: {
          icon: 'md-grid',
          title: '用户管理'
        },
        component: () => import('@/view/user/index.vue')
      }
    ]
  }
]
