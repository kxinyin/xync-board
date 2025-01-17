export function splitPathname(pathname) {
  return pathname.slice(1).split("/").filter(Boolean);
}

export function getPathParentKey(pathname) {
  const splitPath = splitPathname(pathname);
  return splitPath[0];
}

export function getPathSub1Key(pathname) {
  const splitPath = splitPathname(pathname);
  return splitPath[1];
}
