import { setToken } from './auth'

const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:8000'

export async function loginUser(nombre: string, contraseña: string) {
  const res = await fetch(`${API_BASE}/api/usuarios/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ nombre, contraseña })
  })
  if (!res.ok) {
    const errorData = await res.json().catch(() => null)
    throw new Error(errorData?.detail || 'Credenciales incorrectas')
  }
  const data = await res.json()
  setToken(data.token)
  return data
}
