/* eslint-disable @typescript-eslint/no-explicit-any */
import { toast, ToastOptions } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const defaultOptions: ToastOptions = {
  position: 'top-right',
  autoClose: 3000,
  hideProgressBar: false,
  closeOnClick: true,
  pauseOnHover: true,
  draggable: true,
  theme: 'dark',
};

export function useNotify() {
  return {
    success: (message: string, options?: ToastOptions) =>
      toast.success(message, { ...defaultOptions, ...options }),
    error: (message: string, options?: ToastOptions) =>
      toast.error(message, { ...defaultOptions, ...options }),
    info: (message: string, options?: ToastOptions) =>
      toast.info(message, { ...defaultOptions, ...options }),
    warning: (message: string, options?: ToastOptions) =>
      toast.warn(message, { ...defaultOptions, ...options }),
    custom: (message: string, options?: ToastOptions) =>
      toast(message, { ...defaultOptions, ...options }),

    // New method for loading toast
    loading: (
      promise: Promise<any>,
      message: string,
      options?: ToastOptions
    ) => {
      const id = toast.loading(message, { ...defaultOptions, ...options });

      promise
        .then(() => {
          toast.update(id, {
            render: message,
            type: 'success',
            isLoading: false,
            autoClose: 3000,
          });
        })
        .catch((error) => {
          toast.update(id, {
            render: `Error: ${error.message || 'Something went wrong!'}`,
            type: 'error',
            isLoading: false,
            autoClose: 3000,
          });
        });
    },
  };
}
