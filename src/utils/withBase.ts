export function withBase(path = '') {
  const base = import.meta.env.BASE_URL;
  const baseWithSlash = base.endsWith('/') ? base : `${base}/`;

  if (!path) {
    return baseWithSlash;
  }

  const normalized = path.replace(/^\//, '');
  return `${baseWithSlash}${normalized}`;
}
