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
    path: '/segments/edit/:id?',
    name: "EditSegment",
    props: true,
    component: () => import('../components/Segment/Create.vue')
  },
  {
    path: '/trainings/create',
    name: "CreateTraining",
    component: () => import('../components/Training/Create.vue')
  },
  {
    path: '/trainings/edit/:id?',
    name: "EditTraining",
    props: true,
    component: () => import('../components/Training/Create2.vue')
  },
  {
    path: '/exercises/edit/:id?',
    name: 'EditExercise',
    props: true,
    component: () => import('../components/Exercise/EditFull.vue')
  }
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

export default router;