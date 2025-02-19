export function mapTableFilterData(data, keyText, keyValue = keyText) {
  // TODO: return empty array, prevent duplication
  return data.map((item) => ({ text: item[keyText], value: item[keyValue] }));
}

export const statusFilterData = [
  { text: "Active", value: true },
  { text: "Inactive", value: false },
];
