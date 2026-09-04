/**
 * Server-side proxy helper that bridges the Next.js Portfolio API layer to the FastAPI backend.
 * If FastAPI is active (e.g., http://127.0.0.1:8000), it relays requests;
 * otherwise, it gracefully returns fallback/native Next.js responses.
 */

const FASTAPI_BASE_URL = process.env.FASTAPI_URL || "http://127.0.0.1:8000";

export async function fetchFromFastAPI<T>(endpoint: string, options?: RequestInit): Promise<{ data: T | null; source: "fastapi" | "fallback"; error?: string }> {
  const url = `${FASTAPI_BASE_URL}${endpoint.startsWith("/") ? endpoint : `/${endpoint}`}`;

  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 2500); // 2.5s timeout

    const res = await fetch(url, {
      ...options,
      signal: controller.signal,
      headers: {
        "Accept": "application/json",
        "Content-Type": "application/json",
        ...(options?.headers || {}),
      },
    });

    clearTimeout(timeoutId);

    if (!res.ok) {
      return { data: null, source: "fallback", error: `FastAPI responded with ${res.status}` };
    }

    const json = await res.json();
    return { data: (json.data !== undefined ? json.data : json) as T, source: "fastapi" };
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : "FastAPI unreachable";
    return { data: null, source: "fallback", error: msg };
  }
}
