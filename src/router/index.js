import { createWebHistory, createRouter } from "vue-router";
// import { useAbility } from "@casl/vue";
// const { can } = useAbility();

import createAbility from '@/services/ability.js';
const ability = createAbility;

const firstVisitStorageId = 'ca-fv';

const ifCan = (to, from, next) => {
  if (to.meta && to.meta.action && !ability.can(to.meta.action, to.meta.subject)) {
  }
  else {
    next();
    return;
  }
};

const ifFirstVisit = (to, from, next) => {
  if (!localStorage.getItem(firstVisitStorageId)) {
    localStorage.setItem(firstVisitStorageId, new Date());
    next({ name: 'Welcome' });
    return;
  }
  else{
    next();
    return;
  }
}

const routes = [
  {
    path: '/',
    name: 'Home',
    component: () => import('@/views/Exercises.vue'),
    beforeEnter: ifFirstVisit
  },
  {
    path: '/trainings',
    name: 'Trainings',
    component: () => import('@/views/Trainings.vue')
  },
  {
    path: '/segments',
    name: 'Segments',
    component: () => import('@/views/Segment/Overview.vue')
  },
  {
    path: '/exercises',
    name: 'Exercises',
    component: () => import('@/views/Exercises.vue')
  },
  {
    path: '/login',
    name: 'Login',
    component: () => import('../views/Login.vue')
  },
  {
    path: '/register',
    name: 'Register',
    component: () => import('@/views/Register.vue')
  },
  {
    path: '/resetpassword',
    name: 'RequestPasswordReset',
    component: () => import('@/views/RequestPasswordReset.vue')
  },
  {
    path:'/resetpassword/:id',
    name: 'ResetPassword',
    props: true,
    component: () => import('@/views/ResetPassword.vue')
  },
  {
    path: '/about',
    name: 'About',
    component: () => import('@/views/About.vue')
  },
  {
    path: '/welcome',
    name: 'Welcome',
    component: () => import('@/views/Welcome.vue')
  },
  {
    path: '/segments/create/:fromTraining?',
    name: "CreateSegment",
    props: true,
    component: () => import('../views/Segment/Edit.vue'),
    meta: {
      action: 'create',
      subject: 'shareable'
    },
    beforeEnter: ifCan
  },
  {
    path: '/segments/edit/:id',
    name: "EditSegment",
    props: true,
    component: () => import('../views/Segment/Edit.vue'),
    meta: {
      action: 'update',
      subject: 'shareable'
    },
    beforeEnter: ifCan
  },
  {
    path: '/segments/details/:id',
    name: "Segment",
    props: true,
    component: () => import('../views/Segment/Edit.vue'),
    meta: {
      action: 'read',
      subject: 'shareable'
    },
    beforeEnter: ifCan
  },
  {
    path: '/trainings/create',
    name: "CreateTraining",
    component: () => import('../components/Training/Create.vue'),
    meta: {
      action: 'create',
      subject: 'shareable'
    },
    beforeEnter: ifCan
  },
  {
    path: '/trainings/edit/:id',
    name: "EditTraining",
    props: true,
    component: () => import('../components/Training/Create.vue'),
    meta: {
      action: 'update',
      subject: 'shareable'
    },
    beforeEnter: ifCan
  },
  {
    path: '/trainings/details/:id',
    name: "Training",
    props: true,
    component: () => import('../components/Training/Create.vue')
  },
  {
    path: '/groups',
    name: 'Groups',
    props: true,
    component: () => import('../views/Groups/Overview.vue'),
    meta: {
      action: 'read',
      subject: 'group'
    },
    beforeEnter: ifCan
  },
  {
    path: '/groups/create/:parentGroupId?',
    name: 'CreateGroup',
    props: true,
    component: () => import('../views/Groups/Create.vue'),
    meta: {
      action: 'create',
      subject: 'group'
    },
    beforeEnter: ifCan
  },
  {
    path: '/groups/edit/:id',
    name: 'EditGroup',
    props: true,
    component: () => import('../views/Groups/Create.vue'),
    meta: {
      action: 'update',
      subject: 'group'
    },
    beforeEnter: ifCan
  },
  {
    path: '/roles',
    name: 'Roles',
    component: () => import('../views/Roles/Overview.vue'),
    meta: {
      action: 'read',
      subject: 'role'
    },
    beforeEnter: ifCan
  },
  {
    path: '/licenses',
    name: 'Licenses',
    component: () => import('../views/Licenses/Overview.vue'),
    meta: {
      action: 'read',
      subject: 'license'
    },
    beforeEnter: ifCan
  },
  {
    path: '/profile/:id',
    name: 'Profile',
    component: () => import('../views/Profile.vue')
  },
  {
    path: '/board',
    name: 'Board',
    component: () => import ('@/components/Drawing/KonvaBoard.vue')
  }
];


const router = createRouter({
  history: createWebHistory(),
  routes,
});

export default router;