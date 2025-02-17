import { handleRequest } from "../handleRequest";

const apiRequest = handleRequest("Failed to fetch employees data");

export async function getEmployees() {
  const url = "/api/employee";
  return apiRequest(url, "GET");
}

export async function createEmployee(newData) {
  const url = "/api/employee";
  return apiRequest(url, "POST", newData);
}

export async function updateEmployee(employee_id, newData) {
  const url = `/api/employee/${employee_id}`;
  return apiRequest(url, "PUT", newData);
}

export async function deleteEmployee(employee_id) {
  const url = `/api/employee/${employee_id}`;
  return apiRequest(url, "DELETE");
}
