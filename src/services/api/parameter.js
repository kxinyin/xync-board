import { handleRequest } from "../apiRequest";

const apiRequest = handleRequest("Failed to fetch parameter");

export async function getModuleOptions() {
  const url = "/api/param/module/option";
  return apiRequest(url, { cache: "no-store" });
}
