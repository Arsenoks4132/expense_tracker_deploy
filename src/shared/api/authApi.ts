import type { User, UserProfile } from "../types"
import { storage } from "./storage"
import { simulateApiDelay } from "./baseApi"

// Default users for demo
const defaultUsers: User[] = [
  {
    id: "1",
    email: "demo@example.com",
    password: "password123",
    profile: {
      firstName: "Иван",
      lastName: "Иванов",
      profession: "Программист",
      birthDate: "1990-01-01",
      photoUrl: "https://randomuser.me/api/portraits/men/1.jpg",
    },
  },
]

export interface LoginRequest {
  email: string
  password: string
}

export interface LoginResponse {
  success: boolean
  user?: User
  error?: string
}

export interface RegisterRequest {
  email: string
  password: string
  profile: UserProfile
}

export interface RegisterResponse {
  success: boolean
  user?: User
  error?: string
}

export interface UpdateProfileRequest {
  userId: string
  profileUpdates: Partial<UserProfile>
}

export interface UpdateProfileResponse {
  success: boolean
  user?: User
  error?: string
}

export const authApi = {
  // Get all users from storage
  getUsers: async (): Promise<User[]> => {
    await simulateApiDelay()
    return storage.get("users", defaultUsers)
  },

  // Save users to storage
  saveUsers: async (users: User[]): Promise<void> => {
    await simulateApiDelay()
    storage.set("users", users)
  },

  // Login user
  login: async (request: LoginRequest): Promise<LoginResponse> => {
    await simulateApiDelay(300, 800)

    const users = await authApi.getUsers()
    const user = users.find((u) => u.email === request.email && u.password === request.password)

    if (user) {
      return { success: true, user }
    } else {
      return { success: false, error: "Неверный email или пароль" }
    }
  },

  // Register new user
  register: async (request: RegisterRequest): Promise<RegisterResponse> => {
    await simulateApiDelay(400, 900)

    const users = await authApi.getUsers()

    // Check if user already exists
    const userExists = users.some((u) => u.email === request.email)
    if (userExists) {
      return { success: false, error: "Пользователь с таким email уже существует" }
    }

    const newUser: User = {
      id: Date.now().toString(),
      email: request.email,
      password: request.password,
      profile: request.profile,
    }

    const updatedUsers = [...users, newUser]
    await authApi.saveUsers(updatedUsers)

    return { success: true, user: newUser }
  },

  // Update user profile
  updateUserProfile: async (request: UpdateProfileRequest): Promise<UpdateProfileResponse> => {
    await simulateApiDelay(200, 600)

    const users = await authApi.getUsers()
    const userIndex = users.findIndex((u) => u.id === request.userId)

    if (userIndex === -1) {
      return { success: false, error: "Пользователь не найден" }
    }

    const updatedUser = {
      ...users[userIndex],
      profile: { ...users[userIndex].profile, ...request.profileUpdates },
    }

    const updatedUsers = [...users]
    updatedUsers[userIndex] = updatedUser

    await authApi.saveUsers(updatedUsers)

    return { success: true, user: updatedUser }
  },

  // Verify token (for future use)
  verifyToken: async (token: string): Promise<{ success: boolean; user?: User; error?: string }> => {
    await simulateApiDelay(100, 300)

    // For demo purposes, always return success
    // In real app, this would validate JWT token
    return { success: true }
  },

  // Refresh token (for future use)
  refreshToken: async (refreshToken: string): Promise<{ success: boolean; accessToken?: string; error?: string }> => {
    await simulateApiDelay(100, 300)

    // For demo purposes, always return success
    // In real app, this would refresh JWT token
    return { success: true, accessToken: "new-access-token" }
  },
}
