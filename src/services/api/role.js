import { handleRequest } from "../handleRequest";

const apiRequest = handleRequest("Failed to fetch roles data");

export async function getRoleOptions() {
  const url = "/api/role/option";
  return apiRequest(url, { cache: "no-store" });
}

export async function getRoles() {
  const url = "/api/role";
  return apiRequest(url, { cache: "no-store" });
}

export async function createRole(newData) {
  const url = "/api/role";
  return apiRequest(url, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(newData),
  });
}

export async function updateRole(role_id, newData) {
  const url = `/api/role/${role_id}`;
  return apiRequest(url, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(newData),
  });
}

export async function deleteRole(role_id) {
  const url = `/api/role/${role_id}`;
  return apiRequest(url, {
    method: "DELETE",
    headers: { "Content-Type": "application/json" },
  });
}
