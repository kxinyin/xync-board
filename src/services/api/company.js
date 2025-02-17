import { handleRequest } from "../handleRequest";

const apiRequest = handleRequest("Failed to fetch company info");

export async function getBranchOptions() {
  const url = "/api/company/branch/option";
  return apiRequest(url, "GET");
}

export async function getCompanyInfo() {
  const url = "/api/company";
  return apiRequest(url, "GET");
}

export async function updateCompanyInfo(newData) {
  const url = "/api/company";
  return apiRequest(url, "PUT", newData);
}
