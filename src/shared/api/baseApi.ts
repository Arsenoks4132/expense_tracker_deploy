// Base API configuration and utilities
export interface ApiResponse<T = any> {
  success: boolean
  data?: T
  error?: string
}

export interface ApiRequestConfig {
  method?: "GET" | "POST" | "PUT" | "DELETE"
  headers?: Record<string, string>
  body?: any
  timeout?: number
}

class BaseApi {
  private baseURL: string
  private defaultTimeout: number

  constructor(baseURL = "", timeout = 5000) {
    this.baseURL = baseURL
    this.defaultTimeout = timeout
  }

  private async request<T>(endpoint: string, config: ApiRequestConfig = {}): Promise<ApiResponse<T>> {
    const { method = "GET", headers = {}, body, timeout = this.defaultTimeout } = config

    try {
      // Simulate API delay for demo purposes
      await new Promise((resolve) => setTimeout(resolve, Math.random() * 300 + 100))

      const controller = new AbortController()
      const timeoutId = setTimeout(() => controller.abort(), timeout)

      const response = await fetch(`${this.baseURL}${endpoint}`, {
        method,
        headers: {
          "Content-Type": "application/json",
          ...headers,
        },
        body: body ? JSON.stringify(body) : undefined,
        signal: controller.signal,
      })

      clearTimeout(timeoutId)

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }

      const data = await response.json()
      return { success: true, data }
    } catch (error) {
      console.error(`API request failed for ${endpoint}:`, error)
      return {
        success: false,
        error: error instanceof Error ? error.message : "Unknown error occurred",
      }
    }
  }

  async get<T>(endpoint: string, config?: Omit<ApiRequestConfig, "method" | "body">): Promise<ApiResponse<T>> {
    return this.request<T>(endpoint, { ...config, method: "GET" })
  }

  async post<T>(
    endpoint: string,
    body?: any,
    config?: Omit<ApiRequestConfig, "method" | "body">,
  ): Promise<ApiResponse<T>> {
    return this.request<T>(endpoint, { ...config, method: "POST", body })
  }

  async put<T>(
    endpoint: string,
    body?: any,
    config?: Omit<ApiRequestConfig, "method" | "body">,
  ): Promise<ApiResponse<T>> {
    return this.request<T>(endpoint, { ...config, method: "PUT", body })
  }

  async delete<T>(endpoint: string, config?: Omit<ApiRequestConfig, "method" | "body">): Promise<ApiResponse<T>> {
    return this.request<T>(endpoint, { ...config, method: "DELETE" })
  }
}

// Create and export API instance
export const api = new BaseApi()

// Utility function to simulate API delay
export const simulateApiDelay = (min = 100, max = 500): Promise<void> => {
  const delay = Math.random() * (max - min) + min
  return new Promise((resolve) => setTimeout(resolve, delay))
}
