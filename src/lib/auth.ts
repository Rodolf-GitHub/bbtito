// src/lib/auth.ts para Vue

const TOKEN_KEY = "bbtito_auth_token"

export function getToken(): string | null {
  if (typeof window === "undefined") return null
  return localStorage.getItem(TOKEN_KEY)
}

export function setToken(token: string) {
  localStorage.setItem(TOKEN_KEY, token)
}

export function removeToken() {
  localStorage.removeItem(TOKEN_KEY)
}

export function isAuthenticated(): boolean {
  return !!getToken()
}
