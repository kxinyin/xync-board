const { handleRequest, jsonHeaders } = require("../handleRequest");

const apiRequest = handleRequest("Failed to fecth customer info");

export async function getCustomers(pageNo) {
  const url = `/api/customer?page=${pageNo}`;
  return apiRequest(url, "GET");
}

export async function getCustomer(customer_id) {
  const url = `/api/customer/${customer_id}`;
  return apiRequest(url, "GET");
}

export async function createCustomer(newData) {
  const url = "/api/customer";
  return apiRequest(url, "POST", newData);
}

export async function updateCustomer(customer_id, newData) {
  const url = `/api/customer/${customer_id}`;
  return apiRequest(url, "PUT", newData);
}

export async function deleteCustomer(customer_id) {
  const url = `/api/customer/${customer_id}`;
  return apiRequest(url, "DELETE");
}
