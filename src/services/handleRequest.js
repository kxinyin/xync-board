const baseUrl = process.env.NEXT_PUBLIC_BASE_URL;

export function handleRequest(errorMessage) {
  return async function apiRequest(url, options) {
    try {
      const res = await fetch(baseUrl + url, options);

      const { message, data } = await res.json();

      if (!res.ok) return { success: false, message, data };

      return { success: true, message, data };
    } catch (error) {
      return { success: false, message: errorMessage };
    }
  };
}
