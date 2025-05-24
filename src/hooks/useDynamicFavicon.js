// src/hooks/useDynamicFavicon.js
import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

const defaultFavicon = '/site-favicon.png';     // Path to your main site's favicon in public/
const adminFaviconPath = '/admin-favicon.png'; // Path to your admin favicon in public/

const useDynamicFavicon = () => {
  const location = useLocation();

  useEffect(() => {
    let link = document.querySelector("link[rel~='icon']");
    if (!link) {
      link = document.createElement('link');
      link.rel = 'icon';
      // It's important to set a type if it's not a common one or if you want to be explicit
      // For PNG, this is often handled by browsers, but good to be aware.
      // link.type = 'image/png'; // Or image/svg+xml, image/x-icon etc.
      document.getElementsByTagName('head')[0].appendChild(link);
    }

    if (location.pathname.startsWith('/admin')) {
      if (link.href !== adminFaviconPath) { // Only update if it's different
        link.href = adminFaviconPath;
      }
    } else {
      if (link.href !== defaultFavicon) { // Only update if it's different
        link.href = defaultFavicon;
      }
    }
  }, [location.pathname]); // Re-run when the path changes
};

export default useDynamicFavicon;