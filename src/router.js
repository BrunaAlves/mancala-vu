import Vue from "vue";
import Router from "vue-router";

Vue.use(Router);

export default new Router({
  mode: "history",
  routes: [
    {
      path: "/game",
      alias: "/mancala",
      name: "Mancala",
      component: () => import("./pages/Mancala")
    },
    {
      path: "/start",
      alias: "/mancala/start",
      name: "Mancala Start",
      component: () => import("./pages/Start")
    }
  ]
});