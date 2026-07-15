/**
 * Updates SEO tags in the document head dynamically.
 * Helps search engine crawlers index different surprise categories and services.
 * Uses fallback values if metadata is not provided.
 */
export function updateSEO({ title, description, keywords, noindex }) {
  // Title update
  if (title) {
    document.title = `${title} | AnKa Surprises`;
  } else {
    document.title = "AnKa Surprises — Interactive Surprise Websites & Virtual Dates";
  }
  
  // Description update
  let metaDesc = document.querySelector('meta[name="description"]');
  if (!metaDesc) {
    metaDesc = document.createElement('meta');
    metaDesc.setAttribute('name', 'description');
    document.head.appendChild(metaDesc);
  }
  metaDesc.setAttribute(
    'content',
    description || "AnKa — Build personalized interactive surprise websites for your loved ones or get custom-coded website services for shops, schools, and coaching centers."
  );

  // Keywords update
  let metaKeys = document.querySelector('meta[name="keywords"]');
  if (!metaKeys) {
    metaKeys = document.createElement('meta');
    metaKeys.setAttribute('name', 'keywords');
    document.head.appendChild(metaKeys);
  }
  metaKeys.setAttribute(
    'content',
    keywords || "surprise website, birthday surprise, valentine surprise, custom wedding website, shop websites, school web portals, coaching websites, digital invitations"
  );

  // robots tag (critical to block private client surprise instances from Google index)
  let metaRobots = document.querySelector('meta[name="robots"]');
  if (noindex) {
    if (!metaRobots) {
      metaRobots = document.createElement('meta');
      metaRobots.setAttribute('name', 'robots');
      document.head.appendChild(metaRobots);
    }
    metaRobots.setAttribute('content', 'noindex, nofollow');
  } else {
    if (metaRobots) {
      metaRobots.remove();
    }
  }
}
