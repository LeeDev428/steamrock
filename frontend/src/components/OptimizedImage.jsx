import { useState, useEffect } from 'react';
import { cldUrl } from '../utils/cloudinary';

/**
 * Drop-in <img> replacement with:
 *  - Animated shimmer skeleton while the image loads
 *  - Smooth opacity fade-in on load
 *  - Cloudinary auto-format (WebP/AVIF) + quality + width built in
 *
 * REQUIREMENT: the direct parent element MUST have `relative` + `overflow-hidden`
 * so the shimmer overlay is clipped correctly.
 *
 * Props:
 *  src        - image URL (Cloudinary or external)
 *  alt        - alt text
 *  className  - classes applied to the <img> element
 *  w          - Cloudinary resize width (pixels); skipped for non-Cloudinary URLs
 *  loading    - 'lazy' (default) | 'eager' for above-fold images
 */
const OptimizedImage = ({ src, alt, className = '', w, loading = 'lazy', ...props }) => {
  const [loaded, setLoaded] = useState(false);

  // Reset shimmer when src changes (e.g. SPA navigation, lightbox prev/next)
  useEffect(() => {
    setLoaded(false);
  }, [src]);

  return (
    <>
      {/* Shimmer skeleton — hidden once image is loaded */}
      {!loaded && (
        <div
          className="absolute inset-0 bg-gradient-to-r from-gray-200 via-gray-100 to-gray-200 animate-pulse"
          aria-hidden="true"
        />
      )}
      <img
        src={cldUrl(src, { w })}
        alt={alt}
        className={`${className} transition-opacity duration-500 ${loaded ? 'opacity-100' : 'opacity-0'}`}
        onLoad={() => setLoaded(true)}
        onError={() => setLoaded(true)} // hide shimmer on broken image too
        loading={loading}
        decoding="async"
        {...props}
      />
    </>
  );
};

export default OptimizedImage;
