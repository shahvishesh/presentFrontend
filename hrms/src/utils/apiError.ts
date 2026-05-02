import axios from "axios";

interface BackendErrorResponse {
  message?: unknown;
  status?: unknown;
  code?: unknown;
  timestamp?: unknown;
  errors?: unknown;
}

const toNumber = (value: unknown): number | undefined => {
  if (typeof value === "number") {
    return Number.isFinite(value) ? value : undefined;
  }

  if (typeof value === "string") {
    const parsedValue = Number(value);
    return Number.isFinite(parsedValue) ? parsedValue : undefined;
  }

  return undefined;
};

const extractMessageFromPayload = (payload: BackendErrorResponse | string | undefined): string | undefined => {
  if (!payload) {
    return undefined;
  }

  if (typeof payload === "string") {
    return payload;
  }

  if (typeof payload.message === "string" && payload.message.trim().length > 0) {
    return payload.message;
  }

  if (Array.isArray(payload.errors)) {
    const joinedErrors = payload.errors
      .map((entry) => (typeof entry === "string" ? entry.trim() : ""))
      .filter((entry) => entry.length > 0)
      .join(", ");

    if (joinedErrors.length > 0) {
      return joinedErrors;
    }
  }

  return undefined;
};

const buildStatusMessage = (status?: number): string | undefined => {
  switch (status) {
    case 400:
      return "The request is invalid. Please review your input and try again.";
    case 401:
      return "Authentication failed. Check your credentials and try again.";
    case 403:
      return "You do not have permission to perform this action.";
    case 404:
      return "The requested resource could not be found.";
    case 409:
      return "This action conflicts with existing data.";
    case 500:
      return "The server encountered an error. Please try again shortly.";
    default:
      return undefined;
  }
};

export const getApiErrorMessage = (error: unknown, fallbackMessage = "Something went wrong"): string => {
  if (!axios.isAxiosError<BackendErrorResponse | string>(error)) {
    return fallbackMessage;
  }

  if (error.code === "ERR_NETWORK") {
    return "Network error. Please check your internet connection and backend availability.";
  }

  const responsePayload = error.response?.data;
  const status = error.response?.status ?? (typeof responsePayload === "object" && responsePayload
    ? toNumber(responsePayload.status) ?? toNumber(responsePayload.code)
    : undefined);

  const apiMessage = extractMessageFromPayload(responsePayload);
  if (apiMessage) {
    return apiMessage;
  }

  const mappedMessage = buildStatusMessage(status);
  if (mappedMessage) {
    return mappedMessage;
  }

  return fallbackMessage;
};