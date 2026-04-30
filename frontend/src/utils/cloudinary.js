/**
 * Transform a Cloudinary URL to add auto format (WebP/AVIF), auto quality,
 * and optional width resizing. Non-Cloudinary URLs are returned unchanged.
 *
 * @param {string} url   - Original image URL
 * @param {object} opts
 * @param {number} [opts.w]          - Max width in pixels (uses c_limit so image is never upscaled)
 * @param {string} [opts.q='auto']   - Quality ('auto', 'auto:best', 'auto:eco', or 1-100)
 * @param {string} [opts.f='auto']   - Format ('auto' picks WebP/AVIF per browser)
 */
export const cldUrl = (url, { w, q = 'auto', f = 'auto' } = {}) => {
  if (!url || typeof url !== 'string') return url;
  if (!url.includes('res.cloudinary.com')) return url;
  // Skip if transforms are already present in the URL
  if (url.includes('/upload/f_') || url.includes('/upload/q_') || url.includes('/upload/w_')) return url;

  const transforms = [`f_${f}`, `q_${q}`];
  if (w) transforms.push(`w_${w}`, 'c_limit');

  return url.replace('/upload/', `/upload/${transforms.join(',')}/`);
};
