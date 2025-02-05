const { handleRequest } = require("../apiUtils");

const apiRequest = handleRequest("Failed to fetch load profiles data");

export async function getLoadProfileOptions() {
  const url = "/api/load-profile/option";
  return apiRequest(url, { cache: "no-store" });
}

export async function getLoadProfiles() {
  const url = "/api/load-profile";
  return apiRequest(url, { cache: "no-store" });
}

export async function createLoadProfile(newData) {
  const url = "/api/load-profile";
  return apiRequest(url, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(newData),
  });
}

export async function updateLoadProfile(load_profile_id, newData) {
  const url = `/api/load-profile/${load_profile_id}`;
  return apiRequest(url, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(newData),
  });
}

export async function deleteLoadProfile(load_profile_id) {
  const url = `/api/load-profile/${load_profile_id}`;
  return apiRequest(url, {
    method: "DELETE",
    headers: { "Content-Type": "application/json" },
  });
}
