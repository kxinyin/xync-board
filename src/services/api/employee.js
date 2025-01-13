import { handleRequest } from "../apiRequest";

const apiRequest = handleRequest("Failed to fetch employees data");

export async function getEmployees() {
  const url = "/api/employee";
  return apiRequest(url, { cache: "no-store" });
}

export async function createEmployee(newData) {
  const url = "/api/employee";
  return apiRequest(url, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(newData),
  });
}

export async function updateEmployee(employee_id, newData) {
  const url = `/api/employee/${employee_id}`;
  return apiRequest(url, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(newData),
  });
}

export async function deleteEmployee(employee_id) {
  const url = `/api/employee/${employee_id}`;
  return apiRequest(url, {
    method: "DELETE",
    headers: { "Content-Type": "application/json" },
  });
}
