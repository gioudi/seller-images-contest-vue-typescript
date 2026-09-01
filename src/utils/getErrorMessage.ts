import { AxiosError } from "axios";

interface ApiErrorBody {
  message?: string;
}

export default function getErrorMessage(
  error: unknown,
  fallback: string
): string {
  if (error instanceof AxiosError) {
    const data = error.response?.data as ApiErrorBody | undefined;
    return data?.message ?? fallback;
  }
  if (error instanceof Error) {
    return error.message;
  }
  return fallback;
}
