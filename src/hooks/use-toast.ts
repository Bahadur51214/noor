import { toast as sonnerToast } from 'sonner';

export const toast = sonnerToast;

export const showSuccess = (message: string) => {
  sonnerToast.success(message, {
    className: 'bg-green-50 border-green-200 text-green-800',
  });
};

export const showError = (message: string) => {
  sonnerToast.error(message, {
    className: 'bg-red-50 border-red-200 text-red-800',
  });
};

export const showInfo = (message: string) => {
  sonnerToast.info(message, {
    className: 'bg-blue-50 border-blue-200 text-blue-800',
  });
};

export function useToast() {
  return {
    toast,
    showSuccess,
    showError,
    showInfo,
  };
}
