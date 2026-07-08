export type ApiResult<T> =
  | { status: "success"; data: T }
  | { status: "error"; error: string };

export class ApiClient {
  private baseUrl: string;

  constructor(baseUrl: string) {
    this.baseUrl = baseUrl;
  }

  private async request<T>(
    method: string,
    path: string,
    options?: {
      params?: Record<string, string>;
      body?: unknown;
      idempotencyKey?: string;
      signal?: AbortSignal;
    }
  ): Promise<ApiResult<T>> {
    const url = new URL(`${this.baseUrl}${path}`);
    if (options?.params) {
      Object.entries(options.params).forEach(([key, value]) => {
        url.searchParams.set(key, value);
      });
    }

    const headers: Record<string, string> = {
      "Content-Type": "application/json",
    };
    if (options?.idempotencyKey) {
      headers["Idempotency-Key"] = options.idempotencyKey;
    }

    try {
      const response = await fetch(url.toString(), {
        method,
        headers,
        body: options?.body ? JSON.stringify(options.body) : undefined,
        signal: options?.signal,
      });

      if (!response.ok) {
        const text = await response.text().catch(() => "Unknown error");
        return {
          status: "error",
          error: `HTTP ${response.status}: ${text}`,
        };
      }

      const data = (await response.json()) as T;
      return { status: "success", data };
    } catch (err) {
      if (err instanceof DOMException && err.name === "AbortError") {
        return { status: "error", error: "Request aborted" };
      }
      const message =
        err instanceof Error ? err.message : "Network request failed";
      return { status: "error", error: message };
    }
  }

  get<T>(
    path: string,
    options?: {
      params?: Record<string, string>;
      signal?: AbortSignal;
    }
  ): Promise<ApiResult<T>> {
    return this.request<T>("GET", path, options);
  }

  post<T>(
    path: string,
    options?: {
      body?: unknown;
      idempotencyKey?: string;
      signal?: AbortSignal;
    }
  ): Promise<ApiResult<T>> {
    return this.request<T>("POST", path, options);
  }

  put<T>(
    path: string,
    options?: {
      body?: unknown;
      idempotencyKey?: string;
      signal?: AbortSignal;
    }
  ): Promise<ApiResult<T>> {
    return this.request<T>("PUT", path, options);
  }

  delete<T>(
    path: string,
    options?: {
      idempotencyKey?: string;
      signal?: AbortSignal;
    }
  ): Promise<ApiResult<T>> {
    return this.request<T>("DELETE", path, options);
  }
}
