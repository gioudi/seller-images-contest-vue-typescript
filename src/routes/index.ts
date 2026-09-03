import { createRouter, createWebHistory } from "vue-router";

const routes = [
  {
    path: "/",
    name: "LandingPage",
    component: () => import("@/views/LandingPage.vue"),
  },
  {
    path: "/ImageList",
    name: "ImageList",
    component: () => import("@/views/ImageList.vue"),
  },
  {
    path: "/InvoiceForm",
    name: "InvoiceForm",
    component: () => import("@/views/InvoiceForm.vue"),
  },
  {
    path: "/:pathMatch(.*)*",
    name: "NotFound",
    component: () => import("@/views/NotFound.vue"),
  },
];

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes,
});

export default router;
