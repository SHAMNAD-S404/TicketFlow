import { ToastOptions, Bounce } from "react-toastify";

export const toastConfig: ToastOptions = {
    position: "top-center",
    autoClose: 1000,
    hideProgressBar: false,
    closeOnClick: false,
    rtl: false,
    pauseOnFocusLoss: true,
    draggable: true,
    pauseOnHover: true,
    theme: "colored",
    transition: Bounce,
}