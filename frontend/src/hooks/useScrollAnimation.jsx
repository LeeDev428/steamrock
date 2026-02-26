import { useCallback, useRef, useState } from 'react';

/**
 * Custom hook for scroll-triggered animations.
 * Uses a callback ref so the observer correctly registers even when the target
 * element renders AFTER the initial mount (e.g. behind a loading state).
 *
 * @param {Object} options
 * @param {number} options.threshold  - Intersection threshold (0-1)
 * @param {string} options.rootMargin - Margin for intersection observer
 * @returns {[Function, boolean]} - Callback ref to attach to element + visibility state
 */
export const useScrollAnimation = (options = {}) => {
  const { threshold = 0.1, rootMargin = '0px 0px -50px 0px' } = options;
  const [isVisible, setIsVisible] = useState(false);
  const observerRef = useRef(null);

  // Callback ref: React calls this with the DOM node when the element mounts /
  // unmounts, so observation is always set up correctly even with delayed renders.
  const ref = useCallback(
    (node) => {
      // Clean up any existing observer
      if (observerRef.current) {
        observerRef.current.disconnect();
        observerRef.current = null;
      }
      if (!node) return;

      observerRef.current = new IntersectionObserver(
        ([entry]) => {
          if (entry.isIntersecting) {
            setIsVisible(true);
            observerRef.current?.disconnect();
          }
        },
        { threshold, rootMargin }
      );
      observerRef.current.observe(node);
    },
    [threshold, rootMargin]
  );

  return [ref, isVisible];
};

/**
 * AnimatedSection component for easy scroll animations
 */
export const AnimatedSection = ({ 
  children, 
  className = '', 
  animation = 'fade-in-up',
  delay = 0,
  threshold = 0.1 
}) => {
  const [ref, isVisible] = useScrollAnimation({ threshold });

  const animationClasses = {
    'fade-in-up': 'animate-fade-in-up',
    'fade-in': 'animate-fade-in',
    'slide-in-left': 'animate-slide-in-left',
    'slide-in-right': 'animate-slide-in-right',
  };

  return (
    <div
      ref={ref}
      className={`${className} ${isVisible ? animationClasses[animation] : 'opacity-0'}`}
      style={{
        animationDelay: delay ? `${delay}ms` : undefined,
        // Keep element invisible during animation delay so there's no flash
        animationFillMode: delay ? 'backwards' : undefined,
      }}
    >
      {children}
    </div>
  );
};

export default useScrollAnimation;
