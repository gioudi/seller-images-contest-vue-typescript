import { createApp } from "vue";
import App from "./App.vue";
import "./styles/index.scss";
import store from "./store";
import Toast, { PluginOptions } from "vue-toastification";

import "vue-toastification/dist/index.css";
import router from "./routes";
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

app.use(store);
app.use(Toast, options);
app.use(router);
app.mount("#alegra-test");
