const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_URL

export async function apiFetch(path: string) {
  return fetch(`${API_BASE_URL}${path}`)
}