import { env } from '../config/env';

export async function fetchApi<T>(path: string): Promise<T> {
  const res = await fetch(`${env.backendUrl}${path}`);
  if (!res.ok) {
    throw new Error(`API error: ${res.status} ${res.statusText}`);
  }
  const json = await res.json();
  return (json.data !== undefined ? json.data : json) as T;
}
