import React, { useRef, useEffect, useTransition } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { routePreloader } from '../../utils/routePreloader';

export default function SmartLink({
  to,
  occasionKey,
  children,
  className = '',
  onClick,
  prefetchApi,
  ...props
}) {
  const linkRef = useRef(null);
  const navigate = useNavigate();
  const [, startTransition] = useTransition();

  // Viewport Intersection Observer for automatic preloading when scrolled into view
  useEffect(() => {
    const el = linkRef.current;
    if (!el || !to || typeof to !== 'string') return;

    if (!('IntersectionObserver' in window)) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            routePreloader.preloadRoute(to);
            if (occasionKey) routePreloader.preloadOccasion(occasionKey);
            if (prefetchApi) prefetchApi();
            observer.unobserve(el);
          }
        });
      },
      { rootMargin: '100px' }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, [to, occasionKey, prefetchApi]);

  const handleMouseEnter = (e) => {
    if (typeof to === 'string') {
      routePreloader.handleHoverStart(to, occasionKey);
      if (prefetchApi) prefetchApi();
    }
    if (props.onMouseEnter) props.onMouseEnter(e);
  };

  const handleMouseLeave = (e) => {
    if (typeof to === 'string') {
      routePreloader.handleHoverEnd(to);
    }
    if (props.onMouseLeave) props.onMouseLeave(e);
  };

  const handleClick = (e) => {
    if (onClick) onClick(e);
    if (e.defaultPrevented) return;

    // Use non-blocking transition for smooth page swap
    if (typeof to === 'string' && !e.ctrlKey && !e.metaKey && !e.shiftKey) {
      e.preventDefault();
      startTransition(() => {
        navigate(to);
      });
    }
  };

  return (
    <Link
      ref={linkRef}
      to={to}
      className={className}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      onTouchStart={handleMouseEnter}
      onClick={handleClick}
      {...props}
    >
      {children}
    </Link>
  );
}
