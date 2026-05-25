export const AUTH_TOKEN_KEY = 'financy_token'

const PUBLIC_AUTH_PATHS = ['/sign-in', '/sign-up']

let isHandlingUnauthorized = false

export function clearAuthToken(): void {
  localStorage.removeItem(AUTH_TOKEN_KEY)
}

export function handleUnauthorized(): void {
  if (isHandlingUnauthorized) return

  clearAuthToken()

  const pathname = window.location.pathname
  if (PUBLIC_AUTH_PATHS.includes(pathname)) return

  isHandlingUnauthorized = true
  window.location.replace('/sign-in')
}
