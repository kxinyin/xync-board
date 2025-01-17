import { handleRequest } from "../apiUtils";

const apiRequest = handleRequest("Failed to fetch parameter");

export async function getSystemModuleOptions() {
  const url = "/api/param/system_modules/option";
  return apiRequest(url, { cache: "no-store" });
}
