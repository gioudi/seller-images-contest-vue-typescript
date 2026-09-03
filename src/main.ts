import { createApp } from "vue";
import App from "./App.vue";
import "./styles/main.scss";
import { createPinia } from "pinia";
import Toast, { PluginOptions } from "vue-toastification";

import "vue-toastification/dist/index.css";
import router from "./routes";
import i18n from "./i18n";
import { TOAST } from "@/config";

const options: PluginOptions = {
  timeout: TOAST.DEFAULT_DURATION,
  closeOnClick: true,
  pauseOnFocusLoss: true,
  pauseOnHover: true,
  draggable: true,
  draggablePercent: TOAST.DRAGGABLE_PERCENT,
  showCloseButtonOnHover: false,
  hideProgressBar: false,
  closeButton: "button",
  icon: true,
  rtl: false,
};
const app = createApp(App);
const pinia = createPinia();

app.use(pinia);
app.use(Toast, options);
app.use(router);
app.use(i18n);
app.mount("#alegra-test");
