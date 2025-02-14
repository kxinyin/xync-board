export function mapTableFilterData(data, keyText, keyValue = keyText) {
  return data.map((item) => ({ text: item[keyText], value: item[keyValue] }));
}

export const statusFilterData = [
  { text: "Active", value: true },
  { text: "Inactive", value: false },
];
