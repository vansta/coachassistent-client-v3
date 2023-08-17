import { createWebHistory, createRouter } from "vue-router";
import Home from "../views/Home.vue";

const routes = [
  {
    path: '/',
    name: 'Home',
    component: Home
  },
  {
    path: '/trainings',
    name: 'Trainings',
    component: () => import('@/views/Trainings.vue')
  },
  {
    path: '/segments',
    name: 'Segments',
    component: () => import('@/views/Segments.vue')
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
    path: '/about',
    name: 'About',
    component: () => import('@/views/About.vue')
  },
  {
    path: '/segments/create',
    name: "CreateSegment",
    component: () => import('../components/Segment/Create.vue')
  },
  {
    path: '/segments/edit/:id',
    name: "EditSegment",
    props: true,
    component: () => import('../components/Segment/Create.vue')
  },
  {
    path: '/segments/details/:id',
    name: "Segment",
    props: true,
    component: () => import('../components/Segment/Create.vue')
  },
  {
    path: '/trainings/create',
    name: "CreateTraining",
    component: () => import('../components/Training/Create.vue')
  },
  {
    path: '/trainings/edit/:id',
    name: "EditTraining",
    props: true,
    component: () => import('../components/Training/Create.vue')
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
    component: () => import('../views/Groups/Overview.vue')
  },
  {
    path: '/groups/create/:parentGroupId?',
    name: 'CreateGroup',
    props: true,
    component: () => import('../views/Groups/Create.vue')
  },
  {
    path: '/groups/edit/:id',
    name: 'EditGroup',
    props: true,
    component: () => import('../views/Groups/Create.vue')
  },
  {
    path: '/roles',
    name: 'Roles',
    component: () => import('../views/Roles/Overview.vue')
  },
  {
    path: '/profile/:id',
    name: 'Profile',
    component: () => import('../views/Profile.vue')
  }
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

// router.beforeEach((to, from) => {
//   document.title = 'Coachassistent ' + to.meta?.title ?? '';
// })

export default router;