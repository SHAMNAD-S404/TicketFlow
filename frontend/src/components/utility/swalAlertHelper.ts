import Swal, { SweetAlertIcon } from "sweetalert2";

interface AlertOptions {
  title?: string;
  text?: string;
  icon?: SweetAlertIcon;
  confirmButtonText?: string;
  cancelButtonText?: string;
  showCancelButton?: boolean;
  reverseButtons?: boolean;
}

export const showCustomeAlert = (options: AlertOptions) => {
  const swalWithCustomButtons = Swal.mixin({
    customClass: {
      // Used Tailwind classes
      confirmButton:
        "mr-8 bg-green-500 hover:bg-green-600 text-white font-bold py-2 px-4 rounded",
      cancelButton:
        "ml-8 bg-red-500 hover:bg-red-600 text-white font-bold py-2 px-4 rounded",
      actions: "flex gap-4 justify-center",
    },
    buttonsStyling: false, // disable default SweetAlert2 styling
  });

  return swalWithCustomButtons.fire({
    title: options.title,
    text: options.text,
    icon: options.icon,
    showCancelButton: options.showCancelButton ?? false,
    confirmButtonText: options.confirmButtonText ?? "Confirm",
    cancelButtonText: options.cancelButtonText ?? "Cancel",
    reverseButtons: options.reverseButtons ?? false,
  });
};
