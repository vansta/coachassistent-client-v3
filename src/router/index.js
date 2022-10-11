import { createWebHistory, createRouter } from "vue-router";
import Home from "../views/Home.vue";

const routes = [
  {
    path: '/',
    name: 'Home',
    component: Home
  },
  // {
  //   path: '/training',
  //   name: 'Training',
  //   component: () => import(/* webpackChunkName: "about" */ '../views/Training.vue')
  // },
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
    component: () => import(/* webpackChunkName: "about" */ '../views/Login.vue')
  },
  {
    path: '/register',
    name: 'Register',
    component: () => import('@/views/Register.vue')
  },
  {
    path: '/about',
    name: 'About',
    // route level code-splitting
    // this generates a separate chunk (about.[hash].js) for this route
    // which is lazy-loaded when the route is visited.
    component: () => import(/* webpackChunkName: "about" */ '@/views/About.vue')
  },
  {
    path: '/segments/create',
    name: "CreateSegment",
    component: () => import(/* webpackChunkName: "about" */ '../components/Segment/Create.vue')
  },
  {
    path: '/segments/edit/:id?',
    name: "EditSegment",
    props: true,
    component: () => import(/* webpackChunkName: "about" */ '../components/Segment/Create.vue')
  }
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

export default router;