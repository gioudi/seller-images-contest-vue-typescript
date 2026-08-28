import { useToast } from "vue-toastification";
import { TOAST } from "@/config";

const toast = useToast();

const baseOptions = {
  timeout: TOAST.ERROR_DURATION,
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

const toastService = {
  showError(message: string) {
    toast.error(message, baseOptions);
  },
  showWarn(message: string) {
    toast.warning(message, baseOptions);
  },
};

export default toastService;
