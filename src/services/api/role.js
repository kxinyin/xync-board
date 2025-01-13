import { handleRequest } from "../apiRequest";

const apiRequest = handleRequest("Failed to fetch roles data");

export async function getRoleOptions() {
  const url = "/api/role/option";
  return apiRequest(url, { cache: "no-store" });
}
