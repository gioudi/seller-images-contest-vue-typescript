import { useToast } from "vue-toastification";

const toast = useToast();

const toastService = {
  showError(message: string) {
    toast.error(message, {
      timeout: 3000,
      closeOnClick: true,
      pauseOnFocusLoss: true,
      pauseOnHover: true,
      draggable: true,
      draggablePercent: 0.3,
      showCloseButtonOnHover: false,
      hideProgressBar: false,
      closeButton: "button",
      icon: true,
      rtl: false,
    });
  },
};

export default toastService;
