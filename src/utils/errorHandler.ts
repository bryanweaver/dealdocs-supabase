import { useToast } from "primevue/usetoast";

export interface ErrorInfo {
  code?: string;
  message: string;
  details?: any;
  statusCode?: number;
}

// Map technical errors to user-friendly messages
const errorMessages: Record<string, string> = {
  "Network Error": "Unable to connect. Please check your internet connection.",
  NOT_FOUND: "The requested item could not be found.",
  UNAUTHORIZED: "You need to log in to access this feature.",
  VALIDATION_ERROR: "Please check your input and try again.",
  TIMEOUT: "The request took too long. Please try again.",
  SERVER_ERROR: "Something went wrong on our end. Please try again later.",
};

// Get user-friendly error message
export function getErrorMessage(error: any): string {
  // Check for known error messages
  if (error?.message && errorMessages[error.message]) {
    return errorMessages[error.message];
  }

  // Check for GraphQL errors
  if (error?.errors && Array.isArray(error.errors) && error.errors.length > 0) {
    return error.errors[0].message || "An unexpected error occurred";
  }

  // Check for response status codes
  if (error?.response?.status) {
    switch (error.response.status) {
      case 400:
        return "Invalid request. Please check your input.";
      case 401:
        return "You need to log in to continue.";
      case 403:
        return "You don't have permission to access this resource.";
      case 404:
        return "The requested resource was not found.";
      case 429:
        return "Too many requests. Please wait a moment and try again.";
      case 500:
      case 502:
      case 503:
        return "Server error. Please try again later.";
      default:
        return (
          error.response.data?.message || "An error occurred. Please try again."
        );
    }
  }

  // Default message
  return error?.message || "An unexpected error occurred. Please try again.";
}

// Log error for debugging while showing user-friendly message
export function handleError(
  error: any,
  context?: string,
  showToast: boolean = true,
): ErrorInfo {
  const errorInfo: ErrorInfo = {
    message: getErrorMessage(error),
    code: error?.code,
    statusCode: error?.response?.status,
    details: {
      originalError: error,
      context,
      timestamp: new Date().toISOString(),
    },
  };

  // Log to console for debugging
  console.error(`[${context || "Error"}]:`, errorInfo);

  // Show toast notification if requested
  if (showToast && typeof window !== "undefined") {
    try {
      const toast = useToast();
      toast.add({
        severity: "error",
        summary: "Error",
        detail: errorInfo.message,
        life: 5000,
      });
    } catch (e) {
      // Fallback if toast is not available
      console.warn("Toast notification not available");
    }
  }

  return errorInfo;
}

// Retry wrapper for API calls
export async function withRetry<T>(
  fn: () => Promise<T>,
  options: {
    retries?: number;
    delay?: number;
    backoff?: boolean;
    onRetry?: (attempt: number, error: any) => void;
  } = {},
): Promise<T> {
  const { retries = 3, delay = 1000, backoff = true, onRetry } = options;

  let lastError: any;

  for (let attempt = 1; attempt <= retries; attempt++) {
    try {
      return await fn();
    } catch (error) {
      lastError = error;

      // Don't retry on certain errors
      if (
        error?.response?.status &&
        [400, 401, 403, 404].includes(error.response.status)
      ) {
        throw error;
      }

      if (attempt < retries) {
        const waitTime = backoff ? delay * attempt : delay;

        if (onRetry) {
          onRetry(attempt, error);
        }

        await new Promise((resolve) => setTimeout(resolve, waitTime));
      }
    }
  }

  throw lastError;
}

// Create a composable for Vue components
export function useErrorHandler() {
  const handleComponentError = (error: any, context?: string) => {
    return handleError(error, context, true);
  };

  const handleApiError = async <T>(
    apiCall: () => Promise<T>,
    options: {
      context?: string;
      showToast?: boolean;
      retries?: number;
    } = {},
  ): Promise<T | null> => {
    try {
      return await withRetry(apiCall, { retries: options.retries || 0 });
    } catch (error) {
      handleError(error, options.context, options.showToast !== false);
      return null;
    }
  };

  return {
    handleError: handleComponentError,
    handleApiError,
    getErrorMessage,
    withRetry,
  };
}
