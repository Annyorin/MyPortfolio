/** Add a deployment version to local asset URLs without changing their fragments. */
export function versionAssetUrl(url, version = import.meta.env?.DEV ? "" : import.meta.env?.VITE_ASSET_VERSION) {
  if (
    typeof url !== "string" || !url || !version ||
    /^(?:[a-z][a-z\d+.-]*:|\/\/|#|\?)/i.test(url)
  ) return url;

  const hashAt = url.indexOf("#");
  const hash = hashAt < 0 ? "" : url.slice(hashAt);
  const withoutHash = hashAt < 0 ? url : url.slice(0, hashAt);
  const queryAt = withoutHash.indexOf("?");
  const pathname = queryAt < 0 ? withoutHash : withoutHash.slice(0, queryAt);
  const query = queryAt < 0 ? [] : withoutHash.slice(queryAt + 1).split("&").filter(Boolean);
  // Keep unrelated query parameters byte-for-byte (including PDF viewer options).
  const parameters = query.filter((part) => {
    try { return decodeURIComponent(part.split("=")[0]) !== "v"; }
    catch { return true; }
  });
  parameters.push(`v=${encodeURIComponent(String(version))}`);
  return `${pathname}?${parameters.join("&")}${hash}`;
}
