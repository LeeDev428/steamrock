import { useEffect, useRef, useState } from 'react';

/**
 * Custom hook for scroll-triggered animations
 * @param {Object} options - Configuration options
 * @param {number} options.threshold - Intersection threshold (0-1)
 * @param {string} options.rootMargin - Root margin for intersection observer
 * @returns {[React.RefObject, boolean]} - Ref to attach to element and visibility state
 */
export const useScrollAnimation = (options = {}) => {
  const { threshold = 0.1, rootMargin = '0px 0px -50px 0px' } = options;
  const ref = useRef(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.unobserve(entry.target);
        }
      },
      { threshold, rootMargin }
    );

    const currentRef = ref.current;
    if (currentRef) {
      observer.observe(currentRef);
    }

    return () => {
      if (currentRef) {
        observer.unobserve(currentRef);
      }
    };
  }, [threshold, rootMargin]);

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
      style={{ animationDelay: `${delay}ms` }}
    >
      {children}
    </div>
  );
};

export default useScrollAnimation;
