import { handleRequest } from "../handleRequest";

const apiRequest = handleRequest("Failed to fetch client info");

export async function getClientOptions() {
  const url = "/api/client/option";
  return apiRequest(url, { cache: "no-store" });
}

export async function getClients() {
  const url = "/api/client";
  return apiRequest(url, { cache: "no-store" });
}

export async function createClient(newData) {
  const url = "/api/client";
  return apiRequest(url, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(newData),
  });
}

export async function updateClient(client_id, newData) {
  const url = `/api/client/${client_id}`;
  return apiRequest(url, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(newData),
  });
}

export async function deleteClient(client_id) {
  const url = `/api/client/${client_id}`;
  return apiRequest(url, {
    method: "DELETE",
    headers: { "Content-Type": "application/json" },
  });
}
