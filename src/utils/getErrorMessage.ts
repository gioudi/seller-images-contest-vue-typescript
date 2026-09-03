import { AxiosError } from "axios";

interface ApiErrorBody {
  message?: string;
}

export default function getErrorMessage(
  error: unknown,
  fallback: string
): string {
  if (error instanceof AxiosError) {
    if (error.code === "ECONNABORTED" || error.message.includes("timeout")) {
      return "La solicitud tardó demasiado. Inténtalo de nuevo.";
    }
    const data = error.response?.data as ApiErrorBody | undefined;
    return data?.message ?? fallback;
  }
  if (error instanceof Error) {
    return error.message;
  }
  return fallback;
}
