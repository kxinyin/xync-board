import { handleRequest } from "../apiUtils";

const apiRequest = handleRequest("Failed to fetch status data");

export async function getStatusOptions(role_id) {
  const url = `/api/status/option/${role_id}`;
  return apiRequest(url, { cache: "no-store" });
}

export async function getStatus() {
  const url = "/api/status";
  return apiRequest(url, { cache: "no-store" });
}

export async function createStatus(newData) {
  const url = "/api/status";
  return apiRequest(url, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(newData),
  });
}

export async function updateStatus(status_id, newData) {
  const url = `/api/status/${status_id}`;
  return apiRequest(url, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(newData),
  });
}

export async function deleteStatus(status_id) {
  const url = `/api/status/${status_id}`;
  return apiRequest(url, {
    method: "DELETE",
    headers: { "Content-Type": "application/json" },
  });
}
