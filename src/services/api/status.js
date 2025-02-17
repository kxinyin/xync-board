import { handleRequest } from "../handleRequest";

const apiRequest = handleRequest("Failed to fetch status data");

export async function getStatusOptions(role_id) {
  const url = `/api/status/option/${role_id}`;
  return apiRequest(url, "GET");
}

export async function getStatus() {
  const url = "/api/status";
  return apiRequest(url, "GET");
}

export async function createStatus(newData) {
  const url = "/api/status";
  return apiRequest(url, "POST", newData);
}

export async function updateStatus(status_id, newData) {
  const url = `/api/status/${status_id}`;
  return apiRequest(url, "PUT", newData);
}

export async function deleteStatus(status_id) {
  const url = `/api/status/${status_id}`;
  return apiRequest(url, "DELETE");
}
