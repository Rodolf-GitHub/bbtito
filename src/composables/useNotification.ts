import { reactive } from 'vue'

type Toast = {
  id: number
  message: string
  type?: 'success' | 'error' | 'info'
}

const state = reactive({ toasts: [] as Toast[] })
let nextId = 1

export function useNotification() {
  function show(message: string, type: Toast['type'] = 'info', timeout = 4000) {
    const id = nextId++
    state.toasts.push({ id, message, type })
    if (timeout > 0) {
      setTimeout(() => remove(id), timeout)
    }
  }

  function remove(id: number) {
    const idx = state.toasts.findIndex((t) => t.id === id)
    if (idx !== -1) state.toasts.splice(idx, 1)
  }

  return { toasts: state.toasts, show, remove }
}

export default useNotification
