import type { ApiError, ApiResponse } from "@/types";

export class FetchError extends Error {
  public responseData: ApiError;

  constructor(message: string, responseData: ApiError) {
    super(message);
    this.responseData = responseData;
  }
}

// Type-safe fetch wrapper utility
export async function $fetch<TData>(
  url: string,
  options: RequestInit = {},
): Promise<ApiResponse<TData>> {
  // Set default headers if not provided
  const defaultHeaders = {
    Accept: "application/json",
    "Content-Type": "application/json",
  };

  const mergedOptions: RequestInit = {
    ...options,
    headers: {
      ...defaultHeaders,
      ...options.headers, // Override default headers if provided
    },
  };

  const response = await fetch(url, mergedOptions);

  // Check if the response is okay (status code is 2xx)
  if (!response.ok) {
    const errorData = (await response.json()) as ApiError;
    throw new FetchError(errorData.message, errorData);
  }

  // Parse the response as JSON and return the typed data
  return (await response.json()) as ApiResponse<TData>;
}

export function objectToFormData(
  obj: Record<string, any>, // Object to convert
  formData: FormData = new FormData(), // Initial FormData object
  parentKey = "", // Parent key for nested objects/arrays
): FormData {
  for (const key in obj) {
    if (Object.hasOwn(obj, key)) {
      const value = obj[key];
      const fieldKey = parentKey ? `${parentKey}[${key}]` : key;

      if (Array.isArray(value)) {
        value.forEach((item, index) => {
          const arrayKey = `${fieldKey}[${index}]`;
          objectToFormData(item, formData, arrayKey);
        });
      } else if (
        value &&
        typeof value === "object" &&
        !(value instanceof File || value instanceof Blob)
      ) {
        objectToFormData(value, formData, fieldKey);
      } else if (value !== null && value !== undefined) {
        formData.append(fieldKey, value as string | Blob);
      }
    }
  }

  return formData;
}
