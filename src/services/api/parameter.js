import { handleRequest } from "../handleRequest";

const apiRequest = handleRequest("Failed to fetch parameter");

export async function getSystemModuleOptions() {
  const url = "/api/param/system_modules/option";
  return apiRequest(url, { cache: "no-store" });
}

export async function getClientTypeOptions() {
  const url = "/api/param/client_types/option";
  return apiRequest(url, { cache: "no-store" });
}
