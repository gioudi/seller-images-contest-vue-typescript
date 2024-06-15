import { createApp } from "vue";
import App from "./App.vue";
import "./styles/index.scss";
import store from "./store";

const app = createApp(App);

app.use(store);

app.mount("#alegra-test");
