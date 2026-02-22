// api.ts para Vue
import { getToken } from './lib/auth'

export const API_BASE = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000' // Cambia esto a tu URL real

export const API_ENDPOINTS = {
  listarTodos: `${API_BASE}/api/productos/listar_todos`,
  listarOfertas: `${API_BASE}/api/productos/listar_ofertas`,
  listarMujer: `${API_BASE}/api/productos/listar_para_mujer`,
  listarHombre: `${API_BASE}/api/productos/listar_para_hombre`,
  loMasActualizado: `${API_BASE}/api/productos/lo_mas_actualizado`,
  loMasBarato: `${API_BASE}/api/productos/lo_mas_barato`,
  obtenerProducto: `${API_BASE}/api/productos/obtener`,
} as const

export function buildImageUrl(imagePath: string | null): string {
  if (!imagePath) return ''
  if (imagePath.startsWith('http')) return imagePath
  return `${API_BASE}${imagePath.startsWith('/') ? '' : '/'}${imagePath}`
}

export async function fetchProductos(endpoint: string, busqueda?: string) {
  const url = new URL(endpoint)
  if (busqueda) url.searchParams.set('busqueda', busqueda)
  const res = await fetch(url.toString())
  if (!res.ok) throw new Error('Error al cargar productos')
  return res.json()
}

export const WHATSAPP_CONTACTOS = [
  { nombre: 'Bexi', numero: '+598 91 956 716', wa: '59891956716' },
  { nombre: 'Beatriz', numero: '+598 96 716 411', wa: '59896716411' },
]

// Crear producto (POST)
export async function createProducto(producto: any) {
  const token = getToken()
  // Solo enviar los campos requeridos
  const payload = {
    nombre: producto.nombre,
    precio: typeof producto.precio === 'string' ? parseFloat(producto.precio) : producto.precio,
    para_mujer: !!producto.para_mujer,
    en_oferta: !!producto.en_oferta,
  }
  const res = await fetch(`${API_BASE}/api/productos/crear`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
    body: JSON.stringify(payload),
  })
  if (!res.ok) throw new Error('Error al crear producto')
  return res.json()
}

export function buildWhatsappLink(waNumber: string, producto?: any) {
  let mensaje = 'Hola, estoy interesado/a en ver que prendas tienen disponibles'
  if (producto && producto.id && producto.nombre && producto.precio) {
    mensaje = `Hola, estoy interesado/a en el producto:\n- ID: #${producto.id}\n- Nombre: ${producto.nombre}\n- Precio: $${producto.precio}`
  }
  return `https://wa.me/${waNumber}?text=${encodeURIComponent(mensaje)}`
}
