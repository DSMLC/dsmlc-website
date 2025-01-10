import netlifyIdentity from "netlify-identity-widget";

export function initNetlifyIdentity() {
  if (typeof window !== "undefined") {
    netlifyIdentity.init();
  }
}
