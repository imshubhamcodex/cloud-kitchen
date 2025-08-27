import Vue from 'vue'
import Router from 'vue-router'

// import HomePage from '../components/HelloWorld.vue'
import ErrorPage from '../components/ErrorPage.vue'
import TestBar from '../views/TestPage.vue'


Vue.use(Router)

const routes = [
  {
    name: "home",
    path: "/",
    component: TestBar,
  },
  {
    name: "error",
    path: "*",
    component: ErrorPage,
  },
];

const router = new Router({
  mode: "history",
  routes,
  scrollBehavior () { return { x: 0, y: 0 } }
});

export default router;