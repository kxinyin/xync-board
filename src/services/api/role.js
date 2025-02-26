import { handleRequest } from "../handleRequest";

const apiRequest = handleRequest("Failed to fetch roles data");

export async function getRoleOptions() {
  const url = "/api/role/option";
  return apiRequest(url, "GET");
}

export async function getRoles() {
  const url = "/api/role";
  return apiRequest(url, "GET");
}

export async function createRole(newData) {
  const url = "/api/role";
  return apiRequest(url, "POST", newData);
}

export async function updateRole(role_id, newData) {
  const url = `/api/role/${role_id}`;
  return apiRequest(url, "PUT", newData);
}

export async function deleteRole(role_id) {
  const url = `/api/role/${role_id}`;
  return apiRequest(url, "DELETE");
}
