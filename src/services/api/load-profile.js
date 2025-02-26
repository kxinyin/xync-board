const { handleRequest } = require("../handleRequest");

const apiRequest = handleRequest("Failed to fetch load profiles data");

export async function getLoadProfileOptions() {
  const url = "/api/load-profile/option";
  return apiRequest(url, "GET");
}

export async function getLoadProfiles() {
  const url = "/api/load-profile";
  return apiRequest(url, "GET");
}

export async function createLoadProfile(newData) {
  const url = "/api/load-profile";
  return apiRequest(url, "POST", newData);
}

export async function updateLoadProfile(load_profile_id, newData) {
  const url = `/api/load-profile/${load_profile_id}`;
  return apiRequest(url, "PUT", newData);
}

export async function deleteLoadProfile(load_profile_id) {
  const url = `/api/load-profile/${load_profile_id}`;
  return apiRequest(url, "DELETE");
}
