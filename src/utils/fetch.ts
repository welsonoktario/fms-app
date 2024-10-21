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
