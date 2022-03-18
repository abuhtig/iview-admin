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
          icon: 'md-contacts',
          title: '用户管理'
        },
        component: () => import('@/view/user/index.vue')
      }
    ]
  },
  {
    path: '/menu',
    name: 'menu',
    meta: {
      icon: 'md-menu',
      title: '菜单管理'
    },
    component: Main,
    children: [
      {
        path: '/menumanage',
        name: 'menu_manage',
        meta: {
          icon: 'md-list',
          title: '菜单管理'
        },
        component: () => import('@/view/menu/index.vue')
      }
    ]
  },
  {
    path: '/roles',
    name: 'roles',
    meta: {
      icon: 'logo-buffer',
      title: '权限管理'
    },
    component: Main,
    children: [
      {
        path: '/userRoles',
        name: 'user_roles',
        meta: {
          icon: 'md-key',
          title: '角色管理'
        },
        component: () => import('@/view/roles/index.vue')
      }
    ]
  },
  {
    path: '/review',
    name: 'review',
    meta: {
      icon: 'logo-buffer',
      title: '评论'
    },
    component: Main,
    children: [
      {
        path: '/comment',
        name: 'comment',
        meta: {
          icon: 'md-chatbubbles',
          title: '评论管理'
        },
        component: () => import('@/view/comment/index.vue')
      }
    ]
  },
  {
    path: '/logs',
    name: 'logs',
    meta: {
      icon: 'md-bug',
      title: '日志'
    },
    component: Main,
    children: [
      {
        path: '/logs_index',
        name: 'logs_manage',
        meta: {
          icon: 'md-bug',
          title: '日志管理'
        },
        component: () => import('@/view/logs/index.vue')
      }
    ]
  },
  {
    path: '/advert',
    name: 'advert',
    meta: {
      icon: 'logo-linkedin',
      title: '友链'
    },
    component: Main,
    children: [
      {
        path: '/advert_index',
        name: 'advert_manage',
        meta: {
          icon: 'md-link',
          title: '广告管理'
        },
        component: () => import('@/view/advert/index.vue')
      }
    ]
  }
]
