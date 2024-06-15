import LandingPage from "@/views/LandingPage.vue";
import ImageList from "@/views/ImageList.vue";
import { createRouter, createWebHistory } from "vue-router";

const routes = [
  { path: "/", name: "LandingPage", component: LandingPage },
  { path: "/ImageList", name: "ImageList", component: ImageList },
];

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes,
});

export default router;
