const baseUrl = process.env.NEXT_PUBLIC_BASE_URL;

// TODO: include authorization
// const authHeaders = {"Authorization": ""}
const jsonHeaders = { "Content-Type": "application/json" };

export function handleRequest(errorMessage) {
  return async function apiRequest(url, method, newData) {
    try {
      let options =
        method === "GET"
          ? { method, cache: "no-store" }
          : { method, headers: jsonHeaders };

      if (newData) options.body = JSON.stringify(newData);

      const res = await fetch(baseUrl + url, options);

      const { message, data } = await res.json();

      if (!res.ok) return { success: false, message, data };

      return { success: true, message, data };
    } catch (error) {
      return { success: false, message: errorMessage };
    }
  };
}
