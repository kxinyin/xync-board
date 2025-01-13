import { handleRequest } from "../apiRequest";

const apiRequest = handleRequest("Failed to fetch company info");

export async function getBranchOptions() {
  const url = "/api/company/branch/option";
  return apiRequest(url, { cache: "no-store" });
}

export async function getCompanyInfo() {
  const url = "/api/company";
  return apiRequest(url, { cache: "no-store" });
}

export async function updateCompanyInfo(newData) {
  const url = "/api/company";
  return apiRequest(url, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(newData),
  });
}
